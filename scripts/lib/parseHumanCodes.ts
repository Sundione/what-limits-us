/**
 * human_coded_dataset/human_code.csv has no JSON twin. Its existing_code/new_code
 * cells are Python repr() of a list of strings, single-quoted, e.g.
 * "['Methodological Constraints', 'Scope Limitation']" or "[]" - not valid JSON.
 *
 * Verified against the full 150-row file: no code name contains an embedded
 * single quote or apostrophe, so a simple single-quoted-substring extraction is
 * safe here. This is deliberately not a general Python-literal parser - it only
 * needs to handle this one small, already-verified dataset.
 */
export function parseHumanCodeList(cell: string): string[] {
  const matches = cell.match(/'([^']*)'/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1, -1).trim());
}
