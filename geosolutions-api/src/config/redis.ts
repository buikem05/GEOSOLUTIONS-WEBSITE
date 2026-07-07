import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 3000);
    logger.warn({ times, delay }, '⚠️ Attempting Redis reconnect...');
    return delay;
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.info('⚡ Redis client successfully connected.');
});

redis.on('error', (err) => {
  logger.error({ err }, '❌ Redis connection error occurred.');
});

redis.on('close', () => {
  logger.warn('⚠️ Redis connection closed.');
});

export async function initRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error) {
    logger.error({ error }, '❌ Could not establish initial Redis connection. Continuing with fallback behavior.');
  }
}

export default redis;
