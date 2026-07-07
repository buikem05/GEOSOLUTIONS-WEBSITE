// app/(dashboard)/student/page.tsx — Student Dashboard (SSR)

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { StudentDashboardClient } from '@/components/dashboard/StudentDashboardClient';
import { EXPRESS_API_URL, SESSION_COOKIE_NAME } from '@/lib/constants';
import type { Result } from '@/types/results';
import type { Payment } from '@/types/payment';

export const metadata: Metadata = {
  title: 'Student Dashboard',
};

async function fetchStudentData(token: string) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [resultsRes, paymentsRes] = await Promise.allSettled([
    fetch(`${EXPRESS_API_URL}/results/mine`, { headers, cache: 'no-store' }),
    fetch(`${EXPRESS_API_URL}/payments/mine`, { headers, cache: 'no-store' }),
  ]);

  const results: Result[] = resultsRes.status === 'fulfilled' && resultsRes.value.ok
    ? ((await resultsRes.value.json()).data ?? [])
    : [];

  const payments: Payment[] = paymentsRes.status === 'fulfilled' && paymentsRes.value.ok
    ? ((await paymentsRes.value.json()).data ?? [])
    : [];

  return { results, payments };
}

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? '';

  const { results, payments } = await fetchStudentData(token);

  return <StudentDashboardClient results={results} payments={payments} />;
}
