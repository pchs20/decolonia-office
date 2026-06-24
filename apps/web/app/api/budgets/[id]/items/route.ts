import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapJobItemToResponse } from "@/api/mappers/job-item-mapper";
import { commercialDocumentsUseCases } from "@/application/use-cases/commercial-documents/commercial-documents-runtime";
import { postgresJobItemRepository } from "@/infrastructure/persistence/postgres/repositories/job-item-repository";

const { addBudgetItem } = commercialDocumentsUseCases;

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/budgets/:id/items
 * List job items for a budget
 */
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = await postgresJobItemRepository.findByDocumentId(id);
    return NextResponse.json(items.map(mapJobItemToResponse), { status: 200 });
  } catch (error) {
    console.error("GET /api/budgets/:id/items failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * POST /api/budgets/:id/items
 * Add a job item to a budget
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const description = typeof payload.description === "string" ? payload.description : null;
    const quantity = payload.quantity === null || payload.quantity === "" ? null : Number(payload.quantity);
    const unitPrice = payload.unitPrice === null || payload.unitPrice === "" ? null : Number(payload.unitPrice);
    const totalPrice = payload.totalPrice === null || payload.totalPrice === "" ? null : Number(payload.totalPrice);

    if (!title) {
      throw new ApiError(400, "title is required");
    }

    const jobItem = await addBudgetItem(id, { title, description, quantity, unitPrice, totalPrice });

    return NextResponse.json(mapJobItemToResponse(jobItem), { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets/:id/items failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
