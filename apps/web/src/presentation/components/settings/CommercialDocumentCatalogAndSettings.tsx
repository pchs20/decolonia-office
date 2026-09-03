"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { TaxCatalogManager } from "./TaxCatalogManager";
import { DocumentSequenceSettings } from "./DocumentSequenceSettings";
import { CommercialDocumentPricingSettings } from "./CommercialDocumentPricingSettings";
import { WorkerCatalogManager } from "./WorkerCatalogManager";
import { BackupExportPanel } from "./BackupExportPanel";

export function CommercialDocumentCatalogAndSettings() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["taxes", "pricing", "numbering", "workers", "backup"] as const;
  type Tab = (typeof validTabs)[number];
  const initialTab: Tab = validTabs.includes(tabParam as Tab) ? (tabParam as Tab) : "taxes";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("catalog.title")}</h1>

      <div className="border-b overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <button
            onClick={() => setActiveTab("taxes")}
            className={`px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "taxes"
                ? "border-settings text-settings"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.taxes")}
          </button>
          <button
            onClick={() => setActiveTab("numbering")}
            className={`px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "numbering"
                ? "border-settings text-settings"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.numbering")}
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "pricing"
                ? "border-settings text-settings"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.pricing")}
          </button>
          <button
            onClick={() => setActiveTab("workers")}
            className={`px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "workers"
                ? "border-settings text-settings"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.workers")}
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-3 py-2 border-b-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "backup"
                ? "border-settings text-settings"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.backup")}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {activeTab === "taxes" && <TaxCatalogManager />}
        {activeTab === "pricing" && <CommercialDocumentPricingSettings />}
        {activeTab === "numbering" && <DocumentSequenceSettings />}
        {activeTab === "workers" && <WorkerCatalogManager />}
        {activeTab === "backup" && <BackupExportPanel />}
      </div>
    </div>
  );
}
