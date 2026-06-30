"use client";

import { useEffect, useMemo, useState } from "react"
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { ClientSchema } from "@/api/schemas/client-schema";
import { WorkerSchema } from "@/api/schemas/worker-schema";
import { useBudgets } from "@/presentation/hooks/commercial-document-hooks";
import { useClients } from "@/presentation/hooks/clients-hook";
import { WorkerService } from "@/presentation/api-clients/worker.service";
import { useTaxesList } from "@/presentation/hooks/catalog-hooks";
import { BudgetService } from "@/presentation/api-clients/budget.service";
import { CommercialDocumentSettingsService } from "@/presentation/api-clients/commercial-document-settings.service";
import { JobItemForm } from "@/presentation/components/commercial-documents/JobItemForm";
import { JobItemDisplay, JobItemsTable } from "@/presentation/components/commercial-documents/JobItemsTable";

interface BudgetFormProps {
  budget?: BudgetResponse;
  initialClientId?: string;
  initialItems?: JobItemDisplay[];
  onSuccess: (budget: BudgetResponse) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

interface SnapshotPartyFormData {
  name: string;
  taxId: string;
  phone: string;
  email: string;
  workAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

function mapClientToSnapshot(client: ClientSchema): SnapshotPartyFormData {
  return {
    name: client.name,
    taxId: client.taxId,
    phone: client.phone || "",
    email: client.email || "",
    workAddress: {
      street: client.street,
      city: client.city,
      postalCode: client.postalCode
    },
    billingAddress: {
      street: client.billingStreet || client.street,
      city: client.billingCity || client.city,
      postalCode: client.billingPostalCode || client.postalCode
    }
  };
}

function mapWorkerToSnapshot(worker: WorkerSchema): SnapshotPartyFormData {
  return {
    name: worker.name,
    taxId: worker.taxId,
    phone: worker.phone || "",
    email: worker.email || "",
    workAddress: {
      street: worker.street,
      city: worker.city,
      postalCode: worker.postalCode
    },
    billingAddress: {
      street: worker.billingStreet || worker.street,
      city: worker.billingCity || worker.city,
      postalCode: worker.billingPostalCode || worker.postalCode
    }
  };
}

function mapBudgetPartyToSnapshot(party: BudgetResponse["client"] | BudgetResponse["worker"]): SnapshotPartyFormData {
  return {
    name: party.name,
    taxId: party.taxId,
    phone: party.phone || "",
    email: party.email || "",
    workAddress: {
      street: party.workAddress.street,
      city: party.workAddress.city,
      postalCode: party.workAddress.postalCode
    },
    billingAddress: {
      street: party.billingAddress.street,
      city: party.billingAddress.city,
      postalCode: party.billingAddress.postalCode
    }
  };
}

function emptySnapshot(): SnapshotPartyFormData {
  return {
    name: "",
    taxId: "",
    phone: "",
    email: "",
    workAddress: { street: "", city: "", postalCode: "" },
    billingAddress: { street: "", city: "", postalCode: "" }
  };
}

export function BudgetForm({ budget, initialClientId, initialItems = [], onSuccess, onCancel, onDirtyChange }: BudgetFormProps) {
  const { t } = useTranslation();
  const isEditing = !!budget;
  const { create: createBudget, loading: budgetLoading } = useBudgets();
  const { clients, loading: clientsLoading } = useClients();
  const { taxes, loading: taxesLoading, getAll: loadTaxes } = useTaxesList();
  const [primaryWorker, setPrimaryWorker] = useState<WorkerSchema | null>(null);
  const [primaryWorkerLoading, setPrimaryWorkerLoading] = useState(!isEditing);
  const [primaryWorkerError, setPrimaryWorkerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: budget?.client?.id || initialClientId || "",
    notes: budget?.notes || "",
    taxId: "",
    pricingMode: budget?.pricingMode || "computed",
    manualSubtotalAmount: budget?.manualSubtotalAmount !== null && budget?.manualSubtotalAmount !== undefined
      ? String(budget.manualSubtotalAmount)
      : ""
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formItems, setFormItems] = useState<JobItemDisplay[]>(initialItems);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isItemFormDirty, setIsItemFormDirty] = useState(false);
  const [clientSnapshot, setClientSnapshot] = useState<SnapshotPartyFormData>(
    budget?.client ? mapBudgetPartyToSnapshot(budget.client) : emptySnapshot()
  );
  const [workerSnapshot, setWorkerSnapshot] = useState<SnapshotPartyFormData>(
    budget?.worker ? mapBudgetPartyToSnapshot(budget.worker) : emptySnapshot()
  );

  const initialFormSignature = useMemo(
    () => JSON.stringify({
      formData,
      clientSnapshot,
      workerSnapshot,
      formItems
    }),
    []
  );

  const currentFormSignature = useMemo(
    () => JSON.stringify({
      formData,
      clientSnapshot,
      workerSnapshot,
      formItems
    }),
    [formData, clientSnapshot, workerSnapshot, formItems]
  );

  const isDirty = initialFormSignature !== currentFormSignature;

  const selectedTaxRate = (() => {
    const selected = taxes.find(tax => tax.id === formData.taxId);
    if (selected) {
      return selected.rate;
    }
    return budget?.tax?.rate ?? 0;
  })();

  const computedItemsSubtotal = formItems.reduce((sum, item) => {
    if (item.totalPrice !== null && item.totalPrice !== undefined) {
      return sum + item.totalPrice;
    }
    if (item.quantity !== null && item.quantity !== undefined && item.unitPrice !== null && item.unitPrice !== undefined) {
      return sum + (item.quantity * item.unitPrice);
    }
    return sum;
  }, 0);

  const manualSubtotal = Number(formData.manualSubtotalAmount);
  const subtotalAmount = formData.pricingMode === "manual-subtotal"
    ? (Number.isFinite(manualSubtotal) ? manualSubtotal : 0)
    : computedItemsSubtotal;
  const taxAmount = subtotalAmount * (selectedTaxRate / 100);
  const totalAmount = subtotalAmount + taxAmount;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    return () => {
      onDirtyChange?.(false);
    };
  }, [onDirtyChange]);

  useEffect(() => {
    void loadTaxes(1, 100, false);
  }, [loadTaxes]);

  useEffect(() => {
    if (budget?.tax?.name && taxes.length > 0) {
      const matchingTax = taxes.find(tax => tax.name === budget.tax?.name);
      if (matchingTax) {
        setFormData(prev => ({ ...prev, taxId: matchingTax.id }));
      }
    }
  }, [budget?.tax?.name, taxes]);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    let active = true;
    const loadDefaultPricingMode = async () => {
      try {
        const settings = await CommercialDocumentSettingsService.get();
        if (active) {
          setFormData(prev => ({ ...prev, pricingMode: settings.defaultBudgetPricingMode }));
        }
      } catch {
        // Keep local default when settings cannot be loaded.
      }
    };

    void loadDefaultPricingMode();
    return () => {
      active = false;
    };
  }, [isEditing]);

  useEffect(() => {
    if (isEditing || !formData.clientId || clients.length === 0) {
      return;
    }

    const selected = clients.find(client => client.id === formData.clientId);
    if (selected) {
      setClientSnapshot(mapClientToSnapshot(selected));
    }
  }, [clients, formData.clientId, isEditing]);

  useEffect(() => {
    // Fetch primary worker on mount (skip if editing - worker already captured)
    if (isEditing) {
      return;
    }

    const fetchPrimaryWorker = async () => {
      setPrimaryWorkerLoading(true);
      setPrimaryWorkerError(null);
      try {
        const worker = await WorkerService.getPrimary();
        setPrimaryWorker(worker);
        if (worker) {
          setWorkerSnapshot(mapWorkerToSnapshot(worker));
        }
      } catch (err) {
        setPrimaryWorkerError(err instanceof Error ? err.message : "Failed to fetch primary worker");
      } finally {
        setPrimaryWorkerLoading(false);
      }
    };

    void fetchPrimaryWorker();
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSnapshotFieldChange = (
    party: "client" | "worker",
    field:
      | "name"
      | "taxId"
      | "phone"
      | "email"
      | "workStreet"
      | "workCity"
      | "workPostalCode"
      | "billingStreet"
      | "billingCity"
      | "billingPostalCode",
    value: string
  ) => {
    const setParty = party === "client" ? setClientSnapshot : setWorkerSnapshot;
    setParty(prev => {
      switch (field) {
        case "name":
          return { ...prev, name: value };
        case "taxId":
          return { ...prev, taxId: value };
        case "phone":
          return { ...prev, phone: value };
        case "email":
          return { ...prev, email: value };
        case "workStreet":
          return { ...prev, workAddress: { ...prev.workAddress, street: value } };
        case "workCity":
          return { ...prev, workAddress: { ...prev.workAddress, city: value } };
        case "workPostalCode":
          return { ...prev, workAddress: { ...prev.workAddress, postalCode: value } };
        case "billingStreet":
          return { ...prev, billingAddress: { ...prev.billingAddress, street: value } };
        case "billingCity":
          return { ...prev, billingAddress: { ...prev.billingAddress, city: value } };
        case "billingPostalCode":
          return { ...prev, billingAddress: { ...prev.billingAddress, postalCode: value } };
        default:
          return prev;
      }
    });
  };

  const toSnapshotPayload = (snapshot: SnapshotPartyFormData) => ({
    name: snapshot.name.trim(),
    taxId: snapshot.taxId.trim(),
    phone: snapshot.phone.trim() || null,
    email: snapshot.email.trim() || null,
    workAddress: {
      street: snapshot.workAddress.street.trim(),
      city: snapshot.workAddress.city.trim(),
      postalCode: snapshot.workAddress.postalCode.trim()
    },
    billingAddress: {
      street: snapshot.billingAddress.street.trim(),
      city: snapshot.billingAddress.city.trim(),
      postalCode: snapshot.billingAddress.postalCode.trim()
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.clientId) {
      setError(t("budgets.errors.clientRequired"));
      return;
    }

    if (!isEditing && !primaryWorker) {
      setError("No primary worker configured. Please configure a worker in Settings first.");
      return;
    }

    setLoading(true);
    try {
      const result = isEditing
        ? await BudgetService.update(budget.id, {
            clientSnapshot: toSnapshotPayload(clientSnapshot),
            workerSnapshot: toSnapshotPayload(workerSnapshot),
            notes: formData.notes || null,
            taxId: formData.taxId || null,
            pricingMode: formData.pricingMode,
            manualSubtotalAmount: formData.pricingMode === "manual-subtotal"
              ? (formData.manualSubtotalAmount.trim() ? Number(formData.manualSubtotalAmount) : null)
              : null
          })
        : await createBudget({
            clientId: formData.clientId,
            workerId: primaryWorker!.id,
            clientSnapshot: toSnapshotPayload(clientSnapshot),
            workerSnapshot: toSnapshotPayload(workerSnapshot),
            notes: formData.notes || undefined,
            taxId: formData.taxId || undefined,
            pricingMode: formData.pricingMode,
            manualSubtotalAmount: formData.pricingMode === "manual-subtotal"
              ? (formData.manualSubtotalAmount.trim() ? Number(formData.manualSubtotalAmount) : null)
              : null
          });

      if (isEditing) {
        const originalById = new Map(initialItems.map(item => [item.id, item]));
        const existingCurrent = formItems.filter(item => !item.id.startsWith("new-"));
        const existingIds = new Set(existingCurrent.map(item => item.id));

        const deletedIds = initialItems
          .filter(item => !existingIds.has(item.id))
          .map(item => item.id);

        const changedExisting = existingCurrent.filter(item => {
          const original = originalById.get(item.id);
          if (!original) {
            return false;
          }

          return (
            item.title !== original.title
            || (item.description || "") !== (original.description || "")
            || (item.quantity ?? null) !== (original.quantity ?? null)
            || (item.unitPrice ?? null) !== (original.unitPrice ?? null)
            || (item.totalPrice ?? null) !== (original.totalPrice ?? null)
          );
        });

        const positionChanges = existingCurrent.filter(item => {
          const original = originalById.get(item.id);
          if (!original) {
            return false;
          }

          return item.position !== original.position;
        });

        const newItems = formItems.filter(item => item.id.startsWith("new-"));

        for (const itemId of deletedIds) {
          await BudgetService.deleteItem(budget.id, itemId);
        }

        for (const item of changedExisting) {
          await BudgetService.updateItem(budget.id, item.id, {
            title: item.title,
            description: item.description || null,
            quantity: item.quantity ?? null,
            unitPrice: item.unitPrice ?? null,
            totalPrice: item.totalPrice ?? null
          });
        }

        for (const item of newItems) {
          await BudgetService.addItem(budget.id, {
            title: item.title,
            description: item.description || null,
            quantity: item.quantity ?? null,
            unitPrice: item.unitPrice ?? null,
            totalPrice: item.totalPrice ?? null
          });
        }

        // Apply position changes by sending the new position directly
        for (const item of positionChanges) {
          await BudgetService.updateItem(budget.id, item.id, {
            title: item.title,
            description: item.description || null,
            quantity: item.quantity ?? null,
            unitPrice: item.unitPrice ?? null,
            totalPrice: item.totalPrice ?? null,
            position: item.position
          });
        }

        const refreshed = await BudgetService.getById(budget.id);
        onSuccess(refreshed);
        return;
      }

      if (formItems.length > 0) {
        for (const item of formItems) {
          await BudgetService.addItem(result.id, {
            title: item.title,
            description: item.description || null,
            quantity: item.quantity ?? null,
            unitPrice: item.unitPrice ?? null,
            totalPrice: item.totalPrice ?? null
          });
        }

        const refreshed = await BudgetService.getById(result.id);
        onSuccess(refreshed);
        return;
      }

      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errors.unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleDraftItemSubmit = async (payload: {
    title: string;
    description?: string;
    quantity?: number | null;
    unitPrice?: number | null;
    totalPrice?: number | null;
  }) => {
    if (editingItemId) {
      setFormItems(prev =>
        prev.map(item => {
          if (item.id !== editingItemId) {
            return item;
          }

          return {
            ...item,
            title: payload.title,
            description: payload.description,
            quantity: payload.quantity,
            unitPrice: payload.unitPrice,
            totalPrice: payload.totalPrice
          };
        })
      );
    } else {
      setFormItems(prev => [
        ...prev,
        {
          id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          position: prev.length + 1,
          title: payload.title,
          description: payload.description,
          quantity: payload.quantity,
          unitPrice: payload.unitPrice,
          totalPrice: payload.totalPrice
        }
      ]);
    }

    setShowItemForm(false);
    setEditingItemId(null);
    setIsItemFormDirty(false);
  };

  const handleDraftItemDelete = async (itemId: string) => {
    setFormItems(prev =>
      prev
        .filter(item => item.id !== itemId)
        .map((item, index) => ({
          ...item,
          position: index + 1
        }))
    );
  };

  const handleDraftItemMoveUp = async (itemId: string) => {
    setFormItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index <= 0) return prev;

      const newItems = [...prev];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      return newItems.map((item, idx) => ({
        ...item,
        position: idx + 1
      }));
    });
  };

  const handleDraftItemMoveDown = async (itemId: string) => {
    setFormItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index >= prev.length - 1) return prev;

      const newItems = [...prev];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return newItems.map((item, idx) => ({
        ...item,
        position: idx + 1
      }));
    });
  };

  const handleCancel = () => {
    if (showItemForm && isItemFormDirty) {
      const shouldDiscardItemChanges = window.confirm(t("common.unsavedChanges"));
      if (!shouldDiscardItemChanges) {
        return;
      }
    }

    if (isDirty) {
      const shouldDiscard = window.confirm(t("common.unsavedChanges"));
      if (!shouldDiscard) {
        return;
      }
    }

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold">
        {isEditing ? t("budgets.form.editTitle") : t("budgets.form.newTitle")}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!isEditing && primaryWorkerError && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            {t("commercialDocuments.errors.primaryWorkerFailed")}{" "}
            <Link href="/settings/catalog" className="underline font-semibold">
              {t("nav.settings")}
            </Link>.
          </p>
        </div>
      )}

      {!isEditing && !primaryWorkerLoading && !primaryWorker && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            {t("commercialDocuments.errors.noPrimaryWorker")}{" "}
            <Link href="/settings/catalog" className="underline font-semibold">
              {t("commercialDocuments.errors.noPrimaryWorkerLink")}
            </Link>.
          </p>
        </div>
      )}

      {/* Client Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("budgets.fields.client")}</label>
          {isEditing ? (
            <div className="w-full px-3 py-2 border rounded bg-gray-50">
              {budget?.client?.name || "-"}
            </div>
          ) : (
            <>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                disabled={clientsLoading}
                required
                className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
              >
                <option value="" disabled>
                  {clientsLoading ? t("common.loading") : t("budgets.fields.selectClient")}
                </option>
                {clients?.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-600">
                {t("common.notFoundInDropdown")} {" "}
                <Link href="/clients/new" className="text-blue-700 underline">
                  {t("common.createClient")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 border rounded p-4 bg-gray-50">
        <h3 className="text-base font-semibold">{t("commercialDocuments.fields.clientInfo")}</h3>
          <input
            type="text"
            value={clientSnapshot.name}
            onChange={event => handleSnapshotFieldChange("client", "name", event.target.value)}
            placeholder={t("profile.fields.name")}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={clientSnapshot.taxId}
            onChange={event => handleSnapshotFieldChange("client", "taxId", event.target.value)}
            placeholder={t("profile.fields.taxId")}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={clientSnapshot.phone}
            onChange={event => handleSnapshotFieldChange("client", "phone", event.target.value)}
            placeholder={t("profile.fields.phone")}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            value={clientSnapshot.email}
            onChange={event => handleSnapshotFieldChange("client", "email", event.target.value)}
            placeholder={t("profile.fields.email")}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={clientSnapshot.workAddress.street}
            onChange={event => handleSnapshotFieldChange("client", "workStreet", event.target.value)}
            placeholder={t("profile.fields.workStreet")}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={clientSnapshot.workAddress.city}
              onChange={event => handleSnapshotFieldChange("client", "workCity", event.target.value)}
              placeholder={t("profile.fields.workCity")}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={clientSnapshot.workAddress.postalCode}
              onChange={event => handleSnapshotFieldChange("client", "workPostalCode", event.target.value)}
              placeholder={t("profile.fields.workPostalCode")}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <input
            type="text"
            value={clientSnapshot.billingAddress.street}
            onChange={event => handleSnapshotFieldChange("client", "billingStreet", event.target.value)}
            placeholder={t("profile.fields.billingStreet")}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={clientSnapshot.billingAddress.city}
              onChange={event => handleSnapshotFieldChange("client", "billingCity", event.target.value)}
              placeholder={t("profile.fields.billingCity")}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={clientSnapshot.billingAddress.postalCode}
              onChange={event => handleSnapshotFieldChange("client", "billingPostalCode", event.target.value)}
              placeholder={t("profile.fields.billingPostalCode")}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

      <div className="space-y-3 border rounded p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("commercialDocuments.jobItems")}</h3>
          </div>

          <JobItemsTable
            items={formItems}
            pricingMode={formData.pricingMode}
            manualSubtotalAmount={formData.manualSubtotalAmount ? Number(formData.manualSubtotalAmount) : null}
            editable
            onEdit={item => {
              if (showItemForm && isItemFormDirty && editingItemId !== item.id) {
                const shouldDiscard = window.confirm(t("common.unsavedChanges"));
                if (!shouldDiscard) {
                  return;
                }
              }

              setEditingItemId(item.id);
              setShowItemForm(true);
              setIsItemFormDirty(false);
            }}
            onDelete={handleDraftItemDelete}
            onMoveUp={handleDraftItemMoveUp}
            onMoveDown={handleDraftItemMoveDown}
          />

          {!showItemForm ? (
            <div className="flex justify-end">
              <button
                type="button"
                className="px-3 py-1 text-sm bg-budgets text-white rounded hover:bg-budgets/90"
                onClick={() => {
                  if (showItemForm && isItemFormDirty) {
                    const shouldDiscard = window.confirm(t("common.unsavedChanges"));
                    if (!shouldDiscard) {
                      return;
                    }
                  }

                  setEditingItemId(null);
                  setShowItemForm(true);
                  setIsItemFormDirty(false);
                }}
              >
                + {t("commercialDocuments.addItem")}
              </button>
            </div>
          ) : null}

          {showItemForm ? (
            <JobItemForm
              embedded
              initialData={
                editingItemId
                  ? {
                      title: formItems.find(item => item.id === editingItemId)?.title || "",
                      description: formItems.find(item => item.id === editingItemId)?.description,
                      quantity: formItems.find(item => item.id === editingItemId)?.quantity,
                      unitPrice: formItems.find(item => item.id === editingItemId)?.unitPrice,
                      totalPrice: formItems.find(item => item.id === editingItemId)?.totalPrice
                    }
                  : undefined
              }
              onSubmit={handleDraftItemSubmit}
              onDirtyChange={setIsItemFormDirty}
              onCancel={() => {
                if (isItemFormDirty) {
                  const shouldDiscard = window.confirm(t("common.unsavedChanges"));
                  if (!shouldDiscard) {
                    return;
                  }
                }

                setShowItemForm(false);
                setEditingItemId(null);
                setIsItemFormDirty(false);
              }}
              submitLabel={editingItemId ? t("common.save") : t("common.add")}
            />
          ) : null}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">{t("budgets.fields.notes")}</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows={3}
        />
      </div>

      {/* Tax */}
      <div>
        <label className="block text-sm font-medium mb-1">{t("budgets.fields.tax")}</label>
        <select
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          disabled={taxesLoading}
          className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
        >
          <option value="">{taxesLoading ? t("common.loading") : t("budgets.fields.noTax")}</option>
          {taxes?.map(tax => (
            <option key={tax.id} value={tax.id}>
              {tax.name} ({tax.rate}%)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.fields.pricingMode")}</label>
          <select
            name="pricingMode"
            value={formData.pricingMode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="computed">{t("commercialDocuments.pricingModes.computed")}</option>
            <option value="manual-subtotal">{t("commercialDocuments.pricingModes.manualSubtotal")}</option>
          </select>
        </div>
        {formData.pricingMode === "manual-subtotal" ? (
          <div>
            <label className="block text-sm font-medium mb-1">{t("commercialDocuments.fields.manualSubtotalAmount")}</label>
            <input
              type="number"
              name="manualSubtotalAmount"
              value={formData.manualSubtotalAmount}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded p-4 bg-gray-50">
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.subtotal")}</label>
          <input
            type="text"
            value={`$${subtotalAmount.toFixed(2)}`}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.taxAmount")}</label>
          <input
            type="text"
            value={`$${taxAmount.toFixed(2)}`}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("commercialDocuments.totalAmount")}</label>
          <input
            type="text"
            value={`$${totalAmount.toFixed(2)}`}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 font-semibold text-gray-900"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 justify-end border-t pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={loading || budgetLoading || (!isEditing && (!primaryWorker || primaryWorkerLoading))}
          className="px-4 py-2 bg-budgets text-white rounded hover:bg-budgets/90 disabled:bg-gray-400"
        >
          {loading ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </form>
  );
}
