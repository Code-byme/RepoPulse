import { StatusBadge } from "@/components/job/StatusBadge";
import type { AnalysisJobHistoryItem } from "@/types/api";
import { formatTimestamp } from "@/lib/utils/format";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";

type ReportHistorySectionProps = {
  jobHistory: AnalysisJobHistoryItem[];
};

export function ReportHistorySection({ jobHistory }: ReportHistorySectionProps) {
  return (
    <SectionCard
      title="Analysis history"
      description="Past analysis jobs for this repository."
    >
      {jobHistory.length > 0 ? (
        <div className="rp-table-wrap">
          <table className="rp-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Created</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Job ID</th>
              </tr>
            </thead>
            <tbody>
              {jobHistory.map((job) => (
                <tr key={job.jobId}>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="font-mono text-xs">
                    {formatTimestamp(job.createdAt)}
                  </td>
                  <td className="font-mono text-xs">
                    {formatTimestamp(job.startedAt)}
                  </td>
                  <td className="font-mono text-xs">
                    {formatTimestamp(job.completedAt)}
                  </td>
                  <td className="rp-mono">{job.jobId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No analysis history"
          description="This repository has not been analyzed yet."
        />
      )}
    </SectionCard>
  );
}
