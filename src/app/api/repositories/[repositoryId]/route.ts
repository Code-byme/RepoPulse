import { NextResponse } from "next/server";

import { handleApiError } from "@/server/api/handle-api-error";
import { parseUuidParam } from "@/lib/validators/params";
import { getRepositoryWithLatestJob } from "@/server/services/repository-read.service";
import type { ApiErrorResponse, RepositoryDetailResponse } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ repositoryId: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse<RepositoryDetailResponse | ApiErrorResponse>> {
  try {
    const { repositoryId } = await context.params;
    const parsedRepositoryId = parseUuidParam(repositoryId);
    const result = await getRepositoryWithLatestJob(parsedRepositoryId);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
