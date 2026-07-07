import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { initRedis, redis } from './config/redis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function bootstrap() {
  logger.info('🚀 Bootstrapping Geosolutions Enterprise Backend...');

  // Initialize external connections
  await initRedis();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`⚡ Server is running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`🛡️ Security: HttpOnly Cookies | CORS: ${env.FRONTEND_URL} | Rate Limit: Enabled`);
  });

  // Graceful Shutdown Handlers
  const shutdown = async (signal: string) => {
    logger.warn(`🛑 Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('🔻 HTTP server closed.');

      try {
        await redis.quit();
        logger.info('🔻 Redis client disconnected.');
      } catch (err) {
        logger.error({ err }, '⚠️ Error disconnecting Redis');
      }

      try {
        await prisma.$disconnect();
        logger.info('🔻 Prisma ORM disconnected.');
      } catch (err) {
        logger.error({ err }, '⚠️ Error disconnecting Prisma');
      }

      logger.info('✅ Graceful shutdown completed. Exiting process.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds if hanging
    setTimeout(() => {
      logger.error('🔥 Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, '🔥 Unhandled Rejection detected at top level');
  });

  process.on('uncaughtException', (error) => {
    logger.fatal({ error }, '🔥 Uncaught Exception detected! Shutting down immediately.');
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  logger.fatal({ err }, '💥 Fatal error during bootstrap');
  process.exit(1);
});
