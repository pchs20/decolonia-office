import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapDocumentSequenceToResponse } from "@/api/mappers/document-sequence-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { getSequenceState } = commercialDocumentsUseCases;

/**
 * GET /api/commercial-document-settings/sequences
 * Get current document sequence state by type and year.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : new Date().getFullYear();

    if (!Number.isFinite(year)) {
      throw new ApiError(400, "year must be a valid number");
    }

    const budgetSequence = await getSequenceState("budget", null);
    const invoiceSequence = await getSequenceState("invoice", year);

    return NextResponse.json(
      {
        sequences: [
          mapDocumentSequenceToResponse(budgetSequence),
          mapDocumentSequenceToResponse(invoiceSequence)
        ]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/commercial-document-settings/sequences failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
