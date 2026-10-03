import { Invoice } from "@/domain/entities/invoice";

export interface InvoiceRepository {
  create(invoice: Invoice): Promise<Invoice>;
  getById(id: string): Promise<Invoice>;
  findByNumber?(number: string, excludeId?: string): Promise<Invoice | null>;
  list(page: number, limit: number, clientId?: string, year?: number, search?: string): Promise<{
    invoices: Invoice[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(invoice: Invoice): Promise<Invoice>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<Invoice>;
}
