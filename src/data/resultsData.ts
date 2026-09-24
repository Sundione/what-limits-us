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

export interface SignificantAreaCodePair {
  area: string;
  code: string;
  O: number;
  E: number;
  oeRatio: number;
  z: number;
  adjP: string;
  dir: "over" | "under";
  note: string;
}

// Exactly 32 statistically significant cells matching Section 4.3 of the published paper
export const TOP_32_SIGNIFICANT_PAIRS: SignificantAreaCodePair[] = [
  {
    area: "Efficient Methods for NLP",
    code: "Hyperparameter Sensitivity",
    O: 44,
    E: 12.5,
    oeRatio: 3.53,
    z: 9.26,
    adjP: "< 0.001",
    dir: "over",
    note: "High tuning volatility and sensitivity under strict compute budgets.",
  },
  {
    area: "Interpretability and Analysis",
    code: "Theoretical Gap",
    O: 59,
    E: 21.3,
    oeRatio: 2.77,
    z: 8.51,
    adjP: "< 0.001",
    dir: "over",
    note: "Absence of formal analytical guarantees for empirical attention mechanisms.",
  },
  {
    area: "Computational Social Science",
    code: "Dataset Bias/Imbalance",
    O: 78,
    E: 35.2,
    oeRatio: 2.22,
    z: 7.55,
    adjP: "< 0.001",
    dir: "over",
    note: "Severe demographic, ideological, and social media source skews.",
  },
  {
    area: "Resources and Evaluation",
    code: "Subjectivity in Evaluation/Annotation",
    O: 88,
    E: 42.7,
    oeRatio: 2.06,
    z: 7.43,
    adjP: "< 0.001",
    dir: "over",
    note: "Human disagreement, subjective guidelines, and annotator variability.",
  },
  {
    area: "Computational Social Science",
    code: "Subjectivity in Evaluation/Annotation",
    O: 49,
    E: 19.3,
    oeRatio: 2.54,
    z: 7.00,
    adjP: "< 0.001",
    dir: "over",
    note: "Inherent nuance in coding complex social phenomena (e.g. hate speech).",
  },
  {
    area: "Human-Centered NLP & HCI",
    code: "Subjectivity in Evaluation/Annotation",
    O: 20,
    E: 5.2,
    oeRatio: 3.83,
    z: 6.58,
    adjP: "< 0.001",
    dir: "over",
    note: "Variability in human user ratings, subjective prompts, and feedback.",
  },
  {
    area: "Interpretability and Analysis",
    code: "Lack of Interpretability",
    O: 24,
    E: 7.2,
    oeRatio: 3.31,
    z: 6.46,
    adjP: "< 0.001",
    dir: "over",
    note: "Black-box nature of deep neural networks and internal feature circuits.",
  },
  {
    area: "Resources and Evaluation",
    code: "Low Data Quality",
    O: 105,
    E: 59.3,
    oeRatio: 1.77,
    z: 6.38,
    adjP: "< 0.001",
    dir: "over",
    note: "Crowdsourced label noise, OCR artifacts, and corpus extraction errors.",
  },
  {
    area: "Computational Social Science",
    code: "Temporal Degradation",
    O: 27,
    E: 9.3,
    oeRatio: 2.90,
    z: 5.98,
    adjP: "< 0.001",
    dir: "over",
    note: "Rapid concept drift in colloquial language and cultural events over time.",
  },
  {
    area: "Human-Centered NLP & HCI",
    code: "Societal and Ethical Risks",
    O: 8,
    E: 1.4,
    oeRatio: 5.80,
    z: 5.69,
    adjP: "< 0.001",
    dir: "over",
    note: "Highest lift in the corpus (5.80×): Direct psychological or social harms to end-users.",
  },
  {
    area: "Multilingualism & Cross-Lingual",
    code: "Data Scarcity",
    O: 57,
    E: 28.3,
    oeRatio: 2.01,
    z: 5.59,
    adjP: "< 0.001",
    dir: "over",
    note: "Severe lack of parallel corpora and native resources for low-resource languages.",
  },
  {
    area: "Multimodality & Language Grounding",
    code: "Dependency on Upstream Quality",
    O: 140,
    E: 90.6,
    oeRatio: 1.54,
    z: 5.56,
    adjP: "< 0.001",
    dir: "over",
    note: "Downstream vision/audio errors propagating into language reasoning.",
  },
  {
    area: "Computational Social Science",
    code: "Bias and Fairness Risks",
    O: 27,
    E: 10.0,
    oeRatio: 2.70,
    z: 5.54,
    adjP: "< 0.001",
    dir: "over",
    note: "Stereotyping, toxic outputs, and demographic misrepresentation.",
  },
  {
    area: "Resources and Evaluation",
    code: "Human Labor and Annotation Bottleneck",
    O: 73,
    E: 40.5,
    oeRatio: 1.80,
    z: 5.48,
    adjP: "< 0.001",
    dir: "over",
    note: "Massive human effort required to curate and verify gold evaluation benchmarks.",
  },
  {
    area: "Resources and Evaluation",
    code: "Dataset Bias/Imbalance",
    O: 122,
    E: 77.8,
    oeRatio: 1.57,
    z: 5.42,
    adjP: "< 0.001",
    dir: "over",
    note: "Skew across genres, writing styles, and demographic annotator backgrounds.",
  },
  {
    area: "Efficient Methods for NLP",
    code: "High Resource Requirements",
    O: 131,
    E: 85.3,
    oeRatio: 1.54,
    z: 5.30,
    adjP: "< 0.001",
    dir: "over",
    note: "Heavy GPU demands needed to benchmark compression algorithms at scale.",
  },
  {
    area: "Machine Learning for NLP",
    code: "Theoretical Gap",
    O: 25,
    E: 9.3,
    oeRatio: 2.69,
    z: 5.28,
    adjP: "< 0.001",
    dir: "over",
    note: "Empirical heuristics lacking rigorous theoretical convergence guarantees.",
  },
  {
    area: "Resources and Evaluation",
    code: "Data Leakage/Contamination",
    O: 35,
    E: 15.5,
    oeRatio: 2.26,
    z: 5.28,
    adjP: "< 0.001",
    dir: "over",
    note: "Test splits inadvertently absorbed into massive web-scale pre-training data.",
  },
  {
    area: "Summarization",
    code: "Reliance on Automatic Metrics",
    O: 14,
    E: 4.3,
    oeRatio: 3.29,
    z: 4.80,
    adjP: "0.002",
    dir: "over",
    note: "Flaws in n-gram overlap metrics (ROUGE) failing on semantic faithfulness.",
  },
  {
    area: "Ethics, Bias, and Fairness",
    code: "Privacy and Security Risks",
    O: 17,
    E: 6.1,
    oeRatio: 2.78,
    z: 4.58,
    adjP: "0.005",
    dir: "over",
    note: "Memorized PII extraction risks and jailbreak vulnerability.",
  },
  {
    area: "Multilingualism & Cross-Lingual",
    code: "Dataset Task Mismatch",
    O: 2,
    E: 0.2,
    oeRatio: 11.97,
    z: 4.56,
    adjP: "0.006",
    dir: "over",
    note: "Western-centric task formulations failing on non-Indo-European linguistic structures.",
  },
  {
    area: "Machine Translation",
    code: "Reliance on Automatic Metrics",
    O: 17,
    E: 6.0,
    oeRatio: 2.82,
    z: 4.54,
    adjP: "0.007",
    dir: "over",
    note: "BLEU and COMET scoring blind spots on subtle idiom and stylistic translation errors.",
  },
  {
    area: "Interpretability and Analysis",
    code: "Scope Limitation",
    O: 356,
    E: 290.9,
    oeRatio: 1.22,
    z: 4.47,
    adjP: "0.009",
    dir: "over",
    note: "Probing insights carefully bounded to specific layers or model scales.",
  },
  {
    area: "Efficient Methods for NLP",
    code: "Methodological Constraints",
    O: 209,
    E: 158.5,
    oeRatio: 1.32,
    z: 4.44,
    adjP: "0.010",
    dir: "over",
    note: "Quantization, pruning, and architectural simplifications limiting model capacity.",
  },
  // Under-represented cells (statistically significant negative residuals)
  {
    area: "Resources and Evaluation",
    code: "High Resource Requirements",
    O: 92,
    E: 156.9,
    oeRatio: 0.59,
    z: -5.70,
    adjP: "< 0.001",
    dir: "under",
    note: "Under-reported: Benchmark construction emphasizes curation rather than compute.",
  },
  {
    area: "Resources and Evaluation",
    code: "Methodological Constraints",
    O: 208,
    E: 291.6,
    oeRatio: 0.71,
    z: -5.57,
    adjP: "< 0.001",
    dir: "under",
    note: "Under-reported: Focuses on dataset quality rather than algorithmic limitations.",
  },
  {
    area: "Interpretability and Analysis",
    code: "Low Data Quality",
    O: 7,
    E: 34.6,
    oeRatio: 0.20,
    z: -4.92,
    adjP: "0.001",
    dir: "under",
    note: "Under-reported: Probing studies predominantly run on clean, synthetic benchmark suites.",
  },
  {
    area: "Interpretability and Analysis",
    code: "Dataset Bias/Imbalance",
    O: 14,
    E: 45.3,
    oeRatio: 0.31,
    z: -4.90,
    adjP: "0.001",
    dir: "under",
    note: "Under-reported: Internal representation probing rarely evaluates training set distribution skew.",
  },
  {
    area: "Resources and Evaluation",
    code: "Dependency on Upstream Quality",
    O: 83,
    E: 132.6,
    oeRatio: 0.63,
    z: -4.71,
    adjP: "0.003",
    dir: "under",
    note: "Under-reported: Benchmarks establish ground-truth annotations rather than stacking pipelines.",
  },
  {
    area: "Resources and Evaluation",
    code: "High Time Consumption",
    O: 30,
    E: 62.4,
    oeRatio: 0.48,
    z: -4.42,
    adjP: "0.012",
    dir: "under",
    note: "Under-reported: Evaluation runs do not incur weeks-long training cycles.",
  },
  {
    area: "Efficient Methods for NLP",
    code: "Subjectivity in Evaluation/Annotation",
    O: 3,
    E: 23.2,
    oeRatio: 0.13,
    z: -4.37,
    adjP: "0.014",
    dir: "under",
    note: "Under-reported: Efficiency evaluations rely on deterministic hardware metrics (latency, FLOPs).",
  },
  {
    area: "Computational Social Science",
    code: "High Time Consumption",
    O: 6,
    E: 28.2,
    oeRatio: 0.21,
    z: -4.35,
    adjP: "0.016",
    dir: "under",
    note: "Under-reported: Analyses typically train smaller discriminative models or run zero-shot inference.",
  },
];

// Backwards-compatible alias for TOP_32_SIGNIFICANT_PAIRS
export const TOP_SIGNIFICANT_PAIRS = TOP_32_SIGNIFICANT_PAIRS;

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

export const AFFILIATION_STAT_SUMMARY = {
  totalCodes: 40,
  significantCodes: 1,
  nonSignificantCodes: 39,
  uniformityPct: 97.5,
  significantCodeName: "Scope Limitation",
  fdrThreshold: 0.05,
};

export const TOP_AFFILIATION_GAPS: AffiliationComparisonRow[] = affiliationFullData as AffiliationComparisonRow[];


// Discursive Transitions & Contextual Pairings (Paper Table 4, 7, 8 under Within-Paper Permutation Null)
export interface TransitionStat {
  code: string;
  obsPct: number;
  nullMeanPct: number;
  nullCi: [number, number];
  z: number;
  adjP: string;
  direction: "enriched" | "depleted";
  role: string;
}

export interface ConductedMitigationPairing {
  code: string;
  obsPct: number;
  nullMeanPct: number;
  nullCi: [number, number];
  z: number;
  adjP: string;
}

export const DISCURSIVE_PATTERNS = {
  implicitLimitationShare2025: 1.4, // 90 papers with only Non-Limitation codes
  
  // Lim -> NL: What non-limitation code succeeds a limitation? (Table 4)
  transitionsAfter: [
    { code: "Future Work", obsPct: 40.2, nullMeanPct: 32.8, nullCi: [32.3, 33.3] as [number, number], z: 30.05, adjP: "< 0.001", direction: "enriched" as const, role: "Future outlook & follow-up directions" },
    { code: "Contextual Justification", obsPct: 19.7, nullMeanPct: 17.0, nullCi: [16.6, 17.4] as [number, number], z: 13.58, adjP: "< 0.001", direction: "enriched" as const, role: "Rationale & contextual grounding" },
    { code: "Conducted Mitigation", obsPct: 8.2, nullMeanPct: 6.3, nullCi: [6.0, 6.5] as [number, number], z: 16.17, adjP: "< 0.001", direction: "enriched" as const, role: "Proactive mitigations already executed" },
    { code: "Theoretical Projection", obsPct: 7.3, nullMeanPct: 6.3, nullCi: [6.0, 6.5] as [number, number], z: 7.78, adjP: "< 0.001", direction: "enriched" as const, role: "Theoretical implications & hypotheses" },
    { code: "Method Details", obsPct: 7.4, nullMeanPct: 12.6, nullCi: [12.2, 12.9] as [number, number], z: -29.80, adjP: "< 0.001", direction: "depleted" as const, role: "Implementation & system specs" },
    { code: "Strong Reported Performance", obsPct: 4.5, nullMeanPct: 11.8, nullCi: [11.4, 12.1] as [number, number], z: -43.43, adjP: "< 0.001", direction: "depleted" as const, role: "Claims of high empirical results" },
    { code: "Method Strength", obsPct: 3.8, nullMeanPct: 4.7, nullCi: [4.5, 4.9] as [number, number], z: -8.63, adjP: "< 0.001", direction: "depleted" as const, role: "Algorithmic advantages" },
    { code: "Recommendations", obsPct: 3.5, nullMeanPct: 2.8, nullCi: [2.7, 3.0] as [number, number], z: 8.07, adjP: "< 0.001", direction: "enriched" as const, role: "Actionable advice for practitioners" },
    { code: "Anticipated Impact", obsPct: 3.0, nullMeanPct: 3.5, nullCi: [3.3, 3.7] as [number, number], z: -6.04, adjP: "< 0.001", direction: "depleted" as const, role: "Long-term societal footprint" },
    { code: "Authorial Disclaimers", obsPct: 2.4, nullMeanPct: 2.2, nullCi: [2.0, 2.3] as [number, number], z: 2.79, adjP: "0.003", direction: "enriched" as const, role: "Formal boundaries of liability" },
  ],

  // NL -> Lim: What non-limitation code precedes a limitation? (Table 4)
  transitionsBefore: [
    { code: "Strong Reported Performance", obsPct: 17.5, nullMeanPct: 11.8, nullCi: [11.4, 12.1] as [number, number], z: 34.10, adjP: "< 0.001", direction: "enriched" as const, role: "Performance premise before admitting boundaries" },
    { code: "Method Details", obsPct: 16.3, nullMeanPct: 12.6, nullCi: [12.2, 12.9] as [number, number], z: 21.35, adjP: "< 0.001", direction: "enriched" as const, role: "Methodological context framing the boundary" },
    { code: "Contextual Justification", obsPct: 17.3, nullMeanPct: 17.0, nullCi: [16.7, 17.4] as [number, number], z: 1.13, adjP: "0.280", direction: "enriched" as const, role: "Design constraints preceding limitation" },
    { code: "Method Strength", obsPct: 4.9, nullMeanPct: 4.7, nullCi: [4.5, 4.9] as [number, number], z: 1.26, adjP: "0.234", direction: "enriched" as const, role: "System strengths preceding weaknesses" },
    { code: "Future Work", obsPct: 27.9, nullMeanPct: 32.8, nullCi: [32.3, 33.3] as [number, number], z: -20.05, adjP: "< 0.001", direction: "depleted" as const, role: "Typically appears after rather than before" },
    { code: "Conducted Mitigation", obsPct: 5.8, nullMeanPct: 6.3, nullCi: [6.0, 6.5] as [number, number], z: -3.61, adjP: "0.002", direction: "depleted" as const, role: "Usually introduced after identifying the problem" },
    { code: "Theoretical Projection", obsPct: 4.8, nullMeanPct: 6.3, nullCi: [6.0, 6.5] as [number, number], z: -11.60, adjP: "< 0.001", direction: "depleted" as const, role: "Theoretical framing" },
    { code: "Anticipated Impact", obsPct: 2.1, nullMeanPct: 3.6, nullCi: [3.4, 3.7] as [number, number], z: -14.41, adjP: "< 0.001", direction: "depleted" as const, role: "Impact projection" },
    { code: "Recommendations", obsPct: 1.9, nullMeanPct: 2.8, nullCi: [2.7, 3.0] as [number, number], z: -10.72, adjP: "< 0.001", direction: "depleted" as const, role: "Recommendations" },
    { code: "Authorial Disclaimers", obsPct: 1.6, nullMeanPct: 2.2, nullCi: [2.0, 2.3] as [number, number], z: -8.35, adjP: "< 0.001", direction: "depleted" as const, role: "Disclaimers" },
  ],

  // Table 7: Limitations followed by Conducted Mitigation
  conductedMitigationPairings: [
    { code: "Data Leakage/Contamination", obsPct: 24.1, nullMeanPct: 12.1, nullCi: [6.6, 18.1] as [number, number], z: 4.07, adjP: "0.002" },
    { code: "Reproducibility Gap", obsPct: 23.5, nullMeanPct: 12.7, nullCi: [5.5, 21.0] as [number, number], z: 2.75, adjP: "0.012" },
    { code: "Subjectivity in Evaluation/Annotation", obsPct: 23.4, nullMeanPct: 11.0, nullCi: [7.9, 14.3] as [number, number], z: 7.46, adjP: "0.002" },
    { code: "Reliance on Automatic Metrics", obsPct: 20.8, nullMeanPct: 9.9, nullCi: [6.3, 13.8] as [number, number], z: 5.71, adjP: "0.002" },
    { code: "Prompt Sensitivity", obsPct: 20.0, nullMeanPct: 9.3, nullCi: [4.6, 14.5] as [number, number], z: 4.23, adjP: "0.003" },
    { code: "Privacy and Security Risks", obsPct: 20.0, nullMeanPct: 7.9, nullCi: [2.6, 14.1] as [number, number], z: 4.07, adjP: "0.003" },
    { code: "Toxicity Risks", obsPct: 19.3, nullMeanPct: 9.0, nullCi: [2.0, 17.8] as [number, number], z: 2.57, adjP: "0.024" },
  ],

  // Table 8: Share of transitions into limitation departing from Strong Reported Performance
  strongReportedPerformancePreceding: [
    { targetCode: "Empirical Underperformance", obsRate: 23.3, nullRate: 9.1, factor: 2.56, adjP: "< 0.001" },
    { targetCode: "Methodological Constraints", obsRate: 13.1, nullRate: 6.9, factor: 1.90, adjP: "< 0.001" },
    { targetCode: "Dependency on Upstream Quality", obsRate: 12.9, nullRate: 7.2, factor: 1.79, adjP: "< 0.001" },
    { targetCode: "High Time Consumption", obsRate: 12.4, nullRate: 7.4, factor: 1.68, adjP: "< 0.001" },
    { targetCode: "Model Reasoning and Generation Deficits", obsRate: 12.1, nullRate: 7.2, factor: 1.68, adjP: "< 0.001" },
  ],

  // Backwards-compatible alias for existing successors
  successors: [
    { code: "Future Work", obs: 40.2, nullVal: 32.8, diff: "+7.4%", adjP: "< 0.001", type: "defer" },
    { code: "Contextual Justification", obs: 19.7, nullVal: 17.0, diff: "+2.7%", adjP: "< 0.001", type: "justify" },
    { code: "Conducted Mitigation", obs: 8.2, nullVal: 6.3, diff: "+2.0%", adjP: "< 0.001", type: "resolve" },
  ],
};

