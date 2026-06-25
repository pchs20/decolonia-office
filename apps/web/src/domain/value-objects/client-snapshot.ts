import { Address } from "@/domain/value-objects/address";

export interface ClientSnapshot {
  name: string;
  taxId: string;
  phone: string | null;
  email: string | null;
  workAddress: Address;
  billingAddress: Address;
}
