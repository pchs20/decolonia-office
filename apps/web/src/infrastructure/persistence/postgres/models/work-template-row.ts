export interface WorkTemplateRow {
  id: string;
  title: string;
  description: string | null;
  default_unit_price: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
