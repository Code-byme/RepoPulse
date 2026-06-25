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
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 pr-4 font-medium text-zinc-500">Status</th>
                <th className="py-2 pr-4 font-medium text-zinc-500">Created</th>
                <th className="py-2 pr-4 font-medium text-zinc-500">Started</th>
                <th className="py-2 pr-4 font-medium text-zinc-500">Finished</th>
                <th className="py-2 font-medium text-zinc-500">Job ID</th>
              </tr>
            </thead>
            <tbody>
              {jobHistory.map((job) => (
                <tr
                  key={job.jobId}
                  className="border-b border-zinc-100 dark:border-zinc-900"
                >
                  <td className="py-3 pr-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="py-3 pr-4">{formatTimestamp(job.createdAt)}</td>
                  <td className="py-3 pr-4">{formatTimestamp(job.startedAt)}</td>
                  <td className="py-3 pr-4">{formatTimestamp(job.completedAt)}</td>
                  <td className="py-3 font-mono text-xs">{job.jobId}</td>
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
