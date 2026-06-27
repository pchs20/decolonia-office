import { ProfileSchema } from "@/api/schemas/profile-schema";

export interface DocumentAddressSchema {
  street: string;
  city: string;
  postalCode: string;
}

export interface DocumentAddressInput {
  street: string;
  city: string;
  postalCode: string;
}

export interface DocumentPartyInput {
  name: string;
  taxId: string;
  phone?: string | null;
  email?: string | null;
  bankAccount?: string | null;
  workAddress: DocumentAddressInput;
  billingAddress: DocumentAddressInput;
}

export interface DocumentPartySchema extends Pick<ProfileSchema, "id" | "name" | "taxId" | "phone" | "email"> {
  bankAccount?: string | null;
  workAddress: DocumentAddressSchema;
  billingAddress: DocumentAddressSchema;
}

export interface DocumentTaxSchema {
  name: string;
  rate: number;
  behavior: string;
}

export interface CommercialDocumentResponse {
  id: string;
  number: string;
  pricingMode: "computed" | "manual-subtotal";
  manualSubtotalAmount: number | null;
  client: DocumentPartySchema;
  worker: DocumentPartySchema;
  notes: string | null;
  tax: DocumentTaxSchema | null;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
