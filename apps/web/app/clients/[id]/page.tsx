import { ClientDetailPage } from "@/components/clients/ClientDetailPage";

interface ClientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;
  return <ClientDetailPage clientId={id} />;
}
