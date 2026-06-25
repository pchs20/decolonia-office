import { PricingMode } from "@/domain/value-objects/pricing-mode";
import { DocumentSequence } from "@/domain/entities/document-sequence";
import { DocumentType } from "@/domain/value-objects/document-enums";

export interface CommercialDocumentPricingDefaults {
  budget: PricingMode;
  invoice: PricingMode;
}

export interface CommercialDocumentSettingsRepository {
  getDefaultPricingModes(): Promise<CommercialDocumentPricingDefaults>;
  setDefaultPricingModes(modes: CommercialDocumentPricingDefaults): Promise<CommercialDocumentPricingDefaults>;
  getSequence(documentType: DocumentType, scopeYear: number | null): Promise<DocumentSequence>;
  allocateNumber(documentType: DocumentType, scopeYear: number | null): Promise<number>;
  adjustSequence(documentType: DocumentType, scopeYear: number | null, nextNumber: number): Promise<DocumentSequence>;
}
