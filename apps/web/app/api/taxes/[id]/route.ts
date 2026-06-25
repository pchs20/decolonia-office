import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapTaxToResponse } from "@/api/mappers/tax-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { getTaxById, updateTax } = commercialDocumentsUseCases;

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/taxes/:id
 * Update a tax definition
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const existing = await getTaxById(id);
    const name = typeof payload.name === "string" ? payload.name.trim() : existing.name;
    const rate = payload.rate !== undefined ? Number(payload.rate) : existing.rate;
    const isActive = payload.isActive === undefined ? existing.isActive : Boolean(payload.isActive);

    if (!name) {
      throw new ApiError(400, "name is required");
    }

    if (!Number.isFinite(rate) || rate < 0) {
      throw new ApiError(400, "rate must be a positive number");
    }

    const tax = await updateTax(id, { name, rate, isActive });

    return NextResponse.json(mapTaxToResponse(tax), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/taxes/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

