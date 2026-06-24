import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapInvoiceToResponse } from "@/api/mappers/invoice-mapper";
import { ClientSnapshot } from "@/domain/value-objects/client-snapshot";
import { WorkerSnapshot } from "@/domain/value-objects/worker-snapshot";
import { commercialDocumentsUseCases } from "@/application/use-cases/commercial-documents/commercial-documents-runtime";

const { createInvoice, listInvoices } = commercialDocumentsUseCases;

function parsePricingMode(value: unknown): "computed" | "manual-subtotal" | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === "computed" || value === "manual-subtotal") {
    return value;
  }
  throw new ApiError(400, "pricingMode must be 'computed' or 'manual-subtotal'");
}

function parseManualSubtotalAmount(value: unknown): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new ApiError(400, "manualSubtotalAmount must be a valid number");
  }
  return parsed;
}

function parseSnapshotAddress(value: unknown, fieldName: string) {
  if (!value || typeof value !== "object") {
    throw new ApiError(400, `${fieldName} is required`);
  }

  const raw = value as Record<string, unknown>;
  const street = typeof raw.street === "string" ? raw.street.trim() : "";
  const city = typeof raw.city === "string" ? raw.city.trim() : "";
  const postalCode = typeof raw.postalCode === "string" ? raw.postalCode.trim() : "";

  if (!street || !city || !postalCode) {
    throw new ApiError(400, `${fieldName} requires street, city, and postalCode`);
  }

  return { street, city, postalCode };
}

function parseClientSnapshot(value: unknown): ClientSnapshot | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "object") {
    throw new ApiError(400, "clientSnapshot must be an object");
  }

  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const taxId = typeof raw.taxId === "string" ? raw.taxId.trim() : "";

  if (!name || !taxId) {
    throw new ApiError(400, "clientSnapshot requires name and taxId");
  }

  return {
    name,
    taxId,
    phone: typeof raw.phone === "string" && raw.phone.trim() ? raw.phone.trim() : null,
    email: typeof raw.email === "string" && raw.email.trim() ? raw.email.trim() : null,
    workAddress: parseSnapshotAddress(raw.workAddress, "clientSnapshot.workAddress"),
    billingAddress: parseSnapshotAddress(raw.billingAddress, "clientSnapshot.billingAddress")
  };
}

function parseWorkerSnapshot(value: unknown): WorkerSnapshot | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "object") {
    throw new ApiError(400, "workerSnapshot must be an object");
  }

  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const taxId = typeof raw.taxId === "string" ? raw.taxId.trim() : "";

  if (!name || !taxId) {
    throw new ApiError(400, "workerSnapshot requires name and taxId");
  }

  return {
    name,
    taxId,
    phone: typeof raw.phone === "string" && raw.phone.trim() ? raw.phone.trim() : null,
    email: typeof raw.email === "string" && raw.email.trim() ? raw.email.trim() : null,
    workAddress: parseSnapshotAddress(raw.workAddress, "workerSnapshot.workAddress"),
    billingAddress: parseSnapshotAddress(raw.billingAddress, "workerSnapshot.billingAddress")
  };
}

/**
 * GET /api/invoices
 * List all invoices with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");
    const clientId = searchParams.get("clientId") ?? undefined;
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : undefined;
    const search = searchParams.get("search") ?? undefined;

    const result = await listInvoices(page, limit, clientId, year, search);

    return NextResponse.json(
      {
        invoices: result.invoices.map(mapInvoiceToResponse),
        total: result.total,
        page: result.page,
        limit: result.limit
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/invoices failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * POST /api/invoices
 * Create a new invoice
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const clientId = typeof payload.clientId === "string" ? payload.clientId.trim() : "";
    const workerId = typeof payload.workerId === "string" ? payload.workerId.trim() : "";
    const notes = typeof payload.notes === "string" ? payload.notes : null;
    const taxId = typeof payload.taxId === "string" && payload.taxId.trim() ? payload.taxId.trim() : null;
    const pricingMode = parsePricingMode(payload.pricingMode);
    const manualSubtotalAmount = parseManualSubtotalAmount(payload.manualSubtotalAmount);
    const sourceBudgetId = typeof payload.sourceBudgetId === "string" && payload.sourceBudgetId.trim()
      ? payload.sourceBudgetId.trim()
      : null;
    const clientSnapshot = parseClientSnapshot(payload.clientSnapshot);
    const workerSnapshot = parseWorkerSnapshot(payload.workerSnapshot);

    if (!clientId) {
      throw new ApiError(400, "clientId is required");
    }

    if (!workerId) {
      throw new ApiError(400, "workerId is required");
    }

    const invoice = await createInvoice({
      clientId,
      workerId,
      clientSnapshot,
      workerSnapshot,
      notes,
      taxId,
      pricingMode,
      manualSubtotalAmount,
      sourceBudgetId
    });

    return NextResponse.json(mapInvoiceToResponse(invoice), { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
