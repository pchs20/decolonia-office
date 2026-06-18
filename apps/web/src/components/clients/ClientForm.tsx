"use client";

import { useEffect, useMemo, useState } from "react";
import { Client, CreateClientInput, UpdateClientInput } from "@/types/client";
import { ClientService } from "@/services/client.service";

interface ClientFormProps {
  client?: Client;
  onSuccess: (client: Client) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function ClientForm({ client, onSuccess, onCancel, onDirtyChange }: ClientFormProps) {
  const initialIsBillingSameAsWork =
    !client ||
    ((!client.billingStreet || client.billingStreet === client.street) &&
      (!client.billingCity || client.billingCity === client.city) &&
      (!client.billingPostalCode || client.billingPostalCode === client.postalCode));

  const [formData, setFormData] = useState<CreateClientInput | UpdateClientInput>({
    name: client?.name || "",
    type: client?.type || "individual",
    street: client?.street || "",
    city: client?.city || "",
    postalCode: client?.postalCode || "",
    billingStreet: initialIsBillingSameAsWork ? client?.street || "" : client?.billingStreet || "",
    billingCity: initialIsBillingSameAsWork ? client?.city || "" : client?.billingCity || "",
    billingPostalCode: initialIsBillingSameAsWork
      ? client?.postalCode || ""
      : client?.billingPostalCode || "",
    taxId: client?.taxId || "",
    phone: client?.phone || "",
    email: client?.email || ""
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(isBillingSameAsWork &&
      (name === "street" || name === "city" || name === "postalCode")
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
      let result: Client;
      const payload = {
        ...formData,
        billingStreet: isBillingSameAsWork ? formData.street?.trim() : formData.billingStreet?.trim(),
        billingCity: isBillingSameAsWork ? formData.city?.trim() : formData.billingCity?.trim(),
        billingPostalCode: isBillingSameAsWork
          ? formData.postalCode?.trim()
          : formData.billingPostalCode?.trim()
      };

      if (client?.id) {
        result = await ClientService.update(client.id, payload as UpdateClientInput);
      } else {
        result = await ClientService.create(payload as CreateClientInput);
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
      <h2 className="text-xl font-semibold">
        {client ? "Edit Client" : "Add New Client"}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tax ID *</label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="NIF/NIE/CIF"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="+34 612 345 678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="email@example.com"
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <h3 className="text-sm font-semibold text-gray-700">Address</h3>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Work Street *</label>
          <input
            type="text"
            name="street"
            value={formData.street || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Street and number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Work City *</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Work Postal Code *</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Postal code"
          />
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={isBillingSameAsWork}
              onChange={e => {
                const checked = e.target.checked;
                setIsBillingSameAsWork(checked);
                if (checked) {
                  setFormData(prev => ({
                    ...prev,
                    billingStreet: prev.street || "",
                    billingCity: prev.city || "",
                    billingPostalCode: prev.postalCode || ""
                  }));
                }
              }}
            />
            Billing address is the same as work address
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Billing Street *</label>
          <input
            type="text"
            name="billingStreet"
            value={formData.billingStreet || ""}
            onChange={handleChange}
            required={!isBillingSameAsWork}
            disabled={isBillingSameAsWork}
            className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            placeholder="Billing street and number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Billing City *</label>
          <input
            type="text"
            name="billingCity"
            value={formData.billingCity || ""}
            onChange={handleChange}
            required={!isBillingSameAsWork}
            disabled={isBillingSameAsWork}
            className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            placeholder="Billing city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Billing Postal Code *</label>
          <input
            type="text"
            name="billingPostalCode"
            value={formData.billingPostalCode || ""}
            onChange={handleChange}
            required={!isBillingSameAsWork}
            disabled={isBillingSameAsWork}
            className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            placeholder="Billing postal code"
          />
        </div>

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
