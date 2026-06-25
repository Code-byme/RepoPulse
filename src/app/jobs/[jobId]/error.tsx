"use client";

import Link from "next/link";

import { PageContainer } from "@/components/ui/PageContainer";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";

export default function JobErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer>
      <div className="mx-auto max-w-lg space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <ErrorMessage message="Something went wrong loading this job." />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The job may not exist or the server encountered an error.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back to home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
