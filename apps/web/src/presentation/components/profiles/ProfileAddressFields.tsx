'use client';

import { useTranslation } from 'react-i18next';

type ProfileAddressValues = {
  street?: string;
  city?: string;
  postalCode?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
};

interface ProfileAddressFieldsProps {
  values: ProfileAddressValues;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isBillingSameAsWork: boolean;
  setIsBillingSameAsWork: (value: boolean) => void;
  onBillingSameAsWorkChange: (checked: boolean) => void;
}

export function ProfileAddressFields({
  values,
  onChange,
  isBillingSameAsWork,
  setIsBillingSameAsWork,
  onBillingSameAsWorkChange
}: ProfileAddressFieldsProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="md:col-span-2 pt-2">
        <h3 className="text-sm font-semibold text-gray-700">{t('profile.fields.address')}</h3>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.workStreet')}</label>
        <input
          type="text"
          name="street"
          value={values.street || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border rounded"
          placeholder={t('profile.fields.streetPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.workCity')}</label>
        <input
          type="text"
          name="city"
          value={values.city || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border rounded"
          placeholder={t('profile.fields.cityPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.workPostalCode')}</label>
        <input
          type="text"
          name="postalCode"
          value={values.postalCode || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border rounded"
          placeholder={t('profile.fields.postalCodePlaceholder')}
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
              onBillingSameAsWorkChange(checked);
            }}
          />
          {t('profile.fields.billingSameAsWork')}
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.billingStreet')}</label>
        <input
          type="text"
          name="billingStreet"
          value={values.billingStreet || ""}
          onChange={onChange}
          required={!isBillingSameAsWork}
          disabled={isBillingSameAsWork}
          className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
          placeholder={t('profile.fields.billingStreetPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.billingCity')}</label>
        <input
          type="text"
          name="billingCity"
          value={values.billingCity || ""}
          onChange={onChange}
          required={!isBillingSameAsWork}
          disabled={isBillingSameAsWork}
          className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
          placeholder={t('profile.fields.billingCityPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('profile.fields.billingPostalCode')}</label>
        <input
          type="text"
          name="billingPostalCode"
          value={values.billingPostalCode || ""}
          onChange={onChange}
          required={!isBillingSameAsWork}
          disabled={isBillingSameAsWork}
          className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
          placeholder={t('profile.fields.billingPostalCodePlaceholder')}
        />
      </div>
    </>
  );
}
