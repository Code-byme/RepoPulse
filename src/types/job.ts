import type { AnalysisJobStatus } from "@/types/analysis";

export type AnalysisJob = {
  id: string;
  repositoryId: string;
  status: AnalysisJobStatus;
  inngestRunId: string | null;
  errorMessage: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NewAnalysisJob = {
  repositoryId: string;
  status?: AnalysisJobStatus;
};
