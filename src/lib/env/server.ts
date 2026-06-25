import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }

  return value;
}

/** Neon Postgres connection string (use the pooled URL on Vercel). */
export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}

/** Optional GitHub PAT — server-only, never expose to the client. */
export function getGithubToken(): string | undefined {
  const token = process.env.GITHUB_TOKEN?.trim();
  return token || undefined;
}

/** Required in production when sending events via inngest.send(). */
export function getInngestEventKey(): string | undefined {
  const key = process.env.INNGEST_EVENT_KEY?.trim();
  return key || undefined;
}

/** Required in production for verifying Inngest requests to /api/inngest. */
export function getInngestSigningKey(): string | undefined {
  const key = process.env.INNGEST_SIGNING_KEY?.trim();
  return key || undefined;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
