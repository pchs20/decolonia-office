"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";
import { BudgetService } from "@/presentation/api-clients/budget.service";
import { CommercialDocumentView } from "@/presentation/components/commercial-documents/CommercialDocumentView";
import { BudgetForm } from "@/presentation/components/commercial-documents/BudgetForm";
import { JobItemDisplay } from "@/presentation/components/commercial-documents/JobItemsTable";

interface BudgetDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BudgetDetailPage({ params }: BudgetDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [items, setItems] = useState<JobItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  useEffect(() => {
    void params.then(value => setBudgetId(value.id));
  }, [params]);

  useEffect(() => {
    if (searchParams.get("edit") === "1") {
      setEditing(true);
    }
  }, [searchParams]);

  const loadBudget = useCallback(async () => {
    if (!budgetId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [budgetData, itemData] = await Promise.all([
        BudgetService.getById(budgetId),
        BudgetService.getItems(budgetId)
      ]);
      setBudget(budgetData);
      setItems(itemData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("budgets.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [budgetId, t]);

  useEffect(() => {
    void loadBudget();
  }, [loadBudget]);

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

    router.push("/budgets");
  };

  const handleCancelEdit = () => {
    setHasUnsavedChanges(false);
    setEditing(false);
  };

  const handleDuplicate = async () => {
    if (!budgetId || !window.confirm(t("budgets.errors.duplicateConfirm"))) return;
    setDuplicating(true);
    try {
      const duplicate = await BudgetService.duplicate(budgetId);
      router.push(`/budgets/${duplicate.id}?edit=1`);
    } catch {
      window.alert(t("budgets.errors.duplicateFailed"));
    } finally {
      setDuplicating(false);
    }
  };

  if (loading) {
    return <div className="p-4 md:p-6">{t("common.loading")}</div>;
  }

  if (error || !budget) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Link href="/budgets" className="text-gray-500 hover:text-gray-700">
          {t("budgets.backToList")}
        </Link>
        <div className="bg-red-50 p-4 rounded border border-red-200 text-sm text-red-700">
          {error || t("budgets.errors.fetchFailed")}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        {editing ? (
          <button type="button" onClick={handleBackFromEdit} className="text-gray-500 hover:text-gray-700">
            {t("budgets.backToList")}
          </button>
        ) : (
          <Link href="/budgets" className="text-gray-500 hover:text-gray-700">
            {t("budgets.backToList")}
          </Link>
        )}
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  if (!budgetId) return;
                  const response = await fetch(`/api/budgets/${budgetId}/pdf`);
                  if (!response.ok) return;
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `presupuesto-${budget.number}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 text-sm bg-budgets/10 text-budgets rounded hover:bg-budgets/20"
              >
                {t("budgets.exportPdf")}
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-3 py-1 text-sm bg-budgets/10 text-budgets rounded hover:bg-budgets/20"
              >
                {t("common.edit")}
              </button>
              <button
                type="button"
                disabled={duplicating}
                onClick={() => void handleDuplicate()}
                className="px-3 py-1 text-sm bg-budgets/10 text-budgets rounded hover:bg-budgets/20 disabled:opacity-50"
              >
                {t("common.duplicate")}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {editing ? (
        <BudgetForm
          budget={budget}
          initialItems={items.map(mapItem)}
          onSuccess={updated => {
            setBudget(updated);
            setEditing(false);
            setHasUnsavedChanges(false);
            void loadBudget();
          }}
          onCancel={handleCancelEdit}
          onDirtyChange={setHasUnsavedChanges}
        />
      ) : (
        <CommercialDocumentView
          documentType="budget"
          number={budget.number}
          client={{
            ...budget.client,
            phone: budget.client.phone ?? undefined,
            email: budget.client.email ?? undefined
          }}
          worker={{
            ...budget.worker,
            phone: budget.worker.phone ?? undefined,
            email: budget.worker.email ?? undefined
          }}
          tax={budget.tax ?? undefined}
          notes={budget.notes ?? undefined}
          deliveredAt={budget.deliveredAt ? new Date(budget.deliveredAt).toISOString() : undefined}
          subtotalAmount={budget.subtotalAmount}
          taxAmount={budget.taxAmount}
          totalAmount={budget.totalAmount}
          items={items.map(mapItem)}
        />
      )}
    </div>
  );
}
