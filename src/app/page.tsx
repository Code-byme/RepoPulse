import { RepoSubmissionForm } from "@/components/RepoSubmissionForm";
import { PageContainer } from "@/components/ui/PageContainer";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            GitHub Repository Analysis
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            RepoPulse
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Submit a public GitHub repository to queue an asynchronous structural
            analysis. Track job progress and review results when complete.
          </p>
        </div>

        <RepoSubmissionForm />
      </div>
    </PageContainer>
  );
}
