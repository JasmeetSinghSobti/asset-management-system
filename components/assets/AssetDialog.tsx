'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AssetForm from './AssetForm';
import type { Asset, AssetInput } from '@/lib/types/asset';

interface AssetDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  asset?: Asset | null;
  onClose: () => void;
  /** Return an error message string on failure, or nothing/undefined on success. */
  onSubmit: (values: AssetInput) => Promise<string | void>;
}

const EMPTY_VALUES: AssetInput = {
  name: '',
  category: 'Laptop',
  status: 'Available',
  location: '',
  assigned_to: '',
  notes: '',
};

export default function AssetDialog({ open, mode, asset, onClose, onSubmit }: AssetDialogProps) {
  const [values, setValues] = useState<AssetInput>(EMPTY_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && asset) {
      setValues({
        name: asset.name,
        category: asset.category,
        status: asset.status,
        location: asset.location ?? '',
        assigned_to: asset.assigned_to ?? '',
        notes: asset.notes ?? '',
      });
    } else {
      setValues(EMPTY_VALUES);
    }
    setError('');
  }, [open, mode, asset]);

  function update<K extends keyof AssetInput>(field: K, value: AssetInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!values.name.trim()) {
      setError('Asset name is required.');
      return;
    }

    setIsSubmitting(true);
    const submitError = await onSubmit(values);
    setIsSubmitting(false);

    if (submitError) {
      setError(submitError);
      return;
    }

    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8]">
            {mode === 'edit' ? 'Edit asset' : 'Add asset'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A79F8E] hover:text-[#6B655A] dark:hover:text-[#8FA79C]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AssetForm values={values} onChange={update} />

          {error && (
            <p role="alert" className="text-sm text-[#A3402F] dark:text-[#E0836F]">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-4 py-2 text-sm text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#211E19] dark:bg-[#C9A46A] px-4 py-2 text-sm text-[#F6F3EC] dark:text-[#0F1613] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}