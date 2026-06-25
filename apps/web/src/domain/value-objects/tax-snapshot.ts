import { TaxBehavior } from "@/domain/value-objects/document-enums";

export interface TaxSnapshot {
  name: string;
  rate: number;
  behavior: TaxBehavior;
}
