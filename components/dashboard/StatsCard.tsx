import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type StatsCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: { value: string; direction: 'up' | 'down' };
};

export function StatsCard({ label, value, icon: Icon, delta }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.1em] text-[#6B655A] dark:text-[#8FA79C]">
          {label}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#211E19]/5 dark:bg-[#C9A46A]/10">
          <Icon
            size={16}
            className="text-[#8A6B3B] dark:text-[#C9A46A]"
            strokeWidth={1.75}
          />
        </div>
      </div>

      <p className="mt-3 font-serif text-3xl text-[#211E19] dark:text-[#E8E3D8]">
        {value}
      </p>

      {delta && (
        <div
          className={`mt-2 flex items-center gap-1 text-xs ${
            delta.direction === 'up' ? 'text-[#3F7A5C]' : 'text-[#A3402F]'
          }`}
        >
          {delta.direction === 'up' ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
          <span>{delta.value}</span>
          <span className="text-[#A79F8E]">vs last month</span>
        </div>
      )}
    </div>
  );
}
