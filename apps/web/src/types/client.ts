export type ClientType = "individual" | "company";

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  address: string;
  billingAddress: string | null;
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
  address: string;
  billingAddress?: string;
  taxId: string;
  phone?: string;
  email?: string;
}

export interface UpdateClientInput {
  name?: string;
  type?: ClientType;
  address?: string;
  billingAddress?: string;
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
