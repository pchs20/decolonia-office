export interface JobItem {
  id: string;
  commercialDocumentId: string;
  position: number;
  title: string;
  description: string | null;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
}
