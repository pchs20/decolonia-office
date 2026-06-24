import { DocumentSequence } from "@/domain/entities/document-sequence";
import { DocumentSequenceResponse } from "@/api/schemas/document-sequence-schemas";

export function mapDocumentSequenceToResponse(sequence: DocumentSequence): DocumentSequenceResponse {
  return {
    id: sequence.id,
    documentType: sequence.documentType,
    scopeYear: sequence.scopeYear,
    nextNumber: sequence.nextNumber
  };
}
