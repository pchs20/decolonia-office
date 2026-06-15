"use client";

import { useState } from "react";
import { Client, CreateClientInput, UpdateClientInput } from "@/types/client";
import { ClientService } from "@/services/client.service";

interface ClientFormProps {
  client?: Client;
  onSuccess: (client: Client) => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const initialBillingAddress = client?.billingAddress || "";
  const initialIsBillingSameAsWork = !client || !initialBillingAddress || initialBillingAddress === (client.address || "");

  const [formData, setFormData] = useState<CreateClientInput | UpdateClientInput>({
    name: client?.name || "",
    type: client?.type || "individual",
    address: client?.address || "",
    billingAddress: initialIsBillingSameAsWork ? "" : initialBillingAddress,
    taxId: client?.taxId || "",
    phone: client?.phone || "",
    email: client?.email || ""
  });
  const [isBillingSameAsWork, setIsBillingSameAsWork] = useState(initialIsBillingSameAsWork);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isBillingSameAsWork && !formData.billingAddress?.trim()) {
      setError("Billing address is required when it is different from work address");
      return;
    }

    setLoading(true);

    try {
      let result: Client;
      const payload = {
        ...formData,
        billingAddress: isBillingSameAsWork ? formData.address : formData.billingAddress?.trim()
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Work Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-3 py-2 border rounded"
            placeholder="Street, number, city..."
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
                  setFormData(prev => ({ ...prev, billingAddress: "" }));
                }
              }}
            />
            Billing address is the same as work address
          </label>
        </div>

        {!isBillingSameAsWork && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Billing Address *</label>
            <textarea
              name="billingAddress"
              value={formData.billingAddress || ""}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 border rounded"
              placeholder="Billing address"
            />
          </div>
        )}

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
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
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
