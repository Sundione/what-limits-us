export interface ThemeDefinition {
  id: string;
  number: number;
  name: string;
  shortTitle: string;
  description: string;
  color: string;
  /** Text-safe variant of `color` for labels (contrast-checked in both modes). */
  text: string;
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
    color: "var(--theme-1)",
    text: "var(--theme-1-text)",
    bgLight: "color-mix(in srgb, var(--theme-1) 12%, transparent)",
    bgHover: "color-mix(in srgb, var(--theme-1) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--theme-1) 40%, transparent)",
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
    color: "var(--theme-2)",
    text: "var(--theme-2-text)",
    bgLight: "color-mix(in srgb, var(--theme-2) 12%, transparent)",
    bgHover: "color-mix(in srgb, var(--theme-2) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--theme-2) 40%, transparent)",
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
    color: "var(--theme-3)",
    text: "var(--theme-3-text)",
    bgLight: "color-mix(in srgb, var(--theme-3) 12%, transparent)",
    bgHover: "color-mix(in srgb, var(--theme-3) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--theme-3) 40%, transparent)",
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
    color: "var(--theme-4)",
    text: "var(--theme-4-text)",
    bgLight: "color-mix(in srgb, var(--theme-4) 12%, transparent)",
    bgHover: "color-mix(in srgb, var(--theme-4) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--theme-4) 40%, transparent)",
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
    color: "var(--theme-5)",
    text: "var(--theme-5-text)",
    bgLight: "color-mix(in srgb, var(--theme-5) 12%, transparent)",
    bgHover: "color-mix(in srgb, var(--theme-5) 24%, transparent)",
    borderColor: "color-mix(in srgb, var(--theme-5) 40%, transparent)",
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
    description: "Statements that accompany limitations without being limitations themselves: future work, context and justification, method details and strengths, mitigations, and reported results.",
    color: "var(--theme-nl)",
    text: "var(--theme-nl-text)",
    bgLight: "color-mix(in srgb, var(--theme-nl) 9%, transparent)",
    bgHover: "color-mix(in srgb, var(--theme-nl) 18%, transparent)",
    borderColor: "color-mix(in srgb, var(--theme-nl) 35%, transparent)",
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
