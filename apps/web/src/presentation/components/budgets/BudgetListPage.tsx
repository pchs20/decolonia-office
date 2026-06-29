"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { useBudgets } from "@/presentation/hooks/commercial-document-hooks";
import { getErrorTranslationKey } from "@/presentation/utils/error-translation";
import { formatDocumentNumber } from "@/presentation/utils/document-number";

interface BudgetListPageProps {
  clientId?: string;
}

export function BudgetListPage({ clientId }: BudgetListPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { list, loading, error } = useBudgets();
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");

  const fetchBudgets = async () => {
    try {
      const response = await list(page, limit, clientId, search || undefined);
      const resolved = Array.isArray(response) ? { budgets: response, total: response.length } : response;
      setBudgets(resolved?.budgets || []);
      setTotal(resolved?.total || 0);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    }
  };

  useEffect(() => {
    void fetchBudgets();
  }, [clientId, list, page, limit, search]);

  useEffect(() => {
    setPage(1);
  }, [clientId]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("budgets.title")}</h1>
        <Link
          href={clientId ? `/budgets/new?clientId=${clientId}` : "/budgets/new"}
          className="px-4 py-2 bg-budgets text-white rounded hover:bg-budgets/90"
        >
          + {t("budgets.addButton")}
        </Link>
      </div>

      {clientId ? (
        <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
          {t("budgets.filters.clientApplied")} <Link href="/budgets" className="text-blue-700 underline">{t("common.clearFilter")}</Link>
        </div>
      ) : null}

      <div>
        <input
          type="text"
          placeholder={t("budgets.searchPlaceholder")}
          value={search}
          onChange={event => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {t(getErrorTranslationKey(error) as any)}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">{t("common.loading")}</div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? t("budgets.noResultsSearch") : t("budgets.empty")} <Link href={clientId ? `/budgets/new?clientId=${clientId}` : "/budgets/new"} className="text-budgets hover:underline">{t("budgets.addButton")}</Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">{t("commercialDocuments.fields.number")}</th>
                  <th className="px-4 py-2 text-left font-semibold">{t("commercialDocuments.fields.client")}</th>
                  <th className="px-4 py-2 text-left font-semibold">{t("commercialDocuments.fields.worker")}</th>
                  <th className="px-4 py-2 text-left font-semibold">{t("common.city")}</th>
                  <th className="px-4 py-2 text-right font-semibold">{t("commercialDocuments.totalAmount")}</th>
                  <th className="px-4 py-2 text-left font-semibold">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map(budget => (
                  <tr
                    key={budget.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/budgets/${budget.id}`)}
                  >
                    <td className="px-4 py-2 font-mono font-medium">
                      <Link
                        href={`/budgets/${budget.id}`}
                        className="text-gray-900 hover:underline"
                        onClick={event => event.stopPropagation()}
                      >
                        {formatDocumentNumber(budget.number, "budget", t)}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{budget.client?.name || "-"}</td>
                    <td className="px-4 py-2">{budget.worker?.name || "-"}</td>
                    <td className="px-4 py-2">{budget.client?.workAddress?.city || budget.worker?.workAddress?.city || "-"}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ${budget.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-2 space-x-3">
                      <Link
                        href={`/budgets/${budget.id}`}
                        className="px-2 py-1 text-sm bg-budgets/10 text-budgets rounded hover:bg-budgets/20"
                        onClick={event => event.stopPropagation()}
                      >
                        {t("common.view")}
                      </Link>
                      <Link
                        href={`/budgets/${budget.id}?edit=1`}
                        className="px-2 py-1 text-sm bg-budgets/10 text-budgets rounded hover:bg-budgets/20"
                        onClick={event => event.stopPropagation()}
                      >
                        {t("common.edit")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {t("common.showingRange", { from: (page - 1) * limit + 1, to: Math.min(page * limit, total), total })}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {t("common.previous")}
              </button>
              <span className="px-3 py-1">
                {t("common.pageOf", { page, total: totalPages })}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
