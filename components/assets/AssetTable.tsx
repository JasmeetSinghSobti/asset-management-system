'use client';

import Loader from '@/components/Loader';
import type { Asset } from '@/lib/types/asset';
import AssetRow from './AssetRow';

interface AssetTableProps {
  assets: Asset[];
  loading: boolean;
  error: string;
  canManage: boolean;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetTable({
  assets,
  loading,
  error,
  canManage,
  onEdit,
  onDelete,
}: AssetTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="p-5 text-sm text-[#A3402F] dark:text-[#E0836F]">{error}</p>;
  }

  if (assets.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-[#6B655A] dark:text-[#8FA79C]">No assets found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-[#A79F8E] border-b border-[#E4DFD1] dark:border-[#2A3A34]">
            <th className="px-5 py-3 font-normal">Asset ID</th>
            <th className="px-5 py-3 font-normal">Asset</th>
            <th className="px-5 py-3 font-normal">Category</th>
            <th className="px-5 py-3 font-normal">Status</th>
            <th className="px-5 py-3 font-normal">Location</th>
            <th className="px-5 py-3 font-normal">Assigned To</th>
            {canManage && <th className="px-5 py-3 font-normal text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              canManage={canManage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}