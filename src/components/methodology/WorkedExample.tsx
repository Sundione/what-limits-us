interface CodingScenario {
  id: string;
  stepNumber: number;
  caseTitle: string;
  modeBadge: string;
  badgeType: "deductive" | "inductive";
  paperId: string;
  paperTitle: string;
  rawSentence: string;
  focusSpan: string;
  preSpan: string;
  postSpan: string;
  codeName: string;
  theme: string;
  decisionType: string;
  reasoning: string;
  destinationNote: string;
  destinationTarget: "dataset" | "consolidation";
  connectorQuestion?: string;
}

const SCENARIOS: CodingScenario[] = [
  {
    id: "deductive",
    stepNumber: 1,
    caseTitle: "Deductive Coding (Top-Down Matching Against Codebook)",
    modeBadge: "Deductive Mode",
    badgeType: "deductive",
    // Real data: llm_coded_dataset/2024, existing_code_details["Scope Limitation"]
    paperId: "2024.acl-long.224",
    paperTitle: "MAVEN-ARG: Completing the Puzzle of All-in-One Event Understanding Dataset with Event Argument Annotation",
    rawSentence:
      "MAVEN-ARG currently includes only English corpus, which limits its potential applications and coverage for diverse linguistic phenomena.",
    preSpan: "MAVEN-ARG ",
    focusSpan: "currently includes only English corpus",
    postSpan: ", which limits its potential applications and coverage for diverse linguistic phenomena.",
    codeName: "Scope Limitation",
    theme: "Theme 2: Experimental Constraints & Scope",
    decisionType: "Direct Codebook Match (Cₜ₋₁)",
    reasoning:
      "The authors explicitly state a deliberate boundary regarding the languages included in the dataset.",
    destinationNote:
      "Direct to Annotated Dataset: Recorded with sentence-level character offsets and AI justification into the cumulative corpus.",
    destinationTarget: "dataset",
    connectorQuestion:
      "What happens when a limitation sentence does NOT match any category in the current codebook?",
  },
  {
    id: "inductive",
    stepNumber: 2,
    caseTitle: "Inductive Coding (Bottom-Up Candidate Discovery)",
    modeBadge: "Inductive Mode",
    badgeType: "inductive",
    // Real data: llm_coded_dataset/2024, new_code_details["Literature Coverage Gap"];
    // approved into codebook_after_2024 and used to code the 2025 papers.
    paperId: "2024.findings-emnlp.572",
    paperTitle: "A Survey on Detection of LLMs-Generated Content",
    rawSentence:
      "Despite conducting a comprehensive literature review on AI-generated content detection, we acknowledge the potential for omissions due to incomplete searches.",
    preSpan: "Despite conducting a comprehensive literature review on AI-generated content detection, ",
    focusSpan: "we acknowledge the potential for omissions due to incomplete searches.",
    postSpan: "",
    codeName: "Candidate: Literature Coverage Gap",
    theme: "Proposed in the 2024 round · approved into codebook C₃",
    decisionType: "Open Candidate Proposal",
    reasoning:
      "The authors admit a methodological flaw in their data collection/review process, where their search strategy may have missed relevant literature. We generate a new code to capture this specific review constraint.",
    destinationNote:
      "Sent to Code Consolidation Engine: Candidate proposals from across all papers in round t are pooled for clustering and human expert review.",
    destinationTarget: "consolidation",
  },
];

export default function WorkedExample() {
  return (
    <div class="coding-walkthrough-container">
      {SCENARIOS.map((scenario) => {
        // methodology.css styles these variants as "limitation" (existing code) / "candidate" (new code).
        const variant = scenario.badgeType === "deductive" ? "limitation" : "candidate";
        return (
        <div key={scenario.id} class="coding-scenario-block">
          {/* Main Scenario Flow Card */}
          <div class={`worked-scenario-card card-${variant}`}>
            {/* Header */}
            <div class="scenario-card-header">
              <div class="scenario-title-group">
                <div class="scenario-index-pill">
                  <span class="index-num">Pathway {scenario.stepNumber}</span>
                  <span class="index-divider">·</span>
                  <span class="index-badge">{scenario.modeBadge}</span>
                </div>
                <h3 class="scenario-headline">{scenario.caseTitle}</h3>
                <a
                  class="scenario-context-text"
                  href={`${import.meta.env.BASE_URL}explore?paper=${scenario.paperId}`}
                >
                  {scenario.paperTitle} ({scenario.paperId}) &rarr;
                </a>
              </div>
              <div class="scenario-header-right">
                <span class={`decision-pill pill-${variant}`}>
                  {scenario.decisionType}
                </span>
              </div>
            </div>

            {/* 3-Step Horizontal Row */}
            <div class="worked-steps-row">
              {/* Step 1: Raw Sentence */}
              <div class="worked-step-card step-input">
                <div class="step-num-badge">1</div>
                <div class="step-content">
                  <span class="step-label">Raw Limitations Sentence</span>
                  <p class="step-text-quote">
                    "{scenario.rawSentence}"
                  </p>
                </div>
              </div>

              {/* Connector Arrow */}
              <div class="worked-step-connector">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>

              {/* Step 2: Extracted Evidence Span */}
              <div class="worked-step-card step-highlight">
                <div class="step-num-badge">2</div>
                <div class="step-content">
                  <span class="step-label">Extracted Evidence Span</span>
                  <p class="step-highlight-preview">
                    {scenario.preSpan}
                    <mark class={`highlight-chip chip-${variant}`}>
                      {scenario.focusSpan}
                    </mark>
                    {scenario.postSpan}
                  </p>
                </div>
              </div>

              {/* Connector Arrow */}
              <div class="worked-step-connector">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>

              {/* Step 3: Assigned Code & Rationale */}
              <div class={`worked-step-card step-result result-${variant}`}>
                <div class="step-num-badge">3</div>
                <div class="step-content">
                  <span class="step-label">
                    {scenario.badgeType === "deductive" ? "Assigned Master Code" : "Proposed Candidate Code"}
                  </span>
                  <h4 class="assigned-code-heading">{scenario.codeName}</h4>
                  <span class="assigned-theme-tag">{scenario.theme}</span>
                  <p class="assigned-reasoning-body">
                    <strong>Model Rationale:</strong> {scenario.reasoning}
                  </p>
                </div>
              </div>
            </div>

            {/* Downstream Impact Footer */}
            <div class={`worked-impact-footer impact-${variant}`}>
              <div class="impact-indicator-icon">
                {scenario.destinationTarget === "dataset" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 16 12 12 8 16"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                    <polyline points="16 16 12 12 8 16"></polyline>
                  </svg>
                )}
              </div>
              <div class="impact-indicator-text">
                <strong>Pipeline Destination:</strong> {scenario.destinationNote}
              </div>
            </div>
          </div>

          {/* Narrative Storytelling Connector between Scenarios */}
          {scenario.connectorQuestion && (
            <div class="storytelling-connector">
              <div class="connector-line"></div>
              <div class="connector-bubble">
                <span class="connector-text">{scenario.connectorQuestion}</span>
                <svg class="connector-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>
              <div class="connector-line"></div>
            </div>
          )}
        </div>
        );
      })}

      {/* Downstream Transition Bridge into Code Consolidation */}
      <div class="walkthrough-to-consolidation-bridge">
        <div class="bridge-left">
          <span class="bridge-kpi-pill">Next Stage in Pipeline</span>
          <h4 class="bridge-heading">How Are All Proposed Candidate Codes Synthesized?</h4>
          <p class="bridge-sub">
            Across 16,000 papers, the LLM encounters statements like Case 2 and proposes candidate codes. Rather than admitting them immediately into the taxonomy, all candidate proposals are pooled at the end of iteration round <em>t</em> and sent to the <strong>Consolidation Engine</strong> below for semantic clustering and human review.
          </p>
        </div>
        <div class="bridge-right">
          <a href="#consolidation-diagram" class="bridge-cta-btn">
            <span>See Code Consolidation Below</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
