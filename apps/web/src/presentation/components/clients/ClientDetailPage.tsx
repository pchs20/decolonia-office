"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientSchema } from "@/api/schemas/client-schema";
import { ClientService } from "@/presentation/api-clients/client.service";
import { ClientForm } from "./ClientForm";

interface ClientDetailPageProps {
  clientId: string;
  startInEditMode?: boolean;
}

export function ClientDetailPage({ clientId, startInEditMode = false }: ClientDetailPageProps) {
  const router = useRouter();
  const [client, setClient] = useState<ClientSchema | null>(null);
  const [editing, setEditing] = useState(startInEditMode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClientService.getById(clientId);
      setClient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch client");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedClient: ClientSchema) => {
    setClient(updatedClient);
    setEditing(false);
    setHasUnsavedChanges(false);
    setSuccessMessage(`Client ${updatedClient.name} updated successfully`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const confirmDiscardChanges = (): boolean => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm("You have unsaved changes. Discard them and leave edit mode?");
  };

  const handleBackFromEdit = () => {
    if (!confirmDiscardChanges()) {
      return;
    }

    if (startInEditMode) {
      router.push(`/clients/${clientId}`);
      return;
    }

    setHasUnsavedChanges(false);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    if (startInEditMode) {
      router.push(`/clients/${clientId}`);
      return;
    }
    setHasUnsavedChanges(false);
    setEditing(false);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
        <Link href="/clients" className="mt-4 inline-block text-blue-600">
          Back to Clients
        </Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div>Client not found</div>
        <Link href="/clients" className="mt-4 inline-block text-blue-600">
          Back to Clients
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={handleBackFromEdit}
          className="text-blue-600 mb-4 inline-block"
        >
          ← Back
        </button>
        <ClientForm
          client={client}
          onSuccess={handleSuccess}
          onCancel={handleCancelEdit}
          onDirtyChange={setHasUnsavedChanges}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <Link href="/clients" className="text-blue-600">
          ← Back to Clients
        </Link>
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg border p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">{client.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
            <p className="capitalize text-lg">{client.type}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tax ID</label>
            <p className="text-lg">{client.taxId}</p>
          </div>

          {client.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <p className="text-lg">
                <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                  {client.phone}
                </a>
              </p>
            </div>
          )}

          {client.email && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-lg">
                <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                  {client.email}
                </a>
              </p>
            </div>
          )}

          <div className="md:col-span-2 pt-2">
            <h2 className="text-sm font-semibold text-gray-700">Address</h2>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Work Address</label>
            <p className="text-lg">{client.street}</p>
            <p className="text-sm text-gray-600">
              {client.city} {client.postalCode}
            </p>
          </div>

          {client.billingStreet && client.billingCity && client.billingPostalCode && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Billing Address</label>
              <p className="text-lg">{client.billingStreet}</p>
              <p className="text-sm text-gray-600">
                {client.billingCity} {client.billingPostalCode}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
            <p className="text-sm text-gray-600">
              {new Date(client.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
            <p className="text-sm text-gray-600">
              {new Date(client.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
