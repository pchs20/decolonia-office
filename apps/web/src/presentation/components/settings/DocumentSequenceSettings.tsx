"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentSequenceResponse } from "@/api/schemas/document-sequence-schemas";
import { DocumentSequenceService } from "@/presentation/api-clients/document-sequence.service";

interface DocumentSequenceSettingsProps {
  sequences?: DocumentSequenceResponse[];
}

export function DocumentSequenceSettings({ sequences = [] }: DocumentSequenceSettingsProps) {
  const { t } = useTranslation();
  const [items, setItems] = useState<DocumentSequenceResponse[]>(sequences);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const loadSequences = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await DocumentSequenceService.getAll(new Date().getFullYear());
        setItems(response.sequences || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("catalog.numbering.errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    void loadSequences();
  }, [t]);

  const handleEdit = (type: string, value: number) => {
    setEditingId(type);
    setEditValue(value.toString());
  };

  const handleSave = async (type: string) => {
    const [documentType, scopeYear] = type.split("-");
    const nextNumber = Number(editValue);

    if (!Number.isInteger(nextNumber) || nextNumber < 1) {
      setError(t("catalog.numbering.errors.invalidNextNumber"));
      return;
    }

    try {
      setError(null);
      const updated = await DocumentSequenceService.adjust({
        documentType: documentType as "budget" | "invoice",
        year: scopeYear === "null" ? null : Number(scopeYear),
        nextNumber
      });

      setItems(prev =>
        prev.map(item => (item.id === updated.id ? updated : item))
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("catalog.numbering.errors.updateFailed"));
    }
  };

  const getDocumentTypeLabel = (type: string): string => {
    if (type === "budget") {
      return t("catalog.numbering.documentTypes.budget");
    }
    if (type === "invoice") {
      return t("catalog.numbering.documentTypes.invoice");
    }
    return type;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("catalog.numbering.title")}</h3>

      {error ? (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">{t("common.loading")}</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">
          {t("catalog.numbering.note")}
        </div>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">{t("catalog.numbering.documentType")}</th>
                <th className="px-4 py-2 text-left font-semibold">{t("catalog.numbering.scope")}</th>
                <th className="px-4 py-2 text-left font-semibold">{t("catalog.numbering.nextNumber")}</th>
                <th className="px-4 py-2 text-left font-semibold">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(seq => (
                <tr key={`${seq.documentType}-${seq.scopeYear}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{getDocumentTypeLabel(seq.documentType)}</td>
                  <td className="px-4 py-2">{seq.scopeYear || t("catalog.numbering.globalScope")}</td>
                  <td className="px-4 py-2">
                    {editingId === `${seq.documentType}-${seq.scopeYear}` ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="px-2 py-1 border rounded text-sm w-24"
                      />
                    ) : (
                      <span className="font-mono font-semibold">{seq.nextNumber}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === `${seq.documentType}-${seq.scopeYear}` ? (
                      <>
                        <button
                          onClick={() => handleSave(`${seq.documentType}-${seq.scopeYear}`)}
                          className="px-2 py-1 bg-settings text-white text-xs rounded hover:bg-settings/90 mr-2"
                        >
                          {t("common.save")}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
                        >
                          {t("common.cancel")}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(`${seq.documentType}-${seq.scopeYear}`, seq.nextNumber)}
                        className="px-2 py-1 bg-settings/10 text-settings text-xs rounded hover:bg-settings/20"
                      >
                        {t("catalog.numbering.adjust")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 bg-settings/10 rounded text-sm text-settings">
        <strong>{t("catalog.numbering.noteLabel")}</strong> {t("catalog.numbering.note")}
      </div>
    </div>
  );
}
