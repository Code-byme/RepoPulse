import Link from "next/link";

import { StatusBadge } from "@/components/job/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTimestamp } from "@/lib/utils/format";
import type { RepositoryListItemResponse } from "@/types/api";
import type { AnalysisJobStatus } from "@/types/analysis";

type RepositoryListProps = {
  repositories: RepositoryListItemResponse[];
};

function getReportHref(
  repositoryId: string,
  status: AnalysisJobStatus | null,
): string {
  if (status === "completed") {
    return `/repositories/${repositoryId}/report`;
  }

  return `/repositories/${repositoryId}`;
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  if (repositories.length === 0) {
    return (
      <EmptyState
        title="No analyses yet"
        description="Submit your first public GitHub repository to start building your analysis history."
        action={
          <Link href="/#analyze" className="rp-btn-primary">
            Analyze a repository
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-surface-1">
      <div className="rp-table-wrap">
        <table className="rp-table px-4">
          <thead>
            <tr>
              <th className="pl-4">Repository</th>
              <th>Status</th>
              <th>Last analyzed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {repositories.map(({ repository, latestStatus, latestJob }) => (
              <tr key={repository.id}>
                <td className="pl-4">
                  <div className="space-y-1">
                    <Link
                      href={getReportHref(repository.id, latestStatus)}
                      className="font-mono text-sm font-medium text-text-primary hover:text-accent"
                    >
                      {repository.fullName}
                    </Link>
                    <p className="font-mono text-xs text-text-muted">
                      {repository.githubUrl}
                    </p>
                  </div>
                </td>
                <td>
                  {latestStatus ? (
                    <StatusBadge status={latestStatus} />
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="font-mono text-xs">
                  {repository.lastAnalyzedAt
                    ? formatTimestamp(repository.lastAnalyzedAt)
                    : "Not yet analyzed"}
                </td>
                <td>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                      href={`/repositories/${repository.id}`}
                      className="rp-link-accent"
                    >
                      Summary
                    </Link>
                    {latestStatus === "completed" ? (
                      <Link
                        href={`/repositories/${repository.id}/report`}
                        className="rp-link-accent"
                      >
                        Report
                      </Link>
                    ) : latestJob &&
                      (latestStatus === "queued" || latestStatus === "processing") ? (
                      <Link
                        href={`/jobs/${latestJob.jobId}`}
                        className="rp-link-accent"
                      >
                        Track job
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
