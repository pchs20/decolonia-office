import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { getDefaultPricingModes, setDefaultPricingModes } = commercialDocumentsUseCases;

function parseMode(value: unknown): "computed" | "manual-subtotal" {
  if (value === "computed" || value === "manual-subtotal") {
    return value;
  }
  throw new ApiError(400, "pricing mode must be 'computed' or 'manual-subtotal'");
}

export async function GET() {
  try {
    const defaults = await getDefaultPricingModes();
    return NextResponse.json(
      {
        defaultBudgetPricingMode: defaults.budget,
        defaultInvoicePricingMode: defaults.invoice
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/commercial-document-settings failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const updated = await setDefaultPricingModes({
      budget: parseMode(payload.defaultBudgetPricingMode),
      invoice: parseMode(payload.defaultInvoicePricingMode)
    });
    return NextResponse.json(
      {
        defaultBudgetPricingMode: updated.budget,
        defaultInvoicePricingMode: updated.invoice
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/commercial-document-settings failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
