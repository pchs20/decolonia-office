import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/api/errors/api-errors";
import { mapInvoiceToResponse } from "@/api/mappers/invoice-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { duplicateInvoice } = commercialDocumentsUseCases;
type Params = { params: Promise<{ id: string }> };

export async function POST(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const invoice = await duplicateInvoice(id);
    return NextResponse.json(mapInvoiceToResponse(invoice), { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices/:id/duplicate failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
