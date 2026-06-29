"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ClientSchema, ClientListResponseSchema } from "@/api/schemas/client-schema";
import { ClientService } from "@/presentation/api-clients/client.service";

export function ClientListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [clients, setClients] = useState<ClientSchema[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchClients = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: ClientListResponseSchema = await ClientService.getAll(pageNum, limit, searchQuery);
      setClients(data.clients);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('clients.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(page, search);
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await ClientService.delete(id);
      setDeleteConfirm(null);
      fetchClients(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('clients.errors.deleteFailed'));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('clients.title')}</h1>
        <Link
          href="/clients/new"
          className="px-4 py-2 bg-clients text-white rounded hover:bg-clients/90"
        >
          {t('clients.addButton')}
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('clients.searchPlaceholder')}
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">{t('common.loading')}</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? t('clients.noResultsSearch') : t('clients.empty')}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.name')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('clients.fields.type')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.phone')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.city')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => {
                  return (
                    <tr
                      key={client.id}
                      role="link"
                      tabIndex={0}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/clients/${client.id}`)}
                      onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/clients/${client.id}`);
                        }
                      }}
                    >
                      <td className="px-4 py-3 font-medium">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-gray-900 hover:underline"
                          onClick={event => event.stopPropagation()}
                        >
                          {client.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 capitalize">{client.type}</td>
                      <td className="px-4 py-3">{client.phone || "-"}</td>
                      <td className="px-4 py-3">{client.city || "-"}</td>
                      <td className="px-4 py-3 space-x-2">
                        <Link
                          href={`/clients/${client.id}`}
                          className="px-2 py-1 text-sm bg-clients/10 text-clients rounded hover:bg-clients/20"
                          onClick={event => event.stopPropagation()}
                        >
                          {t('common.view')}
                        </Link>
                        <Link
                          href={`/budgets?clientId=${client.id}`}
                          className="px-2 py-1 text-sm bg-budgets/10 text-budgets rounded hover:bg-budgets/20"
                          onClick={event => event.stopPropagation()}
                        >
                          {t('clients.links.budgets')}
                        </Link>
                        <Link
                          href={`/invoices?clientId=${client.id}`}
                          className="px-2 py-1 text-sm bg-invoices/10 text-invoices rounded hover:bg-invoices/20"
                          onClick={event => event.stopPropagation()}
                        >
                          {t('clients.links.invoices')}
                        </Link>
                        <Link
                          href={`/clients/${client.id}/edit`}
                          className="px-2 py-1 text-sm bg-clients/10 text-clients rounded hover:bg-clients/20"
                          onClick={event => event.stopPropagation()}
                        >
                          {t('common.edit')}
                        </Link>
                        <button
                          onClick={event => {
                            event.stopPropagation();
                            setDeleteConfirm(client.id);
                          }}
                          className="px-2 py-1 text-sm bg-danger/10 text-danger rounded hover:bg-danger/20"
                        >
                          {t('common.delete')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {t('common.showingRange', { from: (page - 1) * limit + 1, to: Math.min(page * limit, total), total })}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {t('common.previous')}
              </button>
              <span className="px-3 py-1">
                {t('common.pageOf', { page, total: totalPages })}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            className="bg-white p-6 rounded-lg"
          >
            <h3 id="confirm-delete-title" className="text-lg font-semibold mb-4">{t('common.confirmDelete')}</h3>
            <p className="mb-6">{t('clients.deleteConfirm')}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}