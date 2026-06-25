"use client";

import { useEffect, useState } from "react";

import { ApiClientError, fetchAnalysisJob } from "@/lib/api/client";
import { isActiveJobStatus } from "@/lib/jobs/status";
import type { AnalysisJobDetailResponse } from "@/types/api";

export const JOB_POLL_INTERVAL_MS = 3000;

type UseJobPollingResult = {
  job: AnalysisJobDetailResponse | null;
  error: string | null;
  isLoading: boolean;
  isPolling: boolean;
  refresh: () => Promise<void>;
};

export function useJobPolling(jobId: string): UseJobPollingResult {
  const [job, setJob] = useState<AnalysisJobDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;

    async function loadJob(): Promise<AnalysisJobDetailResponse | null> {
      const data = await fetchAnalysisJob(jobId);

      if (isCancelled) {
        return null;
      }

      setJob(data);
      setError(null);
      setIsLoading(false);
      setIsPolling(isActiveJobStatus(data.status));

      return data;
    }

    async function poll(): Promise<void> {
      try {
        const data = await loadJob();

        if (!data || isCancelled) {
          return;
        }

        if (isActiveJobStatus(data.status)) {
          pollTimer = setTimeout(() => {
            void poll();
          }, JOB_POLL_INTERVAL_MS);
        }
      } catch (pollError) {
        if (isCancelled) {
          return;
        }

        setError(
          pollError instanceof ApiClientError
            ? pollError.message
            : "Failed to load job status",
        );
        setIsLoading(false);
        setIsPolling(false);
      }
    }

    void poll();

    return () => {
      isCancelled = true;

      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, [jobId]);

  async function refresh(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAnalysisJob(jobId);
      setJob(data);
      setIsLoading(false);
      setIsPolling(isActiveJobStatus(data.status));
    } catch (refreshError) {
      setError(
        refreshError instanceof ApiClientError
          ? refreshError.message
          : "Failed to load job status",
      );
      setIsLoading(false);
      setIsPolling(false);
    }
  }

  return {
    job,
    error,
    isLoading,
    isPolling,
    refresh,
  };
}
