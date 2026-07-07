import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../core/utils/jwt';
import { ACCESS_COOKIE_NAME } from '../core/utils/cookies';
import { AppError } from '../core/errors/AppError';
import { ErrorCodes } from '../core/errors/ErrorCodes';

/**
 * Enterprise Authentication Middleware
 * Validates HttpOnly Access Token cookie or Bearer Authorization header.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token = req.cookies?.[ACCESS_COOKIE_NAME];

    // Fallback for React Native / mobile clients using Bearer headers
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw AppError.unauthorized('Authentication token missing. Please sign in.', ErrorCodes.UNAUTHORIZED);
    }

    const payload = await verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Enterprise Role-Based Authorization Guard
 * Restricts endpoint access to specific user roles (e.g. admin, teacher).
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized('Authentication required.', ErrorCodes.UNAUTHORIZED));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        AppError.forbidden(
          `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
          ErrorCodes.FORBIDDEN
        )
      );
      return;
    }

    next();
  };
}
