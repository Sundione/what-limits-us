import { useState, useMemo } from "preact/hooks";
import { PER_CODE_AGREEMENT_DATA } from "../../data/methodologyData";

type FilterType = "all" | "limitation" | "non-limitation";
type SortField = "support" | "annotatorAlpha" | "modelAlpha" | "code";

/** Paper App. A: at low support a few disagreements shift alpha substantially. */
const LOW_SUPPORT = 10;

function AlphaCell({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span class="num-cell null-cell" title="Too few instances for alpha to be defined">
        —
      </span>
    );
  }
  return (
    <div class="score-bar-cell">
      <div class="bar-track">
        <div class="bar-fill bar-alpha" style={{ width: `${Math.min(100, Math.max(0, Math.round(value * 100)))}%` }}></div>
      </div>
      <span class="score-val">{value.toFixed(3)}</span>
    </div>
  );
}
type SortDirection = "asc" | "desc";

export default function EvaluationSection() {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Default order matches the paper's Table 7 (by Model vs. Adjudicated alpha).
  const [sortField, setSortField] = useState<SortField>("modelAlpha");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(false);

  const filteredAndSortedData = useMemo(() => {
    let list = PER_CODE_AGREEMENT_DATA.filter((item) => {
      // Type filter
      if (filterType === "limitation" && item.type !== "Limitation") return false;
      if (filterType === "non-limitation" && item.type !== "Non-Limitation") return false;
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return item.code.toLowerCase().includes(query);
      }
      return true;
    });

    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Handle nulls in sorting
      if (valA === null || valA === undefined) valA = sortDirection === "desc" ? -999 : 999;
      if (valB === null || valB === undefined) valB = sortDirection === "desc" ? -999 : 999;

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return list;
  }, [filterType, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "code" ? "asc" : "desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div class="evaluation-section-container">
      {/* Overview Lead & Context */}
      <div class="eval-context-banner">
        <div class="eval-context-text">
          <h3 class="eval-title">The 150-Paper Human Reference Standard</h3>
          <p>
            To evaluate whether automated qualitative coding is rigorous and reliable, the LLM pipeline was benchmarked against a dedicated <strong>150-paper reference standard</strong> independently coded by <strong>4 expert NLP researchers</strong> across 606 qualitative labels. Papers were double- or triple-coded, with all discrepancies resolved through deliberative consensus meetings.
          </p>
        </div>
      </div>

      {/* Headline KPI Cards */}
      <div class="iaa-kpi-grid">
        <div class="iaa-card highlight-card">
          <div class="iaa-badge-row">
            <span class="iaa-tag tag-human">Human Baseline</span>
            <span class="iaa-formula">Krippendorff's α</span>
          </div>
          <div class="iaa-val-display">
            <span class="iaa-num">0.644</span>
          </div>
          <p class="iaa-card-sub">
            Agreement among the human annotators on deductive code assignments, measured before their consensus discussion.
          </p>
        </div>

        <div class="iaa-card highlight-card primary-accent">
          <div class="iaa-badge-row">
            <span class="iaa-tag tag-model">+ LLM as 5th Coder</span>
            <span class="iaa-formula">Krippendorff's α</span>
          </div>
          <div class="iaa-val-display">
            <span class="iaa-num">0.647</span>
            <span class="iaa-delta-pill">+0.003 Δ</span>
          </div>
          <p class="iaa-card-sub">
            Reliability does not degrade when the model is introduced as a coder. The LLM behaves well within the bounds of human variation.
          </p>
        </div>

        <div class="iaa-card">
          <div class="iaa-badge-row">
            <span class="iaa-tag tag-macro">Best Prompt Setting</span>
            <span class="iaa-formula">Definitions + Few-Shot Examples</span>
          </div>
          <div class="iaa-val-display">
            <span class="iaa-num">0.801</span>
            <span class="iaa-f1-label">F1</span>
          </div>
          <p class="iaa-card-sub">
            How closely the LLM's codes match the human consensus when its prompt includes both code definitions and coded examples (paper Table 2). Precision <strong>0.827</strong>, recall <strong>0.811</strong>.
          </p>
        </div>
      </div>

      {/* Qualitative Agreement Insights (Reader-Friendly Takeaways) */}
      <div class="eval-insights-wrapper">
        <div class="eval-insights-header">
          <div class="insights-title-row">
            <span class="section-kpi-badge">Agreement Spectrum</span>
            <span class="section-corpus-pill">Qualitative Analysis</span>
          </div>
          <h4 class="insights-heading">Where Do Models and Humans Agree?</h4>
          <p class="insights-desc">
            Agreement is not uniform across codes. Two numbers per code, from the paper's Table 7: how much the human annotators agreed with each other before consensus, and how much the LLM agreed with the final consensus labels. They use different references, so read them side by side rather than as a direct comparison.
          </p>
        </div>

        <div class="eval-insights-grid">
          {/* Card 1: High Agreement */}
          <div class="insight-card card-high-agreement">
            <div class="insight-badge-row">
              <span class="insight-badge badge-green">High Agreement</span>
              <span class="insight-metric-label">Both &alpha; &ge; 0.80</span>
            </div>
            <h5 class="insight-card-title">Concrete &amp; Explicit Constraints</h5>
            <p class="insight-card-desc">
              Codes with explicit wording (future plans, compute or hardware needs) are easy for humans and the LLM alike:
            </p>
            <div class="insight-code-samples">
              <div class="insight-code-item">
                <span class="code-item-name">Non-Limitation: Future Work</span>
                <span class="code-item-stats">humans <strong>0.822</strong> · LLM <strong>0.868</strong> · n=112</span>
              </div>
              <div class="insight-code-item">
                <span class="code-item-name">High Resource Requirements</span>
                <span class="code-item-stats">humans <strong>0.817</strong> · LLM <strong>0.922</strong> · n=24</span>
              </div>
            </div>
            <div class="insight-takeaway-footer">
              <span class="footer-icon">✓</span>
              <span><strong>Key Takeaway:</strong> Explicit, factual statements leave little room for interpretation. Codes seen in only a few papers (small n) can swing sharply, so read those with caution.</span>
            </div>
          </div>

          {/* Card 2: Interpretive Divergence */}
          <div class="insight-card card-divergence">
            <div class="insight-badge-row">
              <span class="insight-badge badge-amber">Hard Even for Humans</span>
              <span class="insight-metric-label">Humans &alpha; &lt; 0.50</span>
            </div>
            <h5 class="insight-card-title">Subjective &amp; Methodological Boundaries</h5>
            <p class="insight-card-desc">
              Here the human annotators themselves agree less with each other, which suggests the category boundaries are genuinely contested rather than a model-specific failure:
            </p>
            <div class="insight-code-samples">
              <div class="insight-code-item">
                <span class="code-item-name">Subjectivity in Evaluation/Annotation</span>
                <span class="code-item-stats">humans <strong>0.247</strong> · LLM 0.832 · n=11</span>
              </div>
              <div class="insight-code-item">
                <span class="code-item-name">Methodological Constraints</span>
                <span class="code-item-stats">humans <strong>0.341</strong> · LLM 0.494 · n=81</span>
              </div>
              <div class="insight-code-item">
                <span class="code-item-name">Low Data Quality</span>
                <span class="code-item-stats">humans <strong>0.407</strong> · LLM 0.439 · n=10</span>
              </div>
            </div>
            <div class="insight-takeaway-footer footer-amber">
              <span class="footer-icon">ℹ</span>
              <span><strong>Key Takeaway:</strong> Where the annotators themselves disagreed before consensus, the code's boundary is hard to pin down. The LLM can still match the final consensus on some of these codes (e.g. Subjectivity), but the two α values use different references and are not directly comparable.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Technical Table Toggle Button */}
      <div class="table-accordion-bar">
        <button
          class="table-accordion-toggle-btn"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          aria-expanded={isTableExpanded}
        >
          <div class="toggle-btn-left">
            <span class="toggle-icon">📊</span>
            <div class="toggle-text-wrap">
              <span class="toggle-title">
                {isTableExpanded ? "Hide the 25-code agreement table" : "Inspect the full 25-code agreement table (paper Table 7)"}
              </span>
              <span class="toggle-sub">
                Click to {isTableExpanded ? "collapse" : "view"} support and Krippendorff's &alpha; per code: among annotators and LLM vs. adjudicated labels
              </span>
            </div>
          </div>
          <span class="toggle-chevron">{isTableExpanded ? "▲ Collapse" : "▼ Expand Table"}</span>
        </button>
      </div>

      {/* Interactive Per-Code Agreement Table (Rendered when expanded) */}
      {isTableExpanded && (
        <div class="per-code-table-wrapper" id="per-code-table">
        <div class="table-control-bar">
          <div class="table-title-group">
            <h4 class="table-heading">Per-Code Agreement Breakdown</h4>
            <span class="table-sub-count">
              Showing {filteredAndSortedData.length} of {PER_CODE_AGREEMENT_DATA.length} Evaluated Codes
            </span>
          </div>

          <div class="table-actions">
            {/* Filter Pills */}
            <div class="filter-pill-group">
              <button
                class={`filter-pill ${filterType === "all" ? "active" : ""}`}
                onClick={() => setFilterType("all")}
              >
                All (25)
              </button>
              <button
                class={`filter-pill ${filterType === "limitation" ? "active" : ""}`}
                onClick={() => setFilterType("limitation")}
              >
                Limitations (18)
              </button>
              <button
                class={`filter-pill ${filterType === "non-limitation" ? "active" : ""}`}
                onClick={() => setFilterType("non-limitation")}
              >
                Non-Limitations (7)
              </button>
            </div>

            {/* Search Input */}
            <div class="table-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search code name..."
                value={searchQuery}
                onInput={(e: any) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button class="clear-search-btn" onClick={() => setSearchQuery("")}>
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Markup */}
        <div class="table-responsive-container">
          <table class="per-code-table">
            <thead>
              <tr>
                <th class="col-code sortable" onClick={() => handleSort("code")}>
                  <span>Code Name</span>
                  <span class="sort-indicator">{getSortIcon("code")}</span>
                </th>
                <th class="col-type">Type</th>
                <th class="col-support sortable" onClick={() => handleSort("support")}>
                  <span>Support (n)</span>
                  <span class="sort-indicator">{getSortIcon("support")}</span>
                </th>
                <th class="col-alpha sortable" onClick={() => handleSort("annotatorAlpha")}>
                  <span>Among annotators (α)</span>
                  <span class="sort-indicator">{getSortIcon("annotatorAlpha")}</span>
                </th>
                <th class="col-alpha sortable" onClick={() => handleSort("modelAlpha")}>
                  <span>LLM vs. adjudicated (α)</span>
                  <span class="sort-indicator">{getSortIcon("modelAlpha")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((row) => {
                const isLowSupport = row.support < LOW_SUPPORT;

                return (
                  <tr key={row.code} class={isLowSupport ? "row-low-support" : ""}>
                    <td class="col-code">
                      <div class="code-cell-wrapper">
                        <span class="code-name-text">{row.code}</span>
                        {isLowSupport && (
                          <span class="low-support-badge" title="Low support: interpret alpha with caution">
                            low support
                          </span>
                        )}
                      </div>
                    </td>

                    <td class="col-type">
                      <span class={`type-tag ${row.type === "Limitation" ? "tag-lim" : "tag-nonlim"}`}>
                        {row.type}
                      </span>
                    </td>

                    <td class="col-support">
                      <span class="support-num">{row.support}</span>
                    </td>

                    <td class="col-alpha">
                      <AlphaCell value={row.annotatorAlpha} />
                    </td>

                    <td class="col-alpha">
                      <AlphaCell value={row.modelAlpha} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Statistical Correlation Footnote */}
        <div class="table-footnote-bar">
          <div class="footnote-left">
            <span class="footnote-dot">ℹ</span>
            <span>
              Support counts papers in which the LLM, the adjudicated labels, or both assign the code. At such low support, a few disagreements shift α substantially, so values for rare codes (e.g. the 1.000 for Model Hallucination/Incoherence) should be read with caution. "—" means too few instances for α to be defined.
            </span>
          </div>
          <div class="footnote-right">
            <span>Benchmarks (Krippendorff 2004): α ≥ 0.800 indicates strong agreement; 0.667 ≤ α &lt; 0.800 allows tentative conclusions.</span>
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
