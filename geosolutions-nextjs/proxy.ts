// proxy.ts — Next.js 16 Proxy (route protection, previously middleware.ts)
// Runs at the Edge. Uses jose for JWT decode (Edge-compatible).

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'geo_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-me'
);

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  student: '/student',
  teacher: '/teacher',
  admin: '/admin',
  computer: '/student',
};

const PROTECTED_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: '/student', roles: ['student', 'computer'] },
  { prefix: '/teacher', roles: ['teacher'] },
  { prefix: '/admin',   roles: ['admin'] },
];

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/admin/:path*'],
};

async function handler(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;
    const userStatus = payload.status as string;

    if (userStatus !== 'approved') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'not_approved');
      const res = NextResponse.redirect(loginUrl);
      res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
      return res;
    }

    const routeConfig = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
    if (routeConfig && !routeConfig.roles.includes(userRole)) {
      const correctDashboard = ROLE_DASHBOARD_MAP[userRole] ?? '/login';
      return NextResponse.redirect(new URL(correctDashboard, req.url));
    }

    const res = NextResponse.next();
    res.headers.set('x-user-id', String(payload.id ?? ''));
    res.headers.set('x-user-role', userRole);
    return res;
  } catch {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'session_expired');
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    return res;
  }
}

// Next.js 16 requires the proxy function to be exported as "proxy"
export { handler as proxy };
// Also export as default for backwards compatibility
export default handler;
