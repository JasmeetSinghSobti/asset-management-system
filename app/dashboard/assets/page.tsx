'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import AssetSearch from '@/components/assets/AssetSearch';
import AssetFilters from '@/components/assets/AssetFilters';
import AssetTable from '@/components/assets/AssetTable';
import AssetDialog from '@/components/assets/AssetDialog';
import DeleteAssetDialog from '@/components/assets/DeleteAssetDialog';
import { ASSET_CATEGORIES, ASSET_STATUSES, type Asset, type AssetInput } from '@/lib/types/asset';

// Roles allowed to add/edit/delete assets. Everyone else (e.g. `employee`)
// can still view and search the table, just without the management actions.
// Adjust this list if your org's permissions differ.
const CAN_MANAGE_ROLES = ['server_admin', 'it_admin', 'manager'];

export default function AssetsPage() {
  const supabase = createClient();
  const { user, isLoading: authLoading } = useAuth();

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);

  const canManage = CAN_MANAGE_ROLES.includes(currentUserRole ?? '');

  // Same pattern as User Management — fetch the caller's own role locally
  // rather than trusting AuthProvider's role, per the project's existing convention.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRoleLoading(false);
      return;
    }

    async function loadOwnRole() {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user!.id)
        .maybeSingle();
      setCurrentUserRole(data?.role ?? 'employee');
      setRoleLoading(false);
    }
    loadOwnRole();
  }, [authLoading, user, supabase]);

  async function loadAssets() {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Could not load assets: ' + fetchError.message);
    } else {
      setAssets((data as Asset[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (authLoading || roleLoading) return;
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, roleLoading]);

  const locations = useMemo(
    () => Array.from(new Set(assets.map((a) => a.location).filter(Boolean))) as string[],
    [assets]
  );

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (
        query &&
        !a.name.toLowerCase().includes(query) &&
        !a.asset_tag.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (category && a.category !== category) return false;
      if (status && a.status !== status) return false;
      if (location && a.location !== location) return false;
      return true;
    });
  }, [assets, search, category, status, location]);

  function openCreateDialog() {
    setDialogMode('create');
    setEditingAsset(null);
    setDialogOpen(true);
  }

  function openEditDialog(asset: Asset) {
    setDialogMode('edit');
    setEditingAsset(asset);
    setDialogOpen(true);
  }

  async function handleSubmit(values: AssetInput): Promise<string | void> {
    const payload = {
      name: values.name.trim(),
      category: values.category,
      status: values.status,
      location: values.location?.trim() || null,
      assigned_to: values.assigned_to?.trim() || null,
      notes: values.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (dialogMode === 'edit' && editingAsset) {
      const { data, error: updateError } = await supabase
        .from('assets')
        .update(payload)
        .eq('id', editingAsset.id)
        .select()
        .single();

      if (updateError) return updateError.message;
      setAssets((prev) => prev.map((a) => (a.id === editingAsset.id ? (data as Asset) : a)));
      return;
    }

    // asset_tag is generated server-side (DB default/trigger) — not sent from the client.
    const { data, error: insertError } = await supabase
      .from('assets')
      .insert(payload)
      .select()
      .single();

    if (insertError) return insertError.message;
    setAssets((prev) => [data as Asset, ...prev]);
  }

  async function handleDelete(asset: Asset): Promise<string | void> {
    const { error: deleteError } = await supabase.from('assets').delete().eq('id', asset.id);
    if (deleteError) return deleteError.message;
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
  }

  return (
    <DashboardShell pageTitle="Assets">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif text-2xl text-[#211E19] dark:text-[#E8E3D8]">Assets</h1>
          <p className="text-sm text-[#6B655A] dark:text-[#8FA79C] mt-0.5">
            {assets.length} total
          </p>
        </div>
        {canManage && (
          <button
            onClick={openCreateDialog}
            className="flex items-center gap-1.5 rounded-md bg-[#211E19] dark:bg-[#C9A46A] px-4 py-2.5 text-sm text-[#F6F3EC] dark:text-[#0F1613] transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add Asset
          </button>
        )}
      </div>

      <div className="space-y-4 mb-5">
        <AssetSearch value={search} onChange={setSearch} />
        <AssetFilters
          categories={ASSET_CATEGORIES}
          statuses={ASSET_STATUSES}
          locations={locations}
          category={category}
          status={status}
          location={location}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onLocationChange={setLocation}
        />
      </div>

      <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] overflow-hidden">
        <AssetTable
          assets={filteredAssets}
          loading={authLoading || roleLoading || loading}
          error={error}
          canManage={canManage}
          onEdit={openEditDialog}
          onDelete={setDeletingAsset}
        />
      </div>

      <AssetDialog
        open={dialogOpen}
        mode={dialogMode}
        asset={editingAsset}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteAssetDialog
        asset={deletingAsset}
        onClose={() => setDeletingAsset(null)}
        onConfirm={handleDelete}
      />
    </DashboardShell>
  );
}