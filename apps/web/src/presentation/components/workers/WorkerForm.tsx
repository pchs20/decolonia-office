"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkerSchema, CreateWorkerInput, UpdateWorkerInput } from "@/api/schemas/worker-schema";
import { WorkerService } from "@/presentation/api-clients/worker.service";
import { ProfileCommonFields } from "@/presentation/components/profiles/ProfileCommonFields";
import { ProfileAddressFields } from "@/presentation/components/profiles/ProfileAddressFields";

interface WorkerFormProps {
  worker?: WorkerSchema;
  onSuccess: (worker: WorkerSchema) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function WorkerForm({ worker, onSuccess, onCancel, onDirtyChange }: WorkerFormProps) {
  const initialIsBillingSameAsWork =
    !worker ||
    ((!worker.billingStreet || worker.billingStreet === worker.street) &&
      (!worker.billingCity || worker.billingCity === worker.city) &&
      (!worker.billingPostalCode || worker.billingPostalCode === worker.postalCode));

  const [formData, setFormData] = useState<CreateWorkerInput | UpdateWorkerInput>({
    name: worker?.name || "",
    street: worker?.street || "",
    city: worker?.city || "",
    postalCode: worker?.postalCode || "",
    billingStreet: initialIsBillingSameAsWork ? worker?.street || "" : worker?.billingStreet || "",
    billingCity: initialIsBillingSameAsWork ? worker?.city || "" : worker?.billingCity || "",
    billingPostalCode: initialIsBillingSameAsWork
      ? worker?.postalCode || ""
      : worker?.billingPostalCode || "",
    taxId: worker?.taxId || "",
    phone: worker?.phone || "",
    email: worker?.email || ""
  });
  const [isBillingSameAsWork, setIsBillingSameAsWork] = useState(initialIsBillingSameAsWork);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialFormSignature = useMemo(
    () => JSON.stringify({ formData, isBillingSameAsWork }),
    []
  );

  const currentFormSignature = useMemo(
    () => JSON.stringify({ formData, isBillingSameAsWork }),
    [formData, isBillingSameAsWork]
  );

  const isDirty = initialFormSignature !== currentFormSignature;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    return () => {
      onDirtyChange?.(false);
    };
  }, [onDirtyChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(isBillingSameAsWork && (name === "street" || name === "city" || name === "postalCode")
        ? {
            billingStreet: name === "street" ? value : (prev.billingStreet || ""),
            billingCity: name === "city" ? value : (prev.billingCity || ""),
            billingPostalCode: name === "postalCode" ? value : (prev.billingPostalCode || "")
          }
        : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.street?.trim() || !formData.city?.trim() || !formData.postalCode?.trim()) {
      setError("Street, city, and postal code are required");
      return;
    }

    if (
      !isBillingSameAsWork &&
      (!formData.billingStreet?.trim() ||
        !formData.billingCity?.trim() ||
        !formData.billingPostalCode?.trim())
    ) {
      setError("Billing street, city, and postal code are required when billing differs");
      return;
    }

    setLoading(true);

    try {
      let result: WorkerSchema;
      const payload = {
        ...formData,
        billingStreet: isBillingSameAsWork ? formData.street?.trim() : formData.billingStreet?.trim(),
        billingCity: isBillingSameAsWork ? formData.city?.trim() : formData.billingCity?.trim(),
        billingPostalCode: isBillingSameAsWork
          ? formData.postalCode?.trim()
          : formData.billingPostalCode?.trim()
      };

      if (worker?.id) {
        result = await WorkerService.update(worker.id, payload as UpdateWorkerInput);
      } else {
        result = await WorkerService.create(payload as CreateWorkerInput);
      }

      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const shouldDiscard = window.confirm(
        "You have unsaved changes. Discard them and leave edit mode?"
      );
      if (!shouldDiscard) {
        return;
      }
    }

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold">{worker ? "Edit Worker" : "Add New Worker"}</h2>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileCommonFields values={formData} onChange={handleChange} entityLabel="Worker" />
        <ProfileAddressFields
          values={formData}
          onChange={handleChange}
          isBillingSameAsWork={isBillingSameAsWork}
          setIsBillingSameAsWork={setIsBillingSameAsWork}
          onBillingSameAsWorkChange={checked => {
            if (!checked) return;
            setFormData(prev => ({
              ...prev,
              billingStreet: prev.street || "",
              billingCity: prev.city || "",
              billingPostalCode: prev.postalCode || ""
            }));
          }}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
