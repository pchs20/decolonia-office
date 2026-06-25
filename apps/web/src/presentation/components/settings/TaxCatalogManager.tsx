"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTaxesList } from "@/presentation/hooks/catalog-hooks";

export function TaxCatalogManager() {
  const { t } = useTranslation();
  const { getAll, create, taxes, loading } = useTaxesList();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAll(1, 100, true).catch(err => {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    });
  }, [getAll, t]);

  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    behavior: "added"
  });
  const activeStatusLabel = t("catalog.taxes.status.active" as any);
  const archivedStatusLabel = t("catalog.taxes.status.archived" as any);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTax = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rate = Number(formData.rate);
    if (!formData.name.trim() || !Number.isFinite(rate) || rate < 0 || rate > 100) {
      setError(t("common.errors.unknown"));
      return;
    }

    setSubmitting(true);
    try {
      await create({
        name: formData.name.trim(),
        rate
      });
      await getAll(1, 100, true);
      setShowForm(false);
      setFormData({ name: "", rate: "", behavior: "added" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("catalog.taxes.title")}</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + {t("catalog.taxes.addButton")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTax} className="p-4 bg-gray-50 rounded border space-y-3">
          {error && <div className="text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              name="name"
              placeholder={t("catalog.taxes.fields.name")}
              value={formData.name}
              onChange={handleChange}
              className="px-3 py-2 border rounded text-sm"
              required
            />
            <input
              type="number"
              name="rate"
              placeholder={t("catalog.taxes.fields.rate")}
              step="0.01"
              value={formData.rate}
              onChange={handleChange}
              className="px-3 py-2 border rounded text-sm"
              required
            />
            <select
              name="behavior"
              value={formData.behavior}
              onChange={handleChange}
              className="px-3 py-2 border rounded text-sm"
              disabled
            >
              <option value="added">{t("catalog.taxes.behaviors.added")}</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={submitting}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {submitting ? t("common.saving") : t("common.add")}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500">{t("common.loading")}</div>
      ) : taxes.length === 0 ? (
        <div className="text-gray-500 text-sm">{t("catalog.taxes.empty")}</div>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">{t("common.name")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("catalog.taxes.fields.rate")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("catalog.taxes.fields.behavior")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("catalog.taxes.fields.status")}</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map(tax => (
                <tr key={tax.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{tax.name}</td>
                  <td className="px-3 py-2">{tax.rate}%</td>
                  <td className="px-3 py-2">{tax.behavior}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-1 rounded ${tax.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {tax.isActive ? activeStatusLabel : archivedStatusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
