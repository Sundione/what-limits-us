const PAPER_ID_RE = /^(\d{4})\.([^.]+)\.(\d+)$/;

/**
 * ACL Anthology paper_id is `{year}.{venue-track}.{number}`.
 * The middle token identifies the conference venue and publication format/stream:
 * - `findings-acl`   -> venue: "acl",   track: "findings"
 * - `findings-emnlp` -> venue: "emnlp", track: "findings"
 * - `acl-long`       -> venue: "acl",   track: "long"
 * - `acl-short`      -> venue: "acl",   track: "short"
 * - `acl-main`       -> venue: "acl",   track: "main"
 * - `emnlp-main`     -> venue: "emnlp", track: "main"
 *
 * For any unexpected/workshop tokens, gracefully fall back to generic split.
 */
export function deriveVenueTrack(paperId: string): { year: number; venue: string; track: string } {
  const match = PAPER_ID_RE.exec(paperId);
  if (!match) {
    throw new Error(`paper_id does not match expected ACL Anthology shape: ${paperId}`);
  }
  const [, yearStr, venueTrack] = match;
  const token = venueTrack.toLowerCase();

  let venue: string;
  let track: string;

  if (token.startsWith("findings-")) {
    venue = token.slice("findings-".length);
    track = "findings";
  } else if (token.startsWith("acl-")) {
    venue = "acl";
    track = token.slice("acl-".length);
  } else if (token.startsWith("emnlp-")) {
    venue = "emnlp";
    track = token.slice("emnlp-".length);
  } else {
    const hyphenIndex = token.indexOf("-");
    venue = hyphenIndex === -1 ? token : token.slice(0, hyphenIndex);
    track = hyphenIndex === -1 ? "" : token.slice(hyphenIndex + 1);
  }

  return { year: Number(yearStr), venue, track };
}
