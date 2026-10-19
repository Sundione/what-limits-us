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
      {/* Plain-Language Intuitive Takeaways for First-Time Readers */}
      <div class="rq-intuitive-lead-box">
        <div class="lead-box-header">
          <span class="lead-box-icon" aria-hidden="true">↕</span>
          <div class="lead-box-title-wrap">
            <h3 class="lead-box-title">Preemptive buffers and soft landings</h3>
            <p class="lead-box-sub">How do NLP researchers sequence their limitation statements, and what tends to sit right before and after them?</p>
          </div>
        </div>
        <div class="lead-sandwich-visual">
          <div class="sandwich-slice slice-top">
            <div class="slice-badge">1. Before: preemptive buffer</div>
            <strong class="slice-title">Strong Reported Performance Premise</strong>
            <p class="slice-desc">
              Some limitations are preceded by a statement of strong results—e.g., <em>"While our model achieves SOTA on Benchmark X..."</em>. Empirical Underperformance is preceded this way at 2.56&times; the null expectation.
            </p>
          </div>
          <div class="sandwich-slice slice-middle">
            <div class="slice-badge">2. The limitation</div>
            <strong class="slice-title">Core Technical Limitation</strong>
            <p class="slice-desc">
              Conceding the actual constraint: resource footprints, compute bounds, model scale, or dataset biases (Empirical Underperformance, Leakage, Incompleteness).
            </p>
          </div>
          <div class="sandwich-slice slice-bottom">
            <div class="slice-badge">3. After: soft landing</div>
            <strong class="slice-title">Future Work, Justification or Mitigation</strong>
            <p class="slice-desc">
              Limitations are often followed by <strong>Conducted Mitigation (24.1% of sentences)</strong> or by <strong>Future Work (40.2% observed vs 32.8% null, z = +30.05)</strong>.
            </p>
          </div>
        </div>
        <div class="implicit-note-banner">
          <span class="implicit-icon">🔎</span>
          <p>
            <strong>Notable Finding (Implicit Limitations):</strong> <strong>90 papers (1.4% in 2025)</strong> have a Limitations section containing <strong>only non-limitation codes</strong>. A manual review found the limitation often appears only as proposed future work (e.g., <em>"Expanding beyond A and B remains an area for future exploration"</em>) without being formally declared, which risks important limitations being overlooked.
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
              <span>Baseline: Within-Paper Permutation Null (2,000 permutations)</span>
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
                        href={`${import.meta.env.BASE_URL}explore?${transitionDir}=${encodeURIComponent(item.code)}`}
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
                      href={`${import.meta.env.BASE_URL}explore?${transitionDir}=${encodeURIComponent(item.code)}`}
                      class="t-explore-mini-btn"
                      title={transitionDir === "after" ? `Papers where a limitation is followed by ${item.code}` : `Papers where ${item.code} comes right before a limitation`}
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
              As in Table 6 of the paper, each rate counts the non-limitation codes that immediately precede or follow a limitation code. 
              The null shuffles the code sequence within each paper 2,000 times, keeping each paper's marginal code frequencies. 
              Click "Explore Papers" to read real papers where that exact transition occurs, with the sentence pair highlighted.
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
                        href={`${import.meta.env.BASE_URL}explore?before=Strong%20Reported%20Performance&code=${encodeURIComponent(item.targetCode)}`}
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
                        href={`${import.meta.env.BASE_URL}explore?before=Strong%20Reported%20Performance&code=${encodeURIComponent(item.targetCode)}`}
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
                <span class="quote-tag">Real example (DCG-SQL, ACL 2025):</span>
                <p class="quote-body">
                  <em>“Under the same LLM models, our method outperforms the existing SOTA.”</em> [Strong Reported Performance]{" "}
                  <em>“Our method has shown highly effective in improving performance with small LLMs, however, there is still a performance gap between the use of hyper-scaled LLMs and small LLMs.”</em> [Empirical Underperformance]
                </p>
                <a href={`${import.meta.env.BASE_URL}explore?paper=2025.acl-long.748&before=Strong%20Reported%20Performance`} class="quote-pattern-link">
                  Read it in the explorer with the pattern highlighted ↗
                </a>
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
                        href={`${import.meta.env.BASE_URL}explore?after=Conducted%20Mitigation&code=${encodeURIComponent(item.code)}`}
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
                      <span class="p-signif">FDR adj. p {String(item.adjP).trim().startsWith("<") ? item.adjP : `= ${item.adjP}`}</span>
                      <a
                        href={`${import.meta.env.BASE_URL}explore?after=Conducted%20Mitigation&code=${encodeURIComponent(item.code)}`}
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
                <span class="quote-tag">Real example (Easy as PIE?, EMNLP 2025):</span>
                <p class="quote-body">
                  <em>“A potential concern with using LLMs on existing, publicly available tasks is that the models may have been exposed to the data during training.”</em> [Data Leakage/Contamination]{" "}
                  <em>“To partially address this, we include several different LLMs in our evaluation.”</em> [Conducted Mitigation]
                </p>
                <a href={`${import.meta.env.BASE_URL}explore?paper=2025.emnlp-main.1213&after=Conducted%20Mitigation`} class="quote-pattern-link">
                  Read it in the explorer with the pattern highlighted ↗
                </a>
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
              <h4 class="annotated-title">One Real Limitations Section, Three Consecutive Moves</h4>
              <p class="annotated-desc">
                Three consecutive sentences from{" "}
                <a href={`${import.meta.env.BASE_URL}explore?paper=2025.findings-acl.482&before=Strong%20Reported%20Performance`}>
                  BadWindtunnel (Findings of ACL 2025)
                </a>
                , with the codes the LLM assigned to each:
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
                  “As shown in Section 4.3, BadWindtunnel maintains optimal performance under most attacks when the attack rate is 10%.”
                </blockquote>
                <p class="f-step-desc">
                  <strong>Empirical premise:</strong> Establishes core validity and performance claims before opening discussion of boundaries.
                </p>
                <a
                  href={`${import.meta.env.BASE_URL}explore?before=Strong%20Reported%20Performance`}
                  class="flow-step-explore-btn"
                  title="Papers where Strong Reported Performance comes right before a limitation"
                >
                  Papers with strong results right before a limitation ↗
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
                  “However, its performance starts to decrease for semantic invariant attacks like Synbkd.”
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
                  <span class="f-step-tag tag-blue">Future Work</span>
                </div>
                <blockquote class="f-step-quote">
                  “Given this limitation, future research could explore further ways to magnify the differences in learnability.”
                </blockquote>
                <p class="f-step-desc">
                  <strong>Forward-looking move:</strong> The limitation is immediately turned into a direction for future research.
                </p>
                <a
                  href={`${import.meta.env.BASE_URL}explore?after=Future%20Work`}
                  class="flow-step-explore-btn"
                  title="Papers where a limitation is followed by Future Work"
                >
                  Papers where a limitation is followed by Future Work ↗
                </a>
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
                limitations were discussed strictly through future exploration projections (e.g. <em>“Expanding beyond A and B remains an area for future exploration”</em>, the paper's own illustration) 
                without explicitly acknowledging that the current study was limited to A and B.
              </p>
              <div class="ir-action-row">
                <a
                  href={`${import.meta.env.BASE_URL}explore?implicit=1&year=2025`}
                  class="ir-explore-cta"
                  title="2025 papers whose Limitations section carries only non-limitation codes"
                >
                  Read these 2025 sections in the explorer ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
