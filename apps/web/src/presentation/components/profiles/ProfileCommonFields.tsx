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
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          name="name"
          value={values.name || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border rounded"
          placeholder={`${entityLabel} name`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tax ID *</label>
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
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={values.phone || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="+34 612 345 678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
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
