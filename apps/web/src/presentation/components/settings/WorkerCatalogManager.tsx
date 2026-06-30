"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useWorkers } from "@/presentation/hooks/workers-hook";

export function WorkerCatalogManager() {
  const { t } = useTranslation();
  const router = useRouter();
  const { workers, loading, list, setPrimary, remove } = useWorkers();
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSetPrimary = async (id: string) => {
    setError(null);
    setProcessingId(id);
    try {
      await setPrimary(id);
      await list();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/settings/workers/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("workers.confirmDelete"))) {
      return;
    }
    setError(null);
    setProcessingId(id);
    try {
      await remove(id);
      await list();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("catalog.tabs.workers")}</h3>
        <button
          onClick={() => router.push("/settings/workers/new")}
          className="px-3 py-1 bg-settings text-white text-sm rounded hover:bg-settings/90"
        >
          + {t("workers.addButton")}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">{t("common.loading")}</div>
      ) : workers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t("workers.empty")}</div>
      ) : (
        <div className="border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">{t("common.name")}</th>
                <th className="px-4 py-2 text-left font-semibold">{t("workers.fields.taxId")}</th>
                <th className="px-4 py-2 text-left font-semibold">{t("common.city")}</th>
                <th className="px-4 py-2 text-right font-semibold">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(worker => (
                <tr
                  key={worker.id}
                  role="link"
                  tabIndex={0}
                  className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/settings/workers/${worker.id}`)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/settings/workers/${worker.id}`);
                    }
                  }}
                >
                  <td className="px-4 py-2 font-medium">
                    {worker.isPrimary && (
                      <span className="text-yellow-400 mr-1" title={t("workers.primaryBadge")}>★</span>
                    )}
                    <Link
                      href={`/settings/workers/${worker.id}`}
                      className="text-gray-900 hover:underline"
                      onClick={event => event.stopPropagation()}
                    >
                      {worker.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{worker.taxId}</td>
                  <td className="px-4 py-2">{worker.city}</td>
                  <td className="px-4 py-2 text-right space-x-2" onClick={e => e.stopPropagation()}>
                    {!worker.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(worker.id)}
                        disabled={processingId === worker.id}
                        className="px-2 py-1 bg-settings/10 text-settings text-xs rounded hover:bg-settings/20 disabled:opacity-50"
                      >
                        {processingId === worker.id ? t("common.loading") : t("workers.setAsPrimary")}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(worker.id)}
                      className="px-2 py-1 bg-settings/10 text-settings text-xs rounded hover:bg-settings/20"
                    >
                      {t("common.edit")}
                    </button>
                    {!worker.isPrimary && (
                      <button
                        onClick={() => handleDelete(worker.id)}
                        disabled={processingId === worker.id}
                        className="px-2 py-1 bg-danger/10 text-danger text-xs rounded hover:bg-danger/20 disabled:opacity-50"
                      >
                        {t("common.delete")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
