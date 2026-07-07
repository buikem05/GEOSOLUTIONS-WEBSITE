import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { LoginSchema, RegisterSchema } from './auth.schema';
import { authenticate } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();

// Public auth routes with Redis rate limiting
router.post('/login', authLimiter, validate({ body: LoginSchema }), authController.login);
router.post('/register', authLimiter, validate({ body: RegisterSchema }), authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.me);

export default router;
