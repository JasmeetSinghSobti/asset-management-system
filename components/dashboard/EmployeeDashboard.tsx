'use client';

import {
  Package,
  Clock3,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

export function EmployeeDashboard() {
  return (
    <>
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="My Assets"
          value="3"
          icon={Package}
          delta={{ value: 'Assigned', direction: 'up' }}
        />

        <StatsCard
          label="Pending Requests"
          value="1"
          icon={Clock3}
          delta={{ value: 'Waiting', direction: 'up' }}
        />

        <StatsCard
          label="Approved Requests"
          value="5"
          icon={CheckCircle2}
          delta={{ value: 'Completed', direction: 'up' }}
        />

        <StatsCard
          label="Returns Due"
          value="0"
          icon={RotateCcw}
          delta={{ value: 'No pending', direction: 'down' }}
        />
      </div>

      {/* Dashboard Content */}
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