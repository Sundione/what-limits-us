import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const CODEBOOK_FILES = [
  "human_coded_dataset/codebook_initial.csv",
  "llm_coded_dataset/2020_2022/codebook_after_2022.csv",
  "llm_coded_dataset/2023/codebook_after_2023.csv",
  "llm_coded_dataset/2024/codebook_after_2024.csv",
  "llm_coded_dataset/2025/codebook_after_2025.csv",
];

/**
 * Builds a best-effort code -> definition lookup from every codebook CSV
 * version. Code names are trimmed before matching: at least one code name in
 * the source CSVs ("Societal and Ethical Risks ") carries a trailing space
 * that would otherwise cause a false "no definition" result. Codes that never
 * appear in any codebook CSV (verified: 23 ad hoc human-annotator codes) are
 * simply absent from the returned map - callers must treat that as
 * `null`/unknown, never fabricate a definition.
 */
export function loadCodeDefinitions(datasetDir: string): Map<string, string> {
  const definitions = new Map<string, string>();
  for (const relPath of CODEBOOK_FILES) {
    const filePath = path.join(datasetDir, relPath);
    const rows: string[][] = parse(readFileSync(filePath, "utf-8"), {
      skip_empty_lines: true,
    });
    for (const row of rows.slice(1)) {
      const name = row[0]?.trim();
      const definition = row[1]?.trim();
      if (name && definition) {
        definitions.set(name, definition);
      }
    }
  }
  return definitions;
}
