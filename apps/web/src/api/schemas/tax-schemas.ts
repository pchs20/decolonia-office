// Tax Definition schemas
export interface TaxResponse {
  id: string;
  name: string;
  rate: number;
  behavior: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxCreateRequest {
  name: string;
  rate: number;
}

export interface TaxUpdateRequest {
  name?: string;
  rate?: number;
}

export interface TaxListResponse {
  taxes: TaxResponse[];
  total: number;
  page: number;
  limit: number;
}
