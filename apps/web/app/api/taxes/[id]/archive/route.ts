import { NextResponse } from "next/server";
import { getErrorResponse } from "@/api/errors/api-errors";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { archiveTax } = commercialDocumentsUseCases;

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/taxes/:id/archive
 * Archive a tax.
 */
export async function POST(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    await archiveTax(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("POST /api/taxes/:id/archive failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
