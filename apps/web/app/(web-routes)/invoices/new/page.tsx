"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { InvoiceForm } from "@/presentation/components/invoices/InvoiceForm";
import { InvoiceResponse } from "@/api/schemas/invoice-schemas";

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const initialClientId = searchParams.get("clientId") ?? undefined;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSuccess = (invoice: InvoiceResponse) => {
    router.push(`/invoices/${invoice.id}`);
  };

  const handleCancel = () => {
    router.push("/invoices");
  };

  const handleBack = () => {
    if (hasUnsavedChanges && !window.confirm(t("common.unsavedChanges"))) {
      return;
    }

    router.push("/invoices");
  };

  return (
    <div className="p-6">
      <button type="button" onClick={handleBack} className="text-blue-600 mb-4 inline-block">
        {t("invoices.backToList")}
      </button>
      <div className="max-w-2xl">
        <InvoiceForm
          initialClientId={initialClientId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onDirtyChange={setHasUnsavedChanges}
        />
      </div>
    </div>
  );
}
