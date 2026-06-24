import { InvoiceListPage } from "@/presentation/components/invoices/InvoiceListPage";

interface InvoicesPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const { clientId } = await searchParams;

  return (
    <div className="p-6">
      <InvoiceListPage clientId={clientId} />
    </div>
  );
}
