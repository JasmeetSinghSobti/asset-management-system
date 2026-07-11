'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ROLE_LABELS, ROLE_OPTIONS_BY_ADMIN } from '@/lib/roles';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  /** The signed-in admin's own role — determines which roles they can assign. */
  creatorRole: string | null;
}

const EMPTY_VALUES = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  department: '',
  designation: '',
  role: '',
};

type FormValues = typeof EMPTY_VALUES;

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

export default function AddUserModal({ open, onClose, onCreated, creatorRole }: AddUserModalProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = ROLE_OPTIONS_BY_ADMIN[creatorRole ?? ''] ?? [];

  function update<K extends keyof FormValues>(field: K, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setValues(EMPTY_VALUES);
    setError('');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!values.firstName || !values.lastName || !values.email || !values.role) {
      setError('First name, last name, email, and role are required.');
      return;
    }

    setIsSubmitting(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const result = await res.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!res.ok) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }

    setValues(EMPTY_VALUES);
    onCreated();
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8]">Add user</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#A79F8E] hover:text-[#6B655A] dark:hover:text-[#8FA79C]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                value={values.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Jordan"
                autoComplete="given-name"
                className={inputClass}
              />
            </Field>
            <Field label="Last name">
              <input
                value={values.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Rivera"
                autoComplete="family-name"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Middle name (optional)">
            <input
              value={values.middleName}
              onChange={(e) => update('middleName', e.target.value)}
              placeholder="Alex"
              autoComplete="additional-name"
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+1 555 010 2938"
              autoComplete="tel"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <input
                value={values.department}
                onChange={(e) => update('department', e.target.value)}
                placeholder="Not set"
                className={inputClass}
              />
            </Field>
            <Field label="Designation">
              <input
                value={values.designation}
                onChange={(e) => update('designation', e.target.value)}
                placeholder="Not set"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Role">
            <select
              value={values.role}
              onChange={(e) => update('role', e.target.value)}
              className={inputClass}
            >
              <option value="">Select a role…</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r] ?? r}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <p role="alert" className="text-sm text-[#A3402F] dark:text-[#E0836F]">
              {error}
            </p>
          )}

          <p className="text-xs text-[#A79F8E] leading-relaxed">
            They&apos;ll get an email invite to set their own password — nothing to share here.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-4 py-2 text-sm text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#211E19] dark:bg-[#C9A46A] px-4 py-2 text-sm text-[#F6F3EC] dark:text-[#0F1613] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Sending invite…' : 'Send invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}