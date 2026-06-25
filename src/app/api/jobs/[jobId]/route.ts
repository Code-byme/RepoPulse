import { NextResponse } from "next/server";

import { handleApiError } from "@/server/api/handle-api-error";
import { parseUuidParam } from "@/lib/validators/params";
import { getAnalysisJobById } from "@/server/services/analysis.service";
import type { AnalysisJobDetailResponse, ApiErrorResponse } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse<AnalysisJobDetailResponse | ApiErrorResponse>> {
  try {
    const { jobId } = await context.params;
    const parsedJobId = parseUuidParam(jobId);
    const job = await getAnalysisJobById(parsedJobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return handleApiError(error);
  }
}
