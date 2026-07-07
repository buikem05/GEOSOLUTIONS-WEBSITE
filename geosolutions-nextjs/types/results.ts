// types/results.ts — Academic result types

export interface Score {
  subject: string;
  score: number;
  grade: string;
  maxScore: number;
  remark?: string;
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  term: string;
  session: string;
  examType: string; // e.g. "JAMB", "WAEC", "Internal"
  scores: Score[];
  totalScore: number;
  average: number;
  position?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResultSummary {
  totalResults: number;
  latestSession: string;
  averageScore: number;
  passRate: number;
}
