'use client';

import { ASSET_CATEGORIES, ASSET_STATUSES, type AssetInput } from '@/lib/types/asset';

interface AssetFormProps {
  values: AssetInput;
  onChange: <K extends keyof AssetInput>(field: K, value: AssetInput[K]) => void;
}

const inputClass =
  'w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] px-3 py-2 text-sm text-[#211E19] dark:text-[#E8E3D8] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.1em] text-[#6B655A] dark:text-[#8FA79C] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AssetForm({ values, onChange }: AssetFormProps) {
  return (
    <div className="space-y-4">
      <Field label="Asset name">
        <input
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Dell Latitude 5420"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select
            value={values.category}
            onChange={(e) => onChange('category', e.target.value as AssetInput['category'])}
            className={inputClass}
          >
            {ASSET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={values.status}
            onChange={(e) => onChange('status', e.target.value as AssetInput['status'])}
            className={inputClass}
          >
            {ASSET_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Location">
          <input
            value={values.location ?? ''}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="Lab 1"
            className={inputClass}
          />
        </Field>
        <Field label="Assigned to (optional)">
          <input
            value={values.assigned_to ?? ''}
            onChange={(e) => onChange('assigned_to', e.target.value)}
            placeholder="Priya Shah"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea
          value={values.notes ?? ''}
          onChange={(e) => onChange('notes', e.target.value)}
          rows={3}
          placeholder="Serial number, warranty info, condition…"
          className={inputClass}
        />
      </Field>
    </div>
  );
}