'use client';

import {
  PackagePlus,
  UserPlus,
  ClipboardList,
  FileBarChart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Action = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const ACTIONS: Action[] = [
  { label: 'Add asset', href: '/dashboard/assets/new', icon: PackagePlus },
  { label: 'Add employee', href: '/dashboard/employees/new', icon: UserPlus },
  {
    label: 'New assignment',
    href: '/dashboard/assignments/new',
    icon: ClipboardList,
  },
  {
    label: 'Generate report',
    href: '/dashboard/reports/new',
    icon: FileBarChart,
  },
];

export function QuickActions() {
  return (
    <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-5">
      <p className="text-xs uppercase tracking-[0.1em] text-[#6B655A] dark:text-[#8FA79C]">
        Quick actions
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className="flex flex-col items-start gap-2.5 rounded-md border border-[#E4DFD1] dark:border-[#2A3A34] p-3.5 transition-colors hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#211E19]/5 dark:bg-[#C9A46A]/10">
                <Icon
                  size={16}
                  className="text-[#8A6B3B] dark:text-[#C9A46A]"
                  strokeWidth={1.75}
                />
              </div>
              <span className="text-sm text-[#211E19] dark:text-[#E8E3D8]">
                {action.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
