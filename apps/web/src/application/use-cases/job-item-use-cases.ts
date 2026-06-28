import { randomUUID } from "crypto";
import { JobItem } from "@/domain/value-objects/job-item";
import { JobItemRepository } from "@/application/outbound/job-item-repository";

export async function addJobItem(
  documentId: string,
  title: string,
  description: string | null,
  quantity: number | null,
  unitPrice: number | null,
  totalPrice: number | null,
  jobItemRepo: JobItemRepository
): Promise<JobItem> {
  const existingItems = await jobItemRepo.findByDocumentId(documentId);
  const maxPosition = existingItems.length > 0 ? Math.max(...existingItems.map(i => i.position)) : 0;

  const jobItem: JobItem = {
    id: randomUUID(),
    commercialDocumentId: documentId,
    position: maxPosition + 1,
    title,
    description,
    quantity,
    unitPrice,
    totalPrice
  };

  return jobItemRepo.create(jobItem);
}

export async function updateJobItem(
  itemId: string,
  title: string,
  description: string | null,
  quantity: number | null,
  unitPrice: number | null,
  totalPrice: number | null,
  jobItemRepo: JobItemRepository,
  position?: number
): Promise<JobItem> {
  const jobItem: JobItem = {
    id: itemId,
    commercialDocumentId: "",
    position: position ?? 0,
    title,
    description,
    quantity,
    unitPrice,
    totalPrice
  };

  return jobItemRepo.update(jobItem);
}

export async function removeJobItem(
  itemId: string,
  jobItemRepo: JobItemRepository
): Promise<void> {
  await jobItemRepo.delete(itemId);
}
