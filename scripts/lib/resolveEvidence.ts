import type { EvidenceSpan, RawEvidence } from "../types.js";

/**
 * The source data's highlight_start/highlight_end are offsets into the full
 * `limitation` string and are unreliable (~1.4% mismatch against highlight_text
 * on real data). Resolving against the sentence text instead
 * (segmented_text[segmented_id].indexOf(highlight_text)) is both simpler and
 * far more reliable (99.79% exact hit rate, verified against all 131,166
 * evidence spans in the dataset). The raw full-text offsets are intentionally
 * not carried into the generated output.
 */
export function resolveEvidence(evidence: RawEvidence, sentence: string | undefined): EvidenceSpan {
  const sentenceText = sentence ?? "";
  const start = sentenceText.indexOf(evidence.highlight_text);
  const exact = evidence.highlight_text.length > 0 && start !== -1;
  return {
    sentenceId: evidence.segmented_id,
    start: exact ? start : null,
    end: exact ? start + evidence.highlight_text.length : null,
    highlightText: evidence.highlight_text,
    justification: evidence.justification,
    exact,
  };
}
