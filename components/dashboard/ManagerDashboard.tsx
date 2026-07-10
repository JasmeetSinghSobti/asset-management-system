'use client';

import {
  Users,
  ClipboardCheck,
  Package,
  Clock3,
} from 'lucide-react';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

export function ManagerDashboard() {
  return (
    <>
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Team Members"
          value="12"
          icon={Users}
          delta={{ value: 'My Team', direction: 'up' }}
        />

        <StatsCard
          label="Pending Approvals"
          value="4"
          icon={ClipboardCheck}
          delta={{ value: 'Needs Action', direction: 'up' }}
        />

        <StatsCard
          label="Team Assets"
          value="36"
          icon={Package}
          delta={{ value: 'Assigned', direction: 'up' }}
        />

        <StatsCard
          label="Pending Returns"
          value="2"
          icon={Clock3}
          delta={{ value: 'This Week', direction: 'down' }}
        />
      </div>

      {/* Main Content */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <QuickActions />
        </div>

        <div className="flex flex-col gap-4">
          <RecentActivity />
        </div>
      </div>
    </>
  );
}