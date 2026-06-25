export interface WorkTemplate {
  id: string;
  title: string;
  description: string | null;
  defaultUnitPrice: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
