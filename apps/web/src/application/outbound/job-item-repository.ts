import { JobItem } from "@/domain/value-objects/job-item";

export interface JobItemRepository {
  create(jobItem: JobItem): Promise<JobItem>;
  findByDocumentId(commercialDocumentId: string): Promise<JobItem[]>;
  update(jobItem: JobItem): Promise<JobItem>;
  delete(id: string): Promise<void>;
}
