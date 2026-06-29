import Link from "next/link";

import { AppHeader } from "@/components/layout/AppHeader";
import { RecentRepositories } from "@/components/repository/RecentRepositories";
import { RepoSubmissionForm } from "@/components/RepoSubmissionForm";
import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { loadRepositoryList } from "@/lib/api/server";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    title: "Structure & metrics",
    description: "File counts, folder layout, and repository size at a glance.",
  },
  {
    title: "Language breakdown",
    description: "See which languages and extensions dominate the codebase.",
  },
  {
    title: "Architecture signals",
    description: "Detect frontend/backend patterns, CI, Docker, and configs.",
  },
  {
    title: "TODO / FIXME scan",
    description: "Surface actionable comments from scannable source files.",
  },
] as const;

export default async function HomePage() {
  const repositories = await loadRepositoryList();
  const recentRepositories = repositories.slice(0, 5);

  return (
    <>
      <AppHeader active="home" />
      <DashboardContainer>
        <div className="space-y-12">
          <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                  GitHub Repository Analysis
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                  Understand any public repo in minutes
                </h1>
                <p className="max-w-xl text-base leading-7 text-text-secondary">
                  RepoPulse queues an asynchronous structural analysis, tracks job
                  progress, and builds a report you can revisit anytime.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/repositories" className="rp-btn-secondary">
                  View past analyses
                  {repositories.length > 0 ? (
                    <span className="ml-2 rounded-full bg-accent-dim px-2 py-0.5 font-mono text-xs text-accent">
                      {repositories.length}
                    </span>
                  ) : null}
                </Link>
              </div>
            </div>

            <div id="analyze" className="rp-panel-nested">
              <div className="mb-6 space-y-1">
                <h2 className="rp-section-title">New analysis</h2>
                <p className="text-[13px] text-text-secondary">
                  Paste a public GitHub URL to queue a background job.
                </p>
              </div>
              <RepoSubmissionForm />
            </div>
          </section>

          {recentRepositories.length > 0 ? (
            <RecentRepositories
              repositories={recentRepositories}
              title="Recent analyses"
              showViewAll
            />
          ) : null}

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">What you get</h2>
              <p className="mt-1 text-[13px] text-text-secondary">
                Every completed analysis produces a structured report dashboard.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="rp-stat">
                  <h3 className="font-medium text-text-primary">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DashboardContainer>
    </>
  );
}
