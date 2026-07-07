// app/api/auth/register/route.ts
// Proxies registration to Express. No cookie is set — account is pending approval.

import { NextRequest, NextResponse } from 'next/server';
import { EXPRESS_API_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const expressRes = await fetch(`${EXPRESS_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await expressRes.json();

    return NextResponse.json(json, { status: expressRes.status });
  } catch (err) {
    console.error('[/api/auth/register]', err);
    return NextResponse.json(
      { status: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
