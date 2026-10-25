import { useState } from "preact/hooks";
import { DISCURSIVE_PATTERNS } from "../../data/resultsData";
import { ArrowDown, ArrowRight, FileSearch, Info } from "lucide-preact";

// RQ3 follows the paper's §4.4 in order and wording: implicit limitation
// reports, then the recurring discursive patterns the paper names (the
// Preemptive Buffer, Soft Landing, Proactive Efforts), then the
// full Tables 6, 11 and 12. All numbers are the paper's.

type TableTab = "t6" | "t11" | "t12";
type TransitionDir = "after" | "before";

const BASE = import.meta.env.BASE_URL;
const explore = (query: string) => `${BASE}explore?${query}`;
const isSig = (adjP: string) => adjP.trim().startsWith("<") || Number(adjP) < 0.05;

/** One real Limitations section (BadWindtunnel, Findings of ACL 2025) showing all three moves in a row. */
const EXAMPLE_PAPER = "2025.findings-acl.482";
const EXAMPLE = [
  {
    role: "Preemptive Buffer",
    code: "Strong Reported Performance",
    text: "As shown in Section 4.3, BadWindtunnel maintains optimal performance under most attacks when the attack rate is 10%.",
    tone: "buffer",
  },
  {
    role: "Limitation",
    code: "Empirical Underperformance",
    text: "However, its performance starts to decrease for semantic invariant attacks like Synbkd.",
    tone: "limitation",
  },
  {
    role: "Soft Landing",
    code: "Future Work",
    text: "Given this limitation, future research could explore further ways to magnify the differences in learnability.",
    tone: "landing",
  },
] as const;

/** A real sentence pair (or single sentence) from the dataset, with its codes and a link to read it in context. */
function RealExample({
  lines,
  source,
  href,
}: {
  lines: { text: string; code: string }[];
  source: string;
  href: string;
}) {
  return (
    <div class="pattern-example">
      {lines.map((l) => (
        <p key={l.text}>
          “{l.text}” <span>{l.code}</span>
        </p>
      ))}
      <a href={href}>
        {source} <ArrowRight size={12} aria-hidden="true" />
      </a>
    </div>
  );
}

export default function DiscursiveSandwich() {
  const [tableTab, setTableTab] = useState<TableTab>("t6");
  const [transitionDir, setTransitionDir] = useState<TransitionDir>("after");
  const transitions =
    transitionDir === "after" ? DISCURSIVE_PATTERNS.transitionsAfter : DISCURSIVE_PATTERNS.transitionsBefore;

  return (
    <div class="discursive-section">
      {/* 1. Implicit Limitation Reports (paper §4.4, first paragraph) */}
      <section class="rq3-block">
        <h3 class="rq3-heading">
          <FileSearch size={18} aria-hidden="true" /> Implicit limitation reports
        </h3>
        <div class="rq3-implicit">
          <div class="rq3-stat">
            <span class="rq3-stat-num">90 papers</span>
            <span class="rq3-stat-sub">1.4% of 2025 papers</span>
          </div>
          <div class="rq3-implicit-body">
            <p>
              While analyzing the LLM-annotated data, we found Limitations sections that contain{" "}
              <strong>only non-limitation codes</strong>. A manual review showed the limitation appearing only as
              proposed future work. For example, a paper might state{" "}
              <em>"Expanding beyond A and B remains an area for future exploration,"</em> without explicitly
              acknowledging that the current study was limited to evaluating only A and B. Such limitations are not
              formally declared, risking important limitations being overlooked.
            </p>
            <RealExample
              lines={[
                {
                  text: "While we provide extensive evaluation of SQUiD on our benchmark, we leave comparisons with fewshot baselines and fine-tuned models for future work.",
                  code: "Future Work (the whole section)",
                },
              ]}
              source="SQUiD, EMNLP 2025"
              href={explore("paper=2025.emnlp-main.1629")}
            />
            <a class="action-btn" href={explore("implicit=1&year=2025")}>
              Read these 2025 sections in the explorer <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Recurring Discursive Patterns */}
      <section class="rq3-block">
        <h3 class="rq3-heading">Recurring discursive patterns</h3>
        <p class="rq3-lead">
          Next, we look at what sits immediately <strong>before</strong> and <strong>after</strong> each
          limitation, and compares it with a permutation null that shuffles the code sequence within each paper
          (2,000 permutations). Sequential proximity does not by itself imply a semantic relationship, but these
          non-random patterns are worth noting as common ways of writing about limitations; sentence order alone
          cannot tell us what authors intended.
        </p>

        {/* Real example: the three moves in one section */}
        <figure class="rq3-example">
          <figcaption>
            Three consecutive sentences from one real Limitations section (
            <a href={explore(`paper=${EXAMPLE_PAPER}&before=Strong%20Reported%20Performance`)}>
              BadWindtunnel, Findings of ACL 2025
            </a>
            ):
          </figcaption>
          <ol class="rq3-sequence">
            {EXAMPLE.map((s, i) => (
              <li key={s.code} class={`rq3-move move-${s.tone}`}>
                <span class="rq3-move-role">{s.role}</span>
                <blockquote>“{s.text}”</blockquote>
                <span class="rq3-move-code">{s.code}</span>
                {i < EXAMPLE.length - 1 && <ArrowDown class="rq3-move-arrow" size={16} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </figure>

        {/* The three patterns, in the paper's order */}
        <div class="rq3-patterns">
          <article class="pattern-card">
            <span class="pattern-where">Before a limitation</span>
            <h4 class="pattern-name">Preemptive Buffer</h4>
            <p class="pattern-what">
              Of the non-limitation codes that precede a limitation, <strong>17.5% are Strong Reported
              Performance</strong> (null 11.8%). It places a limitation in context by first stating what the method does
              well. When the limitation is <strong>Empirical Underperformance</strong>, this buffer
              precedes it <strong>23.3%</strong> of the time (null 9.1%, about 2.6×).
            </p>
            <RealExample
              lines={[
                { text: "Experiment results show that CFSum can achieve comparable performance with strong baselines.", code: "Strong Reported Performance" },
                { text: "But it still cannot surpass the SOTA of some dual-stream large models.", code: "Empirical Underperformance" },
              ]}
              source="CFSum: Coarse-to-Fine Contribution Network for Multimodal Summarization, ACL 2023"
              href={explore("paper=2023.acl-long.476&before=Strong%20Reported%20Performance")}
            />
            <div class="pattern-links">
              <a class="action-btn" href={explore("before=Strong%20Reported%20Performance")}>
                Strong Reported Performance → Limitation
              </a>
              <a class="action-btn" href={explore("before=Strong%20Reported%20Performance&code=Empirical%20Underperformance")}>
                … before Empirical Underperformance
              </a>
            </div>
          </article>

          <article class="pattern-card">
            <span class="pattern-where">After a limitation</span>
            <h4 class="pattern-name">Soft Landing</h4>
            <p class="pattern-what">
              Among non-limitation codes immediately following a limitation, <strong>40.2% are Future Work</strong>{" "}
              and <strong>19.7% are Contextual Justification</strong>, both significantly higher than the null
              (32.8% and 17.0%). It pairs a limitation with a way forward (future work) or with the reason behind
              it (a justification).
            </p>
            <RealExample
              lines={[
                { text: "We do not explore other types of metrics and statistical tests.", code: "Scope Limitation" },
                { text: "We leave them to future work.", code: "Future Work" },
              ]}
              source="Faithful Model Evaluation for Model-Based Metrics, EMNLP 2023"
              href={explore("paper=2023.emnlp-main.464&after=Future%20Work")}
            />
            <RealExample
              lines={[
                { text: "We spent about $110 in total for querying the entire MMLU.", code: "High Financial Cost" },
                { text: "But this number includes trying different settings.", code: "Contextual Justification" },
              ]}
              source="An Open-Source Data Contamination Report for LLMs, Findings of EMNLP 2024"
              href={explore("paper=2024.findings-emnlp.30&after=Contextual%20Justification")}
            />
            <div class="pattern-links">
              <a class="action-btn" href={explore("after=Future%20Work")}>Limitation → Future Work</a>
              <a class="action-btn" href={explore("after=Contextual%20Justification")}>Limitation → Contextual Justification</a>
            </div>
          </article>

          <article class="pattern-card">
            <span class="pattern-where">After a limitation</span>
            <h4 class="pattern-name">Proactive Efforts</h4>
            <span class="pattern-tagline">Coded as Conducted Mitigation</span>
            <p class="pattern-what">
              <strong>8.2%</strong> of post-limitation non-limitation codes are Conducted Mitigation (null 6.3%),
              detailing proactive efforts made by authors to address the stated limitation, whether fully,
              partially or not successful. It follows some limitations more than others, notably{" "}
              <strong>Data Leakage/Contamination</strong> (24.1%), <strong>Reproducibility Gap</strong> (23.5%) and{" "}
              <strong>Subjectivity in Evaluation/Annotation</strong> (23.4%).
            </p>
            <RealExample
              lines={[
                {
                  text: "A potential concern with using LLMs on existing, publicly available tasks is that the models may have been exposed to the data during training.",
                  code: "Data Leakage/Contamination",
                },
                { text: "To partially address this, we include several different LLMs in our evaluation.", code: "Conducted Mitigation" },
              ]}
              source="Easy as PIE? Identifying Multi-Word Expressions with LLMs, EMNLP 2025"
              href={explore("paper=2025.emnlp-main.1213&after=Conducted%20Mitigation")}
            />
            <div class="pattern-links">
              <a class="action-btn" href={explore("after=Conducted%20Mitigation")}>Limitation → Conducted Mitigation</a>
            </div>
          </article>
        </div>

        <p class="rq3-caveat">
          <Info size={16} aria-hidden="true" />
          <span>
            Since these patterns were inferred solely from sequential order, we encourage future studies to
            analyze code relations semantically for deeper insights.
          </span>
        </p>
      </section>

      {/* 3. Full tables */}
      <section class="rq3-block">
        <h3 class="rq3-heading">The numbers behind the patterns</h3>
        <div class="filter-pill-group data-table-tabs" role="tablist" aria-label="RQ3 tables">
          <button type="button" role="tab" aria-selected={tableTab === "t6"} class={`filter-pill ${tableTab === "t6" ? "active" : ""}`} onClick={() => setTableTab("t6")}>
            Table 6 · All transitions
          </button>
          <button type="button" role="tab" aria-selected={tableTab === "t12"} class={`filter-pill ${tableTab === "t12" ? "active" : ""}`} onClick={() => setTableTab("t12")}>
            Table 12 · Preemptive Buffer
          </button>
          <button type="button" role="tab" aria-selected={tableTab === "t11"} class={`filter-pill ${tableTab === "t11" ? "active" : ""}`} onClick={() => setTableTab("t11")}>
            Table 11 · Proactive Efforts
          </button>
        </div>

        {tableTab === "t6" && (
          <div class="data-table-panel">
            <div class="segmented-btn-group" role="tablist" aria-label="Transition direction">
              <button type="button" class={`seg-btn ${transitionDir === "after" ? "seg-btn-active" : ""}`} onClick={() => setTransitionDir("after")}>
                Limitation → non-limitation (what follows)
              </button>
              <button type="button" class={`seg-btn ${transitionDir === "before" ? "seg-btn-active" : ""}`} onClick={() => setTransitionDir("before")}>
                Non-limitation → limitation (what precedes)
              </button>
            </div>
            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Non-limitation code</th>
                    <th class="num">Null %</th>
                    <th class="num">Observed %</th>
                    <th class="num">Diff</th>
                    <th class="num">Adj. p</th>
                    <th aria-label="Explore" />
                  </tr>
                </thead>
                <tbody>
                  {transitions.map((t) => {
                    const diff = t.obsPct - t.nullMeanPct;
                    const sig = isSig(t.adjP);
                    return (
                      <tr key={t.code} class={sig ? "" : "row-nonsig"}>
                        <td>
                          {t.code}
                          {!sig && <span class="nonsig-note"> (not significant)</span>}
                        </td>
                        <td class="num">{t.nullMeanPct.toFixed(1)}</td>
                        <td class="num">
                          <span class="data-bar" style={{ "--w": `${Math.min(100, (t.obsPct / 45) * 100)}%` }} />
                          {t.obsPct.toFixed(1)}
                        </td>
                        <td class={`num ${sig ? (diff > 0 ? "diff-up" : "diff-down") : ""}`}>
                          {diff > 0 ? "+" : "−"}
                          {Math.abs(diff).toFixed(1)}
                        </td>
                        <td class="num">{t.adjP}</td>
                        <td class="num">
                          <a class="t-explore-mini-btn" href={explore(`${transitionDir}=${encodeURIComponent(t.code)}`)}>
                            Explore
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p class="data-table-note">
              Shares of non-limitation codes immediately {transitionDir === "after" ? "following" : "preceding"} a
              limitation, normalized over all transitions in that direction corpus-wide. Null: expected rate under
              2,000 within-paper permutations. Benjamini–Hochberg adjusted p. "Explore" opens papers where that exact
              transition occurs, with the sentence pair outlined.
            </p>
          </div>
        )}

        {tableTab === "t11" && (
          <div class="data-table-panel">
            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>Limitation code</th>
                    <th rowSpan={2} class="num">Total</th>
                    <th colSpan={3} class="num group">→ Future Work</th>
                    <th colSpan={3} class="num group">→ Conducted Mitigation</th>
                  </tr>
                  <tr>
                    <th class="num">%</th>
                    <th class="num">Null %</th>
                    <th class="num">Adj. p</th>
                    <th class="num">%</th>
                    <th class="num">Null %</th>
                    <th class="num">Adj. p</th>
                  </tr>
                </thead>
                <tbody>
                  {DISCURSIVE_PATTERNS.conductedMitigationPairings.map((r) => {
                    const cmWins = r.obsPct > r.fwPct && isSig(r.adjP);
                    const fwWins = r.fwPct > r.obsPct && isSig(r.fwAdjP);
                    return (
                      <tr key={r.code}>
                        <td>
                          <a href={explore(`after=Conducted%20Mitigation&code=${encodeURIComponent(r.code)}`)}>{r.code}</a>
                        </td>
                        <td class="num">{r.total}</td>
                        <td class={`num ${fwWins ? "strong" : ""}`}>{r.fwPct.toFixed(1)}</td>
                        <td class="num">{r.fwNullPct.toFixed(1)}</td>
                        <td class="num">{r.fwAdjP}</td>
                        <td class={`num ${cmWins ? "strong" : ""}`}>{r.obsPct.toFixed(1)}</td>
                        <td class="num">{r.nullMeanPct.toFixed(1)}</td>
                        <td class="num">{r.adjP}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p class="data-table-note">
              The seven limitation codes whose outgoing transitions most often land on Conducted Mitigation; all
              exceed their null, and some surpass Future Work, the most common non-limitation code corpus-wide. Bold:
              the higher observed share when it is also significant (adj. p &lt; 0.05). Click a code to read examples.
            </p>
          </div>
        )}

        {tableTab === "t12" && (
          <div class="data-table-panel">
            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Limitation code</th>
                    <th class="num">SRP → code</th>
                    <th class="num">All → code</th>
                    <th class="num">% preceded by SRP</th>
                    <th class="num">Null %</th>
                    <th class="num">× null</th>
                    <th class="num">Adj. p</th>
                  </tr>
                </thead>
                <tbody>
                  {DISCURSIVE_PATTERNS.strongReportedPerformancePreceding.map((r) => (
                    <tr key={r.targetCode}>
                      <td>
                        <a href={explore(`before=Strong%20Reported%20Performance&code=${encodeURIComponent(r.targetCode)}`)}>
                          {r.targetCode}
                        </a>
                      </td>
                      <td class="num">{r.srpCount.toLocaleString()}</td>
                      <td class="num">{r.allCount.toLocaleString()}</td>
                      <td class="num strong">{r.obsRate.toFixed(1)}</td>
                      <td class="num">{r.nullRate.toFixed(1)}</td>
                      <td class="num">{(r.obsRate / r.nullRate).toFixed(1)}×</td>
                      <td class="num">{r.adjP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p class="data-table-note">
              Limitation codes most often preceded by a Strong Reported Performance (SRP) statement. All five exceed
              their null: about 2.6× for Empirical Underperformance and 1.7–1.9× for the other four. Click a code to
              read examples with the buffer outlined.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

