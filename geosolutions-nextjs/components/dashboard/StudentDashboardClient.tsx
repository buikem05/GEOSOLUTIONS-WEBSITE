'use client';

// components/dashboard/StudentDashboardClient.tsx

import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getInitials, formatDate, formatCurrency } from '@/lib/utils';
import type { Result } from '@/types/results';
import type { Payment } from '@/types/payment';

interface Props {
  results: Result[];
  payments: Payment[];
}

export function StudentDashboardClient({ results, payments }: Props) {
  const { user } = useAuthStore();
  const { activeTab, setActiveTab, toggleSidebar } = useUIStore();

  const latestResult = results[0];
  const totalPaid = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-slate-100 dark:border-dark-border shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-card transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Student Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-geo-500 to-geo-800 flex items-center justify-center text-white font-bold text-xs">
            {getInitials(user.fullName)}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div className="p-6 rounded-3xl bg-hero-gradient text-white">
              <p className="text-geo-200 text-sm mb-1">Welcome back,</p>
              <h2 className="text-2xl font-bold">{user.fullName} 👋</h2>
              <p className="text-geo-300 text-sm mt-1">ID: {user.identifier}</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Results', value: results.length.toString(), icon: '📋', color: 'text-geo-600' },
                { label: 'Latest Average', value: latestResult ? `${latestResult.average.toFixed(1)}%` : 'N/A', icon: '📈', color: 'text-green-600' },
                { label: 'Total Paid', value: formatCurrency(totalPaid), icon: '💳', color: 'text-amber-600' },
                { label: 'Account Status', value: user.status, icon: '✅', color: 'text-geo-600' },
              ].map(({ label, value, icon, color }) => (
                <Card key={label} padding="md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                      <p className={`text-xl font-bold ${color} dark:text-opacity-80 capitalize`}>{value}</p>
                    </div>
                    <span className="text-2xl">{icon}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick actions */}
            <Card padding="md">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('results')}>📋 View Results</Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('payment')}>💳 Make Payment</Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('profile')}>👤 Edit Profile</Button>
              </div>
            </Card>
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────── */}
        {activeTab === 'results' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Results</h2>
            {results.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-slate-600 dark:text-slate-400">No results available yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.id} padding="md">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">{result.examType}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{result.term} — {result.session}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-geo-700 dark:text-geo-400">{result.average.toFixed(1)}%</p>
                        {result.position && <p className="text-xs text-slate-500">Position: {result.position}</p>}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-dark-border">
                            <th className="pb-2">Subject</th>
                            <th className="pb-2">Score</th>
                            <th className="pb-2">Max</th>
                            <th className="pb-2">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.scores.map((score) => (
                            <tr key={score.subject} className="border-b border-slate-50 dark:border-dark-border/50 last:border-0">
                              <td className="py-2 text-slate-700 dark:text-slate-300">{score.subject}</td>
                              <td className="py-2 font-semibold text-slate-800 dark:text-white">{score.score}</td>
                              <td className="py-2 text-slate-500">{score.maxScore}</td>
                              <td className="py-2">
                                <Badge variant={score.score >= 50 ? 'success' : 'danger'}>{score.grade}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE ──────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="max-w-lg animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h2>
            <Card padding="lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-geo-500 to-geo-800 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{user.fullName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  <Badge variant={user.status === 'approved' ? 'success' : 'warning'} className="mt-1 capitalize">{user.status}</Badge>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ['Role', user.role],
                  ['ID / Reg Number', user.identifier],
                  ['Phone', user.phone ?? 'Not set'],
                  ['Member Since', formatDate(user.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-slate-50 dark:border-dark-border/50 last:border-0">
                    <span className="text-slate-500 dark:text-slate-400 capitalize">{label}</span>
                    <span className="text-slate-800 dark:text-white font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── PAYMENT ──────────────────────────────────────── */}
        {activeTab === 'payment' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment History</h2>
            {payments.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="text-4xl mb-3">💳</p>
                <p className="text-slate-600 dark:text-slate-400 mb-4">No payments recorded yet.</p>
                <Button variant="primary">Make First Payment</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <Card key={p.id} padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{p.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatDate(p.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.amount)}</p>
                        <Badge variant={p.status === 'success' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'} className="mt-1 capitalize">
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
