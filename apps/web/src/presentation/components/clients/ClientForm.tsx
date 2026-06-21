"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClientSchema, CreateClientInput, UpdateClientInput } from "@/api/schemas/client-schema";
import { ClientService } from "@/presentation/api-clients/client.service";
import { ProfileCommonFields } from "@/presentation/components/profiles/ProfileCommonFields";
import { ProfileAddressFields } from "@/presentation/components/profiles/ProfileAddressFields";

interface ClientFormProps {
  client?: ClientSchema;
  onSuccess: (client: ClientSchema) => void;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function ClientForm({ client, onSuccess, onCancel, onDirtyChange }: ClientFormProps) {
  const { t } = useTranslation();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setError(t('profile.errors.workAddressRequired'));
      return;
    }

    if (
      !isBillingSameAsWork &&
      (!formData.billingStreet?.trim() ||
        !formData.billingCity?.trim() ||
        !formData.billingPostalCode?.trim())
    ) {
      setError(t('profile.errors.billingAddressRequired'));
      return;
    }

    setLoading(true);

    try {
      let result: ClientSchema;
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
      setError(err instanceof Error ? err.message : t('common.errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const shouldDiscard = window.confirm(t('common.unsavedChanges'));
      if (!shouldDiscard) {
        return;
      }
    }

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold">
        {client ? t('clients.form.editTitle') : t('clients.form.newTitle')}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileCommonFields values={formData} onChange={handleChange} entityLabel={t('clients.entityName')} />

        <div>
          <label className="block text-sm font-medium mb-1">{t('clients.fields.type')} *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="individual">{t('clients.types.individual')}</option>
            <option value="company">{t('clients.types.company')}</option>
          </select>
        </div>
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
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  );
}
