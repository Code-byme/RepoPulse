import { NextResponse } from "next/server";

import { handleApiError } from "@/server/api/handle-api-error";
import { listRepositoriesWithLatestJob } from "@/server/services/repository-read.service";
import type { ApiErrorResponse, RepositoryListResponse } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<
  NextResponse<RepositoryListResponse | ApiErrorResponse>
> {
  try {
    const repositories = await listRepositoriesWithLatestJob();

    return NextResponse.json({
      repositories,
      total: repositories.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
