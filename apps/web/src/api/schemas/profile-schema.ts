export interface ProfileSchema {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  billingStreet: string | null;
  billingCity: string | null;
  billingPostalCode: string | null;
  taxId: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileInput {
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
}

export interface UpdateProfileInput {
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
}
