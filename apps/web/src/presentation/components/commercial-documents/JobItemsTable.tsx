"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface JobItemDisplay {
  id: string;
  position: number;
  title: string;
  description?: string;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
}

interface JobItemsTableProps {
  items: JobItemDisplay[];
  pricingMode?: "computed" | "manual-subtotal";
  manualSubtotalAmount?: number | null;
  onEdit?: (item: JobItemDisplay) => void;
  onDelete?: (id: string) => Promise<void>;
  onMoveUp?: (id: string) => Promise<void>;
  onMoveDown?: (id: string) => Promise<void>;
  editable?: boolean;
}

export function JobItemsTable({
  items,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  editable = false
}: JobItemsTableProps) {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [moving, setMoving] = useState<{ id: string; direction: "up" | "down" } | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("common.confirmDelete") || "Are you sure?")) {
      return;
    }

    setDeleting(id);
    try {
      await onDelete?.(id);
    } finally {
      setDeleting(null);
    }
  };

  const handleMoveUp = async (id: string) => {
    setMoving({ id, direction: "up" });
    try {
      await onMoveUp?.(id);
    } finally {
      setMoving(null);
    }
  };

  const handleMoveDown = async (id: string) => {
    setMoving({ id, direction: "down" });
    try {
      await onMoveDown?.(id);
    } finally {
      setMoving(null);
    }
  };

  const lineItemsSubtotal = items.reduce((sum, item) => {
    if (item.totalPrice !== null && item.totalPrice !== undefined) {
      return sum + item.totalPrice;
    }
    if (item.quantity !== null && item.quantity !== undefined && item.unitPrice !== null && item.unitPrice !== undefined) {
      return sum + (item.quantity * item.unitPrice);
    }
    return sum;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border rounded bg-gray-50">
        {t("commercialDocuments.noJobItems")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left px-3 py-2 font-semibold">#</th>
              <th className="text-left px-3 py-2 font-semibold">{t("common.name")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("commercialDocuments.quantity")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("commercialDocuments.unitPrice")}</th>
              <th className="text-right px-3 py-2 font-semibold">{t("commercialDocuments.totalPrice")}</th>
              {editable && <th className="text-center px-3 py-2 font-semibold">{t("common.actions")}</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">{item.position}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-gray-600 text-xs">{item.description}</div>
                  )}
                </td>
                <td className="text-right px-3 py-2">{item.quantity !== null && item.quantity !== undefined ? item.quantity.toFixed(2) : "-"}</td>
                <td className="text-right px-3 py-2">{item.unitPrice !== null && item.unitPrice !== undefined ? `$${item.unitPrice.toFixed(2)}` : "-"}</td>
                <td className="text-right px-3 py-2 font-semibold">
                  {item.totalPrice !== null && item.totalPrice !== undefined
                    ? `$${item.totalPrice.toFixed(2)}`
                    : (item.quantity !== null && item.quantity !== undefined && item.unitPrice !== null && item.unitPrice !== undefined
                        ? `$${(item.quantity * item.unitPrice).toFixed(2)}`
                        : "-")}
                </td>
                {editable && (
                  <td className="text-center px-3 py-2 space-x-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(item.id)}
                      disabled={index === 0 || moving?.id === item.id}
                      className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 text-xs px-1 py-1"
                      title={t("common.moveUp") || "Move up"}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(item.id)}
                      disabled={index === items.length - 1 || moving?.id === item.id}
                      className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 text-xs px-1 py-1"
                      title={t("common.moveDown") || "Move down"}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit?.(item)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="text-red-600 hover:underline text-xs disabled:text-gray-400"
                    >
                        {deleting === item.id ? t("common.deleting") : t("common.delete")}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right px-3 py-2 bg-gray-50 rounded border">
        <div className="text-sm text-gray-600">{t("commercialDocuments.lineItemsSubtotal")}: ${lineItemsSubtotal.toFixed(2)}</div>
      </div>
    </div>
  );
}
