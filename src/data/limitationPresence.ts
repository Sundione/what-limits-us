// Source: raw per-venue-year paper counts supplied by the user (2026-09-20),
// reproducing the paper's Figure 2 "presence of explicit Limitations
// sections in ACL and EMNLP papers (2020-2025)". Not derived from the
// generated dataset (public/data/index.json) - that only contains papers
// that DO have a Limitations section, so it can't tell us the total corpus
// size or the adoption rate.
//
// adoptionPct formula, verified against every percentage the paper itself
// reports in Section 4.1 (2.4%, 2.9%, 9.1%, 4.8%, 4.2%, 97.8%, 98.9%, 99.2%,
// 99.4%, 99.9%, 99.6%, 100.0% - all match exactly):
//   - Pre-mandate years (2020, 2021, ACL 2022), where the extraction
//     pipeline's fail/no-explicit-lim breakdown isn't available:
//       adoptionPct = papersWithLimitations / totalPapers
//   - Post-mandate years (EMNLP 2022 onward): pipeline extraction failures
//     are NOT counted as "missing" (a failure is inconclusive, not evidence
//     of absence) - only "noExplicitLimitations" counts as genuinely
//     lacking a Limitations section:
//       adoptionPct = (totalPapers - noExplicitLimitations) / totalPapers

export interface PresenceRow {
  venue: "ACL" | "EMNLP";
  year: number;
  totalPapers: number;
  papersWithLimitations: number;
  extractionFailures: number | null;
  noExplicitLimitations: number | null;
}

export const presenceRows: PresenceRow[] = [
  { venue: "ACL", year: 2020, totalPapers: 778, papersWithLimitations: 19, extractionFailures: null, noExplicitLimitations: null },
  { venue: "ACL", year: 2021, totalPapers: 1167, papersWithLimitations: 34, extractionFailures: null, noExplicitLimitations: null },
  { venue: "ACL", year: 2022, totalPapers: 1031, papersWithLimitations: 94, extractionFailures: null, noExplicitLimitations: null },
  { venue: "ACL", year: 2023, totalPapers: 1976, papersWithLimitations: 1941, extractionFailures: 13, noExplicitLimitations: 22 },
  { venue: "ACL", year: 2024, totalPapers: 1915, papersWithLimitations: 1898, extractionFailures: 6, noExplicitLimitations: 11 },
  { venue: "ACL", year: 2025, totalPapers: 3086, papersWithLimitations: 3066, extractionFailures: 7, noExplicitLimitations: 13 },
  { venue: "EMNLP", year: 2020, totalPapers: 1198, papersWithLimitations: 58, extractionFailures: null, noExplicitLimitations: null },
  { venue: "EMNLP", year: 2021, totalPapers: 1271, papersWithLimitations: 54, extractionFailures: null, noExplicitLimitations: null },
  { venue: "EMNLP", year: 2022, totalPapers: 1376, papersWithLimitations: 1346, extractionFailures: 0, noExplicitLimitations: 30 },
  { venue: "EMNLP", year: 2023, totalPapers: 2106, papersWithLimitations: 2087, extractionFailures: 3, noExplicitLimitations: 16 },
  { venue: "EMNLP", year: 2024, totalPapers: 2271, papersWithLimitations: 2264, extractionFailures: 4, noExplicitLimitations: 3 },
  { venue: "EMNLP", year: 2025, totalPapers: 3214, papersWithLimitations: 3206, extractionFailures: 8, noExplicitLimitations: 0 },
];

export function adoptionPct(row: PresenceRow): number {
  if (row.noExplicitLimitations === null) {
    return (row.papersWithLimitations / row.totalPapers) * 100;
  }
  return ((row.totalPapers - row.noExplicitLimitations) / row.totalPapers) * 100;
}
