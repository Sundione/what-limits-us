import { useState } from "preact/hooks";
import { DISCURSIVE_PATTERNS } from "../../data/resultsData";

type DiscursiveTab = "transitions" | "pairings" | "annotated";
type TransitionDir = "after" | "before";

export default function DiscursiveSandwich() {
  const [activeTab, setActiveTab] = useState<DiscursiveTab>("transitions");
  const [transitionDir, setTransitionDir] = useState<TransitionDir>("after");
  const [activePairingType, setActivePairingType] = useState<"performance" | "mitigation">("performance");

  const transitionsData =
    transitionDir === "after"
      ? DISCURSIVE_PATTERNS.transitionsAfter
      : DISCURSIVE_PATTERNS.transitionsBefore;

  return (
    <div class="discursive-section" id="discursive-rq3">
      {/* Section Lead Header */}
      <div class="section-lead-header">
        <div class="section-tag-row">
          <span class="section-kpi-badge">RQ3 · Discursive Patterns</span>
          <span class="section-corpus-pill">Within-Paper Permutation Null (N = 1,000)</span>
        </div>
        <h2 class="results-subheading">Discursive Transitions &amp; Contextual Sequencing</h2>
        <p class="section-desc">
          How do authors sequence limitation discussions within paper texts? Testing sentence-level transitions against 
          a within-paper permutation null distribution (1,000 randomized permutations per paper) reveals systematic, 
          non-random discursive structures: authors frequently establish strong benchmark performance before acknowledging 
          weaknesses, and transition immediately into proactive mitigations or future work projections.
        </p>
      </div>

      {/* Plain-Language Intuitive Takeaways for First-Time Readers */}
      <div class="rq-intuitive-lead-box">
        <div class="lead-box-header">
          <span class="lead-box-icon">🥪</span>
          <div class="lead-box-title-wrap">
            <h4 class="lead-box-title">The "Discursive Sandwich" · Rhetorical Framing in Practice</h4>
            <p class="lead-box-sub">How do NLP researchers sequence their limitation statements? Why are technical shortcomings almost never acknowledged in isolation?</p>
          </div>
        </div>
        <div class="lead-sandwich-visual">
          <div class="sandwich-slice slice-top">
            <div class="slice-badge">1. Top Bread (Preceding Boundary)</div>
            <strong class="slice-title">Strong Reported Performance Premise</strong>
            <p class="slice-desc">
              Before admitting any technical shortfall, authors first establish an empirical high ground—e.g., <em>"While our model achieves SOTA on Benchmark X..."</em> (preceding underperformance at 2.56&times; null expectation).
            </p>
          </div>
          <div class="sandwich-slice slice-middle">
            <div class="slice-badge">2. Sandwich Filling (Core Admission)</div>
            <strong class="slice-title">Core Technical Limitation</strong>
            <p class="slice-desc">
              Conceding the actual constraint: resource footprints, compute bounds, model scale, or dataset biases (Empirical Underperformance, Leakage, Incompleteness).
            </p>
          </div>
          <div class="sandwich-slice slice-bottom">
            <div class="slice-badge">3. Bottom Bread (Following Buffer)</div>
            <strong class="slice-title">Immediate Mitigation or Future Work Buffer</strong>
            <p class="slice-desc">
              Authors rarely leave a limitation unbuffered. Weaknesses are immediately softened by <strong>Conducted Mitigation (24.1% of sentences)</strong> or deferred into <strong>Future Work (40.2% observed vs 32.8% null, z = +30.05)</strong>.
            </p>
          </div>
        </div>
        <div class="implicit-note-banner">
          <span class="implicit-icon">🔎</span>
          <p>
            <strong>Notable Finding (Implicit Limitations):</strong> Exactly <strong>90 papers (1.4% in 2025)</strong> feature a mandatory Limitations section that contains <strong>zero actual limitation statements</strong>. Instead, these sections consist entirely of future work proposals or methodological clarifications to satisfy compliance checklists without disclosing vulnerabilities.
          </p>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div class="discursive-kpi-row">
        <div class="d-kpi-card">
          <span class="d-kpi-num">+7.4%</span>
          <span class="d-kpi-lbl">Future Work Transition</span>
          <span class="d-kpi-sub">40.2% observed vs 32.8% null as limitation successor (z = +30.05, q &lt; 0.001)</span>
        </div>
        <div class="d-kpi-card">
          <span class="d-kpi-num">2.56&times;</span>
          <span class="d-kpi-lbl">Performance Premise</span>
          <span class="d-kpi-sub">Empirical Underperformance is preceded by Strong Performance at 2.56&times; null (q &lt; 0.001)</span>
        </div>
        <div class="d-kpi-card">
          <span class="d-kpi-num">24.1%</span>
          <span class="d-kpi-lbl">Immediate Mitigation</span>
          <span class="d-kpi-sub">Critical risks (Data Leakage, Reproducibility) immediately trigger Conducted Mitigation</span>
        </div>
        <div class="d-kpi-card">
          <span class="d-kpi-num">1.4%</span>
          <span class="d-kpi-lbl">Implicit Only (2025)</span>
          <span class="d-kpi-sub">90 papers discuss limitations solely through non-limitation codes (e.g. future work)</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div class="discursive-nav-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "transitions"}
          class={`d-nav-btn ${activeTab === "transitions" ? "d-nav-active" : ""}`}
          onClick={() => setActiveTab("transitions")}
        >
          <span class="d-nav-icon">📊</span>
          <span class="d-nav-text">
            <strong>Discursive Transitions</strong>
            <small>Table 4 · Successors &amp; Predecessors</small>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "pairings"}
          class={`d-nav-btn ${activeTab === "pairings" ? "d-nav-active" : ""}`}
          onClick={() => setActiveTab("pairings")}
        >
          <span class="d-nav-icon">🔗</span>
          <span class="d-nav-text">
            <strong>Contextual Pairings</strong>
            <small>Tables 7 &amp; 8 · Performance &amp; Mitigations</small>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "annotated"}
          class={`d-nav-btn ${activeTab === "annotated" ? "d-nav-active" : ""}`}
          onClick={() => setActiveTab("annotated")}
        >
          <span class="d-nav-icon">📝</span>
          <span class="d-nav-text">
            <strong>Contextual Flow in Practice</strong>
            <small>Annotated Paper Example &amp; Implicit Limits</small>
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DISCURSIVE TRANSITIONS (TABLE 4) */}
      {/* ========================================================================= */}
      {activeTab === "transitions" && (
        <div class="d-tab-panel">
          {/* Direction Switcher */}
          <div class="transition-toggle-toolbar">
            <div class="transition-dir-toggle">
              <button
                type="button"
                class={`t-toggle-btn ${transitionDir === "after" ? "t-btn-active" : ""}`}
                onClick={() => setTransitionDir("after")}
              >
                <span>Limitation &rarr; Non-Limitation (Successor)</span>
                <small>What follows after stating a limitation?</small>
              </button>
              <button
                type="button"
                class={`t-toggle-btn ${transitionDir === "before" ? "t-btn-active" : ""}`}
                onClick={() => setTransitionDir("before")}
              >
                <span>Non-Limitation &rarr; Limitation (Predecessor)</span>
                <small>What precedes before stating a limitation?</small>
              </button>
            </div>
            <div class="transition-method-badge">
              <span>Baseline: Within-Paper Permutation Null (1,000 runs)</span>
            </div>
          </div>

          {/* Transitions List */}
          <div class="transitions-data-list">
            {transitionsData.map((item) => {
              const diff = item.obsPct - item.nullMeanPct;
              const isEnriched = item.direction === "enriched";
              const maxScale = 45; // percentage ceiling for bar width

              return (
                <div
                  key={item.code}
                  class={`transition-row-card ${isEnriched ? "card-enriched" : "card-depleted"}`}
                >
                  <div class="t-row-left">
                    <div class="t-code-title">
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(item.code)}`}
                        class="t-code-link"
                        title={`Click to explore papers featuring ${item.code} in Explorer`}
                      >
                        {item.code}
                      </a>
                      <span class={`t-stat-pill ${isEnriched ? "pill-enriched" : "pill-depleted"}`}>
                        {isEnriched ? `+${diff.toFixed(1)}% Enriched` : `${diff.toFixed(1)}% Depleted`}
                        {" "}(z = {item.z > 0 ? `+${item.z.toFixed(1)}` : item.z.toFixed(1)})
                      </span>
                    </div>
                    <p class="t-role-text">{item.role}</p>

                    {/* Dual Comparative Horizontal Bars */}
                    <div class="t-bars-wrap">
                      {/* Observed Rate */}
                      <div class="t-bar-line">
                        <span class="t-bar-label">Observed:</span>
                        <div class="t-bar-track">
                          <div
                            class={`t-bar-fill ${isEnriched ? "fill-enriched" : "fill-depleted"}`}
                            style={{ width: `${Math.min(100, (item.obsPct / maxScale) * 100)}%` }}
                          ></div>
                        </div>
                        <span class="t-bar-val"><strong>{item.obsPct.toFixed(1)}%</strong></span>
                      </div>

                      {/* Null Distribution Baseline */}
                      <div class="t-bar-line">
                        <span class="t-bar-label">Null Mean:</span>
                        <div class="t-bar-track">
                          <div
                            class="t-bar-fill fill-null-mean"
                            style={{ width: `${Math.min(100, (item.nullMeanPct / maxScale) * 100)}%` }}
                          ></div>
                          {/* 95% Null CI Whisker */}
                          <div
                            class="null-ci-whisker"
                            style={{
                              left: `${(item.nullCi[0] / maxScale) * 100}%`,
                              width: `${((item.nullCi[1] - item.nullCi[0]) / maxScale) * 100}%`,
                            }}
                            title={`Null 95% CI: [${item.nullCi[0]}%, ${item.nullCi[1]}%]`}
                          ></div>
                        </div>
                        <span class="t-bar-val val-null">
                          {item.nullMeanPct.toFixed(1)}%
                          <small> [95% CI: {item.nullCi[0]}–{item.nullCi[1]}]</small>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="t-row-right">
                    <div class="t-p-value-badge">
                      <span class="p-label">FDR adj. p:</span>
                      <strong class="p-num">{item.adjP}</strong>
                    </div>
                    <a
                      href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(item.code)}`}
                      class="t-explore-mini-btn"
                      title={`Explore papers with ${item.code} in Explorer`}
                    >
                      Explore Papers ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div class="transitions-footer-note">
            <span class="info-icon">ℹ️</span>
            <p>
              In Table 4 of the paper, transitions were calculated from consecutive code annotations in the same paragraph. 
              The within-paper permutation null preserves each paper's code set and paragraph length while randomly shuffling 
              sentence order. Click any code or explore link to view papers and sentences exhibiting these patterns.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CONTEXTUAL PAIRINGS (TABLES 7 & 8) */}
      {/* ========================================================================= */}
      {activeTab === "pairings" && (
        <div class="d-tab-panel">
          <div class="pairings-subnav">
            <button
              type="button"
              class={`p-sub-btn ${activePairingType === "performance" ? "p-sub-active" : ""}`}
              onClick={() => setActivePairingType("performance")}
            >
              <span>1. Performance Framing (Table 8)</span>
              <small>Strong Reported Performance Preceding Limitations</small>
            </button>
            <button
              type="button"
              class={`p-sub-btn ${activePairingType === "mitigation" ? "p-sub-active" : ""}`}
              onClick={() => setActivePairingType("mitigation")}
            >
              <span>2. Proactive Mitigations (Table 7)</span>
              <small>Critical Risks Followed by Conducted Mitigation</small>
            </button>
          </div>

          {activePairingType === "performance" && (
            <div class="pairing-content-block">
              <div class="pairing-banner">
                <h4 class="pb-title">Table 8: Strong Reported Performance as Preceding Premise</h4>
                <p class="pb-desc">
                  When authors disclose specific empirical flaws, they frequently preface them with statements 
                  of superior benchmark performance. Below is the percentage of transitions into each limitation 
                  originating from <em>Strong Reported Performance</em> compared to the random null expectation:
                </p>
              </div>

              <div class="pairings-grid">
                {DISCURSIVE_PATTERNS.strongReportedPerformancePreceding.map((item) => (
                  <div key={item.targetCode} class="pairing-card">
                    <div class="p-card-top">
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(item.targetCode)}`}
                        class="p-card-link"
                        title={`Filter explorer by ${item.targetCode}`}
                      >
                        {item.targetCode}
                      </a>
                      <span class="p-card-factor">{item.factor.toFixed(2)}&times; over null</span>
                    </div>

                    <div class="p-card-bars">
                      <div class="p-bar-line">
                        <span class="p-bar-lbl">Observed:</span>
                        <div class="p-bar-track">
                          <div
                            class="p-bar-fill fill-obs-perf"
                            style={{ width: `${(item.obsRate / 26) * 100}%` }}
                          ></div>
                        </div>
                        <span class="p-bar-num"><strong>{item.obsRate.toFixed(1)}%</strong></span>
                      </div>
                      <div class="p-bar-line">
                        <span class="p-bar-lbl">Random Null:</span>
                        <div class="p-bar-track">
                          <div
                            class="p-bar-fill fill-null-perf"
                            style={{ width: `${(item.nullRate / 26) * 100}%` }}
                          ></div>
                        </div>
                        <span class="p-bar-num val-null">{item.nullRate.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div class="p-card-footer">
                      <span class="p-signif">adj. p {item.adjP}</span>
                      {item.targetCode === "Empirical Underperformance" && (
                        <span class="p-highlight-tag">Highest Enrichment in Corpus</span>
                      )}
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(item.targetCode)}`}
                        class="p-explore-action-btn"
                        title={`Explore papers with ${item.targetCode}`}
                      >
                        Explore Papers ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div class="pairing-insight-quote">
                <span class="quote-tag">Representative Contextual Transition:</span>
                <p class="quote-body">
                  <em>“While our model achieves state-of-the-art results on GLUE [<a href={`${import.meta.env.BASE_URL}explore?code=Strong%20Reported%20Performance`} class="quote-pattern-link">Strong Reported Performance ↗</a>], its accuracy drops substantially on out-of-domain dialect tests [<a href={`${import.meta.env.BASE_URL}explore?code=Empirical%20Underperformance`} class="quote-pattern-link">Empirical Underperformance ↗</a>].”</em>
                </p>
              </div>
            </div>
          )}

          {activePairingType === "mitigation" && (
            <div class="pairing-content-block">
              <div class="pairing-banner">
                <h4 class="pb-title">Table 7: Limitations Followed by Conducted Mitigation</h4>
                <p class="pb-desc">
                  When disclosing severe methodological or safety concerns (e.g. data contamination or evaluation subjectivity), 
                  authors rarely leave them open. Instead, they immediately follow the disclosure by reporting interventions 
                  already executed within the paper:
                </p>
              </div>

              <div class="pairings-grid">
                {DISCURSIVE_PATTERNS.conductedMitigationPairings.map((item) => (
                  <div key={item.code} class="pairing-card">
                    <div class="p-card-top">
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(item.code)}`}
                        class="p-card-link"
                        title={`Filter explorer by ${item.code}`}
                      >
                        {item.code}
                      </a>
                      <span class="p-card-z">z = +{item.z.toFixed(2)}</span>
                    </div>

                    <div class="p-card-bars">
                      <div class="p-bar-line">
                        <span class="p-bar-lbl">Observed:</span>
                        <div class="p-bar-track">
                          <div
                            class="p-bar-fill fill-obs-mitig"
                            style={{ width: `${(item.obsPct / 30) * 100}%` }}
                          ></div>
                        </div>
                        <span class="p-bar-num"><strong>{item.obsPct.toFixed(1)}%</strong></span>
                      </div>
                      <div class="p-bar-line">
                        <span class="p-bar-lbl">Null Mean:</span>
                        <div class="p-bar-track">
                          <div
                            class="p-bar-fill fill-null-mitig"
                            style={{ width: `${(item.nullMeanPct / 30) * 100}%` }}
                          ></div>
                        </div>
                        <span class="p-bar-num val-null">{item.nullMeanPct.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div class="p-card-footer">
                      <span class="p-signif">FDR adj. p = {item.adjP}</span>
                      <a
                        href={`${import.meta.env.BASE_URL}explore?code=${encodeURIComponent(item.code)}`}
                        class="p-explore-action-btn"
                        title={`Explore papers with ${item.code}`}
                      >
                        Explore Papers ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div class="pairing-insight-quote">
                <span class="quote-tag">Representative Mitigation Pairing:</span>
                <p class="quote-body">
                  <em>“Due to potential pre-training data contamination [<a href={`${import.meta.env.BASE_URL}explore?code=Data%20Leakage%2FContamination`} class="quote-pattern-link">Data Leakage ↗</a>], we re-evaluated all models on an unseen temporal holdout split created after the training cutoff [<a href={`${import.meta.env.BASE_URL}explore?code=Conducted%20Mitigation`} class="quote-pattern-link">Conducted Mitigation ↗</a>].”</em>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ANNOTATED EXCERPT & IMPLICIT LIMITATIONS */}
      {/* ========================================================================= */}
      {activeTab === "annotated" && (
        <div class="d-tab-panel">
          <div class="annotated-container">
            <div class="annotated-header">
              <h4 class="annotated-title">Discursive Flow in Actual NLP Publications</h4>
              <p class="annotated-desc">
                The diagram below demonstrates how the three sequential discursive moves unfold in a single cohesive paragraph:
              </p>
            </div>

            {/* Three-step visual sequence */}
            <div class="flow-steps-container">
              {/* Step 1 */}
              <div class="flow-step-card step-lead-in">
                <div class="f-step-head">
                  <span class="f-step-num">Step 1</span>
                  <span class="f-step-category">Preceding Context (Antecedent)</span>
                  <span class="f-step-tag tag-green">Strong Reported Performance</span>
                </div>
                <blockquote class="f-step-quote">
                  “Our proposed sparse attention mechanism achieves competitive accuracy compared to full-rank baselines on 6 standard benchmark datasets while achieving a 2.4&times; inference speedup...”
                </blockquote>
                <p class="f-step-desc">
                  <strong>Empirical premise:</strong> Establishes core validity and performance claims before opening discussion of boundaries.
                </p>
                <a
                  href={`${import.meta.env.BASE_URL}explore?code=Strong%20Reported%20Performance`}
                  class="flow-step-explore-btn"
                  title="Explore papers featuring Strong Reported Performance in Explorer"
                >
                  Explore Strong Reported Performance papers ↗
                </a>
              </div>

              {/* Step 2 */}
              <div class="flow-step-card step-core">
                <div class="f-step-head">
                  <span class="f-step-num">Step 2</span>
                  <span class="f-step-category">Core Limitation Admission</span>
                  <span class="f-step-tag tag-rose">Empirical Underperformance</span>
                </div>
                <blockquote class="f-step-quote">
                  “...however, when sequence length exceeds 8k tokens or on out-of-domain conversational datasets, retrieval recall drops by 14.2%...”
                </blockquote>
                <p class="f-step-desc">
                  <strong>Direct vulnerability disclosure:</strong> The specific empirical constraint is formally stated.
                </p>
                <a
                  href={`${import.meta.env.BASE_URL}explore?code=Empirical%20Underperformance`}
                  class="flow-step-explore-btn"
                  title="Explore papers featuring Empirical Underperformance in Explorer"
                >
                  Explore Empirical Underperformance papers ↗
                </a>
              </div>

              {/* Step 3 */}
              <div class="flow-step-card step-resolution">
                <div class="f-step-head">
                  <span class="f-step-num">Step 3</span>
                  <span class="f-step-category">Resolution &amp; Outlook (Successor)</span>
                  <span class="f-step-tag tag-blue">Conducted Mitigation + Future Work</span>
                </div>
                <blockquote class="f-step-quote">
                  “...which we partially addressed via chunk-level positional caching [Conducted Mitigation]; extending this approach to arbitrary context windows remains an active direction for future work [Future Work].”
                </blockquote>
                <p class="f-step-desc">
                  <strong>Forward-looking resolution:</strong> Clarifies existing interventions and directs future research horizons.
                </p>
                <div class="flow-explore-dual-row">
                  <a
                    href={`${import.meta.env.BASE_URL}explore?code=Conducted%20Mitigation`}
                    class="flow-step-explore-btn"
                    title="Explore Conducted Mitigation in Explorer"
                  >
                    Explore Conducted Mitigation ↗
                  </a>
                  <a
                    href={`${import.meta.env.BASE_URL}explore?code=Future%20Work`}
                    class="flow-step-explore-btn"
                    title="Explore Future Work in Explorer"
                  >
                    Explore Future Work ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Implicit Limitations Callout */}
            <div class="implicit-report-banner">
              <div class="ir-header">
                <span class="ir-badge">Implicit Limitation Reporting (§4.4)</span>
                <span class="ir-stat">1.4% of Papers in 2025 (90 papers)</span>
              </div>
              <p class="ir-text">
                In 2025, <strong>90 papers</strong> contained <em>only</em> Non-Limitation discursive codes. In these cases, 
                limitations were discussed strictly through future exploration projections (e.g. <em>“Extending our methodology to non-English languages is an important avenue for future work”</em>) 
                without an explicit acknowledgement that the current study was English-only.
              </p>
              <div class="ir-action-row">
                <a
                  href={`${import.meta.env.BASE_URL}explore?theme=non-limitation&year=2025`}
                  class="ir-explore-cta"
                  title="Explore 2025 papers carrying Non-Limitation codes in Explorer"
                >
                  Explore 2025 Non-Limitation Papers (90 Papers) in Explorer ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
