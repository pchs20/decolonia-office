import { JobItem } from "@/domain/value-objects/job-item";
import { JobItemRow } from "@/infrastructure/persistence/postgres/models/job-item-row";

export function mapJobItemRow(row: JobItemRow): JobItem {
  return {
    id: row.id,
    commercialDocumentId: row.commercial_document_id,
    position: row.position,
    title: row.title,
    description: row.description,
    quantity: row.quantity ? Number(row.quantity) : null,
    unitPrice: row.unit_price ? Number(row.unit_price) : null,
    totalPrice: row.total_price ? Number(row.total_price) : null
  };
}
