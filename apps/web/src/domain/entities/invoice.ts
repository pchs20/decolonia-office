import { CommercialDocument } from "@/domain/entities/commercial-document";

export interface Invoice extends CommercialDocument {
  issuedAt: Date | null;
  sourceBudgetId: string | null;
}
