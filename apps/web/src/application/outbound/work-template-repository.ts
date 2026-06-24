import { WorkTemplate } from "@/domain/entities/work-template";

export interface WorkTemplateRepository {
  create(template: WorkTemplate): Promise<WorkTemplate>;
  getById(id: string): Promise<WorkTemplate>;
  list(page: number, limit: number, includeInactive?: boolean): Promise<{
    templates: WorkTemplate[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(template: WorkTemplate): Promise<WorkTemplate>;
  archive(id: string): Promise<void>;
}
