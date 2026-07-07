// app/api/auth/login/route.ts
// Proxies login to Express, sets an HttpOnly cookie with the JWT.
// The JWT is NEVER sent to the browser — only the User object is returned.

import { NextRequest, NextResponse } from 'next/server';
import { EXPRESS_API_URL } from '@/lib/constants';
import { buildSessionCookieHeader } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const expressRes = await fetch(`${EXPRESS_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await expressRes.json();

    if (!expressRes.ok || !json.status) {
      return NextResponse.json(
        { status: false, message: json.message ?? 'Login failed.' },
        { status: expressRes.status }
      );
    }

    const { token, user } = json.data;

    // Build response — only expose the user object, never the raw token
    const response = NextResponse.json(
      { status: true, data: { user } },
      { status: 200 }
    );

    // Set the JWT exclusively in an HttpOnly cookie
    response.headers.set('Set-Cookie', buildSessionCookieHeader(token));

    return response;
  } catch (err) {
    console.error('[/api/auth/login]', err);
    return NextResponse.json(
      { status: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
