import { NextRequest, NextResponse } from "next/server";
import { workerUseCases } from "@/api/composition/workers";
import { getErrorResponse } from "@/api/errors/api-errors";
import { validateWorkerUpdatePayload } from "@/api/schemas/worker-validator";
import { toWorkerSchema } from "@/api/mappers/worker-mapper";

const { deleteWorker, getWorkerById, updateWorker } = workerUseCases;

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const worker = await getWorkerById(id);

    return NextResponse.json(toWorkerSchema(worker), { status: 200 });
  } catch (error) {
    console.error("GET /api/workers/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const input = validateWorkerUpdatePayload(payload);
    const worker = await updateWorker(id, input);

    return NextResponse.json(toWorkerSchema(worker), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/workers/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteWorker(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/workers/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
