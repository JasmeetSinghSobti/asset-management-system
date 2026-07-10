import {
  PackagePlus,
  UserPlus,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Activity = {
  id: number;
  text: string;
  time: string;
  icon: LucideIcon;
};

const ACTIVITY: Activity[] = [
  {
    id: 1,
    text: 'MacBook Pro 14" (AS-2291) assigned to Rohan Mehta',
    time: '10 minutes ago',
    icon: ClipboardCheck,
  },
  {
    id: 2,
    text: 'New employee Simran Kaur added to Engineering',
    time: '45 minutes ago',
    icon: UserPlus,
  },
  {
    id: 3,
    text: 'Dell Monitor U2723Q (AS-1187) added to inventory',
    time: '2 hours ago',
    icon: PackagePlus,
  },
  {
    id: 4,
    text: 'Asset AS-0932 flagged overdue for return',
    time: '5 hours ago',
    icon: AlertTriangle,
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-5">
      <p className="text-xs uppercase tracking-[0.1em] text-[#6B655A] dark:text-[#8FA79C]">
        Recent activity
      </p>

      <ul className="mt-4 space-y-4">
        {ACTIVITY.map((a, i) => {
          const Icon = a.icon;
          return (
            <li key={a.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#211E19]/5 dark:bg-[#C9A46A]/10">
                  <Icon
                    size={13}
                    className="text-[#8A6B3B] dark:text-[#C9A46A]"
                  />
                </div>
                {i < ACTIVITY.length - 1 && (
                  <div className="mt-1 h-full w-px flex-1 bg-[#E4DFD1] dark:bg-[#2A3A34]" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm text-[#211E19] dark:text-[#E8E3D8] leading-snug">
                  {a.text}
                </p>
                <p className="mt-1 text-xs text-[#A79F8E]">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
