import Link from "next/link";

import { StatusBadge } from "@/components/job/StatusBadge";
import { formatTimestamp } from "@/lib/utils/format";
import type { RepositoryListItemResponse } from "@/types/api";
import type { AnalysisJobStatus } from "@/types/analysis";

type RecentRepositoriesProps = {
  repositories: RepositoryListItemResponse[];
  title?: string;
  showViewAll?: boolean;
};

function getPrimaryHref(
  repositoryId: string,
  status: AnalysisJobStatus | null,
): string {
  if (status === "completed") {
    return `/repositories/${repositoryId}/report`;
  }

  return `/repositories/${repositoryId}`;
}

export function RecentRepositories({
  repositories,
  title = "Recent analyses",
  showViewAll = false,
}: RecentRepositoriesProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            Pick up where you left off with a previous repository.
          </p>
        </div>
        {showViewAll ? (
          <Link href="/repositories" className="rp-link-accent text-sm font-medium">
            View all
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3">
        {repositories.map(({ repository, latestStatus, latestJob }) => (
          <Link
            key={repository.id}
            href={getPrimaryHref(repository.id, latestStatus)}
            className="flex flex-col gap-3 rounded-[10px] border border-border bg-surface-1 p-4 transition-colors hover:border-border-strong hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <p className="font-mono text-sm font-medium text-text-primary">
                {repository.fullName}
              </p>
              <p className="font-mono text-xs text-text-muted">
                {repository.lastAnalyzedAt
                  ? `Last analyzed ${formatTimestamp(repository.lastAnalyzedAt)}`
                  : "Analysis in progress or pending"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {latestStatus ? <StatusBadge status={latestStatus} /> : null}
              {latestJob &&
              (latestStatus === "queued" || latestStatus === "processing") ? (
                <span className="font-mono text-xs text-text-muted">
                  Job {latestJob.jobId.slice(0, 8)}…
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
