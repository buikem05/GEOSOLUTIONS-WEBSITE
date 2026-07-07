import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';

// Domain Route Routers
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import resultsRoutes from './modules/results/results.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import cbtRoutes from './modules/cbt/cbt.routes';

export function createApp(): Express {
  const app = express();

  // 1. Enterprise Security Headers (Helmet)
  app.use(helmet());

  // 2. Strict CORS for HttpOnly Cookie Support
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Refresh-Token'],
    })
  );

  // 3. Structured JSON Request Logging (Pino-HTTP)
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      customSuccessMessage: (req, res) => `${req.method} ${req.url} completed with status ${res.statusCode}`,
      autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/api/v1/health',
      },
    })
  );

  // 4. Body & Cookie Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 5. Global API Distributed Rate Limiting
  app.use('/api', apiLimiter);

  // 6. Health Check
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      service: 'geosolutions-enterprise-api',
      status: 'UP',
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
    });
  });

  // 7. Mount Modular Domain Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/results', resultsRoutes);
  app.use('/api/v1/payments', paymentsRoutes);
  app.use('/api/v1/cbt', cbtRoutes);

  // 8. 404 Fallback
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found on this server.`,
      },
    });
  });

  // 9. Global Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
