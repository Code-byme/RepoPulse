import { notFound } from "next/navigation";

import { JobStatusPanel } from "@/components/JobStatusPanel";
import { PageContainer } from "@/components/ui/PageContainer";
import { parseUuidParam } from "@/lib/validators/params";

type JobPageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function JobPage({ params }: JobPageProps) {
  const { jobId } = await params;

  try {
    parseUuidParam(jobId);
  } catch {
    notFound();
  }

  return (
    <PageContainer>
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Job Monitor
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Analysis Job
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Track progress while your repository is analyzed in the background.
          </p>
        </div>

        <JobStatusPanel jobId={jobId} />
      </div>
    </PageContainer>
  );
}
