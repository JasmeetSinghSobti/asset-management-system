'use client';

import {
  Package,
  ClipboardList,
  Wrench,
  AlertTriangle,
} from 'lucide-react';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { AssetStatsCard } from '@/components/dashboard/AssetStatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { RecentAssets } from '@/components/dashboard/RecentAssets';
import { QuickActions } from '@/components/dashboard/QuickActions';

export function ITAdminDashboard() {
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
          label="Assigned Assets"
          value="312"
          icon={ClipboardList}
          delta={{ value: "+9", direction: "up" }}
        />

        <StatsCard
          label="Maintenance"
          value="12"
          icon={Wrench}
          delta={{ value: "+2", direction: "up" }}
        />

        <StatsCard
          label="Low Stock"
          value="5"
          icon={AlertTriangle}
          delta={{ value: "Attention", direction: "down" }}
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