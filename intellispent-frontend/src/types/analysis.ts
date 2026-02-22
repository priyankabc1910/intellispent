export interface AnalysisRequest {
  income: number;
  expenses: Record<string, number>;
}

export interface AnalysisResult {
  total_expense: number;
  savings: number;
  savings_ratio: number;
  profile: string;
  risk_score: number;
}
