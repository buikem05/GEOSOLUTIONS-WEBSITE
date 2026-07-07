// app/(dashboard)/teacher/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Teacher Dashboard' };

export default function TeacherDashboardPage() {
  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="p-6 rounded-3xl bg-hero-gradient text-white">
        <p className="text-geo-200 text-sm mb-1">Teacher Portal</p>
        <h2 className="text-2xl font-bold">Manage your students & results</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['My Students', 'Add Results', 'View Results'].map((action) => (
          <div key={action} className="p-6 rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card shadow-geo hover:shadow-geo-lg transition-all hover:-translate-y-1 cursor-pointer">
            <h3 className="font-semibold text-slate-800 dark:text-white">{action}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
