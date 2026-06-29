import Link from "next/link";

import { StatusBadge } from "@/components/job/StatusBadge";
import { TerminalCommandBar } from "@/components/ui/TerminalCommandBar";
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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <TerminalCommandBar repoFullName={repository.fullName} backHref={backHref} />
        {latestStatus ? (
          <div className="shrink-0 space-y-2 sm:pt-1">
            <p className="text-[13px] text-text-secondary">Latest job status</p>
            <StatusBadge status={latestStatus} />
          </div>
        ) : null}
      </div>
      <a
        href={repository.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-mono text-xs text-text-muted transition-colors hover:text-text-secondary"
      >
        {repository.githubUrl}
      </a>
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

function QuickSummarySignal({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  const isPositive = value;

  return (
    <div
      className={`rp-signal ${isPositive ? "rp-signal--positive" : "rp-signal--negative"}`}
    >
      <span className="rp-signal-label">
        <span
          className={
            isPositive ? "rp-signal-mark--positive" : "rp-signal-mark--negative"
          }
        >
          {isPositive ? "+" : "-"}
        </span>
        {label}
      </span>
      <span
        className={
          isPositive ? "rp-signal-value--positive" : "rp-signal-value--negative"
        }
      >
        {isPositive ? "Yes" : "No"}
      </span>
    </div>
  );
}

function QuickSummaryStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "blue" | "accent";
}) {
  const valueClass =
    tone === "blue"
      ? "rp-stat-value rp-stat-value--blue"
      : tone === "accent"
        ? "rp-stat-value rp-stat-value--accent"
        : "rp-stat-value";

  return (
    <div className="rp-stat">
      <p className="rp-stat-label">{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <QuickSummaryStat
        label="Primary language"
        value={summary_json.repository.primaryLanguage ?? "Unknown"}
        tone="blue"
      />
      <QuickSummaryStat
        label="Architecture"
        value={formatArchitectureStyle(summary_json.architectureStyle)}
      />
      <QuickSummaryStat label="Total files" value={metrics_json.totalFiles} />
      <QuickSummaryStat label="TODO items" value={todos_json.total} tone="accent" />
      <QuickSummarySignal
        label="Frontend signals"
        value={hasFrontendSignals(structure_json)}
      />
      <QuickSummarySignal
        label="Backend signals"
        value={hasBackendSignals(structure_json)}
      />
      <QuickSummarySignal
        label="Docker"
        value={
          structure_json.configs.dockerfile || structure_json.configs.dockerCompose
        }
      />
      <QuickSummarySignal
        label="CI workflows"
        value={structure_json.folders.githubWorkflows}
      />
    </div>
  );
}

export function RepositoryMetaFooter({
  repository,
}: {
  repository: RepositoryDetailResponse["repository"];
}) {
  return (
    <p className="font-mono text-sm text-text-muted">
      Last analyzed: {formatTimestamp(repository.lastAnalyzedAt)}
    </p>
  );
}
