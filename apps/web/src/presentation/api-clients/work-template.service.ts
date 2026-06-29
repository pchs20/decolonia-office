import {
  WorkTemplateCreateRequest,
  WorkTemplateUpdateRequest,
  WorkTemplateListResponse,
  WorkTemplateResponse
} from "@/api/schemas/work-template-schemas";

const API_ENDPOINT = "/api/work-templates";

export class WorkTemplateService {
  static async create(data: WorkTemplateCreateRequest): Promise<WorkTemplateResponse> {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to create work template");
    }

    return response.json();
  }

  static async update(id: string, data: WorkTemplateUpdateRequest): Promise<WorkTemplateResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update work template");
    }

    return response.json();
  }

  static async toggleActive(id: string, isActive: boolean): Promise<WorkTemplateResponse> {
    return WorkTemplateService.update(id, { isActive });
  }

  static async getAll(
    page: number = 1,
    limit: number = 20,
    includeInactive: boolean = false
  ): Promise<WorkTemplateListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(includeInactive && { includeInactive: "true" })
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch work templates");
    }

    return response.json();
  }
}
