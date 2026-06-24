import { randomUUID } from "crypto";
import { WorkTemplate } from "@/domain/entities/work-template";
import { WorkTemplateRepository } from "@/application/outbound/work-template-repository";

export async function createWorkTemplate(
  title: string,
  description: string | null,
  defaultUnitPrice: number | null,
  templateRepo: WorkTemplateRepository
): Promise<WorkTemplate> {
  const now = new Date();
  const template: WorkTemplate = {
    id: randomUUID(),
    title,
    description,
    defaultUnitPrice,
    isActive: true,
    createdAt: now,
    updatedAt: now
  };

  return templateRepo.create(template);
}

export async function updateWorkTemplate(
  templateId: string,
  title: string,
  description: string | null,
  defaultUnitPrice: number | null,
  templateRepo: WorkTemplateRepository
): Promise<WorkTemplate> {
  const template = await templateRepo.getById(templateId);
  template.title = title;
  template.description = description;
  template.defaultUnitPrice = defaultUnitPrice;
  template.updatedAt = new Date();
  return templateRepo.update(template);
}

export async function deactivateWorkTemplate(
  templateId: string,
  templateRepo: WorkTemplateRepository
): Promise<WorkTemplate> {
  const template = await templateRepo.getById(templateId);
  template.isActive = false;
  template.updatedAt = new Date();
  return templateRepo.update(template);
}

export async function archiveWorkTemplate(
  templateId: string,
  templateRepo: WorkTemplateRepository
): Promise<void> {
  await templateRepo.archive(templateId);
}
