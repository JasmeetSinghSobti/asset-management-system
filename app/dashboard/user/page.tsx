'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Check, X, Search, ShieldCheck, UserPlus } from 'lucide-react';
import Loader from '@/components/Loader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import AddUserModal from '@/components/admin/AddUserModal';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { ROLE_OPTIONS_BY_ADMIN, ROLE_LABELS, ROLE_BADGE_STYLES } from '@/lib/roles';
import type { Profile } from '@/lib/types/profile';

type EditableFields = {
  role: string;
  department: string;
  designation: string;
};

export default function UserManagementPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoading: authLoading } = useAuth();

  // Fetch role locally, same proven pattern as Sidebar — do not rely
  // on AuthProvider's own `role`, since that fetch path was never
  // independently confirmed to work; only the Sidebar's local fetch
  // has actually been verified against this project.
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditableFields>({
    role: '',
    department: '',
    designation: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [rowError, setRowError] = useState('');

  const [addUserOpen, setAddUserOpen] = useState(false);

  const canManageUsers =
    currentUserRole === 'server_admin' || currentUserRole === 'it_admin';

  // Step 1: fetch the current user's own role.
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRoleLoading(false);
      router.replace('/');
      return;
    }

    async function loadOwnRole() {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        setCurrentUserRole('employee');
      } else {
        setCurrentUserRole(data.role);
      }
      setRoleLoading(false);
    }

    loadOwnRole();
  }, [authLoading, user, router, supabase]);

  // Step 2: once we actually know the role, redirect if not allowed.
  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!canManageUsers) {
      router.replace('/dashboard');
    }
  }, [authLoading, roleLoading, canManageUsers, router]);

  async function loadUsers() {
    setLoadingUsers(true);
    setLoadError('');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) {
      setLoadError('Could not load users: ' + error.message);
    } else {
      setUsers((data as Profile[]) ?? []);
    }
    setLoadingUsers(false);
  }

  // Fetch users — only once we know our own role and that it's allowed.
  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user || !canManageUsers) return;
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, roleLoading, user, canManageUsers]);

  function startEditing(target: Profile) {
    setEditingId(target.id);
    setEditValues({
      role: target.role,
      department: target.department ?? '',
      designation: target.designation ?? '',
    });
    setRowError('');
  }

  function cancelEditing() {
    setEditingId(null);
    setRowError('');
  }

  async function saveUser(userId: string) {
    setRowError('');
    setIsSaving(true);

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        role: editValues.role,
        department: editValues.department.trim() || null,
        designation: editValues.designation.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      setRowError(error.message);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? (updated as Profile) : u))
    );
    setEditingId(null);
  }

  const filteredUsers = users.filter((u) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    return fullName.includes(query) || u.email.toLowerCase().includes(query);
  });

  const roleOptions = ROLE_OPTIONS_BY_ADMIN[currentUserRole ?? ''] ?? [];

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardShell pageTitle="User Management">
      {authLoading || roleLoading || !user || !canManageUsers ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <SummaryStat label="Total users" value={users.length} accent="#8A6B3B" />
            {currentUserRole === 'server_admin' && (
              <>
                <SummaryStat
                  label="Server admins"
                  value={roleCounts.server_admin ?? 0}
                  accent="#A3402F"
                />
                <SummaryStat
                  label="IT admins"
                  value={roleCounts.it_admin ?? 0}
                  accent="#5B7A99"
                />
              </>
            )}
            <SummaryStat
              label="Managers"
              value={roleCounts.manager ?? 0}
              accent="#3F7A5C"
            />
            <SummaryStat
              label="Employees"
              value={roleCounts.employee ?? 0}
              accent="#6B655A"
            />
          </div>

          <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-[#E4DFD1] dark:border-[#2A3A34]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#211E19]/5 dark:bg-[#C9A46A]/10">
                  <ShieldCheck size={17} className="text-[#8A6B3B] dark:text-[#C9A46A]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8]">
                    Users
                  </h2>
                  <p className="text-xs text-[#6B655A] dark:text-[#8FA79C] mt-0.5">
                    {currentUserRole === 'server_admin'
                      ? 'You can manage every account, including other admins.'
                      : 'You can manage manager and employee accounts.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A79F8E]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email…"
                    className="w-full sm:w-64 rounded-full border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] py-2 pl-9 pr-4 text-sm text-[#211E19] dark:text-[#E8E3D8] placeholder:text-[#A79F8E] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setAddUserOpen(true)}
                  className="flex items-center gap-1.5 rounded-md bg-[#211E19] dark:bg-[#C9A46A] px-3.5 py-2 text-sm text-[#F6F3EC] dark:text-[#0F1613] transition-opacity hover:opacity-90 whitespace-nowrap"
                >
                  <UserPlus size={15} />
                  Add user
                </button>
              </div>
            </div>

            {loadingUsers ? (
              <div className="pr-8 pb-8 flex justify-center">
                <Loader />
              </div>
            ) : loadError ? (
              <p className="p-5 text-sm text-[#A3402F] dark:text-[#E0836F]">
                {loadError}
              </p>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-[#6B655A] dark:text-[#8FA79C]">
                  No users found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-[#A79F8E] border-b border-[#E4DFD1] dark:border-[#2A3A34]">
                      <th className="px-5 py-3 font-normal">User</th>
                      <th className="px-5 py-3 font-normal">Role</th>
                      <th className="px-5 py-3 font-normal">Department</th>
                      <th className="px-5 py-3 font-normal">Designation</th>
                      <th className="px-5 py-3 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const isEditing = editingId === u.id;
                      const initials = `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase();
                      const roleStyle = ROLE_BADGE_STYLES[u.role] ?? ROLE_BADGE_STYLES.employee;

                      return (
                        <tr
                          key={u.id}
                          className="border-b border-[#E4DFD1] dark:border-[#2A3A34] last:border-b-0 transition-colors hover:bg-[#F1EDE1]/60 dark:hover:bg-[#1C2E27]/60"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-[#211E19] dark:bg-[#C9A46A]/20 flex items-center justify-center">
                                {u.profile_photo ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={u.profile_photo}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="font-serif text-xs text-[#F6F3EC] dark:text-[#C9A46A]">
                                    {initials || '—'}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[#211E19] dark:text-[#E8E3D8] truncate">
                                  {[u.first_name, u.last_name].filter(Boolean).join(' ')}
                                </p>
                                <p className="text-xs text-[#A79F8E] truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            {isEditing ? (
                              <select
                                value={editValues.role}
                                onChange={(e) =>
                                  setEditValues((v) => ({ ...v, role: e.target.value }))
                                }
                                className="rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] px-2 py-1.5 text-sm text-[#211E19] dark:text-[#E8E3D8] outline-none focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
                              >
                                {roleOptions.map((r) => (
                                  <option key={r} value={r}>
                                    {ROLE_LABELS[r] ?? r}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: `${roleStyle}1A`,
                                  color: roleStyle,
                                }}
                              >
                                <span
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: roleStyle }}
                                />
                                {ROLE_LABELS[u.role] ?? u.role}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.department}
                                onChange={(e) =>
                                  setEditValues((v) => ({ ...v, department: e.target.value }))
                                }
                                placeholder="Not set"
                                className="w-32 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] px-2 py-1.5 text-sm text-[#211E19] dark:text-[#E8E3D8] outline-none focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
                              />
                            ) : (
                              <span className="text-[#4A453C] dark:text-[#8FA79C]">
                                {u.department || <span className="text-[#A79F8E]">Not assigned</span>}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.designation}
                                onChange={(e) =>
                                  setEditValues((v) => ({ ...v, designation: e.target.value }))
                                }
                                placeholder="Not set"
                                className="w-32 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] px-2 py-1.5 text-sm text-[#211E19] dark:text-[#E8E3D8] outline-none focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
                              />
                            ) : (
                              <span className="text-[#4A453C] dark:text-[#8FA79C]">
                                {u.designation || <span className="text-[#A79F8E]">Not assigned</span>}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => saveUser(u.id)}
                                  disabled={isSaving}
                                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#211E19] dark:bg-[#C9A46A] text-[#F6F3EC] dark:text-[#0F1613] transition-opacity hover:opacity-90 disabled:opacity-60"
                                  aria-label="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  disabled={isSaving}
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] text-[#4A453C] dark:text-[#8FA79C] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
                                  aria-label="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditing(u)}
                                className="flex items-center gap-1.5 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-2.5 py-1.5 text-xs text-[#211E19] dark:text-[#E8E3D8] transition-colors hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27] ml-auto"
                              >
                                <Pencil size={12} />
                                Edit
                              </button>
                            )}
                            {isEditing && rowError && (
                              <p className="mt-1.5 text-xs text-[#A3402F] dark:text-[#E0836F] text-right">
                                {rowError}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <AddUserModal
            open={addUserOpen}
            onClose={() => setAddUserOpen(false)}
            onCreated={loadUsers}
            creatorRole={currentUserRole}
          />
        </>
      )}
    </DashboardShell>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-3.5">
      <p className="text-xs uppercase tracking-[0.08em] text-[#6B655A] dark:text-[#8FA79C]">
        {label}
      </p>
      <p className="mt-1.5 font-serif text-2xl" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}