"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InvoiceResponse } from "@/api/schemas/invoice-schemas";
import { useInvoices } from "@/presentation/hooks/commercial-document-hooks";
import { getErrorTranslationKey } from "@/presentation/utils/error-translation";
import { formatDocumentNumber } from "@/presentation/utils/document-number";
import { InvoiceService } from "@/presentation/api-clients/invoice.service";

interface InvoiceListPageProps {
  clientId?: string;
}

export function InvoiceListPage({ clientId }: InvoiceListPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { list, loading, error } = useInvoices();
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [yearFilter, setYearFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    try {
      const response = await list(page, limit, clientId, yearFilter ? parseInt(yearFilter) : undefined, search || undefined);
      const resolved = Array.isArray(response) ? { invoices: response, total: response.length } : response;
      setInvoices(resolved?.invoices || []);
      setTotal(resolved?.total || 0);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
  };

  useEffect(() => {
    void fetchInvoices();
  }, [clientId, page, limit, yearFilter, search, list]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const duplicateInvoice = async (id: string) => {
    if (!window.confirm(t("invoices.errors.duplicateConfirm"))) return;
    setDuplicatingId(id);
    try {
      const invoice = await InvoiceService.duplicate(id);
      router.push(`/invoices/${invoice.id}?edit=1`);
    } catch {
      window.alert(t("invoices.errors.duplicateFailed"));
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("invoices.title")}</h1>
        <Link
          href={clientId ? `/invoices/new?clientId=${clientId}` : "/invoices/new"}
          className="px-4 py-2 bg-invoices text-white rounded hover:bg-invoices/90"
        >
          + {t("invoices.addButton")}
        </Link>
      </div>

      {clientId ? (
        <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
          {t("invoices.filters.clientApplied")} <Link href="/invoices" className="text-blue-700 underline">{t("common.clearFilter")}</Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("common.search") || "Search"}</label>
          <input
            type="text"
            placeholder={t("invoices.searchPlaceholder")}
            value={search}
            onChange={event => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("invoices.fields.year")}</label>
          <select
            value={yearFilter}
            onChange={e => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          >
            <option value="">{t("invoices.fields.allYears")}</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {t(getErrorTranslationKey(error) as any)}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">{t("common.loading")}</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? t("invoices.noResultsSearch") : t("invoices.empty")} <Link href={clientId ? `/invoices/new?clientId=${clientId}` : "/invoices/new"} className="text-invoices hover:underline">{t("invoices.addButton")}</Link>
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
                {invoices.map(invoice => (
                  <tr
                    key={invoice.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <td className="px-4 py-2 font-mono font-medium">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-gray-900 hover:underline"
                        onClick={event => event.stopPropagation()}
                      >
                        {formatDocumentNumber(invoice.number, "invoice", t)}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{invoice.client?.name || "-"}</td>
                    <td className="px-4 py-2">{invoice.worker?.name || "-"}</td>
                    <td className="px-4 py-2">{invoice.client?.workAddress?.city || invoice.worker?.workAddress?.city || "-"}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ${invoice.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-2 space-x-3">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="px-2 py-1 text-sm bg-invoices/10 text-invoices rounded hover:bg-invoices/20"
                        onClick={event => event.stopPropagation()}
                      >
                        {t("common.view")}
                      </Link>
                      <Link
                        href={`/invoices/${invoice.id}?edit=1`}
                        className="px-2 py-1 text-sm bg-invoices/10 text-invoices rounded hover:bg-invoices/20"
                        onClick={event => event.stopPropagation()}
                      >
                        {t("common.edit")}
                      </Link>
                      <button
                        type="button"
                        disabled={duplicatingId === invoice.id}
                        className="px-2 py-1 text-sm bg-invoices/10 text-invoices rounded hover:bg-invoices/20 disabled:opacity-50"
                        onClick={event => {
                          event.stopPropagation();
                          void duplicateInvoice(invoice.id);
                        }}
                      >
                        {t("common.duplicate")}
                      </button>
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
