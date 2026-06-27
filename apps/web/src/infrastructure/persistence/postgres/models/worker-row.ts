export type WorkerRow = {
  id: string;
  name: string;
  street: string;
  city: string;
  postal_code: string;
  billing_street: string | null;
  billing_city: string | null;
  billing_postal_code: string | null;
  tax_id: string;
  phone: string | null;
  email: string | null;
  bank_account: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};