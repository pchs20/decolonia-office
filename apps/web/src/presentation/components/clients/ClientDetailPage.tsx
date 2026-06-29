"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ClientSchema } from "@/api/schemas/client-schema";
import { ClientService } from "@/presentation/api-clients/client.service";
import { ClientForm } from "./ClientForm";

interface ClientDetailPageProps {
  clientId: string;
  startInEditMode?: boolean;
}

export function ClientDetailPage({ clientId, startInEditMode = false }: ClientDetailPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
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
      setError(err instanceof Error ? err.message : t('clients.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedClient: ClientSchema) => {
    setClient(updatedClient);
    setEditing(false);
    setHasUnsavedChanges(false);
    setSuccessMessage(t('clients.successUpdate', { name: updatedClient.name }));
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const confirmDiscardChanges = (): boolean => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm(t('common.unsavedChanges'));
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
    return <div className="p-4 md:p-6 text-center">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
        <Link href="/clients" className="mt-4 inline-block text-gray-500 hover:text-gray-700">
          {t('clients.backToList')}
        </Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-4 md:p-6">
        <div>{t('clients.notFound')}</div>
        <Link href="/clients" className="mt-4 inline-block text-gray-500 hover:text-gray-700">
          {t('clients.backToList')}
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="p-4 md:p-6">
        <button
          type="button"
          onClick={handleBackFromEdit}
          className="text-gray-500 hover:text-gray-700 mb-4 inline-block"
        >
          {t('common.back')}
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
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-start mb-6">
        <Link href="/clients" className="text-gray-500 hover:text-gray-700">
          {t('clients.backToList')}
        </Link>
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-clients text-white rounded hover:bg-clients/90"
        >
          {t('common.edit')}
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg border p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">{client.name}</h1>

        <div className="mb-6 flex gap-3 flex-wrap">
          <Link
            href={`/budgets?clientId=${client.id}`}
            className="px-3 py-2 rounded border border-budgets/40 text-budgets hover:bg-budgets/10 text-sm"
          >
            {t('clients.links.viewBudgets')}
          </Link>
          <Link
            href={`/budgets/new?clientId=${client.id}`}
            className="px-3 py-2 rounded border border-budgets text-budgets hover:bg-budgets/10 text-sm"
          >
            + {t('budgets.addButton')}
          </Link>
          <Link
            href={`/invoices?clientId=${client.id}`}
            className="px-3 py-2 rounded border border-invoices/40 text-invoices hover:bg-invoices/10 text-sm"
          >
            {t('clients.links.viewInvoices')}
          </Link>
          <Link
            href={`/invoices/new?clientId=${client.id}`}
            className="px-3 py-2 rounded border border-invoices text-invoices hover:bg-invoices/10 text-sm"
          >
            + {t('invoices.addButton')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('clients.fields.type')}</label>
            <p className="capitalize text-lg">{client.type}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('clients.fields.taxId')}</label>
            <p className="text-lg">{client.taxId}</p>
          </div>

          {client.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t('common.phone')}</label>
              <p className="text-lg">
                <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                  {client.phone}
                </a>
              </p>
            </div>
          )}

          {client.email && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t('profile.fields.email')}</label>
              <p className="text-lg">
                <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                  {client.email}
                </a>
              </p>
            </div>
          )}

          <div className="md:col-span-2 pt-2">
            <h2 className="text-sm font-semibold text-gray-700">{t('clients.fields.address')}</h2>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('clients.fields.workAddress')}</label>
            <p className="text-lg">{client.street}</p>
            <p className="text-sm text-gray-600">
              {client.city} {client.postalCode}
            </p>
          </div>

          {client.billingStreet && client.billingCity && client.billingPostalCode && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">{t('clients.fields.billingAddress')}</label>
              <p className="text-lg">{client.billingStreet}</p>
              <p className="text-sm text-gray-600">
                {client.billingCity} {client.billingPostalCode}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('clients.fields.created')}</label>
            <p className="text-sm text-gray-600">
              {new Date(client.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('clients.fields.lastUpdated')}</label>
            <p className="text-sm text-gray-600">
              {new Date(client.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
