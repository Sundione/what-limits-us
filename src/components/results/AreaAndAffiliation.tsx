import { useState, useMemo } from "preact/hooks";
import {
  HOMOGENEITY_STAT,
  TOP_32_SIGNIFICANT_PAIRS,
  PAPER_FORMAT_DATA,
  TOP_AFFILIATION_GAPS,
  type FormatRow,
  type AffiliationComparisonRow,
} from "../../data/resultsData";

type MainTab = "areas" | "affiliation" | "format";
type PairDirection = "all" | "over" | "under";
type AffiliationMode = "top5" | "all";
type AffiliationCategory = "all" | "higher-in-academia" | "higher-in-bigtech";

export default function AreaAndAffiliation() {
  const [activeTab, setActiveTab] = useState<MainTab>("areas");

  // Tab 1 (Areas) State - Focused strictly on Table 5 (32 Significant Divergences)
  const [pairDirection, setPairDirection] = useState<PairDirection>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [pairSearch, setPairSearch] = useState<string>("");

  // Tab 2 (Affiliation) State - Full 40 Codes from Table 10
  const [affFilter, setAffFilter] = useState<"all" | "top5" | "significant" | "higher-in-bigtech" | "higher-in-academia">("all");
  const [affSort, setAffSort] = useState<"adjp" | "gap" | "bigtech" | "academia" | "prevalence" | "name">("adjp");
  const [affSearch, setAffSearch] = useState<string>("");
  const [affViewMode, setAffViewMode] = useState<"bars" | "table">("bars");

  // Tab 3 (Format) State - Full 39 codes with search and sort
  const [formatSearch, setFormatSearch] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<"all" | "divergent">("all");
  const [formatSort, setFormatSort] = useState<"divergence" | "short" | "long" | "findings" | "name">("divergence");

  // Extract unique areas from the 32 pairs for dropdown
  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(TOP_32_SIGNIFICANT_PAIRS.map((p) => p.area))).sort();
  }, []);

  // Filter 32 pairs
  const filteredPairs = useMemo(() => {
    return TOP_32_SIGNIFICANT_PAIRS.filter((p) => {
      if (pairDirection !== "all" && p.dir !== pairDirection) return false;
      if (selectedArea !== "all" && p.area !== selectedArea) return false;
      if (pairSearch.trim() !== "") {
        const q = pairSearch.toLowerCase();
        const matchCode = p.code.toLowerCase().includes(q);
        const matchArea = p.area.toLowerCase().includes(q);
        const matchNote = p.note.toLowerCase().includes(q);
        if (!matchCode && !matchArea && !matchNote) return false;
      }
      return true;
    });
  }, [pairDirection, selectedArea, pairSearch]);

  const overCount = TOP_32_SIGNIFICANT_PAIRS.filter((p) => p.dir === "over").length;
  const underCount = TOP_32_SIGNIFICANT_PAIRS.filter((p) => p.dir === "under").length;

  // Affiliation rows (All 40 codes from Table 10 in Appendix F)
  const displayedAffiliationRows = useMemo(() => {
    let rows = [...TOP_AFFILIATION_GAPS];

    // Filter by preset or category
    if (affFilter === "top5") {
      rows = rows.slice(0, 5);
    } else if (affFilter === "significant") {
      rows = rows.filter((r) => r.significant);
    } else if (affFilter === "higher-in-bigtech") {
      rows = rows.filter((r) => r.diff > 0);
    } else if (affFilter === "higher-in-academia") {
      rows = rows.filter((r) => r.diff < 0);
    }

    // Filter by search query
    if (affSearch.trim() !== "") {
      const q = affSearch.toLowerCase().trim();
      rows = rows.filter((r) => r.code.toLowerCase().includes(q));
    }

    // Sort rows
    return rows.sort((a, b) => {
      if (affSort === "adjp") {
        return a.adjP - b.adjP || Math.abs(b.diff) - Math.abs(a.diff);
      }
      if (affSort === "gap") {
        return Math.abs(b.diff) - Math.abs(a.diff);
      }
      if (affSort === "bigtech") {
        return b.diff - a.diff;
      }
      if (affSort === "academia") {
        return a.diff - b.diff;
      }
      if (affSort === "prevalence") {
        return b.nonLargePct - a.nonLargePct;
      }
      return a.code.localeCompare(b.code);
    });
  }, [affFilter, affSort, affSearch]);

  // Format rows (all 39 codes from Table 9)
  const displayedFormatRows = useMemo(() => {
    const q = formatSearch.toLowerCase().trim();
    let rows = PAPER_FORMAT_DATA.filter((r) => {
      if (formatFilter === "divergent" && r.pValue >= 0.05) return false;
      if (q && !r.code.toLowerCase().includes(q)) return false;
      return true;
    });

    return [...rows].sort((a, b) => {
      if (formatSort === "divergence") {
        return a.pValue - b.pValue || b.chi2 - a.chi2;
      }
      if (formatSort === "short") {
        return b.shortPct - a.shortPct;
      }
      if (formatSort === "long") {
        return b.longPct - a.longPct;
      }
      if (formatSort === "findings") {
        return b.findingsPct - a.findingsPct;
      }
      return a.code.localeCompare(b.code);
    });
  }, [formatSearch, formatFilter, formatSort]);

  return (
    <div class="area-affiliation-section" id="attributes-rq2">
      {/* Section Lead Header */}
      <div class="section-lead-header">
        <div class="section-tag-row">
          <span class="section-kpi-badge">RQ2 · Paper Attributes &amp; Subfields</span>
          <span class="section-corpus-pill">29 Research Areas · Forbes Global 2000 · 3 Formats</span>
        </div>
        <h2 class="results-subheading">Field-Wide Homogeneity, Corporate Disclosures &amp; Paper Formats</h2>
        <p class="section-desc">
          Does limitation reporting differ by research subfield, author affiliation, or publication format? 
          Our cross-attribute analysis reveals an empirical pattern: <strong>97.2% field-wide uniformity</strong> across 29 research subfields, 
          contrasted with targeted divergence in corporate disclosures and short paper admissions.
        </p>
      </div>

      {/* Plain-Language Intuitive Takeaways for First-Time Readers */}
      <div class="rq-intuitive-lead-box">
        <div class="lead-box-header">
          <span class="lead-box-icon">💡</span>
          <div class="lead-box-title-wrap">
            <h4 class="lead-box-title">Key Takeaways for Readers · Intuitive Summary</h4>
            <p class="lead-box-sub">Essential takeaways translating statistical tests into accessible insights for readers exploring this research.</p>
          </div>
        </div>
        <div class="lead-points-grid">
          <div class="lead-point-card">
            <div class="point-badge-row">
              <span class="point-icon">🏛️</span>
              <span class="point-badge">97.2% Homogeneity</span>
            </div>
            <strong class="point-title">Field-Wide Uniformity: A Shared Reporting Template</strong>
            <p class="point-text">
              Across 29 distinct research areas—from Machine Translation to Dialogue and Speech—97.2% of papers share the exact same top-3 limitation themes (Scope Bounding, Methodology, and Compute), reflecting an unwritten community reporting template.
            </p>
            <div class="point-highlight">
              <strong>Notable Exceptions:</strong> Only 32 statistically significant deviations exist (q &lt; 0.05). For instance, Computational Social Science cites <em>Dataset Bias</em> 2.2&times; more often, while Efficient NLP cites <em>Hyperparameter Sensitivity</em> 3.5&times; more often.
            </div>
          </div>

          <div class="lead-point-card">
            <div class="point-badge-row">
              <span class="point-icon">🏢</span>
              <span class="point-badge">Corporate vs. Academia</span>
            </div>
            <strong class="point-title">Big Tech Reports Compute Bottlenecks at Similar Rates to Academia</strong>
            <p class="point-text">
              Despite having access to vast compute clusters, corporate researchers (Google, Meta, Microsoft) report <em>High Resource Requirements</em> at virtually identical rates (~20%) as university researchers, as corporate experiments scale up to match infrastructure.
            </p>
            <div class="point-highlight">
              <strong>The Sole Major Divergence:</strong> Industry authors bound their experimental scope significantly more often (69.3% vs. 62.4%, p &lt; 0.001), serving as a deliberate risk-management strategy to establish product boundaries.
            </div>
          </div>

          <div class="lead-point-card">
            <div class="point-badge-row">
              <span class="point-icon">📄</span>
              <span class="point-badge">Publication Formats</span>
            </div>
            <strong class="point-title">Short Papers Focus Heavily on What Was Left Out</strong>
            <p class="point-text">
              Constrained by a 4-page ceiling, short papers disproportionately acknowledge experimental boundaries (Scope Limitations) and upstream model dependencies compared to long papers.
            </p>
            <div class="point-highlight">
              <strong>Key Implication:</strong> This highlights that a substantial fraction of reported limitations stem from physical page constraints rather than fundamental methodological defects.
            </div>
          </div>
        </div>
      </div>

      {/* Primary Dimension Switcher (3 Tabs) - strictly constrained */}
      <div class="dimension-tabs-nav" role="tablist" aria-label="RQ2 Analysis Dimensions">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "areas"}
          class={`dimension-tab-btn ${activeTab === "areas" ? "dim-tab-active" : ""}`}
          onClick={() => setActiveTab("areas")}
        >
          <span class="dim-tab-icon">🏛️</span>
          <span class="dim-tab-content">
            <span class="dim-tab-title">Subfield Homogeneity</span>
            <span class="dim-tab-sub">97.2% Uniformity · Table 5</span>
          </span>
          <span class="dim-tab-count">32 Pairs</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "affiliation"}
          class={`dimension-tab-btn ${activeTab === "affiliation" ? "dim-tab-active" : ""}`}
          onClick={() => setActiveTab("affiliation")}
        >
          <span class="dim-tab-icon">🏢</span>
          <span class="dim-tab-content">
            <span class="dim-tab-title">Corporate Affiliation</span>
            <span class="dim-tab-sub">Forbes 2000 vs. Academia</span>
          </span>
          <span class="dim-tab-count">40 Codes</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "format"}
          class={`dimension-tab-btn ${activeTab === "format" ? "dim-tab-active" : ""}`}
          onClick={() => setActiveTab("format")}
        >
          <span class="dim-tab-icon">📄</span>
          <span class="dim-tab-content">
            <span class="dim-tab-title">Publication Formats</span>
            <span class="dim-tab-sub">Long vs. Short vs. Findings</span>
          </span>
          <span class="dim-tab-count">39 Codes</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUBFIELD HOMOGENEITY & THE 32 SIGNIFICANT PAIRS (TABLE 5) */}
      {/* ========================================================================= */}
      {activeTab === "areas" && (
        <div class="dim-tab-panel panel-subfields">
          {/* Homogeneity Callout Banner */}
          <div class="homogeneity-hero-banner">
            <div class="banner-stat-primary">
              <span class="banner-big-val">{HOMOGENEITY_STAT.uniformityPct}%</span>
              <span class="banner-stat-label">Field-Wide Uniformity</span>
              <p class="banner-stat-desc">
                1,128 of 1,160 area-code pairs exhibit <em>no statistically significant deviation</em> from the corpus-wide expectation (&chi;&sup2;(1,092) = 2,872, p &lt; 0.001, Cram&eacute;r's V = 0.071).
              </p>
            </div>
            <div class="banner-divider"></div>
            <div class="banner-stat-secondary">
              <span class="banner-accent-val">{HOMOGENEITY_STAT.distinctPct}%</span>
              <span class="banner-stat-label">Statistically Distinct Cells</span>
              <p class="banner-stat-desc">
                Exactly <strong>32 cells</strong> (24 over-represented, 8 under-represented) reach Bonferroni-corrected significance (|z| &gt; 4.09, p &lt; 4.31 &times; 10⁻⁵).
              </p>
            </div>
          </div>

          {/* 32 Significant Pairs Explorer */}
          <div class="pairs-explorer-wrap">
            {/* Filter Controls Row */}
            <div class="pairs-filter-toolbar">
              <div class="dir-toggle-group" role="group" aria-label="Direction Filter">
                <button
                  type="button"
                  class={`dir-btn ${pairDirection === "all" ? "dir-btn-active" : ""}`}
                  onClick={() => setPairDirection("all")}
                >
                  All Pairs ({TOP_32_SIGNIFICANT_PAIRS.length})
                </button>
                <button
                  type="button"
                  class={`dir-btn dir-over ${pairDirection === "over" ? "dir-btn-active" : ""}`}
                  onClick={() => setPairDirection("over")}
                >
                  Over-Reported ({overCount}) ↑
                </button>
                <button
                  type="button"
                  class={`dir-btn dir-under ${pairDirection === "under" ? "dir-btn-active" : ""}`}
                  onClick={() => setPairDirection("under")}
                >
                  Under-Reported ({underCount}) ↓
                </button>
              </div>

              <div class="pairs-filter-inputs">
                <div class="area-select-wrap">
                  <label class="toolbar-label" for="area-select">Subfield:</label>
                  <select
                    id="area-select"
                    class="toolbar-select"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea((e.target as HTMLSelectElement).value)}
                  >
                    <option value="all">All Subfields ({uniqueAreas.length})</option>
                    {uniqueAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div class="search-input-wrap">
                  <input
                    type="text"
                    class="toolbar-search"
                    placeholder="Search code or insight..."
                    value={pairSearch}
                    onInput={(e) => setPairSearch((e.target as HTMLInputElement).value)}
                  />
                  {pairSearch && (
                    <button
                      type="button"
                      class="search-clear-btn"
                      onClick={() => setPairSearch("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pairs Grid */}
            <div class="pairs-cards-grid">
              {filteredPairs.map((p) => {
                const isOver = p.dir === "over";
                return (
                  <div
                    key={`${p.area}-${p.code}`}
                    class={`pair-data-card ${isOver ? "pair-card-over" : "pair-card-under"}`}
                  >
                    <div class="pair-card-header">
                      <span class="pair-area-badge">{p.area}</span>
                      <span class={`pair-dir-badge ${isOver ? "badge-over" : "badge-under"}`}>
                        {isOver ? `+${p.oeRatio.toFixed(2)}× expected (z = +${p.z.toFixed(1)})` : `${p.oeRatio.toFixed(2)}× expected (z = ${p.z.toFixed(1)})`}
                      </span>
                    </div>

                    <div class="pair-code-name">
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(p.code)}`}
                        class="code-drill-link"
                        title={`Explore papers with ${p.code}`}
                      >
                        {p.code}
                      </a>
                    </div>

                    {/* Comparative Dual Mini Bar (Observed vs Expected) */}
                    <div class="pair-comparison-bars">
                      <div class="bar-row">
                        <span class="bar-lbl">Observed (O):</span>
                        <div class="bar-track">
                          <div
                            class={`bar-val ${isOver ? "fill-over" : "fill-under"}`}
                            style={{ width: `${Math.min(100, (p.O / Math.max(p.O, p.E, 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span class="bar-num">{p.O} p.</span>
                      </div>
                      <div class="bar-row">
                        <span class="bar-lbl">Expected (E):</span>
                        <div class="bar-track">
                          <div
                            class="bar-val fill-baseline"
                            style={{ width: `${Math.min(100, (p.E / Math.max(p.O, p.E, 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span class="bar-num">{p.E.toFixed(1)} p.</span>
                      </div>
                    </div>

                    <p class="pair-note-text">{p.note}</p>
                    <div class="pair-card-footer">
                      <span class="pair-footer-stat">Bonferroni adj. p = {p.adjP}</span>
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(p.code)}`}
                        class="pair-explore-link"
                        title={`Explore ${p.code} in Explorer`}
                      >
                        Explore ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPairs.length === 0 && (
              <div class="pairs-empty-state">
                <p>No pairs match the selected filters.</p>
                <button
                  type="button"
                  class="btn-reset"
                  onClick={() => {
                    setPairDirection("all");
                    setSelectedArea("all");
                    setPairSearch("");
                  }}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CORPORATE AFFILIATION GAPS (TABLE 10 & FIGURE 5 - ALL 40 CODES) */}
      {/* ========================================================================= */}
      {activeTab === "affiliation" && (
        <div class="dim-tab-panel panel-affiliation-full">
          {/* Hero Finding Card: Field-wide Corporate Parity & Scope Divergence */}
          <div class="format-hero-card aff-hero-card">
            <div class="format-hero-badge">Key Statistical Finding · Table 10 (Appendix F)</div>
            <h3 class="format-hero-title">
              97.5% Uniformity: Corporate Disclosures Mirror Academic Research
            </h3>
            <p class="format-hero-desc">
              Testing all <strong>40 limitation codes</strong> with two-sided Fisher’s exact tests (adjusted via Benjamini–Hochberg FDR) 
              demonstrates that <strong>39 out of 40 codes exhibit no statistically significant difference</strong> between Forbes Global 2000 corporate 
              and academic papers. Only <strong>Scope Limitation</strong> reaches statistical significance (p<sub>adj</sub> = 0.019, OR = 0.748), 
              where university researchers bound empirical claims more conservatively.
            </p>
            <div class="format-hero-metrics">
              <div class="f-metric">
                <span class="f-num">97.5%</span>
                <span class="f-lbl">Uniformity (39 of 40 Codes)</span>
              </div>
              <div class="f-divider">|</div>
              <div class="f-metric">
                <span class="f-num">1</span>
                <span class="f-lbl">Significant Code (Scope Limitation)</span>
              </div>
              <div class="f-divider">|</div>
              <div class="f-metric">
                <span class="f-num">−6.96%</span>
                <span class="f-lbl">Scope Gap (56.6% Big Tech vs. 63.6% Academia)</span>
              </div>
            </div>
          </div>

          {/* Affiliation Section Toolbar */}
          <div class="format-toolbar aff-full-toolbar">
            <div class="format-controls-row">
              {/* Presets & Direction Filters */}
              <div class="format-view-toggle">
                <button
                  type="button"
                  class={`f-toggle-btn ${affFilter === "all" ? "f-btn-active" : ""}`}
                  onClick={() => setAffFilter("all")}
                >
                  All 40 Codes
                </button>
                <button
                  type="button"
                  class={`f-toggle-btn ${affFilter === "top5" ? "f-btn-active" : ""}`}
                  onClick={() => setAffFilter("top5")}
                >
                  Top 5 Gaps (Fig. 5)
                </button>
                <button
                  type="button"
                  class={`f-toggle-btn ${affFilter === "significant" ? "f-btn-active" : ""}`}
                  onClick={() => setAffFilter("significant")}
                >
                  ★ Significant (1)
                </button>
                <button
                  type="button"
                  class={`f-toggle-btn ${affFilter === "higher-in-bigtech" ? "f-btn-active" : ""}`}
                  onClick={() => setAffFilter("higher-in-bigtech")}
                >
                  Higher in Big Tech
                </button>
                <button
                  type="button"
                  class={`f-toggle-btn ${affFilter === "higher-in-academia" ? "f-btn-active" : ""}`}
                  onClick={() => setAffFilter("higher-in-academia")}
                >
                  Higher in Academia
                </button>
              </div>

              {/* Sort selector */}
              <div class="format-sort-wrap">
                <label class="toolbar-label" for="aff-sort-select">Sort by:</label>
                <select
                  id="aff-sort-select"
                  class="toolbar-select"
                  value={affSort}
                  onChange={(e) => setAffSort((e.target as HTMLSelectElement).value as any)}
                >
                  <option value="adjp">Significance (Adj. p asc)</option>
                  <option value="gap">Largest Gap (|Δ pp| desc)</option>
                  <option value="bigtech">Highest in Big Tech (Δ pp desc)</option>
                  <option value="academia">Highest in Academia (Δ pp asc)</option>
                  <option value="prevalence">Prevalence (Non-Large % desc)</option>
                  <option value="name">Alphabetical (A–Z)</option>
                </select>
              </div>

              {/* Search input */}
              <div class="format-search-wrap">
                <input
                  type="text"
                  class="toolbar-search"
                  placeholder="Search 40 codes..."
                  value={affSearch}
                  onInput={(e) => setAffSearch((e.target as HTMLInputElement).value)}
                />
                {affSearch && (
                  <button
                    type="button"
                    class="search-clear-btn"
                    onClick={() => setAffSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* View mode toggle */}
              <div class="aff-mode-toggle" role="group" aria-label="Affiliation View Mode">
                <button
                  type="button"
                  class={`aff-toggle-btn ${affViewMode === "bars" ? "aff-btn-active" : ""}`}
                  onClick={() => setAffViewMode("bars")}
                >
                  📊 Bars
                </button>
                <button
                  type="button"
                  class={`aff-toggle-btn ${affViewMode === "table" ? "aff-btn-active" : ""}`}
                  onClick={() => setAffViewMode("table")}
                >
                  📑 Table 10
                </button>
              </div>
            </div>
          </div>

          {/* Affiliation Legend (when in Bars mode) */}
          {affViewMode === "bars" && (
            <div class="aff-legend-container">
              <div class="aff-legend">
                <span class="aff-legend-item">
                  <span class="legend-color-dot dot-large"></span>
                  <span><strong>Large Company only</strong> (Forbes 2000 tech)</span>
                </span>
                <span class="aff-legend-item">
                  <span class="legend-color-dot dot-mixed"></span>
                  <span><strong>Mixed Affiliation</strong> (Industry + Academia)</span>
                </span>
                <span class="aff-legend-item">
                  <span class="legend-color-dot dot-nonlarge"></span>
                  <span><strong>Non-Large Company</strong> (Universities &amp; Non-profits)</span>
                </span>
                <span class="aff-legend-item legend-ci-note">
                  <span class="legend-whisker-icon">⟂—⟂</span>
                  <span>Whiskers denote 95% Confidence Intervals</span>
                </span>
              </div>
            </div>
          )}

          {/* Content Area */}
          {displayedAffiliationRows.length === 0 ? (
            <div class="format-empty-state">
              <p>No limitation codes match your filter criteria.</p>
              <button
                type="button"
                class="filter-reset-btn"
                onClick={() => {
                  setAffFilter("all");
                  setAffSearch("");
                }}
              >
                Reset all filters
              </button>
            </div>
          ) : affViewMode === "bars" ? (
            /* Bars View */
            <div class="affiliation-chart-container">
              {displayedAffiliationRows.map((row) => {
                const maxVal = 70; // 70% scale
                return (
                  <div key={row.code} class={`aff-group-row ${row.significant ? "aff-row-significant" : ""}`}>
                    <div class="aff-row-header">
                      <div class="aff-row-title-wrap">
                        <a
                          href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(row.code)}`}
                          class="aff-code-name"
                        >
                          {row.code}
                        </a>
                      </div>
                      <div class="aff-row-badges">
                        {row.significant && (
                          <span class="sig-badge" title="Statistically significant after Benjamini-Hochberg FDR correction">
                            ★ Statistically Significant (adj. p = {row.adjP != null ? (row.adjP < 0.001 ? "< 0.001" : row.adjP.toFixed(3)) : "N/A"})
                          </span>
                        )}
                        <span class={`delta-badge ${row.diff > 0 ? "delta-bigtech" : "delta-academia"}`}>
                          {row.diff > 0
                            ? `+${row.diff.toFixed(1)}% Big Tech`
                            : `+${Math.abs(row.diff).toFixed(1)}% Academia`}
                        </span>
                        {row.oddsRatio !== undefined && (
                          <span class="stat-pill-subtle" title="Odds Ratio (Large vs. Non-Large)">
                            OR {row.oddsRatio.toFixed(3)}
                          </span>
                        )}
                        <span class="stat-pill-subtle" title="Benjamini-Hochberg Adjusted p-value">
                          adj. p = {row.adjP != null ? (row.adjP < 0.001 ? "< 0.001" : row.adjP.toFixed(3)) : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar Stack with Error Whiskers */}
                    <div class="aff-bars-stack">
                      {/* Large Company Bar */}
                      <div class="bar-line">
                        <span class="bar-label">Large Tech:</span>
                        <div class="bar-track">
                          <div
                            class="bar-fill fill-large"
                            style={{ width: `${(row.largePct / maxVal) * 100}%` }}
                          ></div>
                          {/* Error Bar Whisker */}
                          <div
                            class="error-bar"
                            style={{
                              left: `${(row.largeCi[0] / maxVal) * 100}%`,
                              width: `${((row.largeCi[1] - row.largeCi[0]) / maxVal) * 100}%`,
                            }}
                            title={`Large 95% CI: [${row.largeCi[0]}%, ${row.largeCi[1]}%]`}
                          ></div>
                        </div>
                        <span class="bar-value val-large">{row.largePct.toFixed(1)}%</span>
                      </div>

                      {/* Mixed Bar (when available) */}
                      {row.mixedPct !== undefined && (
                        <div class="bar-line">
                          <span class="bar-label">Mixed:</span>
                          <div class="bar-track">
                            <div
                              class="bar-fill fill-mixed"
                              style={{ width: `${(row.mixedPct / maxVal) * 100}%` }}
                            ></div>
                          </div>
                          <span class="bar-value val-mixed">{row.mixedPct.toFixed(1)}%</span>
                        </div>
                      )}

                      {/* Non-Large Company Bar */}
                      <div class="bar-line">
                        <span class="bar-label">Academia:</span>
                        <div class="bar-track">
                          <div
                            class="bar-fill fill-nonlarge"
                            style={{ width: `${(row.nonLargePct / maxVal) * 100}%` }}
                          ></div>
                          {/* Error Bar Whisker */}
                          <div
                            class="error-bar error-bar-nonlarge"
                            style={{
                              left: `${(row.nonLargeCi[0] / maxVal) * 100}%`,
                              width: `${((row.nonLargeCi[1] - row.nonLargeCi[0]) / maxVal) * 100}%`,
                            }}
                            title={`Academia 95% CI: [${row.nonLargeCi[0]}%, ${row.nonLargeCi[1]}%]`}
                          ></div>
                        </div>
                        <span class="bar-value val-nonlarge">{row.nonLargePct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table 10 View */
            <div class="aff-table-wrap">
              <table class="aff-table">
                <thead>
                  <tr>
                    <th>Limitation Code</th>
                    <th class="th-num">Large Company % [95% CI]</th>
                    <th class="th-num">Non-Large Company % [95% CI]</th>
                    <th class="th-num">Δ pp</th>
                    <th class="th-num">Odds Ratio (OR)</th>
                    <th class="th-num">Adj. p (BH)</th>
                    <th class="th-center">Significance</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAffiliationRows.map((row) => (
                    <tr key={row.code} class={row.significant ? "tr-significant" : ""}>
                      <td class="td-code">
                        <a
                          href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(row.code)}`}
                          class="aff-table-code-link"
                        >
                          {row.code}
                        </a>
                      </td>
                      <td class="td-num">
                        <strong>{row.largePct.toFixed(1)}%</strong>
                        <span class="ci-span">[{row.largeCi[0]}, {row.largeCi[1]}]</span>
                      </td>
                      <td class="td-num">
                        <strong>{row.nonLargePct.toFixed(1)}%</strong>
                        <span class="ci-span">[{row.nonLargeCi[0]}, {row.nonLargeCi[1]}]</span>
                      </td>
                      <td class={`td-num td-delta ${row.diff > 0 ? "delta-pos" : "delta-neg"}`}>
                        {row.diff > 0 ? `+${row.diff.toFixed(2)}` : row.diff.toFixed(2)}
                      </td>
                      <td class="td-num font-mono">
                        {row.oddsRatio !== undefined ? row.oddsRatio.toFixed(3) : "—"}
                      </td>
                      <td class="td-num font-mono">
                        {row.adjP != null ? (row.adjP < 0.001 ? "< 0.001" : row.adjP.toFixed(3)) : "—"}
                      </td>
                      <td class="td-center">
                        {row.significant ? (
                          <span class="sig-badge">★ Significant</span>
                        ) : (
                          <span class="nonsig-badge">p &gt; 0.05</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Affiliation Qualitative Synthesis Cards */}
          <div class="aff-synthesis-grid">
            <div class="synthesis-card">
              <h4 class="synthesis-title">🏛️ Academia: Elevated Scope Bounding &amp; Data Scarcity</h4>
              <p class="synthesis-text">
                Non-large company (academic) papers disclose a <strong>significantly higher rate of Scope Limitation</strong> (63.6% vs 56.6%, diff = -6.96%, FDR adj. p = 0.019) and higher <em>Data Scarcity</em> (13.4% vs 9.8%). Academic researchers frequently face resource ceilings that mandate tighter domain bounding and cautious claims to withstand reviewer scrutiny.
              </p>
            </div>
            <div class="synthesis-card">
              <h4 class="synthesis-title">🏢 Big Tech: High Time Consumption &amp; Model Failures</h4>
              <p class="synthesis-text">
                Conversely, large commercial labs report higher raw rates of <em>High Time Consumption</em> (11.9% vs 8.8%) and <em>Empirical Underperformance</em> (9.0% vs 6.9%). Despite near-limitless GPU clusters, Big Tech workflows involve extreme scale and long training runs where wall-clock iteration latency becomes the primary development bottleneck.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PUBLICATION FORMAT DYNAMICS (FULL TABLE 9: ALL 39 EVALUATED CODES) */}
      {/* ========================================================================= */}
      {activeTab === "format" && (
        <div class="dim-tab-panel panel-format-full">
          {/* Hero Finding Card: Short Papers & Negative Results */}
          <div class="format-hero-card">
            <div class="format-hero-badge">Key Statistical Finding · Table 9</div>
            <h3 class="format-hero-title">
              Short Papers Admit Negative Results at 1.6&times; the Rate of Long Papers
            </h3>
            <p class="format-hero-desc">
              When dissecting disclosures across publication formats (Long Papers, Short Papers, and Findings), a sharp divergence emerges: 
              <strong> Empirical Underperformance</strong> is reported in <strong>12.2% of Short Papers</strong> compared to only <strong>7.5% of Long Papers</strong> and <strong>7.5% of Findings</strong> (&chi;&sup2; = 9.98, p = 0.007).
            </p>
            <div class="format-hero-metrics">
              <div class="f-metric">
                <span class="f-num">12.2%</span>
                <span class="f-lbl">Short Papers (4-5 pages)</span>
              </div>
              <div class="f-divider">vs</div>
              <div class="f-metric">
                <span class="f-num">7.5%</span>
                <span class="f-lbl">Long Papers (8+ pages)</span>
              </div>
              <div class="f-divider">vs</div>
              <div class="f-metric">
                <span class="f-num">7.5%</span>
                <span class="f-lbl">Findings of ACL</span>
              </div>
            </div>
          </div>

          {/* Format Table Toolbar */}
          <div class="format-toolbar">
            <div class="format-heading-block">
              <h4 class="format-table-heading">
                Format Comparison Across Limitation Codes (Table 9)
              </h4>
              <span class="format-count-badge">
                Showing {displayedFormatRows.length} of {PAPER_FORMAT_DATA.length} Codes
              </span>
            </div>

            <div class="format-controls-row">
              {/* Filter: All vs Divergent */}
              <div class="format-view-toggle">
                <button
                  type="button"
                  class={`f-toggle-btn ${formatFilter === "all" ? "f-btn-active" : ""}`}
                  onClick={() => setFormatFilter("all")}
                >
                  All 39 Codes
                </button>
                <button
                  type="button"
                  class={`f-toggle-btn ${formatFilter === "divergent" ? "f-btn-active" : ""}`}
                  onClick={() => setFormatFilter("divergent")}
                >
                  Significant Divergence (p &lt; 0.05)
                </button>
              </div>

              {/* Sort selector */}
              <div class="format-sort-wrap">
                <label class="toolbar-label" for="format-sort-select">Sort by:</label>
                <select
                  id="format-sort-select"
                  class="toolbar-select"
                  value={formatSort}
                  onChange={(e) => setFormatSort((e.target as HTMLSelectElement).value as any)}
                >
                  <option value="divergence">Statistical Divergence (p-value)</option>
                  <option value="short">Highest in Short Papers</option>
                  <option value="long">Highest in Long Papers</option>
                  <option value="findings">Highest in Findings</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Search input */}
              <div class="format-search-wrap">
                <input
                  type="text"
                  class="toolbar-search"
                  placeholder="Search 39 codes..."
                  value={formatSearch}
                  onInput={(e) => setFormatSearch((e.target as HTMLInputElement).value)}
                />
                {formatSearch && (
                  <button
                    type="button"
                    class="search-clear-btn"
                    onClick={() => setFormatSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Format Comparison Table / Bar List */}
          <div class="format-bars-container">
            {displayedFormatRows.map((row) => {
              const maxVal = 70; // 70% scale
              const isSignificant = row.pValue < 0.05;

              return (
                <div key={row.code} class={`format-row-card ${isSignificant ? "row-highlighted" : ""}`}>
                  <div class="format-row-top">
                    <div class="format-code-wrap">
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(row.code)}`}
                        class="format-code-link"
                      >
                        {row.code}
                      </a>
                      {isSignificant && (
                        <span class="format-spike-badge">
                          ★ Format Divergence (p = {row.pValue < 0.001 ? "< 0.001" : row.pValue.toFixed(3)})
                        </span>
                      )}
                    </div>
                    <div class="format-stat-meta">
                      <span>&chi;&sup2; = {row.chi2.toFixed(2)}</span>
                      <span>·</span>
                      <span>p = {row.pValue < 0.001 ? "< 0.001" : row.pValue.toFixed(3)}</span>
                      {row.cramersV !== undefined && (
                        <>
                          <span>·</span>
                          <span>V = {row.cramersV.toFixed(3)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div class="format-tri-bars">
                    {/* Short Paper Bar */}
                    <div class="ftri-line">
                      <span class="ftri-label">Short:</span>
                      <div class="ftri-track">
                        <div
                          class="ftri-fill fill-short"
                          style={{ width: `${Math.min(100, (row.shortPct / maxVal) * 100)}%` }}
                        ></div>
                      </div>
                      <span class="ftri-val val-short">{row.shortPct.toFixed(1)}%</span>
                    </div>

                    {/* Long Paper Bar */}
                    <div class="ftri-line">
                      <span class="ftri-label">Long:</span>
                      <div class="ftri-track">
                        <div
                          class="ftri-fill fill-long"
                          style={{ width: `${Math.min(100, (row.longPct / maxVal) * 100)}%` }}
                        ></div>
                      </div>
                      <span class="ftri-val val-long">{row.longPct.toFixed(1)}%</span>
                    </div>

                    {/* Findings Bar */}
                    <div class="ftri-line">
                      <span class="ftri-label">Findings:</span>
                      <div class="ftri-track">
                        <div
                          class="ftri-fill fill-findings"
                          style={{ width: `${Math.min(100, (row.findingsPct / maxVal) * 100)}%` }}
                        ></div>
                      </div>
                      <span class="ftri-val val-findings">{row.findingsPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayedFormatRows.length === 0 && (
              <div class="format-empty-state">
                <p>No codes match "{formatSearch}".</p>
                <button
                  type="button"
                  class="btn-reset"
                  onClick={() => {
                    setFormatSearch("");
                    setFormatFilter("all");
                  }}
                >
                  Reset filter
                </button>
              </div>
            )}
          </div>

          {/* Qualitative Takeaway */}
          <div class="format-takeaway-banner">
            <span class="format-info-icon">💡</span>
            <p>
              <strong>Scientific Rationale for Short Paper Candor:</strong> Short papers are designed for compact, focused contributions or targeted probing studies. Because the publication bar for short papers often accommodates preliminary or exploratory findings, authors are more willing to report outright <em>Empirical Underperformance</em> without fearing that admitting negative results will result in immediate rejection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
