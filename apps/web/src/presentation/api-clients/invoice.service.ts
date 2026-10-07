import {
  InvoiceCreateRequest,
  InvoiceListResponse,
  InvoiceResponse,
  InvoiceUpdateRequest
} from "@/api/schemas/invoice-schemas";
import {
  JobItemCreateRequest,
  JobItemResponse,
  JobItemUpdateRequest
} from "@/api/schemas/job-item-schemas";

const API_ENDPOINT = "/api/invoices";

export class InvoiceService {
  static async create(data: InvoiceCreateRequest): Promise<InvoiceResponse> {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const error = new Error(body?.message || "Failed to create invoice") as Error & { status?: number; code?: string; details?: Record<string, string> };
      error.status = response.status;
      error.code = body?.code;
      error.details = body?.details;
      throw error;
    }

    return response.json();
  }

  static async getAll(
    page: number = 1,
    limit: number = 20,
    clientId?: string,
    year?: number,
    search?: string
  ): Promise<InvoiceListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(clientId && { clientId }),
      ...(year && { year: year.toString() }),
      ...(search && { search })
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }

    return response.json();
  }

  static async getById(id: string): Promise<InvoiceResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch invoice");
    }

    return response.json();
  }

  static async duplicate(id: string): Promise<InvoiceResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}/duplicate`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to duplicate invoice");
    return response.json();
  }

  static async update(id: string, data: InvoiceUpdateRequest): Promise<InvoiceResponse> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const error = new Error(body?.message || "Failed to update invoice") as Error & { status?: number; code?: string; details?: Record<string, string> };
      error.status = response.status;
      error.code = body?.code;
      error.details = body?.details;
      throw error;
    }

    return response.json();
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete invoice");
  }

  static async addItem(invoiceId: string, data: JobItemCreateRequest): Promise<JobItemResponse> {
    const response = await fetch(`${API_ENDPOINT}/${invoiceId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to add invoice item");
    }

    return response.json();
  }

  static async updateItem(
    invoiceId: string,
    itemId: string,
    data: JobItemUpdateRequest
  ): Promise<JobItemResponse> {
    const response = await fetch(`${API_ENDPOINT}/${invoiceId}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update invoice item");
    }

    return response.json();
  }

  static async deleteItem(invoiceId: string, itemId: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/${invoiceId}/items/${itemId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete invoice item");
    }
  }

  static async getItems(invoiceId: string): Promise<JobItemResponse[]> {
    const response = await fetch(`${API_ENDPOINT}/${invoiceId}/items`);

    if (!response.ok) {
      throw new Error("Failed to fetch invoice items");
    }

    return response.json();
  }
}
