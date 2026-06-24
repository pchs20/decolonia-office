import { TaxBehavior } from "@/domain/value-objects/document-enums";

export interface Tax {
  id: string;
  name: string;
  rate: number;
  behavior: TaxBehavior;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
