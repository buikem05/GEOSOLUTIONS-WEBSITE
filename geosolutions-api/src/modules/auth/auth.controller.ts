import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { setTokenCookies, clearTokenCookies, REFRESH_COOKIE_NAME } from '../../core/utils/cookies';
import { LoginInput, RegisterInput } from './auth.schema';

export class AuthController {
  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const { user, accessToken, refreshToken } = await authService.login(req.body, ip, userAgent);

      // Set HttpOnly Cookies (Never return token strings in JSON body!)
      setTokenCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Successfully logged in',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/register
   */
  async register(req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Rotates refresh token cleanly.
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const cookieToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.headers['x-refresh-token'];

      const { user, accessToken, refreshToken } = await authService.rotateRefreshToken(
        cookieToken as string,
        ip,
        userAgent
      );

      setTokenCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Session token rotated successfully',
        data: user,
      });
    } catch (error) {
      clearTokenCookies(res);
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cookieToken = req.cookies?.[REFRESH_COOKIE_NAME];
      await authService.logout(cookieToken);

      clearTokenCookies(res);

      res.status(200).json({
        success: true,
        message: 'Successfully logged out and session revoked.',
      });
    } catch (error) {
      clearTokenCookies(res);
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const userProfile = await authService.getMe(req.user.id);

      res.status(200).json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
