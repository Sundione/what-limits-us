import { useMemo, useState } from "preact/hooks";
import {
  AREA_TOP_PAIRS,
  HOMOGENEITY_STAT,
  PAPER_FORMAT_DATA,
  TOP_AFFILIATION_GAPS,
} from "../../data/resultsData";
import { Building2, FileText, Layers } from "lucide-preact";

// RQ2 follows the paper's §4.3 in order: research area, paper format, author
// affiliation. Every number shown is from the paper (Tables 5, 9, 10 and
// Figure 5); the full appendix tables sit behind <details>.

const BASE = import.meta.env.BASE_URL;
const explore = (query: string) => `${BASE}explore?${query}`;
const fmtP = (p: number) => (p < 0.001 ? "< 0.001" : p.toFixed(3));

/** Figure 5: the five codes with the largest Large vs. Non-large difference, in the paper's order. */
const FIGURE5_CODES = [
  "Scope Limitation",
  "Data Scarcity",
  "High Time Consumption",
  "Methodological Constraints",
  "Empirical Underperformance",
];
const GROUPS = [
  { key: "largePct", ci: "largeCi", label: "Large company", color: "var(--series-1)" },
  { key: "mixedPct", ci: null, label: "Mixed affiliation", color: "var(--series-3)" },
  { key: "nonLargePct", ci: "nonLargeCi", label: "Non-large company", color: "var(--series-2)" },
] as const;
const FIG5_MAX = 70; // % axis maximum

export default function AreaAndAffiliation() {
  const [formatQuery, setFormatQuery] = useState("");
  const byCode = useMemo(() => new Map(TOP_AFFILIATION_GAPS.map((r) => [r.code, r])), []);
  const formatRows = useMemo(() => {
    const q = formatQuery.trim().toLowerCase();
    return [...PAPER_FORMAT_DATA]
      .filter((r) => !q || r.code.toLowerCase().includes(q))
      .sort((a, b) => a.pValue - b.pValue);
  }, [formatQuery]);

  return (
    <div class="area-affiliation-section">
      <p class="rq-intro">
        We cross-analyze limitation codes with three paper attributes, in this order:{" "}
        <a href="#rq2-area">research area</a>, <a href="#rq2-format">paper format</a>, and{" "}
        <a href="#rq2-affiliation">author affiliation</a>.
      </p>

      {/* ---------------- Research area ---------------- */}
      <section class="rq2-block" id="rq2-area">
        <h3 class="rq3-heading">
          <Layers size={18} aria-hidden="true" /> Research area
        </h3>
        <div class="rq2-stat-row">
          <div class="rq2-stat">
            <span class="rq3-stat-num">~97%</span>
            <span class="rq3-stat-sub">
              of {HOMOGENEITY_STAT.totalCells.toLocaleString()} (area, code) pairs do not differ significantly from
              the field average
            </span>
          </div>
          <div class="rq2-stat">
            <span class="rq3-stat-num">{HOMOGENEITY_STAT.significantCells}</span>
            <span class="rq3-stat-sub">
              cells ({HOMOGENEITY_STAT.distinctPct}%) with significant residuals after Bonferroni correction
            </span>
          </div>
        </div>
        <p class="rq3-lead">
          Using {HOMOGENEITY_STAT.papersAnalyzed.toLocaleString()} papers whose research area is listed in the
          conference programs, a chi-square test of homogeneity on the {HOMOGENEITY_STAT.researchAreas} × 40
          table rejects equal distributions (χ²({HOMOGENEITY_STAT.degreesOfFreedom.toLocaleString()}) ={" "}
          {HOMOGENEITY_STAT.chiSquare.toLocaleString()}, p {HOMOGENEITY_STAT.pValueText}, Cramér's V ={" "}
          {HOMOGENEITY_STAT.cramersV}, a medium effect). Some areas do report specific limitations more often, such
          as Human-Centered NLP and <em>Societal and Ethical Risks</em>, or Efficient NLP and{" "}
          <em>Hyperparameter Sensitivity</em>, reflecting each subfield's priorities. But these 32 cells are only
          2.76% of the table: overall, the field reports limitations in remarkably similar proportions, a{" "}
          <strong>field-wide homogeneity</strong> whose causes we leave to future work.
        </p>
        <figure class="data-figure">
          <figcaption>
            <span class="paper-ref">Table 5 in the paper</span> Top 10 significant (research area, limitation code)
            pairs by observed-to-expected ratio.
          </figcaption>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Research area</th>
                  <th>Limitation code</th>
                  <th class="num">O/E</th>
                  <th class="num">Adj. p</th>
                </tr>
              </thead>
              <tbody>
                {AREA_TOP_PAIRS.map((r) => (
                  <tr key={r.area + r.code}>
                    <td>{r.area}</td>
                    <td>
                      <a href={explore(`code=${encodeURIComponent(r.code)}`)}>{r.code}</a>
                    </td>
                    <td class="num">
                      <span class="data-bar" style={{ "--w": `${(r.oe / 6) * 100}%` }} />
                      {r.oe.toFixed(2)}×
                    </td>
                    <td class="num">{r.adjP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="data-table-note">
            O/E = observed ÷ expected count. Adj. p: residual analysis after Bonferroni correction. Code links open
            all papers with that code; research area is not part of the released dataset, so the explorer cannot
            filter by it.
          </p>
        </figure>
      </section>

      {/* ---------------- Paper format ---------------- */}
      <section class="rq2-block" id="rq2-format">
        <h3 class="rq3-heading">
          <FileText size={18} aria-hidden="true" /> Paper format
        </h3>
        <p class="rq3-lead">
          Across 7,033 ACL 2021–2025 papers (format read from the Anthology ID: long, short or Findings),{" "}
          <strong>no code differs significantly by format</strong> after Benjamini–Hochberg correction. A few
          differences are large enough to report as exploratory observations, consistent with short papers often
          presenting targeted, smaller-scale experiments, negative results or preliminary findings:
        </p>
        <div class="rq2-format-cards">
          {["Empirical Underperformance", "Hyperparameter Sensitivity"].map((code) => {
            const r = PAPER_FORMAT_DATA.find((x) => x.code === code);
            if (!r) return null;
            return (
              <div class="rq2-format-card" key={code}>
                <strong>{code}</strong>
                <div class="rq2-format-bars">
                  {[
                    ["Long", r.longPct],
                    ["Short", r.shortPct],
                    ["Findings", r.findingsPct],
                  ].map(([label, pct]) => (
                    <div class="rq2-format-bar" key={label as string}>
                      <span>{label}</span>
                      <span class="data-bar wide" style={{ "--w": `${((pct as number) / 15) * 100}%` }} />
                      <span class="num">{(pct as number).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
                <span class="rq3-stat-sub">adj. p = {r.adjP.toFixed(3)} (exploratory, not significant)</span>
                <a class="action-btn" href={explore(`code=${encodeURIComponent(code)}&venue=acl&track=short`)}>
                  Read ACL short papers with this code
                </a>
              </div>
            );
          })}
        </div>
        <details class="data-details">
          <summary>
            <span class="paper-ref">Table 9 in the paper</span> All 39 codes by format
          </summary>
          <input
            type="search"
            class="data-search"
            placeholder="Filter codes…"
            value={formatQuery}
            onInput={(e) => setFormatQuery((e.target as HTMLInputElement).value)}
          />
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Limitation code</th>
                  <th class="num">Long</th>
                  <th class="num">Short</th>
                  <th class="num">Findings</th>
                  <th class="num">χ²(2)</th>
                  <th class="num">p</th>
                  <th class="num">Cramér's V</th>
                  <th class="num">Adj. p</th>
                </tr>
              </thead>
              <tbody>
                {formatRows.map((r) => (
                  <tr key={r.code}>
                    <td>{r.code}</td>
                    <td class="num">{r.longPct.toFixed(1)}%</td>
                    <td class="num">{r.shortPct.toFixed(1)}%</td>
                    <td class="num">{r.findingsPct.toFixed(1)}%</td>
                    <td class="num">{r.chi2.toFixed(2)}</td>
                    <td class="num">{fmtP(r.pValue)}</td>
                    <td class="num">{r.cramersV?.toFixed(3) ?? "—"}</td>
                    <td class="num">{r.adjP.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="data-table-note">Sorted by unadjusted p. No adjusted p falls below 0.05.</p>
        </details>
      </section>

      {/* ---------------- Author affiliation ---------------- */}
      <section class="rq2-block" id="rq2-affiliation">
        <h3 class="rq3-heading">
          <Building2 size={18} aria-hidden="true" /> Author affiliation
        </h3>
        <p class="rq3-lead">
          Papers are grouped by whether their authors are at large companies (Forbes Global 2000), at other
          institutions, or both. Comparing large-company-only with non-large-company papers (Fisher's exact tests,
          Benjamini–Hochberg correction), papers <strong>without</strong> large-company authors report{" "}
          <strong>Scope Limitation</strong> significantly more often (63.6% vs. 56.6%, adj. p = 0.019). They also
          report Data Scarcity more often (13.4% vs. 9.8%), and large-company papers show higher raw rates of High
          Time Consumption, Methodological Constraints and Empirical Underperformance, but none of these differences
          is statistically significant.
        </p>
        <figure class="data-figure">
          <figcaption>
            <span class="paper-ref">Figure 5 in the paper</span> The five codes with the largest difference between
            large-company and non-large-company papers. Whiskers: 95% confidence intervals.
          </figcaption>
          <div class="fig5-legend">
            {GROUPS.map((g) => (
              <span key={g.key}>
                <i style={{ background: g.color }} /> {g.label}
              </span>
            ))}
          </div>
          <div class="fig5">
            {FIGURE5_CODES.map((code) => {
              const r = byCode.get(code);
              if (!r) return null;
              return (
                <div class="fig5-row" key={code}>
                  <div class="fig5-label">
                    <a href={explore(`code=${encodeURIComponent(code)}`)}>{code}</a>
                    <span>adj. p = {r.adjP.toFixed(3)}{r.adjP < 0.05 ? " (significant)" : ""}</span>
                  </div>
                  <div class="fig5-bars">
                    {GROUPS.map((g) => {
                      const pct = (r as any)[g.key] as number | undefined;
                      if (pct == null) return null;
                      const ci = g.ci ? ((r as any)[g.ci] as [number, number]) : null;
                      return (
                        <div class="fig5-bar-line" key={g.key} title={`${g.label}: ${pct.toFixed(1)}%${ci ? ` (95% CI ${ci[0]}–${ci[1]})` : ""}`}>
                          <span class="fig5-track">
                            <span class="fig5-fill" style={{ width: `${(pct / FIG5_MAX) * 100}%`, background: g.color }} />
                            {ci && (
                              <span
                                class="fig5-ci"
                                style={{ left: `${(ci[0] / FIG5_MAX) * 100}%`, width: `${((ci[1] - ci[0]) / FIG5_MAX) * 100}%` }}
                              />
                            )}
                          </span>
                          <span class="num">{pct.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div class="fig5-axis" aria-hidden="true">
              {[0, 10, 20, 30, 40, 50, 60, 70].map((t) => (
                <span key={t} style={{ left: `${(t / FIG5_MAX) * 100}%` }}>{t}%</span>
              ))}
            </div>
          </div>
        </figure>
        <details class="data-details">
          <summary>
            <span class="paper-ref">Table 10 in the paper</span> All 40 codes: large vs. non-large company
          </summary>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Limitation code</th>
                  <th class="num">Large %</th>
                  <th class="num">95% CI</th>
                  <th class="num">Non-large %</th>
                  <th class="num">95% CI</th>
                  <th class="num">Δ pp</th>
                  <th class="num">OR</th>
                  <th class="num">Adj. p</th>
                </tr>
              </thead>
              <tbody>
                {TOP_AFFILIATION_GAPS.map((r) => (
                  <tr key={r.code} class={r.adjP < 0.05 ? "" : "row-nonsig"}>
                    <td>{r.code}</td>
                    <td class="num">{r.largePct.toFixed(1)}</td>
                    <td class="num">[{r.largeCi[0]}, {r.largeCi[1]}]</td>
                    <td class="num">{r.nonLargePct.toFixed(1)}</td>
                    <td class="num">[{r.nonLargeCi[0]}, {r.nonLargeCi[1]}]</td>
                    <td class="num">{r.diff > 0 ? "+" : "−"}{Math.abs(r.diff).toFixed(2)}</td>
                    <td class="num">{r.oddsRatio?.toFixed(3) ?? "—"}</td>
                    <td class="num">{r.adjP.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="data-table-note">Δ pp = large minus non-large, in percentage points. Only Scope Limitation is significant.</p>
        </details>
      </section>
    </div>
  );
}
