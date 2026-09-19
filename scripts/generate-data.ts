import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

import { deriveVenueTrack } from "./lib/deriveVenueTrack.js";
import { loadCodeDefinitions } from "./lib/codebook.js";
import { parseHumanCodeList } from "./lib/parseHumanCodes.js";
import { resolveEvidence } from "./lib/resolveEvidence.js";
import type {
  CodeAssignment,
  CodebookVersion,
  GlobalIndex,
  HumanCoding,
  IndexEntry,
  LlmCoding,
  PaperDetail,
  RawHumanRow,
  RawLlmPaper,
  Sentence,
} from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

interface DatasetConfig {
  repo: string;
  ref: string;
  license: string;
  codebookVersionByFile: Record<string, CodebookVersion>;
  humanDatasetCodebookVersion: "codebook_initial";
}

const config: DatasetConfig = JSON.parse(readFileSync(path.join(REPO_ROOT, "dataset.config.json"), "utf-8"));

function resolveDatasetDir(): string {
  const override = process.env.DATASET_SOURCE_DIR;
  const dir = override ?? path.join(REPO_ROOT, ".dataset-src");
  if (!existsSync(dir)) {
    throw new Error(
      `Dataset source directory not found: ${dir}\n` +
        `Set DATASET_SOURCE_DIR to a local checkout of ${config.repo}, or ensure ` +
        `.dataset-src/ has been cloned (see .github/workflows/deploy.yml).`,
    );
  }
  if (override) {
    try {
      const head = execSync("git rev-parse HEAD", { cwd: dir, encoding: "utf-8" }).trim();
      if (head !== config.ref) {
        console.warn(
          `[generate-data] WARNING: DATASET_SOURCE_DIR is at commit ${head}, ` +
            `which does not match the pinned ref ${config.ref} in dataset.config.json. ` +
            `Local output may not match what CI would produce.`,
        );
      }
    } catch {
      console.warn(`[generate-data] WARNING: could not verify git HEAD of DATASET_SOURCE_DIR (${dir}).`);
    }
  }
  return dir;
}

function sentenceSortKey(id: string): number {
  const match = /_s(\d+)$/.exec(id);
  return match ? Number(match[1]) : 0;
}

function toSentences(segmentedText: Record<string, string>): Sentence[] {
  return Object.entries(segmentedText)
    .map(([id, text]) => ({ id, text }))
    .sort((a, b) => sentenceSortKey(a.id) - sentenceSortKey(b.id));
}

function loadLlmPapers(datasetDir: string): Map<string, { paper: RawLlmPaper; codebookVersion: CodebookVersion }> {
  const byId = new Map<string, { paper: RawLlmPaper; codebookVersion: CodebookVersion }>();
  for (const [periodDir, codebookVersion] of Object.entries(config.codebookVersionByFile)) {
    const filePath = path.join(datasetDir, "llm_coded_dataset", periodDir, `papers_${periodDir}.json`);
    const rows: RawLlmPaper[] = JSON.parse(readFileSync(filePath, "utf-8"));
    for (const row of rows) {
      byId.set(row.paper_id, { paper: row, codebookVersion });
    }
  }
  return byId;
}

function loadHumanRows(datasetDir: string): RawHumanRow[] {
  const filePath = path.join(datasetDir, "human_coded_dataset", "human_code.csv");
  return parse(readFileSync(filePath, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  }) as RawHumanRow[];
}

function buildLlmCoding(
  raw: RawLlmPaper,
  codebookVersion: CodebookVersion,
): { coding: LlmCoding; fallbackCount: number; totalSpans: number } {
  const sentences = toSentences(raw.segmented_text);
  const codes: CodeAssignment[] = [];
  let fallbackCount = 0;
  let totalSpans = 0;

  for (const [names, details, origin] of [
    [raw.existing_code, raw.existing_code_details, "existing" as const],
    [raw.new_code, raw.new_code_details, "new" as const],
  ] as const) {
    if (names.length !== details.length) {
      throw new Error(
        `${raw.paper_id}: ${origin}_code (${names.length}) and ${origin}_code_details (${details.length}) length mismatch`,
      );
    }
    for (const detail of details) {
      const evidence = detail.evidence.map((ev) => {
        totalSpans += 1;
        const resolved = resolveEvidence(ev, raw.segmented_text[ev.segmented_id]);
        if (!resolved.exact) fallbackCount += 1;
        return resolved;
      });
      codes.push({ code: detail.code_name.trim(), origin, evidence });
    }
  }

  return {
    coding: { codebookVersion, limitation: raw.limitation, sentences, codes },
    fallbackCount,
    totalSpans,
  };
}

function buildHumanCoding(raw: RawHumanRow): HumanCoding {
  const segmentedText: Record<string, string> = JSON.parse(raw.segmented_text);
  const sentences = toSentences(segmentedText);
  const existing = parseHumanCodeList(raw.existing_code).map((code) => ({ code, origin: "existing" as const }));
  const newCodes = parseHumanCodeList(raw.new_code).map((code) => ({ code, origin: "new" as const }));
  return {
    codebookVersion: "codebook_initial",
    limitation: raw.limitation,
    sentences,
    codes: [...existing, ...newCodes],
  };
}

function main() {
  const datasetDir = resolveDatasetDir();
  console.log(`[generate-data] reading dataset from ${datasetDir}`);

  const llmPapers = loadLlmPapers(datasetDir);
  const humanRows = loadHumanRows(datasetDir);
  const codeDefinitions = loadCodeDefinitions(datasetDir);

  console.log(`[generate-data] loaded ${llmPapers.size} llm papers, ${humanRows.length} human rows`);

  const humanById = new Map(humanRows.map((row) => [row.paper_id, row]));
  const allIds = new Set<string>([...llmPapers.keys(), ...humanById.keys()]);

  const codeSet = new Set<string>();
  for (const { paper } of llmPapers.values()) {
    for (const c of [...paper.existing_code, ...paper.new_code]) codeSet.add(c.trim());
  }
  for (const row of humanRows) {
    for (const c of [...parseHumanCodeList(row.existing_code), ...parseHumanCodeList(row.new_code)]) {
      codeSet.add(c);
    }
  }
  const codes = [...codeSet].sort((a, b) => a.localeCompare(b));
  const codeIndex = new Map(codes.map((c, i) => [c, i]));
  const codeDefinitionsArr = codes.map((c) => codeDefinitions.get(c) ?? null);

  const indexEntries: IndexEntry[] = [];
  let totalFallback = 0;
  let totalSpans = 0;

  const outDataDir = path.join(REPO_ROOT, "public", "data");
  const outPapersDir = path.join(outDataDir, "papers");
  rmSync(outDataDir, { recursive: true, force: true });
  mkdirSync(outPapersDir, { recursive: true });

  for (const id of allIds) {
    const { year, venue, track } = deriveVenueTrack(id);
    const llmEntry = llmPapers.get(id);
    const humanRow = humanById.get(id);

    let llm: LlmCoding | null = null;
    const codeSetForPaper = new Set<number>();

    if (llmEntry) {
      const built = buildLlmCoding(llmEntry.paper, llmEntry.codebookVersion);
      llm = built.coding;
      totalFallback += built.fallbackCount;
      totalSpans += built.totalSpans;
      for (const c of llm.codes) codeSetForPaper.add(codeIndex.get(c.code)!);
    }

    let human: HumanCoding | null = null;
    if (humanRow) {
      human = buildHumanCoding(humanRow);
      for (const c of human.codes) codeSetForPaper.add(codeIndex.get(c.code)!);
    }

    const title = llmEntry?.paper.title ?? humanRow?.title ?? "";
    const abstract = llmEntry?.paper.abstract ?? humanRow?.abstract ?? "";

    const detail: PaperDetail = {
      id,
      title,
      abstract,
      year,
      venue,
      track,
      inLlmDataset: Boolean(llmEntry),
      inHumanDataset: Boolean(humanRow),
      llm,
      human,
    };
    writeFileSync(path.join(outPapersDir, `${id}.json`), JSON.stringify(detail));

    indexEntries.push({
      id,
      title,
      year,
      venue,
      track,
      codes: [...codeSetForPaper].sort((a, b) => a - b),
      inLlmDataset: detail.inLlmDataset,
      inHumanDataset: detail.inHumanDataset,
    });
  }

  indexEntries.sort((a, b) => a.id.localeCompare(b.id));

  const index: GlobalIndex = {
    generatedAt: new Date().toISOString(),
    datasetRef: config.ref,
    codes,
    codeDefinitions: codeDefinitionsArr,
    papers: indexEntries,
  };
  writeFileSync(path.join(outDataDir, "index.json"), JSON.stringify(index));

  console.log(`[generate-data] wrote ${indexEntries.length} papers to ${outPapersDir}`);
  console.log(`[generate-data] ${codes.length} distinct codes (${codeDefinitionsArr.filter((d) => d === null).length} without a codebook definition)`);
  console.log(`[generate-data] evidence spans: ${totalSpans} total, ${totalFallback} used whole-sentence fallback (${((totalFallback / totalSpans) * 100).toFixed(2)}%)`);
}

main();
