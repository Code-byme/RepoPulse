export type AnalysisJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type ActivityLevel = "low" | "moderate" | "high";

export type MaintenanceStatus = "active" | "stale" | "archived";

export type LanguageStat = {
  name: string;
  bytes: number;
  percentage: number;
};

export type AnalysisMetrics = {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  primaryLanguage: string | null;
  languages: LanguageStat[];
  totalCommits: number | null;
  contributors: number | null;
  lastPushedAt: string | null;
  createdAt: string | null;
  sizeKb: number;
};

export type AnalysisInsights = {
  healthScore: number;
  activityLevel: ActivityLevel;
  maintenanceStatus: MaintenanceStatus;
  highlights: string[];
  concerns: string[];
};

export type AnalysisSummary = {
  headline: string;
  description: string;
};

export type AnalysisResultPayload = {
  summary: AnalysisSummary;
  metrics: AnalysisMetrics;
  insights: AnalysisInsights;
};
