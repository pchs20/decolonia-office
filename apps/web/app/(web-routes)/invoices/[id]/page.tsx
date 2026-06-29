"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { InvoiceResponse } from "@/api/schemas/invoice-schemas";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";
import { InvoiceService } from "@/presentation/api-clients/invoice.service";
import { BudgetService } from "@/presentation/api-clients/budget.service";
import { CommercialDocumentView } from "@/presentation/components/commercial-documents/CommercialDocumentView";
import { InvoiceForm } from "@/presentation/components/invoices/InvoiceForm";
import { JobItemDisplay } from "@/presentation/components/commercial-documents/JobItemsTable";
import { formatDocumentNumber } from "@/presentation/utils/document-number";

interface InvoiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [items, setItems] = useState<JobItemResponse[]>([]);
  const [linkedBudget, setLinkedBudget] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    void params.then(value => setInvoiceId(value.id));
  }, [params]);

  useEffect(() => {
    if (searchParams.get("edit") === "1") {
      setEditing(true);
    }
  }, [searchParams]);

  const loadInvoice = useCallback(async () => {
    if (!invoiceId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [invoiceData, itemData] = await Promise.all([
        InvoiceService.getById(invoiceId),
        InvoiceService.getItems(invoiceId)
      ]);

      setInvoice(invoiceData);
      setItems(itemData);

      if (invoiceData.sourceBudgetId) {
        try {
          const sourceBudget = await BudgetService.getById(invoiceData.sourceBudgetId);
          setLinkedBudget(sourceBudget);
        } catch {
          setLinkedBudget(null);
        }
      } else {
        setLinkedBudget(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("invoices.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [invoiceId, t]);

  useEffect(() => {
    void loadInvoice();
  }, [loadInvoice]);

  const mapItem = (item: JobItemResponse): JobItemDisplay => ({
    id: item.id,
    position: item.position,
    title: item.title,
    description: item.description ?? undefined,
    quantity: item.quantity ?? undefined,
    unitPrice: item.unitPrice ?? undefined,
    totalPrice: item.totalPrice ?? undefined
  });

  const confirmDiscardChanges = (): boolean => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm(t("common.unsavedChanges"));
  };

  const handleBackFromEdit = () => {
    if (!confirmDiscardChanges()) {
      return;
    }

    router.push("/invoices");
  };

  const handleCancelEdit = () => {
    setHasUnsavedChanges(false);
    setEditing(false);
  };

  if (loading) {
    return <div className="p-4 md:p-6">{t("common.loading")}</div>;
  }

  if (error || !invoice) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Link href="/invoices" className="text-gray-500 hover:text-gray-700">
          {t("invoices.backToList")}
        </Link>
        <div className="bg-red-50 p-4 rounded border border-red-200 text-sm text-red-700">
          {error || t("invoices.errors.fetchFailed")}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        {editing ? (
          <button type="button" onClick={handleBackFromEdit} className="text-gray-500 hover:text-gray-700">
            {t("invoices.backToList")}
          </button>
        ) : (
          <Link href="/invoices" className="text-gray-500 hover:text-gray-700">
            {t("invoices.backToList")}
          </Link>
        )}
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  if (!invoiceId) return;
                  const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
                  if (!response.ok) return;
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `factura-${invoice.number}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 text-sm bg-invoices/10 text-invoices rounded hover:bg-invoices/20"
              >
                {t("invoices.exportPdf")}
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-sm bg-invoices/10 text-invoices rounded hover:bg-invoices/20"
              >
                {t("common.edit")}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {linkedBudget ? (
        <div className="rounded border bg-blue-50 border-blue-200 p-3 text-sm">
          <span className="font-medium">{t("invoices.fields.linkedBudget")}: </span>
          <Link className="text-blue-700 underline" href={`/budgets/${linkedBudget.id}`}>
            {formatDocumentNumber(linkedBudget.number, "budget", t)}
          </Link>
        </div>
      ) : null}

      {editing ? (
        <InvoiceForm
          invoice={invoice}
          initialItems={items.map(mapItem)}
          onSuccess={updated => {
            setInvoice(updated);
            setEditing(false);
            setHasUnsavedChanges(false);
            void loadInvoice();
          }}
          onCancel={handleCancelEdit}
          onDirtyChange={setHasUnsavedChanges}
        />
      ) : (
        <CommercialDocumentView
          documentType="invoice"
          number={invoice.number}
          client={{
            ...invoice.client,
            phone: invoice.client.phone ?? undefined,
            email: invoice.client.email ?? undefined
          }}
          worker={{
            ...invoice.worker,
            phone: invoice.worker.phone ?? undefined,
            email: invoice.worker.email ?? undefined
          }}
          tax={invoice.tax ?? undefined}
          notes={invoice.notes ?? undefined}
          issuedAt={invoice.issuedAt ? new Date(invoice.issuedAt).toISOString() : undefined}
          subtotalAmount={invoice.subtotalAmount}
          taxAmount={invoice.taxAmount}
          totalAmount={invoice.totalAmount}
          items={items.map(mapItem)}
        />
      )}
    </div>
  );
}
