import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { deriveVenueTrack } from "./lib/deriveVenueTrack.js";
import { loadCodeDefinitions } from "./lib/codebook.js";
import { resolveEvidence } from "./lib/resolveEvidence.js";
import type {
  CodeAssignment,
  CodebookVersion,
  GlobalIndex,
  IndexEntry,
  LlmCoding,
  PaperDetail,
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
}

const config: DatasetConfig = JSON.parse(readFileSync(path.join(REPO_ROOT, "dataset.config.json"), "utf-8"));

function resolveDatasetDir(): string {
  const override = process.env.DATASET_SOURCE_DIR;
  const localSibling = path.join(REPO_ROOT, "..", "nlp-self-reported-limitations");
  const defaultDir = existsSync(localSibling) ? localSibling : path.join(REPO_ROOT, ".dataset-src");
  const dir = override ?? defaultDir;
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

function buildLlmCoding(
  raw: RawLlmPaper,
  codebookVersion: CodebookVersion,
): { coding: LlmCoding; fallbackCount: number; totalSpans: number } {
  const sentences = toSentences(raw.segmented_text);
  const codeMap = new Map<string, { origin: "existing" | "new"; evidence: EvidenceSpan[] }>();
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
      const codeName = detail.code_name.trim();
      const existing = codeMap.get(codeName) ?? { origin, evidence: [] };
      const seenSpans = new Set<string>(
        existing.evidence.map((ev) => `${ev.sentenceId}:${ev.start}:${ev.end}:${ev.highlightText}:${ev.justification}`),
      );

      for (const ev of detail.evidence) {
        totalSpans += 1;
        const resolved = resolveEvidence(ev, raw.segmented_text[ev.segmented_id]);
        if (!resolved.exact) fallbackCount += 1;

        const spanKey = `${resolved.sentenceId}:${resolved.start}:${resolved.end}:${resolved.highlightText}:${resolved.justification}`;
        if (!seenSpans.has(spanKey)) {
          seenSpans.add(spanKey);
          existing.evidence.push(resolved);
        }
      }

      codeMap.set(codeName, existing);
    }
  }

  const codes: CodeAssignment[] = Array.from(codeMap.entries()).map(([code, { origin, evidence }]) => ({
    code,
    origin,
    evidence,
  }));

  return {
    coding: { codebookVersion, limitation: raw.limitation, sentences, codes },
    fallbackCount,
    totalSpans,
  };
}

function main() {
  const datasetDir = resolveDatasetDir();
  console.log(`[generate-data] reading dataset from ${datasetDir}`);

  // Explorer scope is the LLM-coded dataset only (16,047 papers). The
  // human-coded dataset (150 papers) is used as a reference standard
  // described on the landing page, not browsed here - it also carries a
  // handful of workshop/demo venues (wassa, c3nlp, sighan, fieldmatters,
  // nlp4convai, textgraphs, privatenlp, teachingnlp) that exist only in
  // that 150-paper set and fall outside this site's ACL/EMNLP main+Findings
  // scope, so pulling it into the explorer's venue/track filters would
  // introduce noise the LLM dataset itself doesn't have.
  const llmPapers = loadLlmPapers(datasetDir);
  const codeDefinitions = loadCodeDefinitions(datasetDir);

  console.log(`[generate-data] loaded ${llmPapers.size} papers`);

  const codeSet = new Set<string>();
  for (const { paper } of llmPapers.values()) {
    for (const c of [...paper.existing_code, ...paper.new_code]) codeSet.add(c.trim());
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

  for (const [id, { paper, codebookVersion }] of llmPapers) {
    const { year, venue, track } = deriveVenueTrack(id);

    const built = buildLlmCoding(paper, codebookVersion);
    totalFallback += built.fallbackCount;
    totalSpans += built.totalSpans;

    const codeSetForPaper = new Set<number>();
    for (const c of built.coding.codes) codeSetForPaper.add(codeIndex.get(c.code)!);

    const detail: PaperDetail = {
      id,
      title: paper.title,
      abstract: paper.abstract,
      year,
      venue,
      track,
      llm: built.coding,
    };
    writeFileSync(path.join(outPapersDir, `${id}.json`), JSON.stringify(detail));

    indexEntries.push({
      id,
      title: paper.title,
      year,
      venue,
      track,
      codes: [...codeSetForPaper].sort((a, b) => a - b),
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
