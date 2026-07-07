// app/(dashboard)/admin/page.tsx

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { EXPRESS_API_URL, SESSION_COOKIE_NAME } from '@/lib/constants';
import type { User } from '@/types/auth';
import { AdminDashboardClient } from '@/components/dashboard/AdminDashboardClient';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function fetchAllUsers(token: string): Promise<User[]> {
  try {
    const res = await fetch(`${EXPRESS_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? '';
  const users = await fetchAllUsers(token);

  return <AdminDashboardClient users={users} />;
}
