import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import {
  createCloudSyncDependencies,
  getCloudSyncCredentials
} from "@/api/composition/backup-export";
import { synchronizeCloudBatch } from "@/application/use-cases/backup-export/cloud-sync-use-case";

export const runtime = "nodejs";

function parseBatchRequest(body: unknown): { cursor: number; batchSize?: number } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Request body must be an object");
  }

  const input = body as Record<string, unknown>;
  const cursor = input.cursor ?? 0;
  const batchSize = input.batchSize;

  if (typeof cursor !== "number" || !Number.isInteger(cursor) || cursor < 0) {
    throw new ApiError(400, "cursor must be a non-negative integer");
  }

  if (
    batchSize !== undefined &&
    (typeof batchSize !== "number" || !Number.isInteger(batchSize) || batchSize < 1 || batchSize > 20)
  ) {
    throw new ApiError(400, "batchSize must be an integer between 1 and 20");
  }

  return { cursor, batchSize: batchSize as number | undefined };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const input = parseBatchRequest(body);
    const dependencies = await createCloudSyncDependencies(await getCloudSyncCredentials(request));
    const result = await synchronizeCloudBatch(dependencies, input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("POST /api/backup/cloud failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
