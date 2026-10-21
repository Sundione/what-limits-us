import temporalMatrixData from "./resultsTemporalMatrix.json";

export interface TemporalDataPoint {
  count: number;
  total: number;
  pct: number;
}

export interface TemporalMatrix {
  years: number[];
  totals: {
    all: Record<string, number>;
    acl: Record<string, number>;
    emnlp: Record<string, number>;
  };
  codes: string[];
  codeData: Record<string, {
    all: Record<string, TemporalDataPoint>;
    acl: Record<string, TemporalDataPoint>;
    emnlp: Record<string, TemporalDataPoint>;
  }>;
}

export const temporalMatrix = temporalMatrixData as unknown as TemporalMatrix;

// Preset groupings for 1-click exploratory lenses
export interface ThematicPreset {
  id: string;
  name: string;
  description: string;
  badge?: string;
  codes: string[];
}

export const THEMATIC_PRESETS: ThematicPreset[] = [
  {
    id: "mandate-swap",
    name: "Canonical Top 5 (Fig. 3)",
    badge: "Policy Shift",
    description: "The core finding: Scope Limitation surged past 65% post-mandate while Methodological Constraints dropped.",
    codes: [
      "Scope Limitation",
      "Methodological Constraints",
      "High Resource Requirements",
      "Generalization Gap",
      "Dependency on Upstream Quality",
    ],
  },
  {
    id: "lim-vs-nonlim",
    name: "Limitations vs. Non-Limitations",
    badge: "Non-Limitation",
    description: "Compare core limitation reporting with non-limitation statements (Future Work, Justification, Strong Performance, and Conducted Mitigation).",
    codes: [
      "Scope Limitation",
      "Non-Limitation: Future Work",
      "Non-Limitation: Contextual Justification",
      "Non-Limitation: Strong Reported Performance",
      "Non-Limitation: Conducted Mitigation",
    ],
  },
  {
    id: "infrastructure-scale",
    name: "Compute & Infrastructure",
    badge: "Hardware",
    description: "Evolution of compute, financial cost, and scalability bottlenecks across models.",
    codes: [
      "High Resource Requirements",
      "Scalability Bottleneck",
      "High Time Consumption",
      "High Financial Cost",
    ],
  },
  {
    id: "eval-metrics",
    name: "Evaluation & Benchmarks",
    badge: "Validation",
    description: "Challenges in reliable assessment, automatic metrics, and subjectivity in annotations.",
    codes: [
      "Generalization Gap",
      "Lack of Reliable Evaluation Metrics or Benchmarks",
      "Reliance on Automatic Metrics",
      "Subjectivity in Evaluation/Annotation",
    ],
  },
];

// Scope Limitation Sub-codes (Paper Figure 4 & Table 8)
export interface ScopeSubcode {
  name: string;
  color: string;
  trend: {
    year: number;
    pct: number;
    count: number;
  }[];
}

export const SCOPE_SUBCODES: ScopeSubcode[] = [
  {
    name: "Model Scale",
    color: "#2563eb", // Vibrant blue
    trend: [
      { year: 2020, pct: 1.3, count: 1 },
      { year: 2021, pct: 2.3, count: 2 },
      { year: 2022, pct: 11.0, count: 158 },
      { year: 2023, pct: 14.9, count: 599 },
      { year: 2024, pct: 18.1, count: 753 },
      { year: 2025, pct: 17.5, count: 1097 },
    ],
  },
  {
    name: "Task Coverage",
    color: "#059669", // Emerald
    trend: [
      { year: 2020, pct: 11.7, count: 9 },
      { year: 2021, pct: 5.7, count: 5 },
      { year: 2022, pct: 13.2, count: 190 },
      { year: 2023, pct: 14.5, count: 584 },
      { year: 2024, pct: 14.6, count: 606 },
      { year: 2025, pct: 14.6, count: 917 },
    ],
  },
  {
    name: "Language Coverage",
    color: "#d97706", // Amber
    trend: [
      { year: 2020, pct: 0.0, count: 0 },
      { year: 2021, pct: 6.8, count: 6 },
      { year: 2022, pct: 13.1, count: 189 },
      { year: 2023, pct: 14.6, count: 590 },
      { year: 2024, pct: 12.8, count: 531 },
      { year: 2025, pct: 13.2, count: 829 },
    ],
  },
  {
    name: "Dataset Utilization",
    color: "#7c3aed", // Violet
    trend: [
      { year: 2020, pct: 9.1, count: 7 },
      { year: 2021, pct: 9.1, count: 8 },
      { year: 2022, pct: 10.3, count: 148 },
      { year: 2023, pct: 11.7, count: 472 },
      { year: 2024, pct: 10.8, count: 448 },
      { year: 2025, pct: 11.3, count: 711 },
    ],
  },
  {
    name: "Evaluation Framework",
    color: "#0891b2", // Cyan
    trend: [
      { year: 2020, pct: 6.5, count: 5 },
      { year: 2021, pct: 6.8, count: 6 },
      { year: 2022, pct: 4.5, count: 65 },
      { year: 2023, pct: 7.0, count: 281 },
      { year: 2024, pct: 8.0, count: 334 },
      { year: 2025, pct: 9.5, count: 594 },
    ],
  },
  {
    name: "Domain Specificity",
    color: "#ea580c", // Orange
    trend: [
      { year: 2020, pct: 1.3, count: 1 },
      { year: 2021, pct: 1.1, count: 1 },
      { year: 2022, pct: 5.7, count: 82 },
      { year: 2023, pct: 4.7, count: 188 },
      { year: 2024, pct: 6.2, count: 260 },
      { year: 2025, pct: 8.1, count: 508 },
    ],
  },
  {
    name: "Modality Constraint",
    color: "#e11d48", // Rose
    trend: [
      { year: 2020, pct: 0.0, count: 0 },
      { year: 2021, pct: 0.0, count: 0 },
      { year: 2022, pct: 1.4, count: 20 },
      { year: 2023, pct: 1.8, count: 73 },
      { year: 2024, pct: 3.0, count: 126 },
      { year: 2025, pct: 4.8, count: 299 },
    ],
  },
];

// Section word counts & code density evolution (Paper Table 4)
export const SECTION_EVOLUTION = {
  acl: [
    { year: 2020, meanWords: 156.42, medWords: 142.0, codesPerPaper: 1.63 },
    { year: 2021, meanWords: 204.47, medWords: 191.0, codesPerPaper: 2.44 },
    { year: 2022, meanWords: 220.03, medWords: 171.5, codesPerPaper: 2.47 },
    { year: 2023, meanWords: 173.24, medWords: 138.0, codesPerPaper: 2.89 },
    { year: 2024, meanWords: 168.90, medWords: 139.0, codesPerPaper: 2.91 },
    { year: 2025, meanWords: 173.77, medWords: 139.0, codesPerPaper: 2.89 },
  ],
  emnlp: [
    { year: 2020, meanWords: 201.41, medWords: 152.5, codesPerPaper: 1.90 },
    { year: 2021, meanWords: 180.04, medWords: 150.5, codesPerPaper: 1.70 },
    { year: 2022, meanWords: 167.97, medWords: 138.0, codesPerPaper: 2.49 },
    { year: 2023, meanWords: 177.06, medWords: 146.0, codesPerPaper: 2.89 },
    { year: 2024, meanWords: 182.73, medWords: 150.0, codesPerPaper: 2.93 },
    { year: 2025, meanWords: 175.77, medWords: 139.0, codesPerPaper: 3.02 },
  ],
};

// Research Area Homogeneity & Significant Divergences (Paper Table 5 & Section 4.3)
export const HOMOGENEITY_STAT = {
  papersAnalyzed: 6742, // papers whose research area was available from conference programs
  researchAreas: 29,
  totalCells: 1160, // 29 research areas × 40 limitation codes
  significantCells: 32,
  nonSignificantCells: 1128,
  uniformityPct: 97.24,
  distinctPct: 2.76,
  chiSquare: 2872,
  degreesOfFreedom: 1092,
  pValueText: "< 0.001",
  cramersV: 0.071,
  effectSize: "Medium effect (Cohen's df-adjusted benchmark)",
};

// Paper Table 5: top 10 significant (research area, limitation code) pairs by
// observed-to-expected ratio (O/E); adj. p from the residual analysis after
// Bonferroni correction. Only these ten pairs are reported in the paper.
export interface AreaCodePair {
  area: string;
  code: string;
  oe: number;
  adjP: string;
}

export const AREA_TOP_PAIRS: AreaCodePair[] = [
  { area: "Human-Centered NLP", code: "Societal and Ethical Risks", oe: 5.8, adjP: "< 0.001" },
  { area: "Human-Centered NLP", code: "Subjectivity in Evaluation/Annotation", oe: 3.83, adjP: "< 0.001" },
  { area: "Efficient NLP", code: "Hyperparameter Sensitivity", oe: 3.53, adjP: "< 0.001" },
  { area: "Interpretability", code: "Lack of Interpretability", oe: 3.31, adjP: "< 0.001" },
  { area: "Summarization", code: "Reliance on Automatic Metrics", oe: 3.29, adjP: "0.002" },
  { area: "Language Modeling", code: "Reproducibility Gap", oe: 2.91, adjP: "0.036" },
  { area: "Computational Social Science", code: "Temporal Degradation", oe: 2.9, adjP: "< 0.001" },
  { area: "Machine Translation", code: "Reliance on Automatic Metrics", oe: 2.82, adjP: "0.006" },
  { area: "Ethics, Bias, and Fairness", code: "Privacy and Security Risks", oe: 2.78, adjP: "0.005" },
  { area: "Interpretability", code: "Theoretical Gap", oe: 2.77, adjP: "< 0.001" },
];

// The 3 Research Area Clusters (Paper Figure 7 & Appendix D)
export interface AreaCluster {
  id: string;
  name: string;
  clusterNum: number;
  paperCount: number;
  pctOfTotal: number;
  trackCount: number;
  tracksSummary: string;
  description: string;
  top8Prevalence: {
    code: string;
    clusterPct: number;
    corpusPct: number;
  }[];
}

export const RESEARCH_AREA_CLUSTERS: AreaCluster[] = [
  {
    id: "cluster-1",
    name: "Cluster 1: Core & Mainstream NLP",
    clusterNum: 1,
    paperCount: 5940,
    pctOfTotal: 88.1,
    trackCount: 20,
    tracksSummary: "Dialogue, Generation, IE, LM, MT, QA, Summarization, Multimodal, Efficient NLP, etc.",
    description: "Encompasses 88.1% of all categorized papers. Its limitation profile mirrors the corpus-wide average almost perfectly, establishing the empirical foundation of field-wide homogeneity.",
    top8Prevalence: [
      { code: "Scope Limitation", clusterPct: 64.9, corpusPct: 62.9 },
      { code: "Methodological Constraints", clusterPct: 38.0, corpusPct: 39.8 },
      { code: "High Resource Requirements", clusterPct: 21.2, corpusPct: 20.5 },
      { code: "Dependency on Upstream Quality", clusterPct: 17.7, corpusPct: 15.9 },
      { code: "Generalization Gap", clusterPct: 15.7, corpusPct: 15.0 },
      { code: "Data Scarcity", clusterPct: 11.9, corpusPct: 12.6 },
      { code: "Dataset Bias/Imbalance", clusterPct: 9.2, corpusPct: 10.1 },
      { code: "High Time Consumption", clusterPct: 8.4, corpusPct: 9.1 },
    ],
  },
  {
    id: "cluster-2",
    name: "Cluster 2: Human-AI, Discourse & Structure",
    clusterNum: 2,
    paperCount: 455,
    pctOfTotal: 6.7,
    trackCount: 7,
    tracksSummary: "Human-Centered NLP & HCI, Discourse, Sentiment/Argument, Syntax, Phonology, IR, Code Models",
    description: "Characterized by elevated mentions of Data Scarcity (17.1%) and Methodological Constraints (41.5%), reflecting challenges in collecting subjective annotations and structural parse trees.",
    top8Prevalence: [
      { code: "Scope Limitation", clusterPct: 63.7, corpusPct: 62.9 },
      { code: "Methodological Constraints", clusterPct: 41.5, corpusPct: 39.8 },
      { code: "Generalization Gap", clusterPct: 18.0, corpusPct: 15.0 },
      { code: "Data Scarcity", clusterPct: 17.1, corpusPct: 12.6 },
      { code: "High Resource Requirements", clusterPct: 16.9, corpusPct: 20.5 },
      { code: "Dependency on Upstream Quality", clusterPct: 12.3, corpusPct: 15.9 },
      { code: "High Time Consumption", clusterPct: 9.9, corpusPct: 9.1 },
      { code: "Dataset Bias/Imbalance", clusterPct: 8.4, corpusPct: 10.1 },
    ],
  },
  {
    id: "cluster-3",
    name: "Cluster 3: Social Science & Interdisciplinary NLP",
    clusterNum: 3,
    paperCount: 347,
    pctOfTotal: 5.1,
    trackCount: 2,
    tracksSummary: "Computational Social Science and Cultural Analytics, Interdisciplinary Recontextualization of NLP",
    description: "Displays a dramatic 3.2× spike in Dataset Bias/Imbalance (29.1% vs 9.2% in Cluster 1, p < 10⁻³¹), elevated Scope Bounding (78.7%), and negligible mentions of training duration (2.3%).",
    top8Prevalence: [
      { code: "Scope Limitation", clusterPct: 78.7, corpusPct: 62.9 },
      { code: "Methodological Constraints", clusterPct: 38.9, corpusPct: 39.8 },
      { code: "Dataset Bias/Imbalance", clusterPct: 29.1, corpusPct: 10.1 },
      { code: "Generalization Gap", clusterPct: 22.5, corpusPct: 15.0 },
      { code: "Data Scarcity", clusterPct: 19.0, corpusPct: 12.6 },
      { code: "Dependency on Upstream Quality", clusterPct: 18.2, corpusPct: 15.9 },
      { code: "High Resource Requirements", clusterPct: 14.4, corpusPct: 20.5 },
      { code: "High Time Consumption", clusterPct: 2.3, corpusPct: 9.1 },
    ],
  },
];

// Paper Format Breakdown (Paper Table 9 in Appendix E - Full screen over all 39 codes)
import paperFormatFullData from "./resultsPaperFormatFull.json";

export interface FormatRow {
  code: string;
  longPct: number;
  shortPct: number;
  findingsPct: number;
  chi2: number;
  pValue: number;
  cramersV?: number;
  adjP: number;
  isExploratoryHighlight?: boolean;
}

export const PAPER_FORMAT_DATA: FormatRow[] = paperFormatFullData as FormatRow[];


// Corporate Affiliation Gaps (Paper Figure 5 & Table 10 in Appendix F - All 40 Codes)
import affiliationFullData from "./resultsAffiliationFull.json";

export interface AffiliationComparisonRow {
  code: string;
  largePct: number;
  largeCi: [number, number];
  nonLargePct: number;
  nonLargeCi: [number, number];
  mixedPct?: number;
  diff: number; // large - nonLarge (percentage point difference)
  oddsRatio?: number;
  adjP: number;
  significant: boolean;
  category: "higher-in-academia" | "higher-in-bigtech" | "equal";
}


export const TOP_AFFILIATION_GAPS: AffiliationComparisonRow[] = affiliationFullData as AffiliationComparisonRow[];


// Discursive Transitions & Contextual Pairings (Paper Table 4, 7, 8 under Within-Paper Permutation Null)
export interface TransitionStat {
  code: string;
  obsPct: number;
  nullMeanPct: number;
  adjP: string;
  direction: "enriched" | "depleted";
  role: string;
}

export interface ConductedMitigationPairing {
  code: string;
  total: number;
  fwPct: number;
  fwNullPct: number;
  fwAdjP: string;
  obsPct: number;
  nullMeanPct: number;
  adjP: string;
}

export const DISCURSIVE_PATTERNS = {
  implicitLimitationShare2025: 1.4, // 90 papers with only Non-Limitation codes
  
  // Lim -> NL: What non-limitation code succeeds a limitation? (paper Table 6)
  transitionsAfter: [
    { code: "Future Work", obsPct: 40.2, nullMeanPct: 32.8, adjP: "< 0.001", direction: "enriched" as const, role: "Future outlook & follow-up directions" },
    { code: "Contextual Justification", obsPct: 19.7, nullMeanPct: 17.0, adjP: "< 0.001", direction: "enriched" as const, role: "Rationale & contextual grounding" },
    { code: "Conducted Mitigation", obsPct: 8.2, nullMeanPct: 6.3, adjP: "< 0.001", direction: "enriched" as const, role: "Proactive mitigations already executed" },
    { code: "Theoretical Projection", obsPct: 7.3, nullMeanPct: 6.3, adjP: "< 0.001", direction: "enriched" as const, role: "Theoretical implications & hypotheses" },
    { code: "Method Details", obsPct: 7.4, nullMeanPct: 12.6, adjP: "< 0.001", direction: "depleted" as const, role: "Implementation & system specs" },
    { code: "Strong Reported Performance", obsPct: 4.5, nullMeanPct: 11.8, adjP: "< 0.001", direction: "depleted" as const, role: "Claims of high empirical results" },
    { code: "Method Strength", obsPct: 3.8, nullMeanPct: 4.7, adjP: "< 0.001", direction: "depleted" as const, role: "Algorithmic advantages" },
    { code: "Recommendations", obsPct: 3.5, nullMeanPct: 2.8, adjP: "< 0.001", direction: "enriched" as const, role: "Actionable advice for practitioners" },
    { code: "Anticipated Impact", obsPct: 3.0, nullMeanPct: 3.5, adjP: "< 0.001", direction: "depleted" as const, role: "Long-term societal footprint" },
    { code: "Authorial Disclaimers", obsPct: 2.4, nullMeanPct: 2.2, adjP: "0.003", direction: "enriched" as const, role: "Formal boundaries of liability" },
  ],

  // NL -> Lim: What non-limitation code precedes a limitation? (paper Table 6)
  transitionsBefore: [
    { code: "Strong Reported Performance", obsPct: 17.5, nullMeanPct: 11.8, adjP: "< 0.001", direction: "enriched" as const, role: "Performance premise before admitting boundaries" },
    { code: "Method Details", obsPct: 16.3, nullMeanPct: 12.6, adjP: "< 0.001", direction: "enriched" as const, role: "Methodological context framing the boundary" },
    { code: "Contextual Justification", obsPct: 17.3, nullMeanPct: 17.0, adjP: "0.280", direction: "enriched" as const, role: "Design constraints preceding limitation" },
    { code: "Method Strength", obsPct: 4.9, nullMeanPct: 4.7, adjP: "0.234", direction: "enriched" as const, role: "System strengths preceding weaknesses" },
    { code: "Future Work", obsPct: 27.9, nullMeanPct: 32.8, adjP: "< 0.001", direction: "depleted" as const, role: "Typically appears after rather than before" },
    { code: "Conducted Mitigation", obsPct: 5.8, nullMeanPct: 6.3, adjP: "0.002", direction: "depleted" as const, role: "Usually introduced after identifying the problem" },
    { code: "Theoretical Projection", obsPct: 4.8, nullMeanPct: 6.3, adjP: "< 0.001", direction: "depleted" as const, role: "Theoretical framing" },
    { code: "Anticipated Impact", obsPct: 2.1, nullMeanPct: 3.6, adjP: "< 0.001", direction: "depleted" as const, role: "Impact projection" },
    { code: "Recommendations", obsPct: 1.9, nullMeanPct: 2.8, adjP: "< 0.001", direction: "depleted" as const, role: "Recommendations" },
    { code: "Authorial Disclaimers", obsPct: 1.6, nullMeanPct: 2.2, adjP: "< 0.001", direction: "depleted" as const, role: "Disclaimers" },
  ],

  // Paper Table 11 (Appendix G): share of each limitation code's outgoing transitions
  // that land on Future Work vs. Conducted Mitigation, against the permutation null.
  conductedMitigationPairings: [
    { code: "Data Leakage/Contamination", total: 141, fwPct: 10.6, fwNullPct: 20.6, fwAdjP: "0.007", obsPct: 24.1, nullMeanPct: 12.1, adjP: "0.002" },
    { code: "Reproducibility Gap", total: 68, fwPct: 11.8, fwNullPct: 22.0, fwAdjP: "0.072", obsPct: 23.5, nullMeanPct: 12.7, adjP: "0.005" },
    { code: "Subjectivity in Evaluation/Annotation", total: 364, fwPct: 23.1, fwNullPct: 25.9, fwAdjP: "0.402", obsPct: 23.4, nullMeanPct: 11.0, adjP: "0.002" },
    { code: "Reliance on Automatic Metrics", total: 259, fwPct: 32.8, fwNullPct: 30.2, fwAdjP: "0.484", obsPct: 20.8, nullMeanPct: 9.9, adjP: "0.027" },
    { code: "Prompt Sensitivity", total: 130, fwPct: 27.7, fwNullPct: 29.2, fwAdjP: "0.845", obsPct: 20.0, nullMeanPct: 9.3, adjP: "0.025" },
    { code: "Privacy and Security Risks", total: 80, fwPct: 27.5, fwNullPct: 27.7, fwAdjP: "0.993", obsPct: 20.0, nullMeanPct: 7.9, adjP: "0.039" },
    { code: "Toxicity Risks", total: 57, fwPct: 7.0, fwNullPct: 26.0, fwAdjP: "0.007", obsPct: 19.3, nullMeanPct: 9.0, adjP: "0.002" },
  ],

  // Paper Table 12 (Appendix H): limitation codes most often preceded by Strong Reported Performance
  strongReportedPerformancePreceding: [
    { targetCode: "Empirical Underperformance", srpCount: 233, allCount: 1001, obsRate: 23.3, nullRate: 9.1, factor: 2.56, adjP: "< 0.001" },
    { targetCode: "Methodological Constraints", srpCount: 645, allCount: 4941, obsRate: 13.1, nullRate: 6.9, factor: 1.90, adjP: "< 0.001" },
    { targetCode: "Dependency on Upstream Quality", srpCount: 264, allCount: 2042, obsRate: 12.9, nullRate: 7.2, factor: 1.79, adjP: "< 0.001" },
    { targetCode: "High Time Consumption", srpCount: 149, allCount: 1201, obsRate: 12.4, nullRate: 7.4, factor: 1.68, adjP: "< 0.001" },
    { targetCode: "Model Reasoning and Generation Deficits", srpCount: 74, allCount: 614, obsRate: 12.1, nullRate: 7.2, factor: 1.68, adjP: "< 0.001" },
  ],

  // Backwards-compatible alias for existing successors
  successors: [
    { code: "Future Work", obs: 40.2, nullVal: 32.8, diff: "+7.4%", adjP: "< 0.001", type: "defer" },
    { code: "Contextual Justification", obs: 19.7, nullVal: 17.0, diff: "+2.7%", adjP: "< 0.001", type: "justify" },
    { code: "Conducted Mitigation", obs: 8.2, nullVal: 6.3, diff: "+2.0%", adjP: "< 0.001", type: "resolve" },
  ],
};

