export type AnalyzeRepositoryEventData = {
  jobId: string;
  repositoryId: string;
};

export const ANALYZE_REPOSITORY_EVENT = "repo/analyze.requested" as const;

export type AnalyzeRepositoryEvent = {
  name: typeof ANALYZE_REPOSITORY_EVENT;
  data: AnalyzeRepositoryEventData;
};
