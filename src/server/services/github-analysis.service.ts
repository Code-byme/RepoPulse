import { createGithubClient } from "@/lib/github/client";
import {
  loadRepositoryAnalysisData,
  toAnalysisReportInput,
} from "@/lib/github/data-loader";
import { buildAnalysisReport } from "@/server/analysis/report";
import type { AnalysisReport } from "@/types/github-analysis";

export type ExecuteGithubAnalysisOptions = {
  maxTodoFiles?: number;
};

export type GithubAnalysisResult = {
  report: AnalysisReport;
  defaultBranch: string;
};

export async function executeGithubAnalysis(
  githubUrl: string,
  options: ExecuteGithubAnalysisOptions = {},
): Promise<GithubAnalysisResult> {
  const client = createGithubClient();
  const data = await loadRepositoryAnalysisData(client, githubUrl, {
    maxTodoFiles: options.maxTodoFiles,
  });

  return {
    report: buildAnalysisReport(toAnalysisReportInput(data)),
    defaultBranch: data.metadata.defaultBranch,
  };
}
