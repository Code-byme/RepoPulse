import "server-only";

import { getGithubToken } from "@/lib/env/server";

const GITHUB_API_BASE = "https://api.github.com";

export type GithubClientOptions = {
  token?: string;
};

export type GithubRequestOptions = {
  path: string;
  method?: "GET" | "POST";
  body?: unknown;
};

export class GithubApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
  }
}

export class GithubNetworkError extends Error {
  constructor(message = "Unable to reach the GitHub API") {
    super(message);
    this.name = "GithubNetworkError";
  }
}

async function parseErrorBody(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (body && typeof body === "object" && "message" in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === "string") {
        return message;
      }
    }
  } catch {
    // Fall back to status text below.
  }

  return response.statusText || "GitHub API request failed";
}

export function createGithubClient(options: GithubClientOptions = {}) {
  const token = options.token ?? getGithubToken();

  async function request<T>({
    path,
    method = "GET",
    body,
  }: GithubRequestOptions): Promise<T> {
    let response: Response;

    try {
      response = await fetch(`${GITHUB_API_BASE}${path}`, {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    } catch {
      throw new GithubNetworkError();
    }

    if (!response.ok) {
      const message = await parseErrorBody(response);
      throw new GithubApiError(message, response.status);
    }

    return response.json() as Promise<T>;
  }

  return { request };
}

export type GithubClient = ReturnType<typeof createGithubClient>;
