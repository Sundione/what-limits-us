const PAPER_ID_RE = /^(\d{4})\.([^.]+)\.(\d+)$/;

/**
 * ACL Anthology paper_id is `{year}.{venue-track}.{number}`. The middle token
 * itself is a hyphenated venue+track (e.g. "acl-long", "findings-emnlp",
 * "wassa-1") with no fixed enum across the dataset (15 distinct tokens
 * observed, including small workshop/demo tracks) - split generically on the
 * first hyphen rather than hardcoding a venue list.
 */
export function deriveVenueTrack(paperId: string): { year: number; venue: string; track: string } {
  const match = PAPER_ID_RE.exec(paperId);
  if (!match) {
    throw new Error(`paper_id does not match expected ACL Anthology shape: ${paperId}`);
  }
  const [, yearStr, venueTrack] = match;
  const hyphenIndex = venueTrack.indexOf("-");
  const venue = hyphenIndex === -1 ? venueTrack : venueTrack.slice(0, hyphenIndex);
  const track = hyphenIndex === -1 ? "" : venueTrack.slice(hyphenIndex + 1);
  return { year: Number(yearStr), venue, track };
}
