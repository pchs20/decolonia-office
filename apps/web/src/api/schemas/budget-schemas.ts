import { CommercialDocumentResponse, DocumentPartyInput } from "@/api/schemas/commercial-document-schema";

// Budget schemas
export interface BudgetResponse extends CommercialDocumentResponse {
  deliveredAt: Date | null;
}

export interface BudgetCreateRequest {
  clientId: string;
  workerId: string;
  pricingMode?: "computed" | "manual-subtotal";
  manualSubtotalAmount?: number | null;
  clientSnapshot?: DocumentPartyInput;
  workerSnapshot?: DocumentPartyInput;
  notes?: string | null;
  taxId?: string | null;
  number?: string;
  identifierSource?: "automatic" | "custom";
  confirmDuplicateNumber?: boolean;
}

export interface BudgetUpdateRequest {
  pricingMode?: "computed" | "manual-subtotal";
  manualSubtotalAmount?: number | null;
  clientSnapshot?: DocumentPartyInput;
  workerSnapshot?: DocumentPartyInput;
  notes?: string | null;
  deliveredAt?: Date | null;
  taxId?: string | null;
  number?: string;
  identifierSource?: "custom";
  confirmDuplicateNumber?: boolean;
}

export interface BudgetListResponse {
  budgets: BudgetResponse[];
  total: number;
  page: number;
  limit: number;
}
