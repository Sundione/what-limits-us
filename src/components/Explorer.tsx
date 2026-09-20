import { useEffect, useMemo, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { GlobalIndex, IndexEntry, PaperDetail } from "../../scripts/types";

const DATA_BASE = `${import.meta.env.BASE_URL}data/`;
const RESULTS_LIMIT = 200;

function readParams() {
  const params = new URLSearchParams(location.search);
  return {
    paper: params.get("paper"),
    code: params.get("code"),
    year: params.get("year"),
    venue: params.get("venue"),
  };
}

function pushParams(next: { paper?: string | null; code?: string | null }) {
  const params = new URLSearchParams(location.search);
  for (const key of ["paper", "code"] as const) {
    if (key in next) {
      const value = next[key];
      if (value) params.set(key, value);
      else params.delete(key);
    }
  }
  const qs = params.toString();
  history.pushState({}, "", qs ? `?${qs}` : location.pathname);
}

export default function Explorer() {
  const [index, setIndex] = useState<GlobalIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [venue, setVenue] = useState("");
  const [track, setTrack] = useState("");
  const [codeFilter, setCodeFilter] = useState<string | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Map<string, PaperDetail>>(new Map());
  const [detailLoading, setDetailLoading] = useState(false);

  // Initial state from URL, and keep in sync with back/forward navigation.
  useEffect(() => {
    const apply = () => {
      const { paper, code, year, venue } = readParams();
      setPaperId(paper);
      setCodeFilter(code);
      setYear(year ?? "");
      setVenue(venue ?? "");
    };
    apply();
    addEventListener("popstate", apply);
    return () => removeEventListener("popstate", apply);
  }, []);

  useEffect(() => {
    fetch(`${DATA_BASE}index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(setIndex)
      .catch((err) => setError(String(err)));
  }, []);

  useEffect(() => {
    if (!paperId) return;
    if (detailCache.has(paperId)) return;
    setDetailLoading(true);
    fetch(`${DATA_BASE}papers/${encodeURIComponent(paperId)}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((detail: PaperDetail) => {
        setDetailCache((prev) => new Map(prev).set(paperId, detail));
      })
      .catch((err) => setError(String(err)))
      .finally(() => setDetailLoading(false));
  }, [paperId, detailCache]);

  const facets = useMemo(() => {
    if (!index) return { years: [], venues: [], tracks: [] };
    const years = new Set<number>();
    const venues = new Set<string>();
    const tracks = new Set<string>();
    for (const p of index.papers) {
      years.add(p.year);
      venues.add(p.venue);
      tracks.add(p.track);
    }
    return {
      years: [...years].sort((a, b) => a - b),
      venues: [...venues].sort(),
      tracks: [...tracks].sort(),
    };
  }, [index]);

  const codeFilterIndex = useMemo(() => {
    if (!index || !codeFilter) return null;
    const i = index.codes.indexOf(codeFilter);
    return i === -1 ? null : i;
  }, [index, codeFilter]);

  const filtered = useMemo<IndexEntry[]>(() => {
    if (!index) return [];
    const q = search.trim().toLowerCase();
    return index.papers.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (year && p.year !== Number(year)) return false;
      if (venue && p.venue !== venue) return false;
      if (track && p.track !== track) return false;
      if (codeFilterIndex !== null && !p.codes.includes(codeFilterIndex)) return false;
      return true;
    });
  }, [index, search, year, venue, track, codeFilterIndex]);

  function openPaper(id: string) {
    setPaperId(id);
    pushParams({ paper: id });
  }

  function closePaper() {
    setPaperId(null);
    pushParams({ paper: null });
  }

  function setReverseLookup(code: string) {
    setCodeFilter(code);
    pushParams({ code });
  }

  function clearCodeFilter() {
    setCodeFilter(null);
    pushParams({ code: null });
  }

  if (error) {
    return <p class="explorer-error">Could not load the dataset: {error}</p>;
  }

  if (!index) {
    return <p class="explorer-loading">Loading dataset index…</p>;
  }

  const detail = paperId ? detailCache.get(paperId) ?? null : null;

  return (
    <div class="explorer">
      <div class="controls">
        <input
          type="search"
          placeholder="Search by title…"
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
        />
        <select value={year} onChange={(e) => setYear((e.target as HTMLSelectElement).value)}>
          <option value="">All years</option>
          {facets.years.map((y) => (
            <option value={String(y)}>{y}</option>
          ))}
        </select>
        <select value={venue} onChange={(e) => setVenue((e.target as HTMLSelectElement).value)}>
          <option value="">All venues</option>
          {facets.venues.map((v) => (
            <option value={v}>{v}</option>
          ))}
        </select>
        <select value={track} onChange={(e) => setTrack((e.target as HTMLSelectElement).value)}>
          <option value="">All tracks</option>
          {facets.tracks.map((t) => (
            <option value={t}>{t || "(none)"}</option>
          ))}
        </select>
      </div>

      {codeFilter && (
        <p class="active-filter">
          Filtering by code: <strong>{codeFilter}</strong>{" "}
          <button type="button" onClick={clearCodeFilter}>
            clear
          </button>
        </p>
      )}

      <p class="result-count">
        {filtered.length.toLocaleString()} paper{filtered.length === 1 ? "" : "s"} match
        {filtered.length > RESULTS_LIMIT ? ` (showing first ${RESULTS_LIMIT} — refine your search for more)` : ""}
      </p>

      <ul class="results">
        {filtered.slice(0, RESULTS_LIMIT).map((p) => (
          <li key={p.id} class={p.id === paperId ? "result-active" : ""}>
            <button type="button" class="result-row" onClick={() => openPaper(p.id)}>
              <span class="result-title">{p.title}</span>
              <span class="result-meta">
                {p.year} · {p.venue}
                {p.track ? `-${p.track}` : ""}
                {" · "}
                {p.codes.length} code{p.codes.length === 1 ? "" : "s"}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {paperId && (
        <div class="detail-pane">
          <button type="button" class="close-btn" onClick={closePaper}>
            &times; Close
          </button>
          {detailLoading && !detail && <p>Loading paper…</p>}
          {detail && <PaperDetailView detail={detail} codes={index.codes} onCodeClick={setReverseLookup} />}
        </div>
      )}
    </div>
  );
}

function PaperDetailView({
  detail,
  onCodeClick,
}: {
  detail: PaperDetail;
  codes: string[];
  onCodeClick: (code: string) => void;
}) {
  const [openJustification, setOpenJustification] = useState<string | null>(null);

  const sentenceCodes = useMemo(() => {
    const map = new Map<string, { code: string; start: number | null; end: number | null; exact: boolean; justification: string }[]>();
    for (const assignment of detail.llm.codes) {
      for (const ev of assignment.evidence) {
        const list = map.get(ev.sentenceId) ?? [];
        list.push({ code: assignment.code, start: ev.start, end: ev.end, exact: ev.exact, justification: ev.justification });
        map.set(ev.sentenceId, list);
      }
    }
    return map;
  }, [detail]);

  return (
    <article>
      <h2>{detail.title}</h2>
      <p class="detail-meta">
        {detail.year} · {detail.id}
      </p>

      <div class="sentences">
        {detail.llm.sentences.map((s) => {
          const marks = (sentenceCodes.get(s.id) ?? []).slice().sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
          return (
            <p class="sentence" key={s.id}>
              <span>{renderSentence(s.text, marks)}</span>
              {marks.length > 0 && (
                <span class="chip-row">
                  {marks.map((m) => (
                    <span key={m.code}>
                      <button type="button" class="code-chip" onClick={() => setOpenJustification(openJustification === `${s.id}:${m.code}` ? null : `${s.id}:${m.code}`)}>
                        {m.code}
                        {!m.exact && <em> (approx.)</em>}
                      </button>
                      {openJustification === `${s.id}:${m.code}` && (
                        <span class="justification-box">
                          {m.justification}{" "}
                          <button type="button" class="link-btn" onClick={() => onCodeClick(m.code)}>
                            See all papers with this code →
                          </button>
                        </span>
                      )}
                    </span>
                  ))}
                </span>
              )}
            </p>
          );
        })}
      </div>
    </article>
  );
}

function renderSentence(
  text: string,
  marks: { start: number | null; end: number | null; exact: boolean }[],
) {
  const exactMarks = marks.filter((m): m is { start: number; end: number; exact: true } => m.exact && m.start !== null && m.end !== null);
  if (exactMarks.length === 0) return text;

  // Greedily pick non-overlapping marks (sorted by start already).
  const chosen: { start: number; end: number }[] = [];
  for (const m of exactMarks) {
    const last = chosen[chosen.length - 1];
    if (!last || m.start >= last.end) chosen.push({ start: m.start, end: m.end });
  }

  const parts: ComponentChildren[] = [];
  let cursor = 0;
  chosen.forEach((m, i) => {
    if (m.start > cursor) parts.push(text.slice(cursor, m.start));
    parts.push(<mark key={i}>{text.slice(m.start, m.end)}</mark>);
    cursor = m.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}
