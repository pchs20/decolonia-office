"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkTemplatesList } from "@/presentation/hooks/catalog-hooks";

export function WorkTemplateCatalogManager() {
  const { t } = useTranslation();
  const { getAll, create, update, toggleActive, templates, loading } = useWorkTemplatesList();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "", defaultUnitPrice: "" });
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    getAll(1, 100, true);
  }, [getAll]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    defaultUnitPrice: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError(t("common.errors.unknown"));
      return;
    }

    const parsedPrice = formData.defaultUnitPrice.trim() ? Number(formData.defaultUnitPrice) : null;
    if (parsedPrice !== null && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
      setError(t("common.errors.unknown"));
      return;
    }

    setSubmitting(true);
    try {
      await create({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        defaultUnitPrice: parsedPrice
      });
      await getAll(1, 100, true);
      setShowForm(false);
      setFormData({ title: "", description: "", defaultUnitPrice: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (template: { id: string; title: string; description: string | null; defaultUnitPrice: number | null }) => {
    setEditingId(template.id);
    setEditFormData({
      title: template.title,
      description: template.description || "",
      defaultUnitPrice: template.defaultUnitPrice !== null ? String(template.defaultUnitPrice) : ""
    });
    setEditError(null);
    setShowForm(false);
    setError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id: string) => {
    setEditError(null);
    if (!editFormData.title.trim()) {
      setEditError(t("common.errors.unknown"));
      return;
    }
    const parsedPrice = editFormData.defaultUnitPrice.trim() ? Number(editFormData.defaultUnitPrice) : null;
    if (parsedPrice !== null && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
      setEditError(t("common.errors.unknown"));
      return;
    }
    setSubmitting(true);
    try {
      await update(id, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim() || null,
        defaultUnitPrice: parsedPrice
      });
      setEditingId(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setEditError(null);
    try {
      await toggleActive(id, isActive);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t("common.errors.unknown"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("catalog.templates.title")}</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + {t("catalog.templates.addButton")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTemplate} className="p-4 bg-gray-50 rounded border space-y-3">
          {error && <div className="text-sm text-red-700">{error}</div>}
          <input
            type="text"
            name="title"
            placeholder={t("catalog.templates.fields.title")}
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
          <textarea
            name="description"
            placeholder={t("catalog.templates.fields.description")}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-sm"
            rows={2}
          />
          <input
            type="number"
            name="defaultUnitPrice"
            placeholder={t("catalog.templates.fields.defaultUnitPrice")}
            step="0.01"
            value={formData.defaultUnitPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-sm"
          />
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
      ) : templates.length === 0 ? (
        <div className="text-gray-500 text-sm">{t("catalog.templates.empty")}</div>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">{t("common.name")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("catalog.templates.fields.description")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("catalog.templates.fields.defaultUnitPrice")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("catalog.templates.fields.status")}</th>
                <th className="px-3 py-2 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                editingId === template.id ? (
                  <tr key={template.id} className="border-b bg-blue-50">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        name="defaultUnitPrice"
                        step="0.01"
                        value={editFormData.defaultUnitPrice}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border rounded text-sm text-right"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-1 rounded ${template.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {template.isActive ? t("catalog.templates.status.active") : t("catalog.templates.status.inactive")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSave(template.id)}
                            disabled={submitting}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            {submitting ? t("common.saving") : t("common.save")}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={submitting}
                            className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
                          >
                            {t("common.cancel")}
                          </button>
                        </div>
                        {editError && <div className="text-xs text-red-700">{editError}</div>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={template.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{template.title}</td>
                    <td className="px-3 py-2 text-gray-600">{template.description || "-"}</td>
                    <td className="px-3 py-2 text-right">
                      {template.defaultUnitPrice === null ? "-" : `$${template.defaultUnitPrice.toFixed(2)}`}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-1 rounded ${template.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {template.isActive ? t("catalog.templates.status.active") : t("catalog.templates.status.inactive")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditClick(template)}
                          className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
                        >
                          {t("common.edit")}
                        </button>
                        {template.isActive ? (
                          <button
                            onClick={() => handleToggleActive(template.id, false)}
                            className="px-2 py-1 border rounded text-xs text-red-600 hover:bg-red-50"
                          >
                            {t("common.deactivate")}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(template.id, true)}
                            className="px-2 py-1 border rounded text-xs text-green-600 hover:bg-green-50"
                          >
                            {t("common.reactivate")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
