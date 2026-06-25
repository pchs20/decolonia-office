import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapDocumentSequenceToResponse } from "@/api/mappers/document-sequence-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { adjustSequence } = commercialDocumentsUseCases;

/**
 * POST /api/commercial-document-settings/sequences/adjust
 * Manually adjust a document sequence number.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const documentType = payload.documentType;
    const year = payload.year ?? null;
    const nextNumber = Number(payload.nextNumber);

    if (documentType !== "budget" && documentType !== "invoice") {
      throw new ApiError(400, "documentType must be 'budget' or 'invoice'");
    }

    if (documentType === "invoice" && (year === null || !Number.isFinite(Number(year)))) {
      throw new ApiError(400, "year is required for invoice documentType");
    }

    if (!Number.isInteger(nextNumber) || nextNumber < 1) {
      throw new ApiError(400, "nextNumber must be an integer greater than 0");
    }

    const sequence = await adjustSequence(documentType, documentType === "budget" ? null : Number(year), nextNumber);
    return NextResponse.json(mapDocumentSequenceToResponse(sequence), { status: 200 });
  } catch (error) {
    console.error("POST /api/commercial-document-settings/sequences/adjust failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
