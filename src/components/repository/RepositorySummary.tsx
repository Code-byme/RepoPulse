import Link from "next/link";

import { StatusBadge } from "@/components/job/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { RepositoryDetailResponse, RepositoryReportResponse } from "@/types/api";
import type { StructureDetection } from "@/types/github-analysis";
import { formatArchitectureStyle, formatTimestamp } from "@/lib/utils/format";

type RepositoryHeaderProps = {
  repository: RepositoryDetailResponse["repository"];
  latestStatus: RepositoryDetailResponse["latestStatus"];
  backHref?: string;
};

export function RepositoryHeader({
  repository,
  latestStatus,
  backHref = "/",
}: RepositoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <Link
          href={backHref}
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Back
        </Link>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Repository
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {repository.fullName}
          </h1>
        </div>
        <a
          href={repository.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          {repository.githubUrl}
        </a>
      </div>
      {latestStatus ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Latest job status</p>
          <StatusBadge status={latestStatus} />
        </div>
      ) : null}
    </div>
  );
}

type RepositoryQuickSummaryProps = {
  reportData: RepositoryReportResponse;
};

function hasFrontendSignals(structure: StructureDetection): boolean {
  return structure.folders.app || structure.folders.pages || structure.folders.components;
}

function hasBackendSignals(structure: StructureDetection): boolean {
  return structure.folders.api || structure.folders.services || structure.folders.db;
}

export function RepositoryQuickSummary({ reportData }: RepositoryQuickSummaryProps) {
  if (reportData.status !== "complete" || !reportData.report) {
    return (
      <EmptyState
        title="No completed analysis yet"
        description={
          reportData.message ?? "No completed analysis available yet."
        }
      />
    );
  }

  const { report } = reportData.report;
  const { summary_json, metrics_json, todos_json, structure_json } = report;

  const cards = [
    { label: "Primary language", value: summary_json.repository.primaryLanguage ?? "Unknown" },
    {
      label: "Architecture",
      value: formatArchitectureStyle(summary_json.architectureStyle),
    },
    { label: "Total files", value: metrics_json.totalFiles },
    { label: "TODO items", value: todos_json.total },
    { label: "Frontend signals", value: hasFrontendSignals(structure_json) ? "Yes" : "No" },
    { label: "Backend signals", value: hasBackendSignals(structure_json) ? "Yes" : "No" },
    {
      label: "Docker",
      value:
        structure_json.configs.dockerfile || structure_json.configs.dockerCompose
          ? "Yes"
          : "No",
    },
    {
      label: "CI workflows",
      value: structure_json.folders.githubWorkflows ? "Yes" : "No",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.label}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function RepositoryMetaFooter({
  repository,
}: {
  repository: RepositoryDetailResponse["repository"];
}) {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Last analyzed: {formatTimestamp(repository.lastAnalyzedAt)}
    </p>
  );
}
