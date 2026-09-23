import { useState, useMemo, useEffect, useRef } from "preact/hooks";
import { THEMES, getThemeById, type ThemeDefinition } from "../data/themes";
import {
  CODEBOOK_ENTRIES,
  MILESTONES,
  type CodebookEntry,
  type MilestoneSummary,
} from "../data/codebookData";

export default function CodebookExplorer() {
  // Master-Detail selection: default to the first code
  const [selectedCodeId, setSelectedCodeId] = useState<string>(CODEBOOK_ENTRIES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>("all");
  const [highlightExpansions, setHighlightExpansions] = useState<boolean>(true);
  const [showEvolutionOverview, setShowEvolutionOverview] = useState<boolean>(false);
  const [selectedMilestoneTab, setSelectedMilestoneTab] = useState<string>("2025");
  const [selectedVersionFilter, setSelectedVersionFilter] = useState<string>("all");

  const detailScrollRef = useRef<HTMLDivElement>(null);

  // Sync with URL query on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    if (codeParam) {
      const match = CODEBOOK_ENTRIES.find(
        (e) => e.id === codeParam || e.name.toLowerCase() === codeParam.toLowerCase()
      );
      if (match) setSelectedCodeId(match.id);
    }
  }, []);

  const handleSelectCode = (id: string) => {
    setSelectedCodeId(id);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("code", id);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }
    // Scroll detail area to top smoothly
    if (detailScrollRef.current) {
      detailScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectFromDrawer = (id: string) => {
    handleSelectCode(id);
    if (typeof document !== "undefined") {
      const container = document.querySelector(".master-detail-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Filtered sidebar entries based on search, theme, and evolution version
  const filteredSidebarEntries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CODEBOOK_ENTRIES.filter((entry) => {
      if (selectedThemeFilter !== "all" && entry.themeId !== selectedThemeFilter) {
        return false;
      }
      if (selectedVersionFilter !== "all") {
        if (selectedVersionFilter === "initial" && entry.originVersion !== "Initial") return false;
        if (selectedVersionFilter === "2020–2022" && entry.originVersion !== "2020–2022") return false;
        if (selectedVersionFilter === "2024" && entry.originVersion !== "2024") return false;
        if (selectedVersionFilter === "2025" && entry.originVersion !== "2025") return false;
        if (selectedVersionFilter === "expanded" && entry.expansions.length === 0) return false;
        if (selectedVersionFilter === "exp-2020–2022" && !entry.expansions.some((x) => x.version === "2020–2022")) return false;
        if (selectedVersionFilter === "exp-2023" && !entry.expansions.some((x) => x.version === "2023")) return false;
        if (selectedVersionFilter === "exp-2024" && !entry.expansions.some((x) => x.version === "2024")) return false;
        if (selectedVersionFilter === "exp-2025" && !entry.expansions.some((x) => x.version === "2025")) return false;
      }
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.definitionFull.toLowerCase().includes(q) ||
        entry.exampleQuote.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedThemeFilter, selectedVersionFilter]);

  // Group filtered entries by Theme
  const groupedSidebarEntries = useMemo(() => {
    const groups: { theme: ThemeDefinition; entries: CodebookEntry[] }[] = [];
    for (const theme of THEMES) {
      const entries = filteredSidebarEntries.filter((e) => e.themeId === theme.id);
      if (entries.length > 0) {
        groups.push({ theme, entries });
      }
    }
    return groups;
  }, [filteredSidebarEntries]);

  // Selected code object
  const currentEntry = useMemo(() => {
    return CODEBOOK_ENTRIES.find((e) => e.id === selectedCodeId) || CODEBOOK_ENTRIES[0];
  }, [selectedCodeId]);

  const currentTheme = useMemo(() => {
    return getThemeById(currentEntry.themeId) || THEMES[0];
  }, [currentEntry]);

  // Navigation: Next & Previous code in the full list
  const currentIndex = useMemo(() => {
    return CODEBOOK_ENTRIES.findIndex((e) => e.id === currentEntry.id);
  }, [currentEntry]);

  const prevEntry = currentIndex > 0 ? CODEBOOK_ENTRIES[currentIndex - 1] : null;
  const nextEntry = currentIndex < CODEBOOK_ENTRIES.length - 1 ? CODEBOOK_ENTRIES[currentIndex + 1] : null;

  // Active milestone for overview dialog/banner
  const activeMilestone = useMemo(() => {
    return MILESTONES.find((m) => m.version === selectedMilestoneTab) || MILESTONES[4];
  }, [selectedMilestoneTab]);

  // Codes added in active milestone
  const milestoneAddedCodes = useMemo(() => {
    return CODEBOOK_ENTRIES.filter((e) => e.originVersion === activeMilestone.version);
  }, [activeMilestone]);

  // Codes expanded in active milestone
  const milestoneExpandedCodes = useMemo(() => {
    return CODEBOOK_ENTRIES.filter((e) =>
      e.expansions.some((x) => x.version === activeMilestone.version)
    ).map((entry) => ({
      entry,
      expansion: entry.expansions.find((x) => x.version === activeMilestone.version)!,
    }));
  }, [activeMilestone]);

  // Render definition with highlighted expansion clauses
  const renderDefinition = (entry: CodebookEntry) => {
    if (!highlightExpansions || entry.expansions.length === 0) {
      return <span>{entry.definitionFull}</span>;
    }

    const full = entry.definitionFull;
    type Segment = { text: string; isExpansion?: boolean; version?: string };
    let segments: Segment[] = [{ text: full }];

    for (const exp of entry.expansions) {
      const clause = exp.addedClause;
      const nextSegments: Segment[] = [];
      for (const seg of segments) {
        if (seg.isExpansion) {
          nextSegments.push(seg);
          continue;
        }
        const idx = seg.text.indexOf(clause);
        if (idx !== -1) {
          const before = seg.text.substring(0, idx);
          const match = seg.text.substring(idx, idx + clause.length);
          const after = seg.text.substring(idx + clause.length);
          if (before) nextSegments.push({ text: before });
          nextSegments.push({ text: match, isExpansion: true, version: exp.version });
          if (after) nextSegments.push({ text: after });
        } else {
          nextSegments.push(seg);
        }
      }
      segments = nextSegments;
    }

    return (
      <span>
        {segments.map((seg, i) => {
          if (seg.isExpansion) {
            const verClass =
              seg.version === "2020–2022"
                ? "exp-2022"
                : seg.version === "2023"
                  ? "exp-2023"
                  : seg.version === "2024"
                    ? "exp-2024"
                    : "exp-2025";
            return (
              <mark
                key={i}
                class={`expansion-clause ${verClass}`}
                title={`Added during the ${seg.version} grounded expansion round`}
              >
                <span class="expansion-indicator">+{seg.version}</span>
                {seg.text}
              </mark>
            );
          }
          return <span key={i}>{seg.text}</span>;
        })}
      </span>
    );
  };

  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div class="codebook-master-detail-root">
      {/* 1. TOP UTILITY BAR (Clean, non-intrusive) */}
      <div class="top-utility-bar">
        <div class="taxonomy-summary-pill">
          <span class="pulse-indicator"></span>
          <span>50 Codes (40 Limitations + 10 Non-Limitations)</span>
        </div>

        <button
          type="button"
          class={`evolution-toggle-btn ${showEvolutionOverview ? "active" : ""}`}
          onClick={() => setShowEvolutionOverview(!showEvolutionOverview)}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{showEvolutionOverview ? "Hide Evolution Process" : "View Codebook Evolution (C₀ → C₄)"}</span>
        </button>
      </div>

      {/* COLLAPSIBLE EVOLUTION STORY (Progressive disclosure for interested researchers) */}
      {showEvolutionOverview && (
        <section class="evolution-overview-drawer">
          <div class="drawer-header">
            <div>
              <span class="drawer-kicker">Grounded Taxonomy Development</span>
              <h3 class="drawer-title">Iterative Evolution Summary (Table 15)</h3>
            </div>
            <button
              type="button"
              class="drawer-close-btn"
              onClick={() => setShowEvolutionOverview(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <p class="drawer-intro">
            The codebook grew inductively from a 25-code deductive baseline (Xu et al., 2025) through 4 corpus iterations.
            At each round, LLM-generated proposals were reviewed and adjudicated by humans under the{" "}
            <em>Structured Expansion Principle (Preserve &amp; Integrate)</em>.
          </p>

          {/* Stepper Tabs */}
          <div class="drawer-stepper-tabs">
            {MILESTONES.map((m) => (
              <button
                key={m.version}
                type="button"
                class={`drawer-step-btn ${selectedMilestoneTab === m.version ? "active" : ""}`}
                onClick={() => setSelectedMilestoneTab(m.version)}
              >
                <span class="step-lbl">{m.label}</span>
                <span class="step-sub">
                  {m.version === "Initial" ? "25 codes" : `+${m.newCodesAdded} add · ${m.expandedCount} exp`}
                </span>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div class="drawer-milestone-body">
            <div class="body-top">
              <span class="milestone-period">{activeMilestone.years}</span>
              <div class="mini-stats-row">
                <span class="mini-stat"><strong>{activeMilestone.totalCodes}</strong> total codes</span>
                <span class="mini-stat add-stat"><strong>+{activeMilestone.newCodesAdded}</strong> added</span>
                <span class="mini-stat exp-stat"><strong>{activeMilestone.expandedCount}</strong> expanded</span>
                <span class="mini-stat merge-stat"><strong>{activeMilestone.mergedCount}</strong> merged</span>
              </div>
            </div>
            <p class="milestone-desc-text">{activeMilestone.description}</p>

            {/* Interactive Delta Panel: ADDED NEW & EXPANDED CODES */}
            <div class="drawer-deltas-container">
              {/* Column 1: Added New Codes */}
              <div class="delta-column delta-added-col">
                <div class="delta-col-header">
                  <div class="delta-col-title-wrap">
                    <span class="delta-badge add-badge">
                      {selectedMilestoneTab === "Initial"
                        ? "25 BASELINE"
                        : `+${milestoneAddedCodes.length} ADD NEW`}
                    </span>
                    <h4 class="delta-col-title">
                      {selectedMilestoneTab === "Initial"
                        ? "Initial Deductive Baseline"
                        : "New Codes Added in this Round"}
                    </h4>
                  </div>
                  <span class="delta-col-hint">Click code to inspect ↓</span>
                </div>

                {milestoneAddedCodes.length === 0 ? (
                  <div class="delta-empty-state">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>0 new codes added — Empirical saturation achieved across 4,024 papers (Table 15).</span>
                  </div>
                ) : (
                  <div class="delta-chips-grid">
                    {milestoneAddedCodes.map((entry) => {
                      const theme = getThemeById(entry.themeId);
                      const isSelected = entry.id === currentEntry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          class={`delta-code-chip ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectFromDrawer(entry.id)}
                          title={`Click to inspect ${entry.name} (${entry.prevalencePct.toFixed(1)}% prevalence)`}
                        >
                          <span
                            class="chip-theme-dot"
                            style={{ backgroundColor: theme?.color || "#64748b" }}
                          ></span>
                          <span class="chip-name">{entry.name}</span>
                          <span class="chip-pct">{entry.prevalencePct.toFixed(1)}%</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Column 2: Expanded Definitions */}
              <div class="delta-column delta-expanded-col">
                <div class="delta-col-header">
                  <div class="delta-col-title-wrap">
                    <span class="delta-badge exp-badge">{milestoneExpandedCodes.length} EXPANDED</span>
                    <h4 class="delta-col-title">Existing Definitions Expanded</h4>
                  </div>
                  <span class="delta-col-hint">Click code to inspect clause ↓</span>
                </div>

                {milestoneExpandedCodes.length === 0 ? (
                  <div class="delta-empty-state">
                    <span>No definition expansions in baseline iteration (C₀).</span>
                  </div>
                ) : (
                  <div class="delta-expanded-list">
                    {milestoneExpandedCodes.map(({ entry, expansion }) => {
                      const theme = getThemeById(entry.themeId);
                      const isSelected = entry.id === currentEntry.id;
                      return (
                        <div
                          key={entry.id}
                          class={`delta-expanded-card ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectFromDrawer(entry.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectFromDrawer(entry.id);
                            }
                          }}
                          title={`Click to inspect ${entry.name}`}
                        >
                          <div class="card-head">
                            <div class="card-title-wrap">
                              <span
                                class="chip-theme-dot"
                                style={{ backgroundColor: theme?.color || "#64748b" }}
                              ></span>
                              <strong class="exp-code-name">{entry.name}</strong>
                            </div>
                            <span class="card-prevalence">{entry.prevalencePct.toFixed(1)}%</span>
                          </div>
                          <div class="delta-clause-box">
                            <span class="diff-tag">+ clause:</span>
                            <span class="diff-text">{expansion.addedClause}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. TWO-PANE MASTER-DETAIL LAYOUT */}
      <div class="master-detail-container">
        {/* LEFT PANE: Directory & Search */}
        <aside class="master-sidebar">
          {/* Search Box */}
          <div class="sidebar-search-wrap">
            <svg class="sidebar-search-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Filter by code name, definition, or example..."
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            />
            {searchQuery && (
              <button type="button" class="sidebar-clear-btn" onClick={() => setSearchQuery("")}>
                &times;
              </button>
            )}
          </div>

          {/* Theme & Evolution Stage Filters */}
          <div class="sidebar-filter-row">
            <select
              class="theme-select"
              value={selectedThemeFilter}
              onChange={(e) => setSelectedThemeFilter((e.target as HTMLSelectElement).value)}
              title="Filter by thematic domain"
            >
              <option value="all">All Themes (50 codes)</option>
              {THEMES.map((th) => (
                <option key={th.id} value={th.id}>
                  {th.number === 0 ? "NL" : `T${th.number}`}: {th.shortTitle} ({th.codes.length})
                </option>
              ))}
            </select>

            <select
              class="version-select"
              value={selectedVersionFilter}
              onChange={(e) => setSelectedVersionFilter((e.target as HTMLSelectElement).value)}
              title="Filter by codebook evolution stage"
            >
              <option value="all">All Evolution Stages (50)</option>
              <optgroup label="Added New by Milestone">
                <option value="initial">C₀: Baseline (25 codes)</option>
                <option value="2020–2022">C₁: Added 2020–2022 (+22)</option>
                <option value="2024">C₃: Added 2024 (+1)</option>
                <option value="2025">C₄: Added 2025 (+2)</option>
              </optgroup>
              <optgroup label="Definition Expansions">
                <option value="expanded">All Expanded Codes (18)</option>
                <option value="exp-2020–2022">Expanded in C₁ (6)</option>
                <option value="exp-2023">Expanded in C₂ (4)</option>
                <option value="exp-2024">Expanded in C₃ (4)</option>
                <option value="exp-2025">Expanded in C₄ (7)</option>
              </optgroup>
            </select>
          </div>

          {/* Code List Grouped by Theme */}
          <div class="sidebar-code-list">
            {groupedSidebarEntries.length === 0 ? (
              <div class="sidebar-empty">No codes match filters</div>
            ) : (
              groupedSidebarEntries.map(({ theme, entries }) => (
                <div key={theme.id} class="sidebar-theme-group">
                  <div class="sidebar-theme-heading">
                    <span class="theme-chip" style={{ backgroundColor: theme.color }}>
                      {theme.number === 0 ? "NL" : `T${theme.number}`}
                    </span>
                    <span class="theme-heading-text">{theme.shortTitle}</span>
                    <span class="theme-heading-count">({entries.length})</span>
                  </div>

                  <div class="sidebar-items">
                    {entries.map((entry) => {
                      const isSelected = entry.id === currentEntry.id;
                      const hasExpansions = entry.expansions.length > 0;

                      return (
                        <button
                          key={entry.id}
                          type="button"
                          class={`sidebar-code-item ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectCode(entry.id)}
                          style={{
                            "--accent-color": theme.color,
                          } as any}
                        >
                          <span
                            class="item-dot"
                            style={{ backgroundColor: isSelected ? theme.color : "#94a3b8" }}
                          ></span>
                          <span class="item-name">{entry.name}</span>
                          <div class="item-badges">
                            {entry.originVersion === "2025" && (
                              <span class="item-evo-tag tag-new-c4" title="Added new in C₄ (2025)">
                                NEW C₄
                              </span>
                            )}
                            {entry.originVersion === "2024" && (
                              <span class="item-evo-tag tag-new-c3" title="Added new in C₃ (2024)">
                                NEW C₃
                              </span>
                            )}
                            {entry.originVersion === "2020–2022" && (
                              <span class="item-evo-tag tag-new-c1" title="Added new in C₁ (2020–2022)">
                                C₁
                              </span>
                            )}
                            {entry.originVersion === "Initial" && (
                              <span class="item-evo-tag tag-baseline" title="Deductive baseline code (C₀)">
                                C₀
                              </span>
                            )}
                            {hasExpansions && (
                              <span
                                class="item-exp-dot"
                                title={`Expanded in: ${entry.expansions.map((x) => x.version).join(", ")}`}
                              >
                                exp
                              </span>
                            )}
                            <span class="item-prev">{entry.prevalencePct.toFixed(1)}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* RIGHT PANE: Clean Reading Canvas */}
        <main class="detail-canvas" ref={detailScrollRef}>
          {/* Breadcrumb Navigation */}
          <div class="detail-breadcrumb-row">
            <span class="crumb-theme" style={{ color: currentTheme.color }}>
              {currentTheme.number === 0 ? "Non-Limitation Discourse" : `Theme ${currentTheme.number}: ${currentTheme.shortTitle}`}
            </span>
            <span class="crumb-sep">/</span>
            <span class="crumb-origin">
              {currentEntry.originVersion === "Initial" ? "Baseline Code (C₀)" : `Added in ${currentEntry.originVersion}`}
            </span>
          </div>

          {/* Title Header */}
          <div class="detail-title-row">
            <h2 class="detail-code-title">{currentEntry.name}</h2>
            <div class="detail-actions">
              <a
                href={`${baseUrl}explore?code=${encodeURIComponent(currentEntry.name)}`}
                class="detail-explore-btn"
                title="Search papers with this code in Corpus Explorer"
              >
                <span>Explore in Corpus</span>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Metrics & Theme Context Strip */}
          <div class="detail-metric-strip">
            <div class="metric-cell">
              <span class="metric-lbl">Corpus Prevalence</span>
              <span class="metric-val">{currentEntry.prevalencePct.toFixed(2)}%</span>
            </div>
            <div class="metric-sep"></div>
            <div class="metric-cell">
              <span class="metric-lbl">Total Papers</span>
              <span class="metric-val">{currentEntry.paperCount.toLocaleString()}</span>
            </div>
            <div class="metric-sep"></div>
            <div class="metric-cell">
              <span class="metric-lbl">First Introduced</span>
              <span class="metric-val">{currentEntry.originVersion}</span>
            </div>
            <div class="metric-sep"></div>
            <div class="metric-cell">
              <span class="metric-lbl">Evolution Status</span>
              <span class="metric-val">
                {currentEntry.expansions.length > 0 ? (
                  <span class="metric-tag-exp">Expanded ({currentEntry.expansions.map((e) => e.version).join(", ")})</span>
                ) : (
                  <span class="metric-tag-stable">Stable across rounds</span>
                )}
              </span>
            </div>
          </div>

          {/* SECTION 1: FORMAL DEFINITION */}
          <section class="detail-section">
            <div class="section-title-bar">
              <h3 class="section-heading">Definition</h3>
              {currentEntry.expansions.length > 0 && (
                <label class="compact-highlight-toggle">
                  <input
                    type="checkbox"
                    checked={highlightExpansions}
                    onChange={(e) => setHighlightExpansions((e.target as HTMLInputElement).checked)}
                  />
                  <span>Highlight added clauses</span>
                </label>
              )}
            </div>
            <div class="definition-text-lead">{renderDefinition(currentEntry)}</div>
          </section>

          {/* SECTION 2: EXEMPLARY SEMANTIC UNIT */}
          <section class="detail-section">
            <h3 class="section-heading">Exemplary Semantic Unit</h3>
            <p class="section-subtext">Verbatim quotation extracted from published ACL &amp; EMNLP papers:</p>
            <div class="excerpt-callout">
              <svg class="callout-quote-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote class="excerpt-quote">“{currentEntry.exampleQuote}”</blockquote>
            </div>
          </section>

          {/* SECTION 3: EVOLUTION DIFF (Only when expansions exist) */}
          {currentEntry.expansions.length > 0 && (
            <section class="detail-section evolution-section">
              <h3 class="section-heading">Grounded Expansion History</h3>
              <p class="section-subtext">
                How this code's definition was refined across corpus iterations without altering foundational meaning:
              </p>

              <div class="evolution-timeline-cards">
                <div class="timeline-entry base-entry">
                  <div class="entry-meta">
                    <span class="entry-step-badge">Origin</span>
                    <span class="entry-version-tag">{currentEntry.originVersion}</span>
                  </div>
                  <div class="entry-body">{currentEntry.definitionBase}</div>
                </div>

                {currentEntry.expansions.map((exp, idx) => (
                  <div key={idx} class="timeline-entry added-entry">
                    <div class="entry-meta">
                      <span class="entry-step-badge badge-added">Expansion</span>
                      <span class="entry-version-tag">Iteration {exp.version}</span>
                    </div>
                    <div class="entry-body">
                      <span class="added-prefix">+ Additive clause:</span>
                      <p class="added-clause-text">"{exp.addedClause}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: THEME CONTEXT */}
          <section class="detail-section theme-context-section">
            <h3 class="section-heading">Thematic Classification</h3>
            <div class="theme-context-card" style={{ borderLeftColor: currentTheme.color }}>
              <div class="theme-card-top">
                <span class="theme-number-badge" style={{ backgroundColor: currentTheme.color }}>
                  {currentTheme.number === 0 ? "NL" : `Theme ${currentTheme.number}`}
                </span>
                <h4 class="theme-card-title">{currentTheme.name}</h4>
              </div>
              <p class="theme-card-desc">{currentTheme.description}</p>
            </div>
          </section>

          {/* BOTTOM PAGINATION: Prev / Next Code */}
          <nav class="detail-bottom-nav" aria-label="Adjacent Codes">
            {prevEntry ? (
              <button
                type="button"
                class="adjacent-btn prev-btn"
                onClick={() => handleSelectCode(prevEntry.id)}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <div class="btn-text">
                  <span class="btn-sub">Previous Code</span>
                  <span class="btn-title">{prevEntry.name}</span>
                </div>
              </button>
            ) : (
              <div></div>
            )}

            {nextEntry && (
              <button
                type="button"
                class="adjacent-btn next-btn"
                onClick={() => handleSelectCode(nextEntry.id)}
              >
                <div class="btn-text">
                  <span class="btn-sub">Next Code</span>
                  <span class="btn-title">{nextEntry.name}</span>
                </div>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}
