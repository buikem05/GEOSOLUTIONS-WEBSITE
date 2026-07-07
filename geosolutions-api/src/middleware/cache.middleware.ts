import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { logger } from '../config/logger';

/**
 * Enterprise Caching Middleware for Read-Heavy GET Endpoints
 * Caches JSON responses in Redis with a specified TTL (in seconds).
 */
export function cacheMiddleware(ttlSeconds: number = 300) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.debug({ cacheKey }, '⚡ Redis cache HIT');
        res.setHeader('X-Cache', 'HIT');
        res.status(200).json(JSON.parse(cachedData));
        return;
      }

      logger.debug({ cacheKey }, '🐢 Redis cache MISS');
      res.setHeader('X-Cache', 'MISS');

      // Intercept res.json to store in Redis before sending to client
      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.setex(cacheKey, ttlSeconds, JSON.stringify(body)).catch((err) => {
            logger.error({ err, cacheKey }, '❌ Failed to store data in Redis cache');
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error({ error, cacheKey }, '❌ Redis cache middleware error, bypassing cache.');
      next();
    }
  };
}

/**
 * Cache Invalidation Helper
 * Clears all Redis cache keys matching a specific pattern (e.g., 'cache:/api/v1/cbt*').
 */
export async function clearCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info({ count: keys.length, pattern }, '🧹 Cleared Redis cache keys');
    }
  } catch (error) {
    logger.error({ error, pattern }, '❌ Failed to clear Redis cache pattern');
  }
}
