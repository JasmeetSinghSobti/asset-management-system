'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Check, X, Search } from 'lucide-react';
import Loader from '@/components/Loader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import type { Profile } from '@/lib/types/profile';

type EditableFields = {
  role: string;
  department: string;
  designation: string;
};

const ROLE_OPTIONS_BY_ADMIN: Record<string, string[]> = {
  server_admin: ['employee', 'manager', 'it_admin', 'server_admin'],
  it_admin: ['employee', 'manager'],
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

      console.log('user management: own role fetch:', { data, error });

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

  // Fetch users — only once we know our own role and that it's allowed.
  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user || !canManageUsers) return;

    async function loadUsers() {
      setLoadingUsers(true);
      setLoadError('');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('first_name', { ascending: true });

      // Temporary — remove once confirmed working.
      console.log('user management fetch:', {
        count: data?.length,
        error,
      });

      if (error) {
        setLoadError('Could not load users: ' + error.message);
      } else {
        setUsers((data as Profile[]) ?? []);
      }
      setLoadingUsers(false);
    }

    loadUsers();
  }, [authLoading, roleLoading, user, canManageUsers, supabase]);

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

  if (authLoading || roleLoading || !user || !canManageUsers) {
    return <Loader />;
  }

  return (
    
      <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D]">
        <DashboardShell pageTitle="User Management">
        <div className="flex items-center justify-between gap-4 p-5 border-b border-[#E4DFD1] dark:border-[#2A3A34]">
          
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
          


          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A79F8E]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-56 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] py-2 pl-8 pr-3 text-sm text-[#211E19] dark:text-[#E8E3D8] placeholder:text-[#A79F8E] outline-none focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
            />
          </div>
        </div>
        </DashboardShell>
        {loadingUsers ? (
          <div className="p-5">
            <Loader />
          </div>
        ) : loadError ? (
          <DashboardShell pageTitle="User Management">
          <p className="p-5 text-sm text-[#A3402F] dark:text-[#E0836F]">
            {loadError}
          </p>
          </DashboardShell>
        ) : filteredUsers.length === 0 ? (
          <DashboardShell pageTitle="User Management">
          <p className="p-5 text-sm text-[#6B655A] dark:text-[#8FA79C]">
            No users found.
          </p>
          </DashboardShell>
        ) : (
          <DashboardShell pageTitle="User Management">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[#A79F8E] border-b border-[#E4DFD1] dark:border-[#2A3A34]">
                  <th className="px-5 py-3 font-normal">Name</th>
                  <th className="px-5 py-3 font-normal">Email</th>
                  <th className="px-5 py-3 font-normal">Role</th>
                  <th className="px-5 py-3 font-normal">Department</th>
                  <th className="px-5 py-3 font-normal">Designation</th>
                  <th className="px-5 py-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isEditing = editingId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className="border-b border-[#E4DFD1] dark:border-[#2A3A34] last:border-b-0"
                    >
                      <td className="px-5 py-3 text-[#211E19] dark:text-[#E8E3D8]">
                        {[u.first_name, u.last_name].filter(Boolean).join(' ')}
                      </td>
                      <td className="px-5 py-3 text-[#4A453C] dark:text-[#8FA79C]">
                        {u.email}
                      </td>
                      <td className="px-5 py-3">
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
                                {r}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="inline-block rounded-full bg-[#8A6B3B]/10 text-[#8A6B3B] dark:text-[#C9A46A] px-2.5 py-1 text-xs">
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
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
                            {u.department || '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
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
                            {u.designation || '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveUser(u.id)}
                              disabled={isSaving}
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-[#211E19] dark:bg-[#C9A46A] text-[#F6F3EC] dark:text-[#0F1613] disabled:opacity-60"
                              aria-label="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isSaving}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] text-[#4A453C] dark:text-[#8FA79C]"
                              aria-label="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(u)}
                            className="flex items-center gap-1.5 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-2.5 py-1.5 text-xs text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                        )}
                        {isEditing && rowError && (
                          <p className="mt-1 text-xs text-[#A3402F] dark:text-[#E0836F]">
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
          </DashboardShell>
        )}
      </div>
    
  );
}