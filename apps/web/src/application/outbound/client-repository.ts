import { Client } from "@/domain/entities/client";

export interface ClientRepository {
  create(client: Client): Promise<Client>;
  getById(id: string): Promise<Client>;
  list(page: number, limit: number, search?: string): Promise<{
    clients: Client[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}