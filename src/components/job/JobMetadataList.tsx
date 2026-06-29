import type { AnalysisJobDetailResponse } from "@/types/api";
import { formatTimestamp } from "@/lib/utils/format";

type JobMetadataListProps = {
  job: AnalysisJobDetailResponse;
};

function MetadataRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd
        className={`text-right text-text-primary ${
          mono ? "font-mono text-xs break-all" : "text-sm"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function JobMetadataList({ job }: JobMetadataListProps) {
  return (
    <dl className="space-y-3">
      <MetadataRow label="Job ID" value={job.jobId} mono />
      {job.repositoryId ? (
        <MetadataRow label="Repository ID" value={job.repositoryId} mono />
      ) : null}
      <MetadataRow label="Submitted" value={formatTimestamp(job.createdAt)} />
      {job.startedAt ? (
        <MetadataRow label="Started" value={formatTimestamp(job.startedAt)} />
      ) : null}
      {job.completedAt ? (
        <MetadataRow label="Completed" value={formatTimestamp(job.completedAt)} />
      ) : null}
    </dl>
  );
}
