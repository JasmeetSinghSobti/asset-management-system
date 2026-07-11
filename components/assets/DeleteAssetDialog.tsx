'use client';

import { useState } from 'react';
import type { Asset } from '@/lib/types/asset';

interface DeleteAssetDialogProps {
  asset: Asset | null;
  onClose: () => void;
  onConfirm: (asset: Asset) => Promise<string | void>;
}

export default function DeleteAssetDialog({ asset, onClose, onConfirm }: DeleteAssetDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!asset) return null;

  async function handleConfirm() {
    setError('');
    setIsDeleting(true);
    const err = await onConfirm(asset!);
    setIsDeleting(false);

    if (err) {
      setError(err);
      return;
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8]">Delete asset</h2>
        <p className="mt-2 text-sm text-[#6B655A] dark:text-[#8FA79C]">
          Remove <strong className="text-[#211E19] dark:text-[#E8E3D8]">{asset.name}</strong> (
          {asset.asset_tag})? This can&apos;t be undone.
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-[#A3402F] dark:text-[#E0836F]">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-4 py-2 text-sm text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-md bg-[#A3402F] px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}