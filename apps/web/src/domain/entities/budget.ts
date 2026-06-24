import { CommercialDocument } from "@/domain/entities/commercial-document";

export interface Budget extends CommercialDocument {
  deliveredAt: Date | null;
}
