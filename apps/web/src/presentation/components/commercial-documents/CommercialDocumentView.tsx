"use client";

import { useTranslation } from "react-i18next";
import { CommercialDocumentType, formatDocumentNumber } from "@/presentation/utils/document-number";
import { JobItemDisplay, JobItemsTable } from "@/presentation/components/commercial-documents/JobItemsTable";

interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
}

interface TaxInfo {
  name?: string;
  rate?: number;
  behavior?: string;
}

interface CommercialDocumentViewProps {
  documentType: CommercialDocumentType;
  number: string;
  client: {
    id: string;
    name: string;
    taxId: string;
    phone?: string;
    email?: string;
    workAddress: AddressInfo;
    billingAddress: AddressInfo;
  };
  worker: {
    id: string;
    name: string;
    taxId: string;
    phone?: string;
    email?: string;
    workAddress: AddressInfo;
    billingAddress: AddressInfo;
  };
  tax?: TaxInfo;
  notes?: string;
  deliveredAt?: string;
  issuedAt?: string;
  sourceBudgetId?: string;
  subtotalAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  items?: JobItemDisplay[];
}

export function CommercialDocumentView({
  documentType,
  number,
  client,
  worker,
  tax,
  notes,
  deliveredAt,
  issuedAt,
  sourceBudgetId,
  subtotalAmount = 0,
  taxAmount = 0,
  totalAmount = 0,
  items = []
}: CommercialDocumentViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      {/* Header */}
      <div className="border-b pb-4">
        <div>
          <div className="text-3xl font-bold">{formatDocumentNumber(number, documentType, t)}</div>
        </div>
      </div>

      {/* Dates and metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {deliveredAt && (
          <div>
            <div className="text-gray-600 font-medium">{t("budgets.fields.deliveredAt")}</div>
            <div>{new Date(deliveredAt).toLocaleDateString()}</div>
          </div>
        )}
        {issuedAt && (
          <div>
            <div className="text-gray-600 font-medium">{t("invoices.fields.issuedAt")}</div>
            <div>{new Date(issuedAt).toLocaleDateString()}</div>
          </div>
        )}
        {sourceBudgetId && (
          <div>
            <div className="text-gray-600 font-medium">{t("invoices.fields.sourceBudget")}</div>
            <div className="text-blue-600 font-mono text-xs">{sourceBudgetId}</div>
          </div>
        )}
        {notes && (
          <div className="col-span-full">
            <div className="text-gray-600 font-medium">{t("budgets.fields.notes")}</div>
            <div className="text-gray-700">{notes}</div>
          </div>
        )}
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client */}
        <div className="border rounded p-4 bg-gray-50">
          <div className="font-bold text-lg mb-3">{t("commercialDocuments.fields.client")}</div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-600">{t("common.name")}</div>
              <div className="font-medium">{client.name}</div>
            </div>
            <div>
              <div className="text-gray-600">{t("commercialDocuments.fields.taxId")}</div>
              <div className="font-mono">{client.taxId}</div>
            </div>
            {client.phone && (
              <div>
                <div className="text-gray-600">{t("common.phone")}</div>
                <div>{client.phone}</div>
              </div>
            )}
            {client.email && (
              <div>
                <div className="text-gray-600">Email</div>
                <div>{client.email}</div>
              </div>
            )}
            <div>
              <div className="text-gray-600 font-medium mt-2">{t("commercialDocuments.fields.workAddress")}</div>
              <div className="text-xs text-gray-700">
                {client.workAddress.street}<br />
                {client.workAddress.city}, {client.workAddress.postalCode}
              </div>
            </div>
            <div>
              <div className="text-gray-600 font-medium mt-2">{t("commercialDocuments.fields.billingAddress")}</div>
              <div className="text-xs text-gray-700">
                {client.billingAddress.street}<br />
                {client.billingAddress.city}, {client.billingAddress.postalCode}
              </div>
            </div>
          </div>
        </div>

        {/* Worker */}
        <div className="border rounded p-4 bg-gray-50">
          <div className="font-bold text-lg mb-3">{t("commercialDocuments.fields.worker")}</div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-600">{t("common.name")}</div>
              <div className="font-medium">{worker.name}</div>
            </div>
            <div>
              <div className="text-gray-600">{t("commercialDocuments.fields.taxId")}</div>
              <div className="font-mono">{worker.taxId}</div>
            </div>
            {worker.phone && (
              <div>
                <div className="text-gray-600">{t("common.phone")}</div>
                <div>{worker.phone}</div>
              </div>
            )}
            {worker.email && (
              <div>
                <div className="text-gray-600">Email</div>
                <div>{worker.email}</div>
              </div>
            )}
            <div>
              <div className="text-gray-600 font-medium mt-2">{t("commercialDocuments.fields.workAddress")}</div>
              <div className="text-xs text-gray-700">
                {worker.workAddress.street}<br />
                {worker.workAddress.city}, {worker.workAddress.postalCode}
              </div>
            </div>
            <div>
              <div className="text-gray-600 font-medium mt-2">{t("commercialDocuments.fields.billingAddress")}</div>
              <div className="text-xs text-gray-700">
                {worker.billingAddress.street}<br />
                {worker.billingAddress.city}, {worker.billingAddress.postalCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("commercialDocuments.jobItems")}</h2>
        <JobItemsTable items={items} />
      </div>

      {/* Tax and Totals */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span>{t("commercialDocuments.subtotal")}:</span>
          <span>${subtotalAmount.toFixed(2)}</span>
        </div>
        {tax?.name && (
          <div className="flex justify-between text-sm">
            <span>{t("commercialDocuments.taxAmount")} ({tax.name} @ {tax.rate}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>{t("commercialDocuments.totalAmount")}:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
