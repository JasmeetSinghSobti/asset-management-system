'use client';

import { Package, Users, ClipboardList, FileBarChart } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AssetStatsCard } from '@/components/dashboard/AssetStatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecentAssets } from '@/components/dashboard/RecentAssets';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import Loader from '@/components/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  if (!user) {
  router.replace('/');
  }
  return (
    <DashboardShell pageTitle="Dashboard">
      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total assets"
          value="442"
          icon={Package}
          delta={{ value: '+18', direction: 'up' }}
        />
        <StatsCard
          label="Employees"
          value="126"
          icon={Users}
          delta={{ value: '+4', direction: 'up' }}
        />
        <StatsCard
          label="Active assignments"
          value="312"
          icon={ClipboardList}
          delta={{ value: '+9', direction: 'up' }}
        />
        <StatsCard
          label="Pending reports"
          value="3"
          icon={FileBarChart}
          delta={{ value: '-2', direction: 'down' }}
        />
      </div>

      {/* Main grid */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <RecentAssets />
          <QuickActions />
        </div>
        <div className="flex flex-col gap-4">
          <AssetStatsCard />
          <RecentActivity />
        </div>
      </div>
    </DashboardShell>
  );
}
