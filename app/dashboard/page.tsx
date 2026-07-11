'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loader from '@/components/Loader';
import { DashboardShell } from '@/components/layout/DashboardShell';

import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { ITAdminDashboard } from '@/components/dashboard/ITAdminDashboard';
import { ServerAdminDashboard } from '@/components/dashboard/ServerAdminDashboard';

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoading } = useAuth();

  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    async function loadRole() {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setRole('employee');
      } else {
        setRole(data.role);
      }

      setLoadingRole(false);
    }

    loadRole();
  }, [user, isLoading, router, supabase]);

  if (isLoading || loadingRole) 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <DashboardShell pageTitle="Dashboard">
      {role === 'server_admin' && <ServerAdminDashboard />}

      {role === 'it_admin' && <ITAdminDashboard />}

      {role === 'manager' && <ManagerDashboard />}

      {(role === 'employee' || !role) && <EmployeeDashboard />}
    </DashboardShell>
  );
}