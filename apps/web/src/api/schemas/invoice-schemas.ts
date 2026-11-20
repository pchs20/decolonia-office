import { CommercialDocumentResponse, DocumentPartyInput } from "@/api/schemas/commercial-document-schema";

// Invoice schemas
export interface InvoiceResponse extends CommercialDocumentResponse {
  issuedAt: Date;
  sourceBudgetId: string | null;
}

export interface InvoiceCreateRequest {
  clientId: string;
  workerId: string;
  pricingMode?: "computed" | "manual-subtotal";
  manualSubtotalAmount?: number | null;
  clientSnapshot?: DocumentPartyInput;
  workerSnapshot?: DocumentPartyInput;
  notes?: string | null;
  taxId?: string | null;
  issuedAt: string;
  sourceBudgetId?: string | null;
  number?: string;
  identifierSource?: "automatic" | "custom";
  confirmDuplicateNumber?: boolean;
}

export interface InvoiceUpdateRequest {
  pricingMode?: "computed" | "manual-subtotal";
  manualSubtotalAmount?: number | null;
  clientSnapshot?: DocumentPartyInput;
  workerSnapshot?: DocumentPartyInput;
  notes?: string | null;
  issuedAt?: string;
  taxId?: string | null;
  sourceBudgetId?: string | null;
  number?: string;
  identifierSource?: "custom";
  confirmDuplicateNumber?: boolean;
}

export interface InvoiceListResponse {
  invoices: InvoiceResponse[];
  total: number;
  page: number;
  limit: number;
}
