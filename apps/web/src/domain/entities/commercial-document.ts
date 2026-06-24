import { ClientSnapshot } from "@/domain/value-objects/client-snapshot";
import { PricingMode } from "@/domain/value-objects/pricing-mode";
import { WorkerSnapshot } from "@/domain/value-objects/worker-snapshot";
import { TaxSnapshot } from "@/domain/value-objects/tax-snapshot";

export interface CommercialDocument {
  id: string;
  number: string;
  clientId: string;
  clientSnapshot: ClientSnapshot;
  workerId: string;
  workerSnapshot: WorkerSnapshot;
  notes: string | null;
  taxSnapshot: TaxSnapshot | null;
  pricingMode: PricingMode;
  manualSubtotalAmount: number | null;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
