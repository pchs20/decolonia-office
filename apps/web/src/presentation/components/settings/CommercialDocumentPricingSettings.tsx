"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCommercialDocumentSettings } from "@/presentation/hooks/catalog-hooks";

export function CommercialDocumentPricingSettings() {
  const { t } = useTranslation();
  const { settings, loading, error, get, update } = useCommercialDocumentSettings();
  const [budgetMode, setBudgetMode] = useState<"computed" | "manual-subtotal">("computed");
  const [invoiceMode, setInvoiceMode] = useState<"computed" | "manual-subtotal">("computed");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void get();
  }, [get]);

  useEffect(() => {
    if (settings) {
      setBudgetMode(settings.defaultBudgetPricingMode);
      setInvoiceMode(settings.defaultInvoicePricingMode);
    }
  }, [settings]);

  const onSave = async () => {
    setSuccess(null);
    await update({
      defaultBudgetPricingMode: budgetMode,
      defaultInvoicePricingMode: invoiceMode
    });
    setSuccess(t("catalog.pricing.saved"));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("catalog.pricing.title")}</h3>

      {error ? (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
      ) : null}

      {success ? (
        <div className="p-3 bg-green-100 text-green-700 rounded text-sm">{success}</div>
      ) : null}

      <div>
        <label className="block text-sm font-medium mb-1">{t("catalog.pricing.defaultBudgetMode")}</label>
        <select
          value={budgetMode}
          onChange={event => setBudgetMode(event.target.value as "computed" | "manual-subtotal")}
          disabled={loading}
          className="w-full md:w-96 px-3 py-2 border rounded disabled:bg-gray-100"
        >
          <option value="computed">{t("commercialDocuments.pricingModes.computed")}</option>
          <option value="manual-subtotal">{t("commercialDocuments.pricingModes.manualSubtotal")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("catalog.pricing.defaultInvoiceMode")}</label>
        <select
          value={invoiceMode}
          onChange={event => setInvoiceMode(event.target.value as "computed" | "manual-subtotal")}
          disabled={loading}
          className="w-full md:w-96 px-3 py-2 border rounded disabled:bg-gray-100"
        >
          <option value="computed">{t("commercialDocuments.pricingModes.computed")}</option>
          <option value="manual-subtotal">{t("commercialDocuments.pricingModes.manualSubtotal")}</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => void onSave()}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? t("common.saving") : t("common.save")}
      </button>
    </div>
  );
}
