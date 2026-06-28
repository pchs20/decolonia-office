import { WorkerDetailPage } from "@/presentation/components/workers/WorkerDetailPage";

interface WorkerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkerPage({ params }: WorkerPageProps) {
  const { id } = await params;
  return <WorkerDetailPage workerId={id} />;
}
