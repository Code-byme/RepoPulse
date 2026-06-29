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
      <div className="mx-auto max-w-lg space-y-6 rp-panel">
        <ErrorMessage message="Something went wrong loading this job." />
        <p className="text-sm text-text-secondary">
          The job may not exist or the server encountered an error.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link href="/" className="rp-btn-secondary h-11 w-auto px-4">
            Back to home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
