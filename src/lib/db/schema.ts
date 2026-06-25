import type { MetricsJson, StructureJson } from "@/types/github-analysis";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const analysisJobStatusEnum = pgEnum("analysis_job_status", [
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const repositories = pgTable(
  "repositories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    owner: text("owner").notNull(),
    name: text("name").notNull(),
    fullName: text("full_name").notNull(),
    githubUrl: text("github_url").notNull(),
    defaultBranch: text("default_branch"),
    lastAnalyzedAt: timestamp("last_analyzed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("repositories_full_name_idx").on(table.fullName),
    index("repositories_owner_name_idx").on(table.owner, table.name),
  ],
);

export const analysisJobs = pgTable(
  "analysis_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    repositoryId: uuid("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    status: analysisJobStatusEnum("status").notNull().default("queued"),
    inngestRunId: text("inngest_run_id"),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("analysis_jobs_repository_id_idx").on(table.repositoryId),
    index("analysis_jobs_status_idx").on(table.status),
  ],
);

export const analysisResults = pgTable(
  "analysis_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => analysisJobs.id, { onDelete: "cascade" })
      .unique(),
    repositoryId: uuid("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    summary: text("summary").notNull(),
    metrics: jsonb("metrics").$type<MetricsJson>().notNull(),
    insights: jsonb("insights").$type<StructureJson>().notNull(),
    rawData: jsonb("raw_data").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("analysis_results_repository_id_idx").on(table.repositoryId),
    index("analysis_results_job_id_idx").on(table.jobId),
  ],
);

export type RepositoryRow = typeof repositories.$inferSelect;
export type NewRepositoryRow = typeof repositories.$inferInsert;

export type AnalysisJobRow = typeof analysisJobs.$inferSelect;
export type NewAnalysisJobRow = typeof analysisJobs.$inferInsert;

export type AnalysisResultRow = typeof analysisResults.$inferSelect;
export type NewAnalysisResultRow = typeof analysisResults.$inferInsert;
