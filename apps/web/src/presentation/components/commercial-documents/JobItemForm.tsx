"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkTemplatesList } from "@/presentation/hooks/catalog-hooks";

interface JobItemFormData {
  title: string;
  description?: string;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
}

interface JobItemFormProps {
  onSubmit: (item: JobItemFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: JobItemFormData;
  submitLabel?: string;
  brandColor?: "budgets" | "invoices";
  embedded?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const submitButtonClasses = {
  budgets: "bg-budgets hover:bg-budgets/90",
  invoices: "bg-invoices hover:bg-invoices/90"
} as const;

function normalizeFormData(data?: JobItemFormData): Required<JobItemFormData> {
  return {
    title: data?.title || "",
    description: data?.description || "",
    quantity: data?.quantity ?? null,
    unitPrice: data?.unitPrice ?? null,
    totalPrice: data?.totalPrice ?? null
  };
}

export function JobItemForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel,
  brandColor = "budgets",
  embedded = false,
  onDirtyChange
}: JobItemFormProps) {
  const { t } = useTranslation();
  const { templates, loading: templatesLoading, getAll: loadTemplates } = useWorkTemplatesList();
  const initialTitle = initialData?.title || "";
  const initialDescription = initialData?.description || "";
  const initialQuantity = initialData?.quantity ?? null;
  const initialUnitPrice = initialData?.unitPrice ?? null;
  const initialTotalPrice = initialData?.totalPrice ?? null;

  const [formData, setFormData] = useState<JobItemFormData>(() =>
    normalizeFormData({
      title: initialTitle,
      description: initialDescription,
      quantity: initialQuantity,
      unitPrice: initialUnitPrice,
      totalPrice: initialTotalPrice
    })
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialFormData = useMemo(
    () =>
      normalizeFormData({
        title: initialTitle,
        description: initialDescription,
        quantity: initialQuantity,
        unitPrice: initialUnitPrice,
        totalPrice: initialTotalPrice
      }),
    [initialTitle, initialDescription, initialQuantity, initialUnitPrice, initialTotalPrice]
  );
  const normalizedFormData = normalizeFormData(formData);

  useEffect(() => {
    setFormData(initialFormData);
    setSelectedTemplateId("");
  }, [initialFormData]);

  useEffect(() => {
    const isDirty = JSON.stringify(normalizedFormData) !== JSON.stringify(initialFormData);
    onDirtyChange?.(isDirty);
  }, [initialFormData, normalizedFormData, onDirtyChange]);

  useEffect(() => {
    return () => {
      onDirtyChange?.(false);
    };
  }, [onDirtyChange]);

  useEffect(() => {
    void loadTemplates(1, 100, false);
  }, [loadTemplates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parseNullableNumber = (raw: string): number | null => {
      if (raw.trim() === "") {
        return null;
      }
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    };
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" || name === "unitPrice" || name === "totalPrice"
        ? parseNullableNumber(value)
        : value
    }));
  };

  const submitItem = async () => {
    setError(null);

    if (!formData.title?.trim()) {
      setError(t("commercialDocuments.title"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitItem();
  };

  const handleEmbeddedKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault();
      void submitItem();
    }
  };

  const effectiveTotal = formData.totalPrice ?? (
    formData.quantity !== null && formData.quantity !== undefined
    && formData.unitPrice !== null && formData.unitPrice !== undefined
      ? formData.quantity * formData.unitPrice
      : 0
  );

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (!templateId) {
      return;
    }

    const selectedTemplate = templates.find(template => template.id === templateId);
    if (!selectedTemplate) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      title: selectedTemplate.title,
      description: selectedTemplate.description ?? "",
      unitPrice: selectedTemplate.defaultUnitPrice ?? prev.unitPrice,
      totalPrice: null
    }));
  };

  const formContent = (
    <>
      {error && (
        <div className="p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">{t("commercialDocuments.fields.workTemplate")}</label>
        <select
          value={selectedTemplateId}
          onChange={e => handleTemplateChange(e.target.value)}
          disabled={templatesLoading}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="">
            {templatesLoading ? t("common.loading") : t("commercialDocuments.noTemplate")}
          </option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("commercialDocuments.title")}</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded text-sm"
          placeholder={t("commercialDocuments.title")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("commercialDocuments.description")}</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded text-sm"
          rows={2}
          placeholder={t("common.name")}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.quantity")}</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity ?? ""}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.unitPrice")}</label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice ?? ""}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.totalPrice")}</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice ?? ""}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <div className="mt-1 text-xs text-gray-500">
            {t("commercialDocuments.fields.calculatedTotal")}: ${effectiveTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-100"
        >
          {t("common.cancel")}
        </button>
        <button
          type={embedded ? "button" : "submit"}
          onClick={embedded ? () => void submitItem() : undefined}
          disabled={loading}
          className={`px-3 py-2 ${submitButtonClasses[brandColor]} text-white text-sm rounded disabled:bg-gray-400`}
        >
          {loading ? t("common.saving") : (submitLabel || t("common.add"))}
        </button>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div onKeyDown={handleEmbeddedKeyDown} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
        {formContent}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
      {formContent}
    </form>
  );
}
