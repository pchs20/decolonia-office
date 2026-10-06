"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DocumentPartySnapshotField,
  DocumentPartySnapshotFormData,
  getChangedSnapshotFields
} from "@/presentation/components/commercial-documents/document-party-snapshot";

interface DocumentPartySnapshotSectionProps {
  party: "client" | "worker";
  snapshot: DocumentPartySnapshotFormData;
  sourceSnapshot: DocumentPartySnapshotFormData | null;
  sourceLoading?: boolean;
  sourceError?: string | null;
  isEditing: boolean;
  onChange: (field: DocumentPartySnapshotField, value: string) => void;
  onRefresh: () => Promise<DocumentPartySnapshotFormData | null>;
}

const fieldLabels: Record<DocumentPartySnapshotField, "name" | "taxId" | "phone" | "email" | "bankAccount" | "workStreet" | "workCity" | "workPostalCode" | "billingStreet" | "billingCity" | "billingPostalCode"> = {
  name: "name",
  taxId: "taxId",
  phone: "phone",
  email: "email",
  bankAccount: "bankAccount",
  workStreet: "workStreet",
  workCity: "workCity",
  workPostalCode: "workPostalCode",
  billingStreet: "billingStreet",
  billingCity: "billingCity",
  billingPostalCode: "billingPostalCode"
};

export function DocumentPartySnapshotSection({
  party,
  snapshot,
  sourceSnapshot,
  sourceLoading = false,
  sourceError,
  isEditing,
  onChange,
  onRefresh
}: DocumentPartySnapshotSectionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingSnapshot, setPendingSnapshot] = useState<DocumentPartySnapshotFormData | null>(null);
  const [pendingFields, setPendingFields] = useState<DocumentPartySnapshotField[]>([]);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const changedFields = sourceSnapshot ? getChangedSnapshotFields(snapshot, sourceSnapshot) : [];
  const actionVisible = changedFields.length > 0;
  const partyLabel = t(`commercialDocuments.fields.${party}`);
  const sourceAction = isEditing
    ? t(`commercialDocuments.snapshot.applyLatest${party === "client" ? "Client" : "Worker"}`)
    : t(`commercialDocuments.snapshot.restore${party === "client" ? "Client" : "Worker"}`);

  useEffect(() => {
    if (!sourceError) return;
    setRefreshError(sourceError);
  }, [sourceError]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshError(null);
    setRefreshMessage(null);
    try {
      const latest = await onRefresh();
      if (!latest) {
        setRefreshError(t("commercialDocuments.snapshot.refreshFailed"));
        return;
      }

      const latestFields = getChangedSnapshotFields(snapshot, latest);
      if (latestFields.length === 0) {
        setRefreshMessage(t("commercialDocuments.snapshot.alreadyCurrent"));
        return;
      }

      setPendingSnapshot(latest);
      setPendingFields(latestFields);
    } catch {
      setRefreshError(t("commercialDocuments.snapshot.refreshFailed"));
    } finally {
      setRefreshing(false);
    }
  };

  const applyPending = () => {
    if (!pendingSnapshot) return;
    for (const field of pendingFields) {
      const value = field === "workStreet"
        ? pendingSnapshot.workAddress.street
        : field === "workCity"
          ? pendingSnapshot.workAddress.city
          : field === "workPostalCode"
            ? pendingSnapshot.workAddress.postalCode
            : field === "billingStreet"
              ? pendingSnapshot.billingAddress.street
              : field === "billingCity"
                ? pendingSnapshot.billingAddress.city
                : field === "billingPostalCode"
                  ? pendingSnapshot.billingAddress.postalCode
                  : pendingSnapshot[field];
      onChange(field, value);
    }
    setPendingSnapshot(null);
    setPendingFields([]);
  };

  const input = (field: DocumentPartySnapshotField, type = "text", required = false) => {
    const value = field === "workStreet"
      ? snapshot.workAddress.street
      : field === "workCity"
        ? snapshot.workAddress.city
        : field === "workPostalCode"
          ? snapshot.workAddress.postalCode
          : field === "billingStreet"
            ? snapshot.billingAddress.street
            : field === "billingCity"
              ? snapshot.billingAddress.city
              : field === "billingPostalCode"
                ? snapshot.billingAddress.postalCode
                : snapshot[field];
    return (
      <input
        type={type}
        value={value}
        onChange={event => onChange(field, event.target.value)}
        placeholder={t(`profile.fields.${fieldLabels[field]}`)}
        required={required}
        className="w-full px-3 py-2 border rounded"
      />
    );
  };

  return (
    <div className="space-y-3 border rounded p-4 bg-gray-50">
      <button type="button" className="w-full flex items-center justify-between text-left" onClick={() => setExpanded(value => !value)}>
        <span className="text-base font-semibold">{partyLabel}: {snapshot.name || "-"}</span>
        <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
      </button>

      {expanded && (
        <div className="space-y-3 pt-2">
          {actionVisible && (
            <button type="button" onClick={() => void handleRefresh()} disabled={refreshing || sourceLoading} className="px-3 py-2 bg-blue-700 text-white rounded text-sm">
              {refreshing ? t("commercialDocuments.snapshot.refreshing") : sourceAction}
            </button>
          )}
          {refreshError && <div className="p-2 bg-red-100 text-red-700 rounded text-sm">{refreshError}</div>}
          {refreshMessage && <div className="p-2 bg-blue-50 text-blue-800 rounded text-sm">{refreshMessage}</div>}
          {input("name", "text", true)}
          {input("taxId", "text", true)}
          {input("phone")}
          {input("email", "email")}
          {party === "worker" && input("bankAccount")}
          {input("workStreet", "text", true)}
          <div className="grid grid-cols-2 gap-2">
            {input("workCity", "text", true)}
            {input("workPostalCode", "text", true)}
          </div>
          {input("billingStreet", "text", true)}
          <div className="grid grid-cols-2 gap-2">
            {input("billingCity", "text", true)}
            {input("billingPostalCode", "text", true)}
          </div>
        </div>
      )}

      {pendingSnapshot && (
        <div className="space-y-3 border rounded bg-white p-3 text-sm">
          <p className="font-semibold">{t("commercialDocuments.snapshot.confirmTitle", { action: sourceAction })}</p>
          <p>{t("commercialDocuments.snapshot.changedFields")}</p>
          <ul className="list-disc pl-5">
            {pendingFields.map(field => <li key={field}>{t(`profile.fields.${fieldLabels[field]}`)}</li>)}
          </ul>
          <p>{t("commercialDocuments.snapshot.replaceNotice", { party: partyLabel.toLowerCase() })}</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setPendingSnapshot(null); setPendingFields([]); }} className="px-3 py-2 border rounded">{t("common.cancel")}</button>
            <button type="button" onClick={applyPending} className="px-3 py-2 bg-blue-700 text-white rounded">{t("commercialDocuments.snapshot.apply")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
