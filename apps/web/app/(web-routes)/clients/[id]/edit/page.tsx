import { ClientDetailPage } from "@/presentation/components/clients/ClientDetailPage";

interface EditClientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  return <ClientDetailPage clientId={id} startInEditMode />;
}
