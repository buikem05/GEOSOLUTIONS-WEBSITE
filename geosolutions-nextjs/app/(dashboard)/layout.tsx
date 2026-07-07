// app/(dashboard)/layout.tsx — Protected dashboard shell

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import type { ReactNode } from 'react';
import { SESSION_COOKIE_NAME, EXPRESS_API_URL } from '@/lib/constants';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import type { User } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-me'
);

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    // Verify locally first (fast)
    await jwtVerify(token, JWT_SECRET);

    // Then fetch full user from Express
    const res = await fetch(`${EXPRESS_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?error=session_expired');
  }

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-dark-bg">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
