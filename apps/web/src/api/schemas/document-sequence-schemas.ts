// Document Sequence schemas
export interface DocumentSequenceResponse {
  id: string;
  documentType: string;
  scopeYear: number | null;
  nextNumber: number;
}

export interface DocumentSequenceAdjustRequest {
  documentType: "budget" | "invoice";
  year?: number | null;
  nextNumber: number;
}
