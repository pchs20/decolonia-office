import {
  BudgetCreateRequest,
  BudgetListResponse,
  BudgetResponse,
  BudgetUpdateRequest
} from "@/api/schemas/budget-schemas";
import {
  JobItemCreateRequest,
  JobItemResponse,
  JobItemUpdateRequest
} from "@/api/schemas/job-item-schemas";

const API_ENDPOINT = "/api/budgets";

export class BudgetService {
  static async create(data: BudgetCreateRequest): Promise<BudgetResponse> {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to create budget");
    }

    return response.json();
  }

  static async getAll(
    page: number = 1,
    limit: number = 20,
    clientId?: string,
    search?: string
  ): Promise<BudgetListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(clientId && { clientId }),
      ...(search && { search })
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch budgets");
    }

    return response.json();
  }

  static async getById(id: string): Promise<BudgetResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch budget");
    }

    return response.json();
  }

  static async update(id: string, data: BudgetUpdateRequest): Promise<BudgetResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update budget");
    }

    return response.json();
  }

  static async addItem(budgetId: string, data: JobItemCreateRequest): Promise<JobItemResponse> {
    const response = await fetch(`${API_ENDPOINT}/${budgetId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to add budget item");
    }

    return response.json();
  }

  static async updateItem(
    budgetId: string,
    itemId: string,
    data: JobItemUpdateRequest
  ): Promise<JobItemResponse> {
    const response = await fetch(`${API_ENDPOINT}/${budgetId}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update budget item");
    }

    return response.json();
  }

  static async deleteItem(budgetId: string, itemId: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/${budgetId}/items/${itemId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete budget item");
    }
  }

  static async getItems(budgetId: string): Promise<JobItemResponse[]> {
    const response = await fetch(`${API_ENDPOINT}/${budgetId}/items`);

    if (!response.ok) {
      throw new Error("Failed to fetch budget items");
    }

    return response.json();
  }
}
