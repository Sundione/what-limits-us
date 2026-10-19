import { useState } from "preact/hooks";

interface DiagramNode {
  id: string;
  clusterId: string;
  name: string;
  color: "purple" | "orange" | "blue" | "gray";
}

interface ClusterNode {
  id: string;
  name: string;
  subtitle: string;
  color: "purple" | "orange" | "blue" | "gray";
  actionType: "EXPAND" | "ADD" | "MERGE" | "REJECT";
  actionTarget: string;
  actionDesc: string;
  detailExplanation: string;
}

const NEW_CODES: DiagramNode[] = [
  { id: "code-1", clusterId: "cluster-purple", name: "Noisy Crowd Labels", color: "purple" },
  { id: "code-2", clusterId: "cluster-orange", name: "Missed Recent Preprints", color: "orange" },
  { id: "code-3", clusterId: "cluster-gray", name: "Code Release Plan", color: "gray" },
  { id: "code-4", clusterId: "cluster-purple", name: "Annotation Disagreement", color: "purple" },
  { id: "code-5", clusterId: "cluster-blue", name: "Only Small Models Tested", color: "blue" },
  { id: "code-6", clusterId: "cluster-orange", name: "Literature Not Fully Reviewed", color: "orange" },
];

const CLUSTERS: ClusterNode[] = [
  {
    id: "cluster-purple",
    name: "Label noise and disagreement",
    subtitle: "2 proposals",
    color: "purple",
    actionType: "EXPAND",
    actionTarget: "Low Data Quality",
    actionDesc: "Widen its definition to cover this",
    detailExplanation:
      "Crowd annotation noise is closely tied to data quality. Rather than creating a redundant new code, researchers broaden the existing definition of 'Low Data Quality' to encompass annotator disagreement.",
  },
  {
    id: "cluster-orange",
    name: "Incomplete literature review",
    subtitle: "2 proposals",
    color: "orange",
    actionType: "ADD",
    actionTarget: "Literature Coverage Gap",
    actionDesc: "Nothing fits, and it recurs",
    detailExplanation:
      "Because the volume of NLP preprints is exploding, authors frequently report incomplete literature coverage. Since no existing code fits this recurring limitation, researchers add a new formal code.",
  },
  {
    id: "cluster-blue",
    name: "Only small models tested",
    subtitle: "1 proposal",
    color: "blue",
    actionType: "MERGE",
    actionTarget: "into Scope Limitation",
    actionDesc: "Already covered; no change needed",
    detailExplanation:
      "Testing only specific model sizes is an explicit study boundary. This proposal maps directly into the existing 'Scope Limitation' definition without modifying the codebook.",
  },
  {
    id: "cluster-gray",
    name: "Code release plan",
    subtitle: 'e.g. "We will release our code."',
    color: "gray",
    actionType: "REJECT",
    actionTarget: "drop the cluster",
    actionDesc: "Not a limitation or a related move",
    detailExplanation:
      "Statements promising future code releases are logistical statements, not research limitations. The consolidator flags these as non-limitation noise and drops them from the codebook.",
  },
];

export default function CodeConsolidationDiagram() {
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  const selectedCluster = CLUSTERS.find((c) => c.id === activeClusterId);

  return (
    <section class="methodology-section" id="consolidation-diagram">
      <div class="section-lead-header">
        <div class="section-tag-row">
          <span class="section-kpi-badge">Conceptual Overview</span>
          <span class="section-corpus-pill">Human-in-the-Loop Synthesis</span>
        </div>
        <h2 class="methodology-subheading">How New Codes are Discovered and Consolidated</h2>
        <p class="section-desc">
          When analyzing thousands of papers, the LLM encounters statements that don't match existing definitions and proposes <em>New Candidate Codes</em>. At the end of each iteration round, researchers cluster related proposals and assign <strong>4 decisive actions</strong>. Hover or click any item to see how proposals flow into the final codebook.
        </p>
      </div>

      {/* Main Diagram Canvas */}
      <div class="simpl-diagram-wrapper">
        <div class="simpl-diagram-grid">

          {/* Column 1: New code proposals (illustrative) */}
          <div class="simpl-col col-codes">
            <h4 class="simpl-col-header">New code proposals (illustrative)</h4>
            <div class="simpl-items-stack stack-codes">
              {NEW_CODES.map((code) => {
                const isHighlighted =
                  !activeClusterId || activeClusterId === code.clusterId;
                const isSelected = activeClusterId === code.clusterId;

                return (
                  <div
                    key={code.id}
                    class={`simpl-pill-card pill-${code.color} ${
                      isSelected ? "selected" : ""
                    } ${!isHighlighted ? "dimmed" : ""}`}
                    onMouseEnter={() => setActiveClusterId(code.clusterId)}
                    onMouseLeave={() => setActiveClusterId(null)}
                    onClick={() =>
                      setActiveClusterId(
                        activeClusterId === code.clusterId ? null : code.clusterId
                      )
                    }
                  >
                    <span class="pill-accent-bar"></span>
                    <span class="pill-name">{code.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transition 1: Consolidate Arrow */}
          <div class="simpl-transition-arrow">
            <span class="consolidate-label">Consolidate</span>
            <svg
              class="arrow-svg"
              width="36"
              height="24"
              viewBox="0 0 36 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="2" y1="12" x2="28" y2="12"></line>
              <polyline points="20 4 28 12 20 20"></polyline>
            </svg>
          </div>

          {/* Right Section: Clusters and Suggested Actions aligned row-by-row */}
          <div class="simpl-col col-clusters-actions">
            <div class="paired-headers-row">
              <h4 class="simpl-col-header header-clusters">Clusters</h4>
              <h4 class="simpl-col-header header-actions">Suggested action</h4>
            </div>

            <div class="paired-rows-stack">
              {CLUSTERS.map((cluster) => {
                const isHighlighted =
                  !activeClusterId || activeClusterId === cluster.id;
                const isSelected = activeClusterId === cluster.id;

                return (
                  <div key={cluster.id} class="cluster-action-pair-row">
                    {/* Cluster Card */}
                    <div
                      class={`simpl-cluster-card cluster-${cluster.color} ${
                        isSelected ? "selected" : ""
                      } ${!isHighlighted ? "dimmed" : ""}`}
                      onMouseEnter={() => setActiveClusterId(cluster.id)}
                      onMouseLeave={() => setActiveClusterId(null)}
                      onClick={() =>
                        setActiveClusterId(
                          activeClusterId === cluster.id ? null : cluster.id
                        )
                      }
                    >
                      <span class="cluster-accent-bar"></span>
                      <div class="cluster-text-wrap">
                        <span class="cluster-name">{cluster.name}</span>
                        <span class="cluster-subtitle">{cluster.subtitle}</span>
                      </div>
                    </div>

                    {/* Horizontal Flow Arrow */}
                    <div
                      class={`pair-flow-arrow arrow-${cluster.color} ${
                        !isHighlighted ? "dimmed" : ""
                      }`}
                    >
                      <svg
                        width="28"
                        height="16"
                        viewBox="0 0 28 16"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <line x1="2" y1="8" x2="22" y2="8"></line>
                        <polyline points="16 2 22 8 16 14"></polyline>
                      </svg>
                    </div>

                    {/* Suggested Action Card */}
                    <div
                      class={`simpl-action-card action-${cluster.color} ${
                        isSelected ? "selected" : ""
                      } ${!isHighlighted ? "dimmed" : ""}`}
                      onMouseEnter={() => setActiveClusterId(cluster.id)}
                      onMouseLeave={() => setActiveClusterId(null)}
                      onClick={() =>
                        setActiveClusterId(
                          activeClusterId === cluster.id ? null : cluster.id
                        )
                      }
                    >
                      <span class="action-accent-bar"></span>
                      <div class="action-text-wrap">
                        <div class="action-headline">
                          <strong class="action-verb">{cluster.actionType}</strong>{" "}
                          <span class="action-target">{cluster.actionTarget}</span>
                        </div>
                        <span class="action-explanation">{cluster.actionDesc}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Human Review Box positioned below the suggested actions */}
            <div class="human-review-callout-row">
              <div class="human-review-callout">
                <div class="human-review-inner">
                  <svg
                    class="human-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <div class="human-review-text">
                    <strong>Human review:</strong> researchers confirm or modify each suggested action
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Interactive Deep-Dive Drawer (Appears when hovered or clicked) */}
        {selectedCluster && (
          <div class="cluster-deepdive-banner">
            <div class="deepdive-badge">Action Rationale: {selectedCluster.actionType}</div>
            <p class="deepdive-content">
              <strong>{selectedCluster.name} &rarr; {selectedCluster.actionType} {selectedCluster.actionTarget}:</strong>{" "}
              {selectedCluster.detailExplanation}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
