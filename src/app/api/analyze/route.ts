import { NextResponse } from "next/server";

import { parseJsonBody } from "@/server/api/parse-json-body";
import { handleApiError } from "@/server/api/handle-api-error";
import { submitRepositoryForAnalysis } from "@/server/services/analysis.service";
import type { ApiErrorResponse, SubmitAnalysisResponse } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
): Promise<NextResponse<SubmitAnalysisResponse | ApiErrorResponse>> {
  try {
    const body = await parseJsonBody(request);
    const result = await submitRepositoryForAnalysis(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
