export interface JobItemRow {
  id: string;
  commercial_document_id: string;
  position: number;
  title: string;
  description: string | null;
  quantity: string | null;
  unit_price: string | null;
  total_price: string | null;
  created_at: Date;
  updated_at: Date;
}
