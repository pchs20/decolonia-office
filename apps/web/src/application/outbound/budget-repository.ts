import { Budget } from "@/domain/entities/budget";

export interface BudgetRepository {
  create(budget: Budget): Promise<Budget>;
  getById(id: string): Promise<Budget>;
  list(page: number, limit: number, clientId?: string, search?: string): Promise<{
    budgets: Budget[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(budget: Budget): Promise<Budget>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<Budget>;
}
