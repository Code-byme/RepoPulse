import { NextResponse } from "next/server";

import { handleApiError } from "@/server/api/handle-api-error";
import { parseUuidParam } from "@/lib/validators/params";
import { getRepositoryReportByRepositoryId } from "@/server/services/repository-read.service";
import type { ApiErrorResponse, RepositoryReportResponse } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ repositoryId: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse<RepositoryReportResponse | ApiErrorResponse>> {
  try {
    const { repositoryId } = await context.params;
    const parsedRepositoryId = parseUuidParam(repositoryId);
    const result = await getRepositoryReportByRepositoryId(parsedRepositoryId);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
