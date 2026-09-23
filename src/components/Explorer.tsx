import { useEffect, useMemo, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { GlobalIndex, IndexEntry, PaperDetail } from "../../scripts/types";
import { THEMES, getThemeByCode, type ThemeDefinition } from "../data/themes";

const DATA_BASE = `${import.meta.env.BASE_URL}data/`;
const PAGE_SIZE = 40;

function readParams() {
  const params = new URLSearchParams(location.search);
  return {
    paper: params.get("paper"),
    code: params.get("code"),
    theme: params.get("theme"),
    year: params.get("year"),
    venue: params.get("venue"),
    track: params.get("track"),
    q: params.get("q"),
  };
}

function pushParams(next: {
  paper?: string | null;
  code?: string | null;
  theme?: string | null;
  year?: string | null;
  venue?: string | null;
  track?: string | null;
  q?: string | null;
}) {
  const params = new URLSearchParams(location.search);
  for (const key of ["paper", "code", "theme", "year", "venue", "track", "q"] as const) {
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
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [codeFilter, setCodeFilter] = useState<string | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const [detailCache, setDetailCache] = useState<Map<string, PaperDetail>>(new Map());
  const [detailLoading, setDetailLoading] = useState(false);

  // Active hover synchronization across list / details (JuICE style)
  const [activeHoverCode, setActiveHoverCode] = useState<string | null>(null);

  // Initial state from URL, and keep in sync with back/forward navigation.
  useEffect(() => {
    const apply = () => {
      const { paper, code, theme, year, venue, track, q } = readParams();
      setPaperId(paper);
      setCodeFilter(code);
      setThemeFilter(theme);
      setYear(year ?? "");
      setVenue(venue ?? "");
      setTrack(track ?? "");
      if (q) setSearch(q);
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

  // Map theme ID to set of code indices in index.codes
  const themeCodeIndicesMap = useMemo(() => {
    if (!index) return new Map<string, Set<number>>();
    const map = new Map<string, Set<number>>();
    for (const t of THEMES) {
      const set = new Set<number>();
      for (const code of t.codes) {
        const idx = index.codes.indexOf(code);
        if (idx !== -1) set.add(idx);
      }
      map.set(t.id, set);
    }
    return map;
  }, [index]);

  const codeFilterIndex = useMemo(() => {
    if (!index || !codeFilter) return null;
    const i = index.codes.indexOf(codeFilter);
    return i === -1 ? null : i;
  }, [index, codeFilter]);

  const filtered = useMemo<IndexEntry[]>(() => {
    if (!index) return [];
    const q = search.trim().toLowerCase();
    const themeIndices = themeFilter ? themeCodeIndicesMap.get(themeFilter) : null;

    return index.papers.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (year && p.year !== Number(year)) return false;
      if (venue && p.venue !== venue) return false;
      if (track) {
        if (track === "main") {
          // "main" matches all Main conference streams (main, long, short)
          if (p.track === "findings") return false;
        } else if (p.track !== track) {
          return false;
        }
      }
      if (codeFilterIndex !== null && !p.codes.includes(codeFilterIndex)) return false;
      if (themeIndices && !p.codes.some((cIdx) => themeIndices.has(cIdx))) return false;
      return true;
    });
  }, [index, search, year, venue, track, codeFilterIndex, themeFilter, themeCodeIndicesMap]);

  // Reset page to 0 when search/filter inputs change
  useEffect(() => {
    setPage(0);
  }, [search, year, venue, track, codeFilter, themeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedPapers = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function openPaper(id: string) {
    setPaperId(id);
    pushParams({ paper: id });
  }

  function closePaper() {
    setPaperId(null);
    pushParams({ paper: null });
  }

  function toggleTheme(themeId: string) {
    const next = themeFilter === themeId ? null : themeId;
    setThemeFilter(next);
    pushParams({ theme: next });
  }

  function handleSelectCode(code: string) {
    const next = code || null;
    setCodeFilter(next);
    pushParams({ code: next });
  }

  function clearCodeFilter() {
    setCodeFilter(null);
    pushParams({ code: null });
  }

  function clearAllFilters() {
    setSearch("");
    setYear("");
    setVenue("");
    setTrack("");
    setThemeFilter(null);
    setCodeFilter(null);
    pushParams({ search: null, year: null, venue: null, track: null, theme: null, code: null });
  }

  function surpriseMe() {
    if (filtered.length === 0 && (!index || index.papers.length === 0)) return;
    const pool = filtered.length > 0 ? filtered : index!.papers;
    const randomPaper = pool[Math.floor(Math.random() * pool.length)];
    openPaper(randomPaper.id);
  }

  if (error) {
    return <p class="explorer-error">Could not load the dataset: {error}</p>;
  }

  if (!index) {
    return (
      <div class="explorer-loading-box">
        <div class="spinner"></div>
        <p>Loading dataset index (16,047 papers and 50 limitation codes)…</p>
      </div>
    );
  }

  const detail = paperId ? detailCache.get(paperId) ?? null : null;
  const activeFiltersCount =
    (search ? 1 : 0) +
    (year ? 1 : 0) +
    (venue ? 1 : 0) +
    (track ? 1 : 0) +
    (themeFilter ? 1 : 0) +
    (codeFilter ? 1 : 0);

  return (
    <div class="explorer-container">
      {/* Search and Filter Toolbar */}
      <div class="explorer-toolbar">
        <div class="search-row">
          <div class="search-input-wrapper">
            <svg
              class="search-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="18"
              height="18"
              style={{ width: "18px", height: "18px", minWidth: "18px", flexShrink: 0 }}
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by paper title or keywords…"
              value={search}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                setSearch(val);
                pushParams({ q: val || null });
              }}
            />
            {search && (
              <button
                type="button"
                class="clear-search-btn"
                onClick={() => {
                  setSearch("");
                  pushParams({ q: null });
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div class="select-group">
            <select
              value={year}
              onChange={(e) => {
                const val = (e.target as HTMLSelectElement).value;
                setYear(val);
                pushParams({ year: val || null });
              }}
            >
              <option value="">All years</option>
              {facets.years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={venue}
              onChange={(e) => {
                const val = (e.target as HTMLSelectElement).value;
                setVenue(val);
                pushParams({ venue: val || null });
              }}
            >
              <option value="">All venues</option>
              {facets.venues.map((v) => (
                <option key={v} value={v}>
                  {v.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={track}
              onChange={(e) => {
                const val = (e.target as HTMLSelectElement).value;
                setTrack(val);
                pushParams({ track: val || null });
              }}
              title="Filter by publication format / stream"
            >
              <option value="">All formats</option>
              <option value="main">Main Conference (all)</option>
              <option value="findings">Findings</option>
              <option value="long">Main — Long</option>
              <option value="short">Main — Short</option>
            </select>

            {/* Direct Code Selector */}
            <select
              value={codeFilter || ""}
              onChange={(e) => handleSelectCode((e.target as HTMLSelectElement).value)}
              class="code-select"
            >
              <option value="">All 50 Limitation Codes</option>
              {THEMES.map((theme) => (
                <optgroup key={theme.id} label={theme.name}>
                  {theme.codes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <button type="button" class="surprise-btn" onClick={surpriseMe} title="Pick a random paper to explore">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "6px" }}>
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
              </svg>
              Surprise Me
            </button>
          </div>
        </div>

        {/* 5 Thematic Filter Pills */}
        <div class="theme-pills-bar">
          <span class="theme-pills-label">Filter by Theme:</span>
          <div class="theme-pills-list">
            {THEMES.map((theme) => {
              const isActive = themeFilter === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  class={`theme-pill ${isActive ? "active" : ""}`}
                  style={{
                    "--theme-color": theme.color,
                    "--theme-bg": theme.bgLight,
                    "--theme-hover": theme.bgHover,
                    "--theme-border": theme.borderColor,
                  }}
                  onClick={() => toggleTheme(theme.id)}
                  title={theme.description}
                >
                  <span class="theme-dot" style={{ backgroundColor: theme.color }}></span>
                  <span class="theme-pill-title">{theme.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary Strip */}
        <div class="filters-status-row">
          <span class="result-count">
            Found <strong>{filtered.length.toLocaleString()}</strong> paper
            {filtered.length === 1 ? "" : "s"}
            {filtered.length > 0
              ? ` (showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)})`
              : ""}
          </span>

          {activeFiltersCount > 0 && (
            <div class="active-chips-wrap">
              {themeFilter && (
                <span class="filter-chip theme-chip">
                  Theme: {THEMES.find((t) => t.id === themeFilter)?.shortTitle}
                  <button type="button" onClick={() => toggleTheme(themeFilter)}>
                    ×
                  </button>
                </span>
              )}
              {codeFilter && (
                <span class="filter-chip code-chip-filter">
                  Code: {codeFilter}
                  <button type="button" onClick={clearCodeFilter}>
                    ×
                  </button>
                </span>
              )}
              {year && (
                <span class="filter-chip">
                  Year: {year}
                  <button type="button" onClick={() => setYear("")}>
                    ×
                  </button>
                </span>
              )}
              {venue && (
                <span class="filter-chip">
                  Venue: {venue.toUpperCase()}
                  <button type="button" onClick={() => setVenue("")}>
                    ×
                  </button>
                </span>
              )}
              {track && (
                <span class="filter-chip">
                  Format:{" "}
                  {track === "main"
                    ? "Main Conference"
                    : track === "findings"
                    ? "Findings"
                    : track === "long"
                    ? "Main (Long)"
                    : track === "short"
                    ? "Main (Short)"
                    : track.toUpperCase()}
                  <button type="button" onClick={() => setTrack("")}>
                    ×
                  </button>
                </span>
              )}
              <button type="button" class="clear-all-link" onClick={clearAllFilters}>
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Master-Detail Split Workspace */}
      <div class="explorer-workspace">
        {/* Left Pane: Master Paper List */}
        <div class="master-pane">
          {filtered.length === 0 ? (
            <div class="empty-list-notice">
              <p>No papers match your current filters.</p>
              <button type="button" class="btn-subtle" onClick={clearAllFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div class="paper-list-scroll">
              <ul class="paper-list">
                {pagedPapers.map((p) => {
                  const isSelected = p.id === paperId;
                  const paperThemeMap = new Map<string, number>();
                  for (const cIdx of p.codes) {
                    const codeName = index.codes[cIdx];
                    if (codeName) {
                      const t = getThemeByCode(codeName);
                      paperThemeMap.set(t.id, (paperThemeMap.get(t.id) ?? 0) + 1);
                    }
                  }

                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        class={`paper-card ${isSelected ? "selected" : ""}`}
                        onClick={() => openPaper(p.id)}
                      >
                        <div class="paper-card-header">
                          <span class={`venue-badge badge-${p.venue}`}>{p.venue.toUpperCase()}</span>
                          <span class="year-badge">{p.year}</span>
                          {p.track && (
                            <span class={`track-badge track-${p.track}`}>
                              {p.track === "long"
                                ? "LONG"
                                : p.track === "short"
                                ? "SHORT"
                                : p.track === "findings"
                                ? "FINDINGS"
                                : "MAIN"}
                            </span>
                          )}
                        </div>

                        <h3 class="paper-card-title">{p.title}</h3>

                        <div class="paper-card-footer">
                          {/* Mini Theme Dots Bar */}
                          <div class="paper-theme-dots">
                            {THEMES.map((theme) => {
                              const count = paperThemeMap.get(theme.id);
                              if (!count) return null;
                              return (
                                <span
                                  key={theme.id}
                                  class="theme-mini-tag"
                                  style={{
                                    backgroundColor: theme.bgLight,
                                    borderColor: theme.borderColor,
                                    color: theme.color,
                                  }}
                                  title={`${theme.shortTitle}: ${count} code(s)`}
                                >
                                  <span class="dot" style={{ backgroundColor: theme.color }}></span>
                                  {count}
                                </span>
                              );
                            })}
                          </div>

                          <span class="total-codes-text">
                            {p.codes.length} code{p.codes.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div class="pagination-bar">
              <button
                type="button"
                class="page-nav-btn"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ‹ Previous
              </button>
              <span class="page-indicator">
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                class="page-nav-btn"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Next ›
              </button>
            </div>
          )}
        </div>

        {/* Right Pane: Paper Inspector / Detail View */}
        <div class="detail-pane">
          {!paperId ? (
            <div class="detail-placeholder">
              <div class="placeholder-icon">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Select a paper to inspect</h3>
              <p>
                Click any paper on the left to read its full Limitations section, explore sentence-level thematic
                highlighting, and audit the LLM-assigned evidence.
              </p>
              <button type="button" class="btn-primary" onClick={surpriseMe}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "6px" }}>
                  <polyline points="16 3 21 3 21 8"></polyline>
                  <line x1="4" y1="20" x2="21" y2="3"></line>
                  <polyline points="21 16 21 21 16 21"></polyline>
                  <line x1="15" y1="15" x2="21" y2="21"></line>
                  <line x1="4" y1="4" x2="9" y2="9"></line>
                </svg>
                Pick a Random Paper
              </button>
            </div>
          ) : detailLoading && !detail ? (
            <div class="detail-loading-box">
              <div class="spinner"></div>
              <p>Fetching paper data and sentence annotations…</p>
            </div>
          ) : detail ? (
            <PaperDetailInspector
              detail={detail}
              codes={index.codes}
              onCodeClick={handleSelectCode}
              onClose={closePaper}
              activeHoverCode={activeHoverCode}
              setActiveHoverCode={setActiveHoverCode}
            />
          ) : (
            <div class="detail-placeholder">
              <p>Could not load paper details.</p>
              <button type="button" onClick={closePaper}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaperDetailInspector({
  detail,
  codes,
  onCodeClick,
  onClose,
  activeHoverCode,
  setActiveHoverCode,
}: {
  detail: PaperDetail;
  codes: string[];
  onCodeClick: (code: string) => void;
  onClose: () => void;
  activeHoverCode: string | null;
  setActiveHoverCode: (code: string | null) => void;
}) {
  const [showAbstract, setShowAbstract] = useState(false);
  const [openJustification, setOpenJustification] = useState<string | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Map sentenceId -> list of assignments with evidence and theme
  const sentenceCodes = useMemo(() => {
    const map = new Map<
      string,
      {
        code: string;
        theme: ThemeDefinition;
        origin: "existing" | "new";
        start: number | null;
        end: number | null;
        exact: boolean;
        justification: string;
      }[]
    >();

    for (const assignment of detail.llm.codes) {
      const theme = getThemeByCode(assignment.code);
      for (const ev of assignment.evidence) {
        const list = map.get(ev.sentenceId) ?? [];
        list.push({
          code: assignment.code,
          theme,
          origin: assignment.origin,
          start: ev.start,
          end: ev.end,
          exact: ev.exact,
          justification: ev.justification,
        });
        map.set(ev.sentenceId, list);
      }
    }
    return map;
  }, [detail]);

  // Aggregate paper theme distribution profile
  const themeProfile = useMemo(() => {
    const counts = new Map<string, { theme: ThemeDefinition; count: number; codes: Set<string> }>();
    let totalAssignments = 0;

    for (const assignment of detail.llm.codes) {
      const theme = getThemeByCode(assignment.code);
      const entry = counts.get(theme.id) ?? { theme, count: 0, codes: new Set<string>() };
      entry.count += 1;
      entry.codes.add(assignment.code);
      counts.set(theme.id, entry);
      totalAssignments += 1;
    }

    return {
      list: Array.from(counts.values()).sort((a, b) => b.count - a.count),
      total: totalAssignments,
    };
  }, [detail]);

  function copyBibtex() {
    const bib = `@inproceedings{${detail.id.replace(/[^a-zA-Z0-9]/g, "_")},
  title = {${detail.title.replace(/[{}]/g, "")}},
  year = {${detail.year}},
  url = {https://aclanthology.org/${detail.id}/}
}`;
    navigator.clipboard.writeText(bib).then(() => {
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2000);
    });
  }

  function copyLimitationsText() {
    const text = detail.llm.limitation || detail.llm.sentences.map((s) => s.text).join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  }

  const aclUrl = `https://aclanthology.org/${detail.id}/`;

  return (
    <article class="inspector-article">
      {/* Header Bar */}
      <div class="inspector-header">
        <div class="inspector-title-row">
          <h2 class="inspector-title">{detail.title}</h2>
          <button type="button" class="close-inspector-btn" onClick={onClose} title="Close inspector">
            ✕
          </button>
        </div>

        <div class="inspector-meta-row">
          <span class="meta-item">
            <strong>{detail.year}</strong>
          </span>
          <span class="meta-sep">·</span>
          <span class="meta-item badge-venue">{detail.venue.toUpperCase()}</span>
          {detail.track && (
            <>
              <span class="meta-sep">·</span>
              <span class="meta-item track-text">
                {detail.track === "long"
                  ? "Main (Long Paper)"
                  : detail.track === "short"
                  ? "Main (Short Paper)"
                  : detail.track === "findings"
                  ? "Findings"
                  : "Main Conference"}
              </span>
            </>
          )}
          <span class="meta-sep">·</span>
          <a href={aclUrl} target="_blank" rel="noopener noreferrer" class="acl-link">
            {detail.id} ↗
          </a>
        </div>

        {/* Action Toolbar */}
        <div class="inspector-actions">
          <button type="button" class="action-btn" onClick={copyBibtex}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "5px" }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copiedBibtex ? "Copied BibTeX" : "Copy BibTeX"}
          </button>
          <button type="button" class="action-btn" onClick={copyLimitationsText}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: "5px" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            {copiedText ? "Copied Text" : "Copy Limitations"}
          </button>
          <a href={aclUrl} target="_blank" rel="noopener noreferrer" class="action-btn-link">
            Open Anthology ↗
          </a>
        </div>
      </div>

      {/* Collapsible Abstract Section */}
      {detail.abstract && (
        <div class="abstract-section">
          <button
            type="button"
            class="abstract-toggle-btn"
            onClick={() => setShowAbstract(!showAbstract)}
            aria-expanded={showAbstract}
          >
            <span class="toggle-arrow">{showAbstract ? "▼" : "▶"}</span>
            <span>Paper Abstract</span>
          </button>
          {showAbstract && <div class="abstract-content">{detail.abstract}</div>}
        </div>
      )}

      {/* Limitation Thematic Profile Bar */}
      {themeProfile.total > 0 && (
        <div class="profile-card">
          <div class="profile-header">
            <span class="profile-title">Limitation Profile ({detail.llm.codes.length} codes across themes)</span>
            <span class="codebook-badge" title="Codebook iteration version for this paper">
              {detail.llm.codebookVersion.replace(/_/g, " ")}
            </span>
          </div>

          {/* Segmented Distribution Bar */}
          <div class="profile-segmented-bar">
            {themeProfile.list.map(({ theme, count }) => {
              const pct = (count / themeProfile.total) * 100;
              return (
                <div
                  key={theme.id}
                  class="profile-segment"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: theme.color,
                  }}
                  title={`${theme.shortTitle}: ${count} code(s) (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          {/* Theme Legend Pills */}
          <div class="profile-legend-list">
            {themeProfile.list.map(({ theme, count, codes: paperCodes }) => (
              <div
                key={theme.id}
                class="profile-legend-item"
                onMouseEnter={() => {
                  // highlight all codes in this theme for this paper
                  const firstCode = Array.from(paperCodes)[0];
                  if (firstCode) setActiveHoverCode(firstCode);
                }}
                onMouseLeave={() => setActiveHoverCode(null)}
              >
                <span class="legend-color-dot" style={{ backgroundColor: theme.color }}></span>
                <span class="legend-theme-name">{theme.shortTitle}</span>
                <span class="legend-count">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sentence-Level Annotated Limitations Text (JuICE style) */}
      <div class="limitations-body">
        <h3 class="limitations-heading">Self-Reported Limitations Section</h3>
        <p class="limitations-subheading">
          Hover over any code badge to illuminate its evidence span. Click a code to review the LLM's justification.
        </p>

        <div class="sentences-flow">
          {detail.llm.sentences.map((s, idx) => {
            const marks = (sentenceCodes.get(s.id) ?? []).slice().sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
            const primaryTheme = marks.length > 0 ? marks[0].theme : null;
            const isHoveredSentence = marks.some((m) => m.code === activeHoverCode);

            return (
              <div
                key={s.id}
                class={`sentence-block ${primaryTheme ? "has-marks" : ""} ${isHoveredSentence ? "sentence-highlight-active" : ""}`}
                style={{
                  "--sentence-theme-bg": primaryTheme ? primaryTheme.bgLight : "transparent",
                  "--sentence-theme-border": primaryTheme ? primaryTheme.borderColor : "transparent",
                  "--sentence-theme-color": primaryTheme ? primaryTheme.color : "inherit",
                }}
              >
                <span class="sentence-index">S{idx + 1}</span>
                <div class="sentence-content">
                  <p class="sentence-text">{renderThematicSentence(s.text, marks, activeHoverCode)}</p>

                  {/* Code Badges for this sentence (Deduplicated per code) */}
                  {(() => {
                    const uniqueCodeMarks = new Map<string, (typeof marks)[0]>();
                    for (const m of marks) {
                      if (!uniqueCodeMarks.has(m.code)) {
                        uniqueCodeMarks.set(m.code, m);
                      }
                    }
                    const distinctMarks = Array.from(uniqueCodeMarks.values());
                    if (distinctMarks.length === 0) return null;

                    return (
                      <div class="sentence-chips-row">
                        {distinctMarks.map((m) => {
                          const isChipActive = activeHoverCode === m.code;
                          const isBoxOpen = openJustification === `${s.id}:${m.code}`;
                          const allCodeJustifications = Array.from(
                            new Set(marks.filter((x) => x.code === m.code).map((x) => x.justification).filter(Boolean))
                          );

                          return (
                            <div key={m.code} class="code-chip-wrapper">
                              <button
                                type="button"
                                class={`thematic-code-chip ${isChipActive ? "chip-active" : ""}`}
                                style={{
                                  "--chip-color": m.theme.color,
                                  "--chip-bg": m.theme.bgLight,
                                  "--chip-border": m.theme.borderColor,
                                }}
                                onMouseEnter={() => setActiveHoverCode(m.code)}
                                onMouseLeave={() => setActiveHoverCode(null)}
                                onClick={() => setOpenJustification(isBoxOpen ? null : `${s.id}:${m.code}`)}
                              >
                                <span class="chip-theme-bullet" style={{ backgroundColor: m.theme.color }}></span>
                                <span class="chip-code-name">{m.code}</span>
                                {m.origin === "new" && <span class="new-origin-badge">inductive</span>}
                                {!m.exact && <em class="approx-tag">(approx)</em>}
                                <span class="expand-icon">{isBoxOpen ? "▲" : "▼"}</span>
                              </button>

                              {/* Justification Box */}
                              {isBoxOpen && (
                                <div
                                  class="justification-card"
                                  style={{
                                    borderLeftColor: m.theme.color,
                                  }}
                                >
                                  <div class="justification-header">
                                    <span class="justification-theme-tag" style={{ color: m.theme.color }}>
                                      {m.theme.name}
                                    </span>
                                  </div>
                                  {allCodeJustifications.map((just, jIdx) => (
                                    <p key={jIdx} class="justification-text">{just}</p>
                                  ))}
                                  <div class="justification-footer">
                                    <button
                                      type="button"
                                      class="link-action-btn"
                                      onClick={() => onCodeClick(m.code)}
                                    >
                                      Filter all papers with "{m.code}" →
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function renderThematicSentence(
  text: string,
  marks: {
    start: number | null;
    end: number | null;
    exact: boolean;
    code: string;
    theme: ThemeDefinition;
  }[],
  activeHoverCode: string | null,
) {
  const exactMarks = marks.filter(
    (m): m is { start: number; end: number; exact: true; code: string; theme: ThemeDefinition } =>
      m.exact && m.start !== null && m.end !== null,
  );

  if (exactMarks.length === 0) return text;

  // Greedily pick non-overlapping spans
  const chosen: { start: number; end: number; code: string; theme: ThemeDefinition }[] = [];
  for (const m of exactMarks) {
    const last = chosen[chosen.length - 1];
    if (!last || m.start >= last.end) {
      chosen.push(m);
    }
  }

  const parts: ComponentChildren[] = [];
  let cursor = 0;

  chosen.forEach((m, i) => {
    if (m.start > cursor) {
      parts.push(text.slice(cursor, m.start));
    }

    const isActive = activeHoverCode === m.code;
    parts.push(
      <mark
        key={i}
        class={`theme-mark ${isActive ? "theme-mark-active" : ""}`}
        style={{
          backgroundColor: isActive ? m.theme.bgHover : m.theme.bgLight,
          borderBottom: `2px solid ${m.theme.color}`,
          color: "inherit",
        }}
        title={`${m.code} (${m.theme.shortTitle})`}
      >
        {text.slice(m.start, m.end)}
      </mark>,
    );
    cursor = m.end;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}
