// Job Item schemas
export interface JobItemResponse {
  id: string;
  commercialDocumentId: string;
  position: number;
  title: string;
  description: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
}

export interface JobItemCreateRequest {
  title: string;
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
}

export interface JobItemUpdateRequest {
  title: string;
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  position?: number;
}
