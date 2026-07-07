import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../core/errors/AppError';
import { ErrorCodes } from '../core/errors/ErrorCodes';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Universal Zod Request Validation Middleware
 * Intercepts req.body, req.query, and req.params, parsing them against Zod schemas.
 * Rejects malformed requests immediately before controller execution.
 */
export function validate(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query) as Record<string, any>;
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params) as Record<string, string>;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        next(AppError.badRequest('Validation failed', details, ErrorCodes.VALIDATION_ERROR));
      } else {
        next(error);
      }
    }
  };
}
