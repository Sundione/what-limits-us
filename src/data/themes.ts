export interface ThemeDefinition {
  id: string;
  number: number;
  name: string;
  shortTitle: string;
  description: string;
  color: string;
  bgLight: string;
  bgHover: string;
  borderColor: string;
  codes: string[];
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "theme-1",
    number: 1,
    name: "Theme 1: Operating the models requires unsustainable resources",
    shortTitle: "Unsustainable Resources",
    description: "Refers to requirements for excessive processing power, hardware (GPUs/TPUs), latency, financial cost, human annotation, or environmental impact.",
    color: "#d97706",
    bgLight: "rgba(217, 119, 6, 0.12)",
    bgHover: "rgba(217, 119, 6, 0.24)",
    borderColor: "rgba(217, 119, 6, 0.4)",
    codes: [
      "Environmental Impact",
      "High Data Requirement",
      "High Financial Cost",
      "High Resource Requirements",
      "High Time Consumption",
      "Human Labor and Annotation Bottleneck",
      "Scalability Bottleneck",
    ],
  },
  {
    id: "theme-2",
    number: 2,
    name: "Theme 2: Performance breaks down outside narrow experimental constraints",
    shortTitle: "Experimental Constraints & Scope",
    description: "Clarifies scope boundaries, methodological limitations, failure to generalize across domains/languages, deployment barriers, or prompt sensitivity.",
    color: "#2563eb",
    bgLight: "rgba(37, 99, 235, 0.12)",
    bgHover: "rgba(37, 99, 235, 0.24)",
    borderColor: "rgba(37, 99, 235, 0.4)",
    codes: [
      "Empirical Underperformance",
      "Generalization Gap",
      "Hyperparameter Sensitivity",
      "Literature Coverage Gap",
      "Methodological Constraints",
      "Performance Trade-off",
      "Prompt Sensitivity",
      "Real-World Deployment Barrier",
      "Scope Limitation",
      "Temporal Degradation",
    ],
  },
  {
    id: "theme-3",
    number: 3,
    name: "Theme 3: Systems are bottlenecked by flawed data and external dependencies",
    shortTitle: "Flawed Data & Dependencies",
    description: "States that performance is bottlenecked by low data quality, scarcity, imbalance, upstream model artifacts, or reliance on external APIs/tools.",
    color: "#059669",
    bgLight: "rgba(5, 150, 105, 0.12)",
    bgHover: "rgba(5, 150, 105, 0.24)",
    borderColor: "rgba(5, 150, 105, 0.4)",
    codes: [
      "Data Scarcity",
      "Dataset Bias/Imbalance",
      "Dataset Task Mismatch",
      "Dependency on Upstream Quality",
      "Low Data Quality",
      "Reliance on External Tools or Resources",
      "Resource Accessibility Barriers",
      "Sparse Data Sensitivity",
    ],
  },
  {
    id: "theme-4",
    number: 4,
    name: "Theme 4: Scientific claims are difficult to measure and verify",
    shortTitle: "Measurement & Verification",
    description: "Evaluation vulnerabilities, benchmark saturation, reliance on flawed automatic metrics, annotator subjectivity, data leakage, or unverified theoretical claims.",
    color: "#7c3aed",
    bgLight: "rgba(124, 58, 237, 0.12)",
    bgHover: "rgba(124, 58, 237, 0.24)",
    borderColor: "rgba(124, 58, 237, 0.4)",
    codes: [
      "Data Leakage/Contamination",
      "Lack of Interpretability",
      "Lack of Reliable Evaluation Metrics or Benchmarks",
      "Measurement Vulnerabilities",
      "Reliance on Automatic Metrics",
      "Reproducibility Gap",
      "Subjectivity in Evaluation/Annotation",
      "Theoretical Gap",
    ],
  },
  {
    id: "theme-5",
    number: 5,
    name: "Theme 5: The models generate unpredictable and unsafe behaviors",
    shortTitle: "Unsafe Behaviors & Risks",
    description: "Behavioral and ethical risks including hallucination, reasoning breakdown, bias and stereotyping, toxicity, misuse potential, or privacy breaches.",
    color: "#e11d48",
    bgLight: "rgba(225, 29, 72, 0.12)",
    bgHover: "rgba(225, 29, 72, 0.24)",
    borderColor: "rgba(225, 29, 72, 0.4)",
    codes: [
      "Bias and Fairness Risks",
      "Model Hallucination/Incoherence",
      "Model Reasoning and Generation Deficits",
      "Potential for Misuse",
      "Privacy and Security Risks",
      "Societal and Ethical Risks",
      "Toxicity Risks",
    ],
  },
  {
    id: "non-limitation",
    number: 0,
    name: "Non-Limitation Codes (Context, Mitigations & Future Work)",
    shortTitle: "Non-Limitation (Discourse)",
    description: "Rhetorical moves that accompany limitation disclosures: future work, contextual defense, method strengths, mitigations, and performance claims.",
    color: "#64748b",
    bgLight: "rgba(100, 116, 139, 0.09)",
    bgHover: "rgba(100, 116, 139, 0.18)",
    borderColor: "rgba(100, 116, 139, 0.35)",
    codes: [
      "Non-Limitation: Anticipated Impact",
      "Non-Limitation: Authorial Disclaimers",
      "Non-Limitation: Conducted Mitigation",
      "Non-Limitation: Contextual Justification",
      "Non-Limitation: Future Work",
      "Non-Limitation: Method Details",
      "Non-Limitation: Method Strength",
      "Non-Limitation: Recommendations",
      "Non-Limitation: Strong Reported Performance",
      "Non-Limitation: Theoretical Projection",
    ],
  },
];

const CODE_TO_THEME_MAP = new Map<string, ThemeDefinition>();
for (const theme of THEMES) {
  for (const code of theme.codes) {
    CODE_TO_THEME_MAP.set(code, theme);
  }
}

export function getThemeByCode(code: string): ThemeDefinition {
  const found = CODE_TO_THEME_MAP.get(code);
  if (found) return found;
  // Fallback for codes starting with Non-Limitation
  if (code.startsWith("Non-Limitation:") || code.startsWith("NL:")) {
    return THEMES[5];
  }
  return THEMES[1]; // fallback to Theme 2 (Methodological/Scope)
}

export function getThemeById(id: string): ThemeDefinition | undefined {
  return THEMES.find((t) => t.id === id);
}
