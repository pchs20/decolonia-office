import { CommercialDocument } from "@/domain/entities/commercial-document";

export interface Invoice extends CommercialDocument {
  issuedAt: Date;
  sourceBudgetId: string | null;
}
