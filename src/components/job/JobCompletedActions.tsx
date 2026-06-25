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
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
        Analysis completed successfully
      </p>
      <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
        {redirectCancelled
          ? "Open the report when you are ready."
          : `Redirecting to report in ${secondsRemaining}s…`}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => router.push(reportHref)}>
          View Report
        </Button>
        {!redirectCancelled ? (
          <Button
            type="button"
            className="bg-white text-emerald-900 ring-1 ring-inset ring-emerald-300 hover:bg-emerald-100 dark:bg-transparent dark:text-emerald-200 dark:ring-emerald-800 dark:hover:bg-emerald-950/50"
            onClick={() => setRedirectCancelled(true)}
          >
            Stay on this page
          </Button>
        ) : null}
      </div>
    </div>
  );
}
