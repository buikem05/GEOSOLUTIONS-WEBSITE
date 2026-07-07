import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';
import { AppError } from '../core/errors/AppError';
import { ErrorCodes } from '../core/errors/ErrorCodes';

/**
 * Enterprise Distributed Rate Limiter
 * Uses Redis store to enforce consistent rate limiting across scaled server instances.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - rate-limit-redis type mismatch with ioredis call v5
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:api:',
  }),
  handler: () => {
    throw new AppError(
      429,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Too many requests from this IP address, please try again after 15 minutes.'
    );
  },
});

/**
 * Strict Auth Limiter for Login / Password Endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - rate-limit-redis type mismatch with ioredis call v5
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:auth:',
  }),
  handler: () => {
    throw new AppError(
      429,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Too many authentication attempts from this IP address, please try again after 15 minutes.'
    );
  },
});
