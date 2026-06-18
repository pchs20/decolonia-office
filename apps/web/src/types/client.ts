export type ClientType = "individual" | "company";

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  workAddress: Address;
  billingAddress: Address;
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

export interface CreateClientInput {
  name: string;
  type: ClientType;
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

export interface UpdateClientInput {
  name?: string;
  type?: ClientType;
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

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}
