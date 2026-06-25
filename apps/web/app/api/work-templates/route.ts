import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapWorkTemplateToResponse } from "@/api/mappers/work-template-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { createWorkTemplate, listWorkTemplates } = commercialDocumentsUseCases;

/**
 * GET /api/work-templates
 * List all work templates with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "100");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const result = await listWorkTemplates(page, limit, includeInactive);

    return NextResponse.json(
      {
        templates: result.templates.map(mapWorkTemplateToResponse),
        total: result.total,
        page: result.page,
        limit: result.limit
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/work-templates failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * POST /api/work-templates
 * Create a new work template
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const description = typeof payload.description === "string" ? payload.description : null;
    const defaultUnitPrice = payload.defaultUnitPrice === null || payload.defaultUnitPrice === ""
      ? null
      : Number(payload.defaultUnitPrice);

    if (!title) {
      throw new ApiError(400, "title is required");
    }

    if (defaultUnitPrice !== null && (!Number.isFinite(defaultUnitPrice) || defaultUnitPrice < 0)) {
      throw new ApiError(400, "defaultUnitPrice must be a positive number or null");
    }

    const workTemplate = await createWorkTemplate({ title, description, defaultUnitPrice });

    return NextResponse.json(mapWorkTemplateToResponse(workTemplate), { status: 201 });
  } catch (error) {
    console.error("POST /api/work-templates failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
