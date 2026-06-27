"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { InvoiceResponse } from "@/api/schemas/invoice-schemas";
import { useBudgets, useInvoices } from "@/presentation/hooks/commercial-document-hooks";

const RECENT_LIMIT = 5;

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { list: listBudgets } = useBudgets();
  const { list: listInvoices } = useInvoices();

  const [recentBudgets, setRecentBudgets] = useState<BudgetResponse[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<InvoiceResponse[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void listBudgets(1, RECENT_LIMIT).then((res) => {
      if (cancelled) return;
      const resolved = Array.isArray(res) ? res : res?.budgets ?? [];
      setRecentBudgets(resolved);
      setLoadingBudgets(false);
    }).catch(() => {
      if (!cancelled) setLoadingBudgets(false);
    });

    void listInvoices(1, RECENT_LIMIT).then((res) => {
      if (cancelled) return;
      const resolved = Array.isArray(res) ? res : res?.invoices ?? [];
      setRecentInvoices(resolved);
      setLoadingInvoices(false);
    }).catch(() => {
      if (!cancelled) setLoadingInvoices(false);
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/budgets/new"
          className="flex items-center justify-center rounded-2xl bg-blue-600 text-white font-semibold text-lg py-8 px-6 hover:bg-blue-700 active:bg-blue-800 transition-colors text-center leading-snug"
        >
          {t("dashboard.newBudget")}
        </Link>
        <Link
          href="/invoices/new"
          className="flex items-center justify-center rounded-2xl bg-green-600 text-white font-semibold text-lg py-8 px-6 hover:bg-green-700 active:bg-green-800 transition-colors text-center leading-snug"
        >
          {t("dashboard.newInvoice")}
        </Link>
      </div>

      {/* Recent budgets */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{t("dashboard.recentBudgets")}</h2>
          <Link href="/budgets" className="text-sm text-blue-600 hover:underline">
            {t("dashboard.seeAll")}
          </Link>
        </div>
        {loadingBudgets ? (
          <p className="text-gray-400 text-sm">{t("common.loading")}</p>
        ) : recentBudgets.length === 0 ? (
          <p className="text-gray-400 text-sm">{t("dashboard.emptyBudgets")}</p>
        ) : (
          <ul className="space-y-2">
            {recentBudgets.map((budget) => (
              <li key={budget.id}>
                <Link
                  href={`/budgets/${budget.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-gray-900">#{budget.number} · {budget.client.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(budget.createdAt)}</p>
                  </div>
                  <p className="font-semibold text-gray-800 text-right">{formatAmount(budget.totalAmount)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent invoices */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{t("dashboard.recentInvoices")}</h2>
          <Link href="/invoices" className="text-sm text-green-600 hover:underline">
            {t("dashboard.seeAll")}
          </Link>
        </div>
        {loadingInvoices ? (
          <p className="text-gray-400 text-sm">{t("common.loading")}</p>
        ) : recentInvoices.length === 0 ? (
          <p className="text-gray-400 text-sm">{t("dashboard.emptyInvoices")}</p>
        ) : (
          <ul className="space-y-2">
            {recentInvoices.map((invoice) => (
              <li key={invoice.id}>
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-green-300 hover:bg-green-50 active:bg-green-100 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-gray-900">#{invoice.number} · {invoice.client.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(invoice.createdAt)}</p>
                  </div>
                  <p className="font-semibold text-gray-800 text-right">{formatAmount(invoice.totalAmount)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
