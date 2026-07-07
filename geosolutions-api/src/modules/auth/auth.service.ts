import { PrismaClient, UserStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { LoginInput, RegisterInput } from './auth.schema';
import { AppError } from '../../core/errors/AppError';
import { ErrorCodes } from '../../core/errors/ErrorCodes';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
  REFRESH_TOKEN_MAX_AGE_MS,
} from '../../core/utils/jwt';
import { logger } from '../../config/logger';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * Enterprise Login with Token Rotation & Session Creation
   */
  async login(input: LoginInput, ip?: string, userAgent?: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.identifier }, { identifier: input.identifier }],
      },
    });

    if (!user) {
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid identifier or password.');
    }

    if (user.status !== UserStatus.approved) {
      throw new AppError(
        403,
        ErrorCodes.FORBIDDEN,
        `Your account status is currently: ${user.status.toUpperCase()}. Please contact administration.`
      );
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      logger.warn({ userId: user.id, ip }, '⚠️ Failed login attempt (incorrect password)');
      throw new AppError(401, ErrorCodes.UNAUTHORIZED, 'Invalid identifier or password.');
    }

    // Generate token pair
    const accessToken = await signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    // Create session record in MySQL
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = hashRefreshToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        deviceIp: ip?.slice(0, 45) ?? null,
        userAgent: userAgent?.slice(0, 255) ?? null,
        expiresAt,
      },
    });

    // Sign the JWT refresh token enclosing the session ID and random secret
    const refreshToken = await signRefreshToken(user.id, session.id);

    logger.info({ userId: user.id, sessionId: session.id, ip }, '⚡ User successfully logged in');

    return {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        identifier: user.identifier,
        status: user.status,
        subject: user.subject,
        phone: user.phone,
        avatarInitials: user.avatarInitials,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken: `${session.id}.${rawRefreshToken}.${refreshToken}`,
    };
  }

  /**
   * Enterprise Account Registration
   */
  async register(input: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          ...(input.identifier ? [{ identifier: input.identifier }] : []),
        ],
      },
    });

    if (existing) {
      throw AppError.conflict('An account with this email or identifier already exists.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const initials = input.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const identifier = input.identifier || `GEO/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await prisma.user.create({
      data: {
        role: input.role,
        fullName: input.fullName,
        email: input.email,
        identifier,
        passwordHash,
        phone: input.phone ?? null,
        subject: input.subject ?? null,
        status: input.role === Role.student ? UserStatus.approved : UserStatus.pending,
        avatarInitials: initials,
      },
    });

    logger.info({ userId: user.id, role: user.role }, '⚡ New user registered');

    return {
      id: user.id,
      email: user.email,
      identifier: user.identifier,
      status: user.status,
    };
  }

  /**
   * Enterprise Token Rotation Lifecycle
   * Revokes old session and issues a fresh Access/Refresh Token pair.
   */
  async rotateRefreshToken(cookieToken: string, ip?: string, userAgent?: string) {
    if (!cookieToken || !cookieToken.includes('.')) {
      throw AppError.unauthorized('Invalid or missing refresh token.', ErrorCodes.UNAUTHORIZED);
    }

    const parts = cookieToken.split('.');
    if (parts.length < 3) {
      throw AppError.unauthorized('Malformed refresh token structure.', ErrorCodes.UNAUTHORIZED);
    }

    const sessionId = parseInt(parts[0], 10);
    const rawSecret = parts[1];
    const jwtToken = parts.slice(2).join('.');

    // Verify JWT signature & expiration
    await verifyRefreshToken(jwtToken);

    // Look up session in MySQL
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      throw AppError.unauthorized('Session no longer exists.', ErrorCodes.TOKEN_REVOKED);
    }

    // Verify raw secret hash
    const expectedHash = hashRefreshToken(rawSecret);
    if (session.refreshTokenHash !== expectedHash) {
      logger.warn({ sessionId, userId: session.userId }, '🚨 Token mismatch! Potential session hijacking detected.');
      await prisma.session.deleteMany({ where: { userId: session.userId } }); // Revoke all user sessions!
      throw AppError.unauthorized('Session compromised. All devices logged out.', ErrorCodes.TOKEN_REVOKED);
    }

    if (session.isRevoked || session.expiresAt < new Date()) {
      logger.warn({ sessionId, userId: session.userId }, '⚠️ Reused revoked or expired refresh token.');
      await prisma.session.delete({ where: { id: sessionId } });
      throw AppError.unauthorized('Session revoked or expired.', ErrorCodes.TOKEN_REVOKED);
    }

    // Rotate: Revoke current session
    await prisma.session.delete({ where: { id: sessionId } });

    // Issue brand new token pair
    const newAccessToken = await signAccessToken({
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      fullName: session.user.fullName,
    });

    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = hashRefreshToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);

    const newSession = await prisma.session.create({
      data: {
        userId: session.user.id,
        refreshTokenHash: newRefreshTokenHash,
        deviceIp: ip?.slice(0, 45) ?? null,
        userAgent: userAgent?.slice(0, 255) ?? null,
        expiresAt: newExpiresAt,
      },
    });

    const newJwtRefresh = await signRefreshToken(session.user.id, newSession.id);

    logger.info({ userId: session.user.id, oldSession: sessionId, newSession: newSession.id }, '🔄 Session token rotated successfully');

    return {
      user: {
        id: session.user.id,
        role: session.user.role,
        fullName: session.user.fullName,
        email: session.user.email,
        identifier: session.user.identifier,
        status: session.user.status,
      },
      accessToken: newAccessToken,
      refreshToken: `${newSession.id}.${newRawRefreshToken}.${newJwtRefresh}`,
    };
  }

  /**
   * Enterprise Logout — Revokes session in DB
   */
  async logout(cookieToken?: string): Promise<void> {
    if (!cookieToken || !cookieToken.includes('.')) return;
    try {
      const sessionId = parseInt(cookieToken.split('.')[0], 10);
      if (!isNaN(sessionId)) {
        await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
      }
    } catch {
      // Best effort deletion
    }
  }

  /**
   * Get Current Authenticated User Profile
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        fullName: true,
        email: true,
        identifier: true,
        status: true,
        subject: true,
        phone: true,
        avatarInitials: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound('User profile not found.');
    }
    return user;
  }
}

export const authService = new AuthService();
