import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/api/errors/api-errors";
import { mapBudgetToResponse } from "@/api/mappers/budget-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { duplicateBudget } = commercialDocumentsUseCases;
type Params = { params: Promise<{ id: string }> };

export async function POST(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const budget = await duplicateBudget(id);
    return NextResponse.json(mapBudgetToResponse(budget), { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets/:id/duplicate failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
