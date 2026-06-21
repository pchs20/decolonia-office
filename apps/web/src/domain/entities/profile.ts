import { Address } from "@/domain/value-objects/address";

export interface Profile {
  id: string;
  name: string;
  workAddress: Address;
  billingAddress: Address;
  taxId: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
