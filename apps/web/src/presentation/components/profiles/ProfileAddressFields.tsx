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
  return (
    <>
      <div className="md:col-span-2 pt-2">
        <h3 className="text-sm font-semibold text-gray-700">Address</h3>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Work Street *</label>
        <input
          type="text"
          name="street"
          value={values.street || ""}
          onChange={onChange}
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
          value={values.city || ""}
          onChange={onChange}
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
          value={values.postalCode || ""}
          onChange={onChange}
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
              onBillingSameAsWorkChange(checked);
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
          value={values.billingStreet || ""}
          onChange={onChange}
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
          value={values.billingCity || ""}
          onChange={onChange}
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
          value={values.billingPostalCode || ""}
          onChange={onChange}
          required={!isBillingSameAsWork}
          disabled={isBillingSameAsWork}
          className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
          placeholder="Billing postal code"
        />
      </div>
    </>
  );
}
