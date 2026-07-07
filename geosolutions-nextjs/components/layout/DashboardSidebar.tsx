'use client';

// components/layout/DashboardSidebar.tsx

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { cn, getInitials } from '@/lib/utils';
import type { User } from '@/types/auth';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

const studentNavItems: NavItem[] = [
  { id: 'overview',  label: 'Overview',    icon: '📊' },
  { id: 'results',   label: 'My Results',  icon: '📋' },
  { id: 'profile',   label: 'My Profile',  icon: '👤' },
  { id: 'edu-needs', label: 'Edu Needs',   icon: '🎒' },
  { id: 'payment',   label: 'Make Payment', icon: '💳' },
];

const teacherNavItems: NavItem[] = [
  { id: 'overview',  label: 'Overview',      icon: '📊' },
  { id: 'students',  label: 'My Students',   icon: '🎓' },
  { id: 'results',   label: 'Add Results',   icon: '📋' },
  { id: 'profile',   label: 'My Profile',    icon: '👤' },
];

const adminNavItems: NavItem[] = [
  { id: 'overview',  label: 'Overview',      icon: '📊' },
  { id: 'users',     label: 'Manage Users',  icon: '👥' },
  { id: 'results',   label: 'Results',       icon: '📋' },
  { id: 'payments',  label: 'Payments',      icon: '💳' },
  { id: 'profile',   label: 'Profile',       icon: '👤' },
];

function getNavItems(role: string): NavItem[] {
  if (role === 'teacher') return teacherNavItems;
  if (role === 'admin')   return adminNavItems;
  return studentNavItems;
}

interface DashboardSidebarProps {
  user: User;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const { logout } = useAuth();
  const { sidebarOpen, setSidebarOpen, activeTab, setActiveTab } = useUIStore();
  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-30',
          'w-64 flex flex-col',
          'bg-geo-900 dark:bg-dark-surface',
          'border-r border-white/10',
          'transition-transform duration-300 ease-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.jpg" alt="Geo Academy" width={36} height={36} className="rounded-xl" />
            <span className="font-bold text-white text-sm">
              GEO<em className="not-italic text-geo-400">SOLUTION</em>
            </span>
          </Link>
          <button
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName}
              width={44}
              height={44}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-geo-500 to-geo-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {getInitials(user.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate" id="sidebar-user-name">
              {user.fullName}
            </p>
            <p className="text-geo-300 text-xs capitalize">{user.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === item.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
              id={`nav-${item.id}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer — Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
            id="logout-btn"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
