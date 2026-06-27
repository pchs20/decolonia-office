export interface CreateWorkerParams {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  taxId: string;
  phone?: string;
  email?: string;
  bankAccount?: string | null;
}

export interface UpdateWorkerParams {
  name?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  taxId?: string;
  phone?: string;
  email?: string;
  bankAccount?: string | null;
}
