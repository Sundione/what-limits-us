export interface Author {
  name: string;
  affiliation: "chula" | "google";
  corresponding?: boolean;
}

export const authors: Author[] = [
  { name: "Tawan Thaepprasit", affiliation: "chula" },
  { name: "Peeranuth Kehasukcharoen", affiliation: "chula" },
  { name: "Ding Wang", affiliation: "google" },
  { name: "Remi Denton", affiliation: "google" },
  { name: "Peerapon Vateekul", affiliation: "chula", corresponding: true },
  { name: "Piyawat Lertvittayakumjorn", affiliation: "google" },
];

export const affiliations: Record<Author["affiliation"], string> = {
  chula: "Department of Computer Engineering, Faculty of Engineering, Chulalongkorn University, Thailand",
  google: "Google Research",
};

export const paper = {
  title: "What Limits Us? Analyzing Self-Reported Limitations in NLP Research",
  venue: "EMNLP 2026 Findings",
  abstract:
    "Since late 2022, a Limitations section has become mandatory at many top-tier NLP " +
    "conferences. The growing number of accepted papers at these venues has resulted in a " +
    "vast corpus of self-reported limitations that cannot all be manually reviewed, yet " +
    "remains systematically unanalyzed. Therefore, in this paper, we conduct a large-scale " +
    "analysis of the Limitations sections from ACL and EMNLP papers published between 2020 " +
    "and 2025 to understand what researchers disclose about their own work. To do so, we " +
    "implement a novel human-AI framework for iterative hybrid qualitative coding. This " +
    "framework enables us to investigate trends in self-reported limitations over time, " +
    "their correlations with specific paper attributes, and the writing patterns that " +
    "recur around these disclosures. Our findings offer a critical reflection on the " +
    "diverse reported challenges as well as the self-reporting practices of researchers in " +
    "the NLP community.",
  links: {
    arxiv: "https://arxiv.org/abs/2609.15191",
    // ACL Anthology page not yet live (paper pending Findings of EMNLP 2026 publication) - fill in once published.
    aclAnthology: null as string | null,
    datasetGithub: "https://github.com/Sundione/nlp-self-reported-limitations",
    // Not verified anywhere in the dataset repo or paper - do not invent a URL.
    datasetHuggingFace: null as string | null,
  },
  bibtex: `@misc{thaepprasit2026what,
      title         = {What Limits Us? Analyzing Self-Reported Limitations in NLP Research},
      author        = {Tawan Thaepprasit and Peeranuth Kehasukcharoen and Ding Wang and Remi Denton and Peerapon Vateekul and Piyawat Lertvittayakumjorn},
      year          = {2026},
      eprint        = {2609.15191},
      archivePrefix = {arXiv},
      primaryClass  = {cs.CL},
      url           = {https://arxiv.org/abs/2609.15191},
      note          = {Accepted to Findings of EMNLP 2026}
}`,
};
