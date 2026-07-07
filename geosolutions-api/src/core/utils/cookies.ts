import { Response } from 'express';
import { env } from '../../config/env';
import { REFRESH_TOKEN_MAX_AGE_MS } from './jwt';

export const ACCESS_COOKIE_NAME = 'geo_access_token';
export const REFRESH_COOKIE_NAME = 'geo_refresh_token';

const isProd = env.NODE_ENV === 'production';

/**
 * Set Secure HttpOnly Cookies for Access and Refresh Tokens
 * Protects against XSS token extraction by never exposing tokens in JSON body.
 */
export function setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
  // 1. Access Token Cookie (15 min)
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  // 2. Refresh Token Cookie (7 days)
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE_MS, // 7 days
    path: '/',
  });
}

/**
 * Clear Secure HttpOnly Cookies on Logout or Revocation
 */
export function clearTokenCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
  });

  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
  });
}
