import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/api/errors/api-errors";
import { documentPdfRenderer } from "@/api/composition/backup-export";
import { LOCALE_COOKIE } from "@/presentation/i18n/config";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const locale = request.cookies.get(LOCALE_COOKIE)?.value;
    const uint8 = await documentPdfRenderer.renderBudgetPdf(id, locale);
    const number = await documentPdfRenderer.getBudgetNumber(id);
    const safeNumber = number.replace(/[^a-zA-Z0-9-]/g, "-");

    return new NextResponse(uint8 as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="presupuesto-${safeNumber}.pdf"`
      }
    });
  } catch (error) {
    console.error("GET /api/budgets/[id]/pdf failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
