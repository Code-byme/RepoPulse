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
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Loading job status
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
    <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <LoadingSpinner className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {status === "queued" ? "Waiting to start" : "Processing repository"}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
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
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Current status</p>
          <StatusBadge status={job.status} />
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You can submit the repository again from the homepage.
          </p>
        </div>
      ) : null}

      {job.status === "completed" && job.repositoryId ? (
        <JobCompletedActions repositoryId={job.repositoryId} />
      ) : null}

      {job.status === "completed" && !job.repositoryId ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Analysis completed, but no repository ID was returned for the report link.
        </p>
      ) : null}
    </div>
  );
}
