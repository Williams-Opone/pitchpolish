export interface SectionScore {
  key: string;
  label: string;
  score: number; // 0–10
  weight: number; // percentage weight in overall score
  note: string;
}

export interface AnalysisResult {
  score: number; // 0–100
  band: string;
  sections: SectionScore[];
  redFlags: string[];
  summary: string;
  wordCount: number;
}

export interface ReportRow {
  id: number;
  deckName: string;
  fileName: string;
  score: number;
  band: string;
  slideCount: number;
  wordCount: number;
  sections: SectionScore[];
  redFlags: string[];
  summary: string;
  excerpt: string;
  isSample: boolean;
  owner: string | null;
  createdAt: Date;
}
