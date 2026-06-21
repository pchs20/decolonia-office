import { WorkerSchema, CreateWorkerInput, UpdateWorkerInput, WorkerListResponseSchema } from "@/api/schemas/worker-schema";

const API_ENDPOINT = "/api/workers";

export class WorkerService {
  static async create(data: CreateWorkerInput): Promise<WorkerSchema> {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create worker");
    }

    return response.json();
  }

  static async getById(id: string): Promise<WorkerSchema> {
    const response = await fetch(`${API_ENDPOINT}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Worker not found");
      }
      throw new Error("Failed to fetch worker");
    }

    return response.json();
  }

  static async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<WorkerListResponseSchema> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch workers");
    }

    return response.json();
  }

  static async update(id: string, data: UpdateWorkerInput): Promise<WorkerSchema> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update worker");
    }

    return response.json();
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Worker not found");
      }
      throw new Error("Failed to delete worker");
    }
  }
}
