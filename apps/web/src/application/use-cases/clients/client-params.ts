import { ClientType } from "@/domain/entities/client";

export interface CreateClientParams {
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

export interface UpdateClientParams {
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
