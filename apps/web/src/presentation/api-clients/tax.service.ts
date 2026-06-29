import {
  TaxCreateRequest,
  TaxUpdateRequest,
  TaxListResponse,
  TaxResponse
} from "@/api/schemas/tax-schemas";

const API_ENDPOINT = "/api/taxes";

export class TaxService {
  static async create(data: TaxCreateRequest): Promise<TaxResponse> {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to create tax definition");
    }

    return response.json();
  }

  static async update(id: string, data: TaxUpdateRequest): Promise<TaxResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update tax definition");
    }

    return response.json();
  }

  static async toggleActive(id: string, isActive: boolean): Promise<TaxResponse> {
    return TaxService.update(id, { isActive });
  }

  static async getAll(
    page: number = 1,
    limit: number = 20,
    includeInactive: boolean = false
  ): Promise<TaxListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(includeInactive && { includeInactive: "true" })
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch tax definitions");
    }

    return response.json();
  }
}
