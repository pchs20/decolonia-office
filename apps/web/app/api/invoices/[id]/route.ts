import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorResponse } from "@/api/errors/api-errors";
import { mapInvoiceToResponse } from "@/api/mappers/invoice-mapper";
import { ClientSnapshot } from "@/domain/value-objects/client-snapshot";
import { WorkerSnapshot } from "@/domain/value-objects/worker-snapshot";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const { getInvoiceById, updateInvoice } = commercialDocumentsUseCases;

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

function parseClientSnapshot(value: unknown): ClientSnapshot | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== "object") {
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

function parseWorkerSnapshot(value: unknown): WorkerSnapshot | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== "object") {
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
    billingAddress: parseSnapshotAddress(raw.billingAddress, "workerSnapshot.billingAddress"),
    bankAccount: typeof raw.bankAccount === "string" && raw.bankAccount.trim() ? raw.bankAccount.trim() : null
  };
}

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/invoices/:id
 * Get a specific invoice by ID
 */
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);
    return NextResponse.json(mapInvoiceToResponse(invoice), { status: 200 });
  } catch (error) {
    console.error("GET /api/invoices/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

/**
 * PATCH /api/invoices/:id
 * Update an invoice
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();

    const recalculated = await updateInvoice(id, {
      notes: payload.notes !== undefined ? (typeof payload.notes === "string" ? payload.notes : null) : undefined,
      issuedAt: payload.issuedAt !== undefined ? (payload.issuedAt ? new Date(payload.issuedAt) : null) : undefined,
      taxId: payload.taxId !== undefined
        ? (typeof payload.taxId === "string" && payload.taxId.trim() ? payload.taxId.trim() : null)
        : undefined,
      pricingMode: parsePricingMode(payload.pricingMode),
      manualSubtotalAmount: parseManualSubtotalAmount(payload.manualSubtotalAmount),
      sourceBudgetId: payload.sourceBudgetId !== undefined
        ? (typeof payload.sourceBudgetId === "string" && payload.sourceBudgetId.trim() ? payload.sourceBudgetId.trim() : null)
        : undefined,
      clientSnapshot: parseClientSnapshot(payload.clientSnapshot),
      workerSnapshot: parseWorkerSnapshot(payload.workerSnapshot)
    });

    return NextResponse.json(mapInvoiceToResponse(recalculated), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/invoices/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
