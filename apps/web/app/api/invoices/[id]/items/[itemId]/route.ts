import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapJobItemToResponse } from "@/api/mappers/job-item-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { updateInvoiceItem, removeInvoiceItem } = commercialDocumentsUseCases;

type Params = { params: Promise<{ id: string; itemId: string }> };

/**
 * PATCH /api/invoices/:id/items/:itemId
 * Update a job item in an invoice
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, itemId } = await params;
    const payload = await request.json();
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const description = typeof payload.description === "string" ? payload.description : null;
    const quantity = payload.quantity === null || payload.quantity === "" ? null : Number(payload.quantity);
    const unitPrice = payload.unitPrice === null || payload.unitPrice === "" ? null : Number(payload.unitPrice);
    const totalPrice = payload.totalPrice === null || payload.totalPrice === "" ? null : Number(payload.totalPrice);

    if (quantity !== null && !Number.isFinite(quantity)) {
      throw new ApiError(400, "quantity must be a valid number or null");
    }

    if (unitPrice !== null && !Number.isFinite(unitPrice)) {
      throw new ApiError(400, "unitPrice must be a valid number or null");
    }

    if (totalPrice !== null && !Number.isFinite(totalPrice)) {
      throw new ApiError(400, "totalPrice must be a valid number or null");
    }

    if (!title) {
      throw new ApiError(400, "title is required");
    }

    const jobItem = await updateInvoiceItem(id, itemId, { title, description, quantity, unitPrice, totalPrice });

    return NextResponse.json(mapJobItemToResponse(jobItem), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/invoices/:id/items/:itemId failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * DELETE /api/invoices/:id/items/:itemId
 * Remove a job item from an invoice
 */
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id, itemId } = await params;
    await removeInvoiceItem(id, itemId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/invoices/:id/items/:itemId failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
