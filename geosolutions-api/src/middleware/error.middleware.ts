import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../core/errors/AppError';
import { ErrorCodes } from '../core/errors/ErrorCodes';
import { logger, apmReporter } from '../config/logger';

/**
 * Enterprise Global Error Handling Middleware
 * Intercepts all errors, formats JSON response, differentiates operational vs programmer bugs,
 * and reports severe crashes to APM.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // 1. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    
    logger.warn({ path: req.path, method: req.method, details }, '⚠️ Request validation failed');

    res.status(400).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Invalid request payload',
        details,
      },
    });
    return;
  }

  // 2. Handle Operational AppErrors
  if (err instanceof AppError) {
    logger.warn(
      {
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        code: err.code,
        details: err.details,
      },
      `⚠️ Operational Error: ${err.message}`
    );

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
      },
    });
    return;
  }

  // 3. Handle Unhandled Programmer Bugs / Fatal System Errors
  const errorObj = err instanceof Error ? err : new Error(String(err));
  
  logger.error(
    {
      err: errorObj,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      user: req.user?.id,
    },
    '🔥 FATAL UNHANDLED EXCEPTION'
  );

  // Send to APM (Sentry / Datadog)
  apmReporter.captureException(errorObj, {
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'An unexpected internal server error occurred. Our engineering team has been notified.',
    },
  });
}
