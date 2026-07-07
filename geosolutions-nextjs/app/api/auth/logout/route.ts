// app/api/auth/logout/route.ts
// Clears the HttpOnly session cookie.

import { NextResponse } from 'next/server';
import { EXPRESS_API_URL } from '@/lib/constants';
import { buildClearSessionCookieHeader } from '@/lib/cookies';
import { getSessionToken } from '@/lib/cookies';

export async function POST() {
  const token = await getSessionToken();

  // Fire-and-forget — notify Express (stateless JWT, so this is best-effort)
  if (token) {
    fetch(`${EXPRESS_API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }

  const response = NextResponse.json(
    { status: true, data: { message: 'Logged out successfully.' } },
    { status: 200 }
  );

  // Expire the HttpOnly cookie
  response.headers.set('Set-Cookie', buildClearSessionCookieHeader());

  return response;
}
