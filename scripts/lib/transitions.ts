import type { LlmCoding } from "../types.js";

export const NL_PREFIX = "Non-Limitation: ";

export function isLimitationCode(code: string): boolean {
  return !code.startsWith(NL_PREFIX);
}

export interface TransitionPair {
  /** Sentence id of the earlier sentence in the pair. */
  from: string;
  /** Sentence id of the later sentence in the pair. */
  to: string;
  nlCode: string;
  /** "after": limitation -> NL code; "before": NL code -> limitation. */
  dir: "after" | "before";
}

/**
 * Finds consecutive coded sentences where a non-limitation code directly
 * follows or precedes a limitation code. Uncoded sentences are skipped, so
 * adjacency is over the paper's code sequence (as in the paper's Table 6).
 * Shared by the build-time index (scripts/generate-data.ts) and the
 * explorer's sentence-pair highlighting, so both always agree.
 */
export function findTransitions(coding: Pick<LlmCoding, "sentences" | "codes">): TransitionPair[] {
  const codesBySentence = new Map<string, Set<string>>();
  for (const assignment of coding.codes) {
    for (const ev of assignment.evidence) {
      const set = codesBySentence.get(ev.sentenceId) ?? new Set<string>();
      set.add(assignment.code);
      codesBySentence.set(ev.sentenceId, set);
    }
  }

  const coded = coding.sentences.filter((s) => codesBySentence.has(s.id));
  const pairs: TransitionPair[] = [];
  for (let i = 0; i + 1 < coded.length; i++) {
    const from = coded[i].id;
    const to = coded[i + 1].id;
    const a = [...codesBySentence.get(from)!];
    const b = [...codesBySentence.get(to)!];
    if (a.some(isLimitationCode)) {
      for (const c of b) if (!isLimitationCode(c)) pairs.push({ from, to, nlCode: c, dir: "after" });
    }
    if (b.some(isLimitationCode)) {
      for (const c of a) if (!isLimitationCode(c)) pairs.push({ from, to, nlCode: c, dir: "before" });
    }
  }
  return pairs;
}
