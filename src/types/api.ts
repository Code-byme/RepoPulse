import type { AnalysisJobStatus } from "@/types/analysis";
import type { AnalysisReport } from "@/types/github-analysis";

export type SubmitAnalysisResponse = {
  jobId: string;
  repositoryId: string;
  status: AnalysisJobStatus;
};

export type AnalysisJobDetailResponse = {
  jobId: string;
  repositoryId: string;
  status: AnalysisJobStatus;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RepositoryResponse = {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  githubUrl: string;
  defaultBranch: string | null;
  lastAnalyzedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AnalysisJobSummaryResponse = {
  jobId: string;
  status: AnalysisJobStatus;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type AnalysisJobHistoryItem = {
  jobId: string;
  status: AnalysisJobStatus;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type AnalysisResultResponse = {
  resultId: string;
  jobId: string;
  summary: string;
  report: AnalysisReport;
  createdAt: string;
};

export type RepositoryDetailResponse = {
  repository: RepositoryResponse;
  latestJob: AnalysisJobSummaryResponse | null;
  latestStatus: AnalysisJobStatus | null;
};

export type RepositoryReportStatus = "complete" | "incomplete";

export type RepositoryReportResponse = {
  repository: RepositoryResponse;
  status: RepositoryReportStatus;
  report: AnalysisResultResponse | null;
  jobHistory: AnalysisJobHistoryItem[];
  message: string | null;
};

export type ApiErrorResponse = {
  error: string;
  details?: unknown;
};
