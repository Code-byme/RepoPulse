"use client";

import Link from "next/link";

import { JobCompletedActions } from "@/components/job/JobCompletedActions";
import { JobMetadataList } from "@/components/job/JobMetadataList";
import { StatusBadge } from "@/components/job/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useJobPolling } from "@/hooks/useJobPolling";

type JobStatusPanelProps = {
  jobId: string;
};

function JobLoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <LoadingSpinner className="h-8 w-8" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">Loading job status</p>
        <p className="text-sm text-text-secondary">
          Fetching the latest analysis job details…
        </p>
      </div>
    </div>
  );
}

function JobProcessingState({ status }: { status: "queued" | "processing" }) {
  const message =
    status === "queued"
      ? "Your analysis is queued and will start shortly."
      : "Analysis is in progress. This may take a minute.";

  return (
    <div className="rp-alert-info">
      <LoadingSpinner className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">
          {status === "queued" ? "Waiting to start" : "Processing repository"}
        </p>
        <p className="text-sm text-text-secondary">{message}</p>
        <p className="text-xs text-text-muted">
          Checking for updates every few seconds…
        </p>
      </div>
    </div>
  );
}

export function JobStatusPanel({ jobId }: JobStatusPanelProps) {
  const { job, error, isLoading, isPolling, refresh } = useJobPolling(jobId);

  if (isLoading && !job) {
    return <JobLoadingState />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <p className="text-sm text-text-secondary">
          Verify the job ID and try again.
        </p>
        <Button type="button" onClick={() => void refresh()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!job) {
    return <ErrorMessage message="Job not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[13px] text-text-secondary">Current status</p>
          <StatusBadge status={job.status} />
        </div>
        <Link href="/" className="rp-link-accent text-sm font-medium">
          Analyze another
        </Link>
      </div>

      <JobMetadataList job={job} />

      {isPolling && (job.status === "queued" || job.status === "processing") ? (
        <JobProcessingState status={job.status} />
      ) : null}

      {job.status === "failed" ? (
        <div className="space-y-3">
          <ErrorMessage
            message={job.errorMessage ?? "The analysis job failed unexpectedly."}
          />
          <p className="text-sm text-text-secondary">
            You can submit the repository again from the homepage.
          </p>
        </div>
      ) : null}

      {job.status === "completed" && job.repositoryId ? (
        <JobCompletedActions repositoryId={job.repositoryId} />
      ) : null}

      {job.status === "completed" && !job.repositoryId ? (
        <p className="text-sm text-text-secondary">
          Analysis completed, but no repository ID was returned for the report link.
        </p>
      ) : null}
    </div>
  );
}
