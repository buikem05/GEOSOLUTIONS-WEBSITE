import { ErrorCode, ErrorCodes } from './ErrorCodes';

/**
 * Enterprise Operational Error Class
 * Distinguishes expected operational domain failures from programmer errors / bugs.
 */
export class AppError extends Error {
  public readonly isOperational: boolean = true;

  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown, code: ErrorCode = ErrorCodes.VALIDATION_ERROR): AppError {
    return new AppError(400, code, message, details);
  }

  static unauthorized(message: string = 'Authentication required', code: ErrorCode = ErrorCodes.UNAUTHORIZED): AppError {
    return new AppError(401, code, message);
  }

  static forbidden(message: string = 'Access denied', code: ErrorCode = ErrorCodes.FORBIDDEN): AppError {
    return new AppError(403, code, message);
  }

  static notFound(message: string = 'Resource not found', code: ErrorCode = ErrorCodes.NOT_FOUND): AppError {
    return new AppError(404, code, message);
  }

  static conflict(message: string, code: ErrorCode = ErrorCodes.CONFLICT): AppError {
    return new AppError(409, code, message);
  }

  static tooManyRequests(message: string = 'Rate limit exceeded', code: ErrorCode = ErrorCodes.RATE_LIMIT_EXCEEDED): AppError {
    return new AppError(429, code, message);
  }

  static internal(message: string = 'Internal server error', code: ErrorCode = ErrorCodes.INTERNAL_SERVER_ERROR): AppError {
    return new AppError(500, code, message);
  }
}
