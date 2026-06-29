"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

export const REPORT_REDIRECT_DELAY_MS = 3000;

type JobCompletedActionsProps = {
  repositoryId: string;
};

export function JobCompletedActions({ repositoryId }: JobCompletedActionsProps) {
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState(
    REPORT_REDIRECT_DELAY_MS / 1000,
  );
  const [redirectCancelled, setRedirectCancelled] = useState(false);

  const reportHref = `/repositories/${repositoryId}/report`;

  useEffect(() => {
    if (redirectCancelled) {
      return;
    }

    if (secondsRemaining <= 0) {
      router.push(reportHref);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCancelled, reportHref, router, secondsRemaining]);

  return (
    <div className="rp-alert-success">
      <p className="text-sm font-medium text-green">Analysis completed successfully</p>
      <p className="mt-1 text-sm text-text-secondary">
        {redirectCancelled
          ? "Open the report when you are ready."
          : `Redirecting to report in ${secondsRemaining}s…`}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => router.push(reportHref)}>
          View Report
        </Button>
        {!redirectCancelled ? (
          <button
            type="button"
            className="rp-btn-secondary w-full sm:w-auto"
            onClick={() => setRedirectCancelled(true)}
          >
            Stay on this page
          </button>
        ) : null}
      </div>
    </div>
  );
}
