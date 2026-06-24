import { JobItem } from "@/domain/value-objects/job-item";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";

export function mapJobItemToResponse(item: JobItem): JobItemResponse {
  return {
    id: item.id,
    commercialDocumentId: item.commercialDocumentId,
    position: item.position,
    title: item.title,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice
  };
}
