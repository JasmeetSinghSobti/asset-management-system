'use client';

import {
  Package,
  Users,
  ShieldCheck,
  FileBarChart,
} from 'lucide-react';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { AssetStatsCard } from '@/components/dashboard/AssetStatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecentAssets } from '@/components/dashboard/RecentAssets';
import { QuickActions } from '@/components/dashboard/QuickActions';

export function ServerAdminDashboard() {
  return (
    <>
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total Assets"
          value="442"
          icon={Package}
          delta={{ value: "+18", direction: "up" }}
        />

        <StatsCard
          label="Total Users"
          value="126"
          icon={Users}
          delta={{ value: "+4", direction: "up" }}
        />

        <StatsCard
          label="System Health"
          value="99.9%"
          icon={ShieldCheck}
          delta={{ value: "Healthy", direction: "up" }}
        />

        <StatsCard
          label="Audit Events"
          value="84"
          icon={FileBarChart}
          delta={{ value: "Today", direction: "up" }}
        />
      </div>

      {/* Main Grid */}
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
    </>
  );
}