// Work Template schemas
export interface WorkTemplateResponse {
  id: string;
  title: string;
  description: string | null;
  defaultUnitPrice: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkTemplateCreateRequest {
  title: string;
  description?: string | null;
  defaultUnitPrice?: number | null;
}

export interface WorkTemplateUpdateRequest {
  title?: string;
  description?: string | null;
  defaultUnitPrice?: number | null;
  isActive?: boolean;
}

export interface WorkTemplateListResponse {
  templates: WorkTemplateResponse[];
  total: number;
  page: number;
  limit: number;
}
