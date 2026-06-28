import { Worker } from "@/domain/entities/worker";

export interface WorkerRepository {
  create(worker: Worker): Promise<Worker>;
  getById(id: string): Promise<Worker>;
  getByPrimary(): Promise<Worker | null>;
  list(page: number, limit: number, search?: string): Promise<{
    workers: Worker[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(worker: Worker): Promise<Worker>;
  delete(id: string): Promise<void>;
  setPrimary(id: string): Promise<Worker>;
}