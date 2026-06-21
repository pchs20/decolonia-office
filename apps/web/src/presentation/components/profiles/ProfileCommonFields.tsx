'use client';

import { useTranslation } from 'react-i18next';

type ProfileCommonValues = {
  name?: string;
  taxId?: string;
  phone?: string;
  email?: string;
};

interface ProfileCommonFieldsProps {
  values: ProfileCommonValues;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  entityLabel: string;
}

export function ProfileCommonFields({ values, onChange, entityLabel }: ProfileCommonFieldsProps) {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.name')}</label>
        <input
          type="text"
          name="name"
          value={values.name || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border rounded"
          placeholder={entityLabel}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.taxId')}</label>
        <input
          type="text"
          name="taxId"
          value={values.taxId || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border rounded"
          placeholder="NIF/NIE/CIF"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.phone')}</label>
        <input
          type="tel"
          name="phone"
          value={values.phone || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          placeholder={t('profile.fields.phonePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.email')}</label>
        <input
          type="email"
          name="email"
          value={values.email || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="email@example.com"
        />
      </div>
    </>
  );
}
