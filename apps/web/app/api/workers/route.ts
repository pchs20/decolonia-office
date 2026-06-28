import { NextRequest, NextResponse } from "next/server";
import { workerUseCases } from "@/api/composition/workers";
import { getErrorResponse } from "@/api/errors/api-errors";
import { validateWorkerCreatePayload } from "@/api/schemas/worker-validator";
import { toWorkerListResponseSchema, toWorkerSchema } from "@/api/mappers/worker-mapper";

const { createWorker, listWorkers, getPrimaryWorker } = workerUseCases;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Handle ?primary=true query to get the primary worker
    if (searchParams.get("primary") === "true") {
      const worker = await getPrimaryWorker();
      if (worker === null) {
        return NextResponse.json(null, { status: 200 });
      }
      return NextResponse.json(toWorkerSchema(worker), { status: 200 });
    }

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? undefined;

    const data = await listWorkers(page, limit, search);
    return NextResponse.json(toWorkerListResponseSchema(data), { status: 200 });
  } catch (error) {
    console.error("GET /api/workers failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const input = validateWorkerCreatePayload(payload);
    const worker = await createWorker(input);

    return NextResponse.json(toWorkerSchema(worker), { status: 201 });
  } catch (error) {
    console.error("POST /api/workers failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
