// Use __non_webpack_require__ to bypass Next.js's RSC-vendored React and get the
// real React 18 — the same one @react-pdf/renderer uses at runtime.
const React = __non_webpack_require__("react") as typeof import("react");
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getErrorResponse } from "@/api/errors/api-errors";
import { mapBudgetToResponse } from "@/api/mappers/budget-mapper";
import { mapJobItemToResponse } from "@/api/mappers/job-item-mapper";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";
import { BudgetDocument } from "@/presentation/components/pdf/BudgetDocument";
import { getPdfLabels } from "@/presentation/i18n/pdf-translations";
import { LOCALE_COOKIE } from "@/presentation/i18n/config";

const { getBudgetById, listBudgetItems } = commercialDocumentsUseCases;

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const [budget, items] = await Promise.all([
      getBudgetById(id),
      listBudgetItems(id)
    ]);

    const budgetResponse = mapBudgetToResponse(budget);
    const itemResponses = items.map(mapJobItemToResponse);

    const locale = request.cookies.get(LOCALE_COOKIE)?.value;
    const labels = getPdfLabels(locale);

    const buffer = await renderToBuffer(
      React.createElement(BudgetDocument, { budget: budgetResponse, items: itemResponses, labels }) as React.ReactElement
    );
    const uint8 = new Uint8Array(buffer);

    const safeNumber = budget.number.replace(/[^a-zA-Z0-9-]/g, "-");

    return new NextResponse(uint8, {
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
