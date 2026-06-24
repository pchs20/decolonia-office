import { DocumentType } from "@/domain/value-objects/document-enums";

export interface DocumentSequence {
  id: string;
  documentType: DocumentType;
  scopeYear: number | null;
  nextNumber: number;
  updatedAt: Date;
}
