import { computeStructureMetrics } from "@/server/analysis/metrics";
import { aggregateLanguages } from "@/server/analysis/languages";
import { detectStructure } from "@/server/analysis/structure";
import {
  extractTodosFromFiles,
  summarizeTodos,
} from "@/server/analysis/todos";
import type {
  AnalysisReport,
  AnalysisReportInput,
  SummaryJson,
} from "@/types/github-analysis";

function buildHighlights(
  input: AnalysisReportInput,
  todoTotal: number,
): string[] {
  const highlights: string[] = [];
  const { metadata, tree } = input;
  const structure = detectStructure(tree);

  if (metadata.primaryLanguage) {
    highlights.push(`Primary language: ${metadata.primaryLanguage}`);
  }

  if (input.treeTruncated) {
    highlights.push("Repository tree was truncated — metrics may be partial");
  }

  if ((input.failedFileFetches ?? 0) > 0) {
    highlights.push(
      `${input.failedFileFetches} scannable files could not be fetched from GitHub`,
    );
  }

  if (structure.folders.githubWorkflows) {
    highlights.push("GitHub Actions workflows detected");
  }

  if (structure.configs.dockerfile || structure.configs.dockerCompose) {
    highlights.push("Container configuration present");
  }

  if (structure.configs.packageJson) {
    highlights.push("Node.js project (package.json found)");
  }

  if (todoTotal === 0) {
    highlights.push("No TODO/FIXME markers found in scanned files");
  }

  return highlights.slice(0, 5);
}

function buildSummary(
  input: AnalysisReportInput,
  todoTotal: number,
): SummaryJson {
  const structure = detectStructure(input.tree);

  return {
    headline: `${input.metadata.fullName} repository overview`,
    description:
      input.metadata.description ??
      `Automated structural analysis for ${input.metadata.fullName}.`,
    repository: {
      fullName: input.metadata.fullName,
      url: input.metadata.url,
      defaultBranch: input.metadata.defaultBranch,
      primaryLanguage: input.metadata.primaryLanguage,
      stars: input.metadata.stars,
      forks: input.metadata.forks,
    },
    architectureStyle: structure.architectureStyle,
    highlights: buildHighlights(input, todoTotal),
  };
}

export function buildAnalysisReport(input: AnalysisReportInput): AnalysisReport {
  const metrics = computeStructureMetrics(input.tree, input.treeTruncated ?? false);
  const structure = detectStructure(input.tree);
  const languages = aggregateLanguages(metrics, input.metadata.primaryLanguage);
  const todoItems = extractTodosFromFiles(input.fileContents);
  const todos = summarizeTodos(todoItems, input.fileContents.length);

  return {
    summary_json: buildSummary(input, todos.total),
    metrics_json: {
      ...metrics,
      repositorySizeKb: input.metadata.sizeKb,
      openIssues: input.metadata.openIssues,
    },
    languages_json: languages,
    structure_json: structure,
    todos_json: todos,
  };
}
