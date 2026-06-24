"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { WorkerSchema, WorkerListResponseSchema } from "@/api/schemas/worker-schema";
import { WorkerService } from "@/presentation/api-clients/worker.service";

export function WorkerListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [workers, setWorkers] = useState<WorkerSchema[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchWorkers = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: WorkerListResponseSchema = await WorkerService.getAll(pageNum, limit, searchQuery);
      setWorkers(data.workers);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('workers.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(page, search);
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await WorkerService.delete(id);
      setDeleteConfirm(null);
      fetchWorkers(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('workers.errors.deleteFailed'));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('workers.title')}</h1>
        <Link
          href="/workers/new"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {t('workers.addButton')}
        </Link>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('workers.searchPlaceholder')}
          value={search}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">{t('common.loading')}</div>
      ) : workers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? t('workers.noResultsSearch') : t('workers.empty')}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.name')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.phone')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.city')}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(worker => {
                  return (
                    <tr
                      key={worker.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/workers/${worker.id}`)}
                    >
                      <td className="px-4 py-3 font-medium">
                        <Link
                          href={`/workers/${worker.id}`}
                          className="text-blue-600 hover:underline"
                          onClick={event => event.stopPropagation()}
                        >
                          {worker.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{worker.phone || "-"}</td>
                      <td className="px-4 py-3">{worker.city || "-"}</td>
                      <td className="px-4 py-3 space-x-2">
                        <Link
                          href={`/workers/${worker.id}`}
                          className="px-2 py-1 text-sm bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200"
                          onClick={event => event.stopPropagation()}
                        >
                          {t('common.view')}
                        </Link>
                        <Link
                          href={`/workers/${worker.id}/edit`}
                          className="px-2 py-1 text-sm bg-sky-100 text-sky-800 rounded hover:bg-sky-200"
                          onClick={event => event.stopPropagation()}
                        >
                          {t('common.edit')}
                        </Link>
                        <button
                          onClick={event => {
                            event.stopPropagation();
                            setDeleteConfirm(worker.id);
                          }}
                          className="px-2 py-1 text-sm bg-rose-100 text-rose-800 rounded hover:bg-rose-200"
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
          <div role="dialog" aria-modal="true" className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{t('common.confirmDelete')}</h3>
            <p className="mb-6">{t('workers.deleteConfirm')}</p>
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
