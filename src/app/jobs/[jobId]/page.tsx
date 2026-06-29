import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
import { JobStatusPanel } from "@/components/JobStatusPanel";
import { DashboardContainer } from "@/components/ui/DashboardContainer";
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
    <>
      <AppHeader />
      <DashboardContainer>
        <div className="mx-auto max-w-lg rp-panel">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
              Job Monitor
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Analysis Job
            </h1>
            <p className="text-[13px] text-text-secondary">
              Track progress while your repository is analyzed in the background.
            </p>
          </div>

          <JobStatusPanel jobId={jobId} />
        </div>
      </DashboardContainer>
    </>
  );
}
