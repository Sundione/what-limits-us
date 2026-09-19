export type CodebookVersion =
  | "codebook_initial"
  | "codebook_after_2022"
  | "codebook_after_2023"
  | "codebook_after_2024";

export interface GlobalIndex {
  generatedAt: string;
  datasetRef: string;
  codes: string[];
  codeDefinitions: (string | null)[];
  papers: IndexEntry[];
}

export interface IndexEntry {
  id: string;
  title: string;
  year: number;
  venue: string;
  track: string;
  codes: number[];
  inLlmDataset: boolean;
  inHumanDataset: boolean;
}

export interface PaperDetail {
  id: string;
  title: string;
  abstract: string;
  year: number;
  venue: string;
  track: string;
  inLlmDataset: boolean;
  inHumanDataset: boolean;
  llm: LlmCoding | null;
  human: HumanCoding | null;
}

export interface Sentence {
  id: string;
  text: string;
}

export interface EvidenceSpan {
  sentenceId: string;
  start: number | null;
  end: number | null;
  highlightText: string;
  justification: string;
  exact: boolean;
}

export interface CodeAssignment {
  code: string;
  origin: "existing" | "new";
  evidence: EvidenceSpan[];
}

export interface LlmCoding {
  codebookVersion: CodebookVersion;
  limitation: string;
  sentences: Sentence[];
  codes: CodeAssignment[];
}

export interface HumanCoding {
  codebookVersion: "codebook_initial";
  limitation: string;
  sentences: Sentence[];
  codes: { code: string; origin: "existing" | "new" }[];
}

/** Raw shape of one row in llm_coded_dataset/*\/papers_*.json */
export interface RawLlmPaper {
  paper_id: string;
  title: string;
  abstract: string;
  limitation: string;
  segmented_text: Record<string, string>;
  existing_code: string[];
  new_code: string[];
  existing_code_details: RawCodeDetail[];
  new_code_details: RawCodeDetail[];
}

export interface RawCodeDetail {
  code_name: string;
  evidence: RawEvidence[];
}

export interface RawEvidence {
  segmented_id: string;
  segmented: string;
  highlight_start: number;
  highlight_end: number;
  highlight_text: string;
  justification: string;
}

/** Raw shape of one row in human_coded_dataset/human_code.csv after CSV parsing */
export interface RawHumanRow {
  paper_id: string;
  title: string;
  abstract: string;
  limitation: string;
  segmented_text: string;
  existing_code: string;
  new_code: string;
}
