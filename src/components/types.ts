export type RiskLevel = "danger" | "warning" | "safe";

export interface Sentence {
  id: string;
  text: string;
  risk: RiskLevel;
  why?: string;
  fix?: string;
}

export interface Article {
  id: number | string;
  title: string;
  sentences: Sentence[];
}