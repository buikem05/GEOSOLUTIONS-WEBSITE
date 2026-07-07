// app/api/auth/me/route.ts
// Validates the session cookie and returns the current user.

import { NextResponse } from 'next/server';
import { EXPRESS_API_URL } from '@/lib/constants';
import { getSessionToken } from '@/lib/cookies';

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json(
      { status: false, message: 'Not authenticated.' },
      { status: 401 }
    );
  }

  try {
    const expressRes = await fetch(`${EXPRESS_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const json = await expressRes.json();

    return NextResponse.json(json, { status: expressRes.status });
  } catch (err) {
    console.error('[/api/auth/me]', err);
    return NextResponse.json(
      { status: false, message: 'Server error.' },
      { status: 500 }
    );
  }
}
