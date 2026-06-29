import { Suspense } from "react";
import { CommercialDocumentCatalogAndSettings } from "@/presentation/components/settings/CommercialDocumentCatalogAndSettings";

export default function SettingsCatalogPage() {
  return (
    <div className="p-4 md:p-6">
      <Suspense fallback={null}>
        <CommercialDocumentCatalogAndSettings />
      </Suspense>
    </div>
  );
}
