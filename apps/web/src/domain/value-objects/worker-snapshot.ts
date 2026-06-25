import { Address } from "@/domain/value-objects/address";

export interface WorkerSnapshot {
  name: string;
  taxId: string;
  phone: string | null;
  email: string | null;
  workAddress: Address;
  billingAddress: Address;
}
