import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { env } from '../../config/env';
import { AuthUserPayload } from '../types/express';
import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/ErrorCodes';

const ACCESS_SECRET = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Sign Short-Lived Access Token (15m)
 */
export async function signAccessToken(payload: AuthUserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setSubject(payload.id)
    .sign(ACCESS_SECRET);
}

/**
 * Sign Long-Lived Refresh Token (7d)
 */
export async function signRefreshToken(userId: string, sessionId: number): Promise<string> {
  return new SignJWT({ sub: userId, sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_SECRET);
}

/**
 * Verify Short-Lived Access Token
 */
export async function verifyAccessToken(token: string): Promise<AuthUserPayload> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as AuthUserPayload;
  } catch (error: any) {
    if (error?.code === 'ERR_JWT_EXPIRED') {
      throw new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Access token has expired');
    }
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid access token');
  }
}

/**
 * Verify Long-Lived Refresh Token
 */
export async function verifyRefreshToken(token: string): Promise<{ sub: string; sessionId: number }> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return { sub: payload.sub as string, sessionId: payload.sessionId as number };
  } catch (error: any) {
    if (error?.code === 'ERR_JWT_EXPIRED') {
      throw new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Refresh token has expired');
    }
    throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid refresh token');
  }
}

/**
 * SHA-256 Hash Helper for Secure Refresh Token Storage in MySQL DB
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
