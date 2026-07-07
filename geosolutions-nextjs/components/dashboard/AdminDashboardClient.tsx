'use client';

// components/dashboard/AdminDashboardClient.tsx

import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getInitials, formatDate } from '@/lib/utils';
import type { User, UserStatus } from '@/types/auth';

interface Props { users: User[]; }

export function AdminDashboardClient({ users }: Props) {
  const { user: adminUser } = useAuthStore();
  const { activeTab, toggleSidebar } = useUIStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<UserStatus | 'all'>('all');

  const filtered = users.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.identifier.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: users.length,
    approved: users.filter(u => u.status === 'approved').length,
    pending: users.filter(u => u.status === 'pending').length,
    students: users.filter(u => u.role === 'student').length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-slate-100 dark:border-dark-border shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Open sidebar">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        </div>
        {adminUser && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-geo-500 to-geo-800 flex items-center justify-center text-white font-bold text-xs">
            {getInitials(adminUser.fullName)}
          </div>
        )}
      </header>

      <main className="flex-1 p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-hero-gradient text-white">
              <p className="text-geo-200 text-sm">Admin Control Panel</p>
              <h2 className="text-2xl font-bold mt-1">Manage Users & System</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats.total, icon: '👥' },
                { label: 'Approved',    value: stats.approved, icon: '✅' },
                { label: 'Pending',     value: stats.pending, icon: '⏳' },
                { label: 'Students',    value: stats.students, icon: '🎓' },
              ].map(({ label, value, icon }) => (
                <Card key={label} padding="md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                      <p className="text-2xl font-extrabold text-geo-700 dark:text-geo-400">{value}</p>
                    </div>
                    <span className="text-2xl">{icon}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Users</h2>
              <div className="flex gap-3">
                <input
                  type="search"
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-geo-500"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as UserStatus | 'all')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-geo-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-dark-card border-b border-slate-100 dark:border-dark-border">
                    <tr>
                      {['User', 'Role', 'Identifier', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-dark-card/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-geo-500 to-geo-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {getInitials(u.fullName)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-white">{u.fullName}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 capitalize text-slate-600 dark:text-slate-300">{u.role}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">{u.identifier}</td>
                        <td className="px-5 py-4">
                          <Badge variant={
                            u.status === 'approved' ? 'success' :
                            u.status === 'pending'  ? 'warning' :
                            u.status === 'rejected' ? 'danger'  : 'default'
                          } className="capitalize">{u.status}</Badge>
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{formatDate(u.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            {u.status === 'pending' && (
                              <Button size="sm" variant="primary" className="text-xs px-3 py-1.5">Approve</Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-xs px-3 py-1.5">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
