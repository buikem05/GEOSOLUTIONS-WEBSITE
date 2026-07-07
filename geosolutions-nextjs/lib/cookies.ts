// lib/cookies.ts — Server-side cookie helpers (uses next/headers, Node.js only)
// Do NOT import this in middleware.ts (Edge runtime).

import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, COOKIE_MAX_AGE_SECONDS } from './constants';

/**
 * Read the session JWT from the HttpOnly cookie (server components / route handlers).
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

/**
 * Set the session JWT as an HttpOnly cookie in a route handler response.
 * Returns the Set-Cookie header value string.
 */
export function buildSessionCookieHeader(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (isProduction) parts.push('Secure');
  return parts.join('; ');
}

/**
 * Build a cookie header that clears the session (sets Max-Age=0).
 */
export function buildClearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`;
}
