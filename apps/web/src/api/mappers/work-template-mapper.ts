import { WorkTemplate } from "@/domain/entities/work-template";
import { WorkTemplateResponse } from "@/api/schemas/work-template-schemas";

export function mapWorkTemplateToResponse(template: WorkTemplate): WorkTemplateResponse {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
    defaultUnitPrice: template.defaultUnitPrice,
    isActive: template.isActive,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt
  };
}
