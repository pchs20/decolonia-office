"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkerForm } from "@/presentation/components/workers/WorkerForm";
import { WorkerSchema } from "@/api/schemas/worker-schema";

export default function NewWorkerPage() {
  const router = useRouter();

  const handleSuccess = (worker: WorkerSchema) => {
    router.push(`/workers/${worker.id}`);
  };

  const handleCancel = () => {
    router.push("/workers");
  };

  return (
    <div className="p-6">
      <Link href="/workers" className="text-blue-600 mb-4 inline-block">
        ← Back to Workers
      </Link>
      <div className="max-w-2xl">
        <WorkerForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
