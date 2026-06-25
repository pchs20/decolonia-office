"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TaxCatalogManager } from "./TaxCatalogManager";
import { WorkTemplateCatalogManager } from "./WorkTemplateCatalogManager";
import { DocumentSequenceSettings } from "./DocumentSequenceSettings";
import { CommercialDocumentPricingSettings } from "./CommercialDocumentPricingSettings";

export function CommercialDocumentCatalogAndSettings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"taxes" | "templates" | "pricing" | "numbering">("taxes");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("catalog.title")}</h1>

      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("taxes")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "taxes"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.taxes")}
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "templates"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.templates")}
          </button>
          <button
            onClick={() => setActiveTab("numbering")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "numbering"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.numbering")}
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "pricing"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("catalog.tabs.pricing")}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {activeTab === "taxes" && <TaxCatalogManager />}
        {activeTab === "templates" && <WorkTemplateCatalogManager />}
        {activeTab === "pricing" && <CommercialDocumentPricingSettings />}
        {activeTab === "numbering" && <DocumentSequenceSettings />}
      </div>
    </div>
  );
}
