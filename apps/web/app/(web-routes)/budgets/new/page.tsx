"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BudgetForm } from "@/presentation/components/commercial-documents/BudgetForm";
import { BudgetResponse } from "@/api/schemas/budget-schemas";

export default function NewBudgetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const initialClientId = searchParams.get("clientId") ?? undefined;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSuccess = (budget: BudgetResponse) => {
    router.push(`/budgets/${budget.id}`);
  };

  const handleCancel = () => {
    router.push("/budgets");
  };

  const handleBack = () => {
    if (hasUnsavedChanges && !window.confirm(t("common.unsavedChanges"))) {
      return;
    }

    router.push("/budgets");
  };

  return (
    <div className="p-4 md:p-6">
      <button type="button" onClick={handleBack} className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
        {t("budgets.backToList")}
      </button>
      <div className="max-w-2xl">
        <BudgetForm
          initialClientId={initialClientId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onDirtyChange={setHasUnsavedChanges}
        />
      </div>
    </div>
  );
}
