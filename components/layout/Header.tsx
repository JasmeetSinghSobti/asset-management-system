'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';

type HeaderProps = {
  pageTitle: string;
  onMenuClick: () => void;
};

const NOTIFICATIONS = [
  { id: 1, text: 'Laptop LT-1042 assigned to Priya Nair', time: '12m ago' },
  { id: 2, text: 'Audit flagged 2 unreturned assets', time: '1h ago' },
  { id: 3, text: 'Monthly asset report is ready', time: '3h ago' },
];

export function Header({ pageTitle, onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const supabase = createClient();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pull the avatar + name from `profiles` so the header shows the
  // user's actual photo instead of just an email-initial placeholder.
  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      setDisplayName(null);
      return;
    }

    let cancelled = false;

    supabase
      .from('profiles')
      .select('first_name, last_name, profile_photo')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setAvatarUrl(data.profile_photo ?? null);
        const fullName = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(' ');
        setDisplayName(fullName || null);
      });

    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  const initials = (displayName ?? user?.email ?? 'U')[0]?.toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#E4DFD1] dark:border-[#2A3A34] bg-[#F6F3EC]/90 dark:bg-[#0F1613]/90 backdrop-blur px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-[#6B655A] dark:text-[#8FA79C]"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <h1 className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8] whitespace-nowrap">
        {pageTitle}
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A79F8E]"
          />
          <input
            type="text"
            placeholder="Search assets, employees…"
            className="w-52 md:w-64 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] py-2 pl-9 pr-3 text-sm text-[#211E19] dark:text-[#E8E3D8] placeholder:text-[#A79F8E] dark:placeholder:text-[#5C6E66] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A]"
          />
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-[#6B655A] dark:text-[#8FA79C] hover:bg-[#EDE8DA] dark:hover:bg-[#1C2E27] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#A3402F]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-md border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E4DFD1] dark:border-[#2A3A34] text-xs uppercase tracking-wide text-[#6B655A] dark:text-[#8FA79C]">
                Notifications
              </div>
              <ul>
                {NOTIFICATIONS.map((n) => (
                  <li
                    key={n.id}
                    className="px-4 py-3 text-sm text-[#211E19] dark:text-[#E8E3D8] border-b border-[#E4DFD1] dark:border-[#2A3A34] last:border-b-0 hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
                  >
                    <p>{n.text}</p>
                    <p className="mt-1 text-xs text-[#A79F8E]">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#EDE8DA] dark:hover:bg-[#1C2E27] transition-colors"
          >
            <div className="h-7 w-7 rounded-full overflow-hidden bg-[#211E19] dark:bg-[#C9A46A]/20 dark:border dark:border-[#C9A46A]/40 flex items-center justify-center text-xs text-[#F6F3EC] dark:text-[#C9A46A]">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <ChevronDown
              size={14}
              className="hidden sm:block text-[#6B655A] dark:text-[#8FA79C]"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E4DFD1] dark:border-[#2A3A34]">
                <p className="text-sm text-[#211E19] dark:text-[#E8E3D8] truncate">
                  {displayName ?? user?.email ?? 'Signed in'}
                </p>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
              >
                <UserIcon size={15} />
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#A3402F] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}