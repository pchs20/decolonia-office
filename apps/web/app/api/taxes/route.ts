import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapTaxToResponse } from "@/api/mappers/tax-mapper";
import { commercialDocumentsUseCases } from "@/application/use-cases/commercial-documents/commercial-documents-runtime";

const { createTax, listTaxes } = commercialDocumentsUseCases;

/**
 * GET /api/taxes
 * List all tax definitions with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "100");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const result = await listTaxes(page, limit, includeInactive);

    return NextResponse.json(
      {
        taxes: result.taxes.map(mapTaxToResponse),
        total: result.total,
        page: result.page,
        limit: result.limit
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/taxes failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * POST /api/taxes
 * Create a new tax definition
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const rate = Number(payload.rate);

    if (!name) {
      throw new ApiError(400, "name is required");
    }

    if (!Number.isFinite(rate) || rate < 0) {
      throw new ApiError(400, "rate must be a positive number");
    }

    const tax = await createTax({ name, rate });

    return NextResponse.json(mapTaxToResponse(tax), { status: 201 });
  } catch (error) {
    console.error("POST /api/taxes failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
