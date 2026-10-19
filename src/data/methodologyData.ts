export interface PipelineStage {
  id: string;
  stageNumber: number;
  name: string;
  subtitle: string;
  model: string;
  temperature: string;
  input: string;
  output: string;
  mathNotation: string;
  summary: string;
  keyPoints: string[];
  promptSnippet: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-1",
    stageNumber: 1,
    name: "Corpus Collection & Segmentation",
    subtitle: "Docling PDF Extraction & Semantic Unit Parsing",
    model: "Gemini 2.5 Flash",
    temperature: "0.0",
    input: "Raw academic PDF papers from the ACL Anthology (2020–2025)",
    output: "Ordered sequence of semantic units ⟨s₁, s₂, …, sₙ⟩ with verbatim guarantee",
    mathNotation: "⟨s₁, …, sₙ⟩ = M_seg(L_p)  where  s₁ ⊕ … ⊕ sₙ = L_p",
    summary:
      "Limitations sections are extracted directly from published PDFs using Docling. Rather than relying on naive punctuation-based sentence tokenization, Gemini 2.5 Flash segments the text into semantically distinct analytical clauses under a strict verbatim constraint to ensure no word is omitted or altered.",
    keyPoints: [
      "Docling parsing isolates the dedicated Limitations section across 16,047 papers.",
      "Semantic units preserve complex compound clauses that standard sentence splitters break apart.",
      "Strict verbatim check: concatenation s₁ ⊕ … ⊕ sₙ must match source text character-by-character.",
      "Each unit receives a globally unique identifier: paper_id_s01, paper_id_s02, etc.",
    ],
    promptSnippet: `System Instruction:
Split the text below into semantically distinct chunks (sentences or meaningful clauses).
Output format: JSON list of strings.
CRITICAL: Preserve the original text EXACTLY (verbatim). Do not modify, omit, or summarize anything.`,
  },
  {
    id: "stage-2",
    stageNumber: 2,
    name: "Hybrid Thematic Coding",
    subtitle: "Deductive Classification & Inductive Discovery",
    model: "Gemini 3.1 Pro",
    temperature: "0.0",
    input: "Semantic units ⟨s₁…sₙ⟩, Active Codebook Cₜ₋₁, and Few-Shot Examples E",
    output: "Coded units I = {(c, s_i, span, justification)}, with predefined (c ∈ C) or emergent (c ∉ C) codes",
    mathNotation: "I = M_code(s₁, …, sₙ, Cₜ₋₁, E)",
    summary:
      "Each paper's section is analyzed sequentially with full section context. Gemini 3.1 Pro matches sentences against the active codebook (deductive), while freely proposing novel in-vivo codes when empirical phenomena depart from the taxonomy (inductive).",
    keyPoints: [
      "Parsimony Principle: Maximum 1 to 2 core codes per sentence to prevent label sprawl.",
      "Cross-Sentence Continuity: Consecutive sentences describing the same limitation without new analytical weight are not redundantly coded.",
      "Aggressive Noise Filter: Neutral background, section titles, or filler sentences output Code: None.",
      "Every assignment requires an exact verbatim character span and a structured reasoning justification.",
    ],
    promptSnippet: `System Instruction (v4.7):
You are an expert qualitative researcher in NLP literature performing Hybrid Thematic Analysis.
1. Read the ENTIRE section first to grasp overarching narrative context.
2. Deductive Coding: Match against the current codebook definitions.
3. Inductive Freedom: When no code fits, generate an In-Vivo New Code directly from authors' terminology.
4. Output format for each sentence: Focus quote, Reasoning, and Code name.`,
  },
  {
    id: "stage-3",
    stageNumber: 3,
    name: "New Code Handling",
    subtitle: "Consolidation & Recommendation Engine",
    model: "Gemini 3.1 Pro",
    temperature: "0.0",
    input: "Emergent candidate codes I⁺ from Stage 2 across batch runs",
    output: "Consolidated Master Codes M with action recommendations: {Add New, Merge, Expand, Reject}",
    mathNotation: "M = M_consolidate(I⁺),  action(m) = M_recommend(m, Cₜ₋₁)",
    summary:
      "Inductively proposed codes are collected at the end of each annotation wave. The LLM consolidator groups lexical variants and synonyms into fine-grained Master Codes, eliminates idiosyncratic noise, and proposes explicit actions relative to the existing codebook.",
    keyPoints: [
      "Semantic Consolidation: Unifies synonyms (e.g., 'Prompt Instability' + 'Sensitivity to Prompts' → 'Prompt Sensitivity').",
      "Granularity Safeguard: Keeps codes fine-grained at phenomenon level; avoids collapsing into broad umbrella themes.",
      "Outlier Filter: Hyper-specific one-off edge cases are categorized as Noise / Idiosyncratic Outliers.",
      "Automated Action Proposal: Classifies candidate into MERGE into existing, EXPAND existing definition, ADD NEW code, or REJECT.",
    ],
    promptSnippet: `System Instruction:
Perform Code Consolidation on emergent codes. Merge synonyms into unified Master Codes at specific code-level.
Do not over-generalize to high-level umbrella themes.
Evaluate evidence strength: merge weak edge cases into 'Noise / Idiosyncratic Outliers'.`,
  },
  {
    id: "stage-4",
    stageNumber: 4,
    name: "Human-in-the-Loop Review",
    subtitle: "Expert Adjudication & Iterative Codebook Evolution",
    model: "4 Expert NLP Researchers",
    temperature: "N/A (Human Consensus)",
    input: "Consolidated Master Codes M and proposed actions",
    output: "Updated Codebook Cₜ propagated into the next temporal wave",
    mathNotation: "Cₜ = Cₜ₋₁ ∪ {m ∈ M | HumanDecision(m) = ADD NEW}",
    summary:
      "All LLM-suggested taxonomy revisions undergo rigorous human review. Four expert NLP researchers meet to evaluate proposed additions, expansions, and merges through consensus deliberation, preventing drift and ensuring academic rigor.",
    keyPoints: [
      "4 temporal waves: 2020–2022 (Seed), 2023 (Wave 1), 2024 (Wave 2), 2025 (Wave 3).",
      "Additive Growth Guarantee: No code was ever deleted once introduced, maintaining backwards compatibility.",
      "Human validation committed 22 new codes after 2020–2022, 0 after 2023, 1 in 2024, and 2 in 2025.",
      "Codebook stabilized at exactly 50 codes (40 Limitations across 5 themes + 10 Non-Limitation discursive codes).",
    ],
    promptSnippet: `Human Adjudication Protocol:
1. Two independent researchers review candidate code definitions and supporting paper excerpts.
2. Disagreements are reconciled in consensus meetings (not majority vote).
3. Final commitments update the codebook CSV for the subsequent processing round.`,
  },
  {
    id: "stage-5",
    stageNumber: 5,
    name: "Final Annotated Corpus",
    subtitle: "Sentence-Level Evidence Spans & Justifications",
    model: "Pipeline Integration",
    temperature: "Deterministic",
    input: "Full corpus papers + validated taxonomy C_final",
    output: "16,047 papers, 84,930 code assignments, 131,166 traceable evidence spans",
    mathNotation: "D_final = { (p, L_p, [ (c, span, justification) ]) }",
    summary:
      "The final dataset is structured paper-first. Every single code applied to any paper is permanently bound to the specific sentence ID, character-level highlight offsets, and the LLM's natural language justification.",
    keyPoints: [
      "100% inspectable: Every analytical claim in the study can be traced back to exact sentence quotes.",
      "Dual-layer taxonomy: 40 Substantive Limitations + 10 Non-Limitation rhetorical moves.",
      "Full metadata enrichment: Venue, year, research area track, paper format, corporate affiliation.",
      "Freely available via the interactive Explore interface and public GitHub repository.",
    ],
    promptSnippet: `Record Schema:
{
  "paper_id": "2020.acl-main.189",
  "title": "Active Imitation Learning with Noisy Guidance",
  "existing_code": ["Methodological Constraints", ...],
  "existing_code_details": [
    { "code_name": "Methodological Constraints", "evidence": [{ "segmented_id": "...", "highlight_text": "...", "justification": "..." }] }
  ]
}`,
  },
];

export interface WorkedExampleSentence {
  sentenceId: string;
  sentenceIndex: number;
  text: string;
  assignedCodes: {
    codeName: string;
    isLimitation: boolean;
    isNewCode?: boolean;
    theme: string;
    focusQuote: string;
    highlightRange: [number, number]; // offsets within limitation text
    justification: string;
  }[];
}

export interface WorkedExamplePaper {
  paperId: string;
  title: string;
  venue: string;
  year: number;
  authors: string;
  abstract: string;
  limitationText: string;
  sentences: WorkedExampleSentence[];
}

export const WORKED_EXAMPLE: WorkedExamplePaper = {
  paperId: "2020.acl-main.189",
  title: "Active Imitation Learning with Noisy Guidance",
  venue: "ACL Main 2020",
  year: 2020,
  authors: "Kiante Brantley, Amr Sharaf, Hal Daumé III",
  abstract:
    "Imitation learning algorithms provide strong theoretical guarantees for sequential decision making tasks. However, in practice, human expert demonstrations often contain label noise, severely degrading policy performance...",
  limitationText:
    "While our approach demonstrates strong empirical sample efficiency on simulated benchmark environments, several limitations remain. 1. In some settings, learning a difference classifier may be as hard or harder than learning the structured predictor; for instance if the task is binary sequence labeling (e.g., word segmentation), minimizing its usefulness. 2. We only evaluate on synthetic demonstrations with artificial label noise, and have not yet tested on real-world human demonstration trajectories. In future work, we plan to validate our method on interactive robotic arm tasks.",
  sentences: [
    {
      sentenceId: "2020.acl-main.189_s01",
      sentenceIndex: 1,
      text: "While our approach demonstrates strong empirical sample efficiency on simulated benchmark environments, several limitations remain.",
      assignedCodes: [
        {
          codeName: "Non-Limitation: Strong Reported Performance",
          isLimitation: false,
          theme: "Non-Limitation Rhetoric",
          focusQuote: "demonstrates strong empirical sample efficiency on simulated benchmark environments",
          highlightRange: [19, 90],
          justification:
            "The authors emphasize their method's empirical strengths and high sample efficiency before introducing negative boundaries.",
        },
      ],
    },
    {
      sentenceId: "2020.acl-main.189_s02",
      sentenceIndex: 2,
      text: "1. In some settings, learning a difference classifier may be as hard or harder than learning the structured predictor; for instance if the task is binary sequence labeling (e.g., word segmentation), minimizing its usefulness.",
      assignedCodes: [
        {
          codeName: "Methodological Constraints",
          isLimitation: true,
          theme: "Methodological & Algorithmic",
          focusQuote: "learning a difference classifier may be as hard or harder than learning the structured predictor; for instance if the task is binary sequence labeling",
          highlightRange: [142, 292],
          justification:
            "The authors identify a structural vulnerability in their own methodology: the difference classifier component can become too difficult to learn under specific task formulations, undermining algorithm utility.",
        },
      ],
    },
    {
      sentenceId: "2020.acl-main.189_s03",
      sentenceIndex: 3,
      text: "2. We only evaluate on synthetic demonstrations with artificial label noise, and have not yet tested on real-world human demonstration trajectories.",
      assignedCodes: [
        {
          codeName: "Task-Specific Difficulty",
          isLimitation: true,
          isNewCode: true,
          theme: "Candidate Code (Inductive)",
          focusQuote: "only evaluate on synthetic demonstrations with artificial label noise, and have not yet tested on real-world human demonstration trajectories",
          highlightRange: [329, 471],
          justification:
            "[INDUCTIVE] The codebook lacks a specific category for environments restricted to artificial/synthetic data vs real-world trajectories. Proposing 'Task-Specific Difficulty' as a new candidate code.",
        },
      ],
    },
    {
      sentenceId: "2020.acl-main.189_s04",
      sentenceIndex: 4,
      text: "In future work, we plan to validate our method on interactive robotic arm tasks.",
      assignedCodes: [
        {
          codeName: "Non-Limitation: Future Work",
          isLimitation: false,
          theme: "Non-Limitation Rhetoric",
          focusQuote: "In future work, we plan to validate our method on interactive robotic arm tasks",
          highlightRange: [473, 552],
          justification:
            "The authors outline planned subsequent experiments and physical embodiment testbeds, deferring unresolved questions.",
        },
      ],
    },
  ],
};

/**
 * Per-code Krippendorff's alpha on the 150 annotated papers, transcribed from
 * the paper's Appendix A, Table 7 (ordered by Model vs. Adjudicated alpha).
 * - annotatorAlpha: among the human annotators' independent, pre-consensus labels.
 * - modelAlpha: between the LLM and the adjudicated (consensus) labels.
 * The two use different references and are not directly comparable.
 * support: papers in which the model, the adjudicated labels, or both assign the
 * code (pertains to modelAlpha). null = too few instances for alpha to be defined.
 */
export interface PerCodeAgreementRow {
  code: string;
  type: "Limitation" | "Non-Limitation";
  support: number;
  annotatorAlpha: number | null;
  modelAlpha: number | null;
}

export const PER_CODE_AGREEMENT_DATA: PerCodeAgreementRow[] = [
  { code: "Model Hallucination/Incoherence", type: "Limitation", support: 6, annotatorAlpha: 0.743, modelAlpha: 1.000 },
  { code: "High Time Consumption", type: "Limitation", support: 16, annotatorAlpha: 0.640, modelAlpha: 0.926 },
  { code: "High Resource Requirements", type: "Limitation", support: 24, annotatorAlpha: 0.817, modelAlpha: 0.922 },
  { code: "Non-Limitation: Future Work", type: "Non-Limitation", support: 112, annotatorAlpha: 0.822, modelAlpha: 0.868 },
  { code: "Subjectivity in Evaluation/Annotation", type: "Limitation", support: 11, annotatorAlpha: 0.247, modelAlpha: 0.832 },
  { code: "Potential for Misuse", type: "Limitation", support: 3, annotatorAlpha: 0.797, modelAlpha: 0.797 },
  { code: "Non-Limitation: Strong Reported Performance", type: "Non-Limitation", support: 43, annotatorAlpha: 0.512, modelAlpha: 0.765 },
  { code: "Scope Limitation", type: "Limitation", support: 94, annotatorAlpha: 0.637, modelAlpha: 0.717 },
  { code: "Non-Limitation: Conducted Mitigation", type: "Non-Limitation", support: 16, annotatorAlpha: 0.423, modelAlpha: 0.696 },
  { code: "Lack of Evaluation Metrics or Benchmarks", type: "Limitation", support: 6, annotatorAlpha: 0.885, modelAlpha: 0.658 },
  { code: "Data Scarcity", type: "Limitation", support: 16, annotatorAlpha: 0.434, modelAlpha: 0.639 },
  { code: "Dataset Bias/Imbalance", type: "Limitation", support: 20, annotatorAlpha: 0.479, modelAlpha: 0.631 },
  { code: "Non-Limitation: Contextual Justification", type: "Non-Limitation", support: 60, annotatorAlpha: 0.497, modelAlpha: 0.616 },
  { code: "Reliance on External Tools or Resources", type: "Limitation", support: 9, annotatorAlpha: 0.427, modelAlpha: 0.599 },
  { code: "High Financial Cost", type: "Limitation", support: 7, annotatorAlpha: 0.321, modelAlpha: 0.588 },
  { code: "Non-Limitation: Method Details", type: "Non-Limitation", support: 47, annotatorAlpha: 0.415, modelAlpha: 0.531 },
  { code: "Non-Limitation: Method Strength", type: "Non-Limitation", support: 29, annotatorAlpha: 0.455, modelAlpha: 0.521 },
  { code: "Non-Limitation: Anticipated Impact", type: "Non-Limitation", support: 11, annotatorAlpha: 0.656, modelAlpha: 0.510 },
  { code: "Dependency on Upstream Quality", type: "Limitation", support: 19, annotatorAlpha: 0.763, modelAlpha: 0.496 },
  { code: "Methodological Constraints", type: "Limitation", support: 81, annotatorAlpha: 0.341, modelAlpha: 0.494 },
  { code: "Low Data Quality", type: "Limitation", support: 10, annotatorAlpha: 0.407, modelAlpha: 0.439 },
  { code: "Performance Trade-off", type: "Limitation", support: 5, annotatorAlpha: 0.230, modelAlpha: 0.322 },
  { code: "Reliance on Automatic Metrics", type: "Limitation", support: 3, annotatorAlpha: null, modelAlpha: -0.007 },
  { code: "Lack of Interpretability", type: "Limitation", support: 2, annotatorAlpha: null, modelAlpha: null },
  { code: "Data Leakage/Contamination", type: "Limitation", support: 1, annotatorAlpha: null, modelAlpha: null },
];

export interface CodebookEvolutionRow {
  period: string;
  years: string;
  detectedUnique: number;
  clustersFormed: number;
  mergeCount: number;
  expandCount: number;
  addNewCount: number;
  rejectCount: number;
  newCodesAdded: number;
  codebookSize: number;
  addedCodeList: string[];
}

export const CODEBOOK_EVOLUTION_SUMMARY: CodebookEvolutionRow[] = [
  {
    period: "Seed / Initial",
    years: "2020–2022",
    detectedUnique: 104,
    clustersFormed: 105,
    mergeCount: 75,
    expandCount: 6,
    addNewCount: 22,
    rejectCount: 2,
    newCodesAdded: 22,
    codebookSize: 47,
    addedCodeList: [
      "Bias and Fairness Risks",
      "Toxicity Risks",
      "Empirical Underperformance",
      "High Data Requirement",
      "Environmental Impact",
      "Societal and Ethical Risks",
      "Measurement Vulnerabilities",
      "Generalization Gap",
      "Scalability Bottleneck",
      "Human Labor and Annotation Bottleneck",
      "Model Reasoning and Generation Deficits",
      "Non-Limitation: Recommendations",
      "Non-Limitation: Theoretical Projection",
      "Non-Limitation: Authorial Disclaimers",
      "Privacy and Security Risks",
      "Real-World Deployment Barrier",
      "Resource Accessibility Barriers",
      "Reproducibility Gap",
      "Hyperparameter Sensitivity",
      "Prompt Sensitivity",
      "Temporal Degradation",
      "Theoretical Gap",
    ],
  },
  {
    period: "Wave 1",
    years: "2023",
    detectedUnique: 206,
    clustersFormed: 104,
    mergeCount: 95,
    expandCount: 9,
    addNewCount: 0,
    rejectCount: 0,
    newCodesAdded: 0,
    codebookSize: 47,
    addedCodeList: [],
  },
  {
    period: "Wave 2",
    years: "2024",
    detectedUnique: 200,
    clustersFormed: 143,
    mergeCount: 138,
    expandCount: 4,
    addNewCount: 1,
    rejectCount: 0,
    newCodesAdded: 1,
    codebookSize: 48,
    addedCodeList: ["Literature Coverage Gap"],
  },
  {
    period: "Wave 3 (Final)",
    years: "2025",
    detectedUnique: 228,
    clustersFormed: 74,
    mergeCount: 64,
    expandCount: 8,
    addNewCount: 2,
    rejectCount: 0,
    newCodesAdded: 2,
    codebookSize: 50,
    addedCodeList: ["Sparse Data Sensitivity", "Dataset Task Mismatch"],
  },
];
