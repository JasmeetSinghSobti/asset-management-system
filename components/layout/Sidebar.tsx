'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  FileBarChart,
  ScrollText,
  Settings,
  X,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Assets', href: '/dashboard/assets', icon: Package },
  { label: 'Employees', href: '/dashboard/employees', icon: Users },
  { label: 'Assignments', href: '/dashboard/assignments', icon: ClipboardList },
  { label: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
  { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: ScrollText },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-[#E4DFD1] dark:border-[#2A3A34] bg-[#F6F3EC] dark:bg-[#0F1613] transition-transform duration-200 lg:fixed lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#E4DFD1] dark:border-[#2A3A34]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-[#8A6B3B] dark:border-[#C9A46A]/60 flex items-center justify-center">
              <span className="font-serif text-[#8A6B3B] dark:text-[#C9A46A] text-sm">
                Ω
              </span>
            </div>
            <span className="text-[#211E19] dark:text-[#E8E3D8] tracking-[0.15em] text-xs uppercase">
              Ledger
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[#6B655A] dark:text-[#8FA79C] hover:text-[#211E19] dark:hover:text-[#E8E3D8]"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#211E19] text-[#F6F3EC] dark:bg-[#C9A46A]/15 dark:text-[#E8E3D8] dark:border dark:border-[#C9A46A]/30'
                    : 'text-[#4A453C] dark:text-[#8FA79C] hover:bg-[#EDE8DA] dark:hover:bg-[#1C2E27]'
                }`}
              >
                <Icon size={17} strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
