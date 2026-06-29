"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/presentation/components/clients/ClientForm";
import { ClientSchema } from "@/api/schemas/client-schema";

export default function NewClientPage() {
  const router = useRouter();

  const handleSuccess = (client: ClientSchema) => {
    router.push(`/clients/${client.id}`);
  };

  const handleCancel = () => {
    router.push("/clients");
  };

  return (
    <div className="p-4 md:p-6">
      <Link href="/clients" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← Back to Clients
      </Link>
      <div className="max-w-2xl">
        <ClientForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
