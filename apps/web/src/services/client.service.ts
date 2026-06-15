import {
  Client,
  CreateClientInput,
  UpdateClientInput,
  ClientListResponse
} from "@/types/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const API_ENDPOINT = `${API_BASE_URL}/api/clients`;

export class ClientService {
  /**
   * Create a new client
   */
  static async create(data: CreateClientInput): Promise<Client> {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create client");
    }

    return response.json();
  }

  /**
   * Get a client by ID
   */
  static async getById(id: string): Promise<Client> {
    const response = await fetch(`${API_ENDPOINT}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Client not found");
      }
      throw new Error("Failed to fetch client");
    }

    return response.json();
  }

  /**
   * Get all clients with pagination and optional search
   */
  static async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ClientListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }

    return response.json();
  }

  /**
   * Update a client
   */
  static async update(id: string, data: UpdateClientInput): Promise<Client> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update client");
    }

    return response.json();
  }

  /**
   * Delete a client (soft delete)
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Client not found");
      }
      throw new Error("Failed to delete client");
    }
  }
}
