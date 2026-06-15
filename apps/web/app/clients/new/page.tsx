"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/components/clients/ClientForm";
import { Client } from "@/types/client";

export default function NewClientPage() {
  const router = useRouter();

  const handleSuccess = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const handleCancel = () => {
    router.push("/clients");
  };

  return (
    <div className="p-6">
      <Link href="/clients" className="text-blue-600 mb-4 inline-block">
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
