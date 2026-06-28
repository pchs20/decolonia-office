import { WorkerDetailPage } from "@/presentation/components/workers/WorkerDetailPage";

interface EditWorkerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditWorkerPage({ params }: EditWorkerPageProps) {
  const { id } = await params;
  return <WorkerDetailPage workerId={id} startInEditMode />;
}
