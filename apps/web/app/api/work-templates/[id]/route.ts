import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapWorkTemplateToResponse } from "@/api/mappers/work-template-mapper";
import { commercialDocumentsUseCases } from "@/application/use-cases/commercial-documents/commercial-documents-runtime";

const { getWorkTemplateById, updateWorkTemplate, archiveWorkTemplate } = commercialDocumentsUseCases;

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/work-templates/:id
 * Update a work template
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const existing = await getWorkTemplateById(id);
    const title = typeof payload.title === "string" ? payload.title.trim() : existing.title;
    const description = payload.description === undefined
      ? existing.description
      : (typeof payload.description === "string" ? payload.description : null);
    const defaultUnitPrice = payload.defaultUnitPrice === undefined
      ? existing.defaultUnitPrice
      : (payload.defaultUnitPrice === null || payload.defaultUnitPrice === "" ? null : Number(payload.defaultUnitPrice));
    const isActive = payload.isActive === undefined ? existing.isActive : Boolean(payload.isActive);

    if (!title) {
      throw new ApiError(400, "title is required");
    }

    if (defaultUnitPrice !== null && (!Number.isFinite(defaultUnitPrice) || defaultUnitPrice < 0)) {
      throw new ApiError(400, "defaultUnitPrice must be a positive number or null");
    }

    const workTemplate = await updateWorkTemplate(id, {
      title,
      description,
      defaultUnitPrice,
      isActive
    });

    return NextResponse.json(mapWorkTemplateToResponse(workTemplate), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/work-templates/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * POST /api/work-templates/:id/archive
 * Archive a work template
 */
export async function POST(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await archiveWorkTemplate(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("POST /api/work-templates/:id/archive failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
