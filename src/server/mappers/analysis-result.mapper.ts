import type { AnalysisResultRow } from "@/lib/db/schema";
import type { AnalysisReport } from "@/types/github-analysis";

export type StoredAnalysisResult = {
  id: string;
  jobId: string;
  repositoryId: string;
  summary: string;
  report: AnalysisReport;
  createdAt: Date;
};

export function toAnalysisResultInsert(
  jobId: string,
  repositoryId: string,
  report: AnalysisReport,
) {
  return {
    jobId,
    repositoryId,
    summary: report.summary_json.headline,
    metrics: report.metrics_json,
    insights: report.structure_json,
    rawData: report as unknown as Record<string, unknown>,
  };
}

export function toStoredAnalysisResult(
  row: AnalysisResultRow,
): StoredAnalysisResult {
  const report =
    row.rawData && isAnalysisReport(row.rawData)
      ? row.rawData
      : rebuildReportFromRow(row);

  return {
    id: row.id,
    jobId: row.jobId,
    repositoryId: row.repositoryId,
    summary: row.summary,
    report,
    createdAt: row.createdAt,
  };
}

function isAnalysisReport(value: Record<string, unknown>): value is AnalysisReport {
  return (
    "summary_json" in value &&
    "metrics_json" in value &&
    "languages_json" in value &&
    "structure_json" in value &&
    "todos_json" in value
  );
}

function rebuildReportFromRow(row: AnalysisResultRow): AnalysisReport {
  return {
    summary_json: {
      headline: row.summary,
      description: row.summary,
      repository: {
        fullName: "",
        url: "",
        defaultBranch: "",
        primaryLanguage: null,
        stars: 0,
        forks: 0,
      },
      architectureStyle: row.insights.architectureStyle,
      highlights: [],
    },
    metrics_json: row.metrics,
    languages_json: {
      byExtension: row.metrics.extensionCounts,
      byLanguage: [],
      primaryLanguage: null,
    },
    structure_json: row.insights,
    todos_json: {
      total: 0,
      todoCount: 0,
      fixmeCount: 0,
      items: [],
      scannedFileCount: 0,
    },
  };
}
