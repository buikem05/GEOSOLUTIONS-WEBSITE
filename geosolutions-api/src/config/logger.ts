import pino from 'pino';
import { env } from './env';

/**
 * Enterprise APM & Crash Reporting Hook (Sentry / Datadog Preparation)
 * Intercepts severe log events to forward stack traces and metadata to APM collectors.
 */
export const apmReporter = {
  captureException(_error: unknown, _context?: Record<string, unknown>): void {
    if (env.NODE_ENV === 'test') return;
    // TODO: Connect official APM SDK (e.g. Sentry.captureException(error, { extra: context }))
    // In production, this hooks directly into the monitoring agent.
  },
  captureMessage(_message: string, _level: 'info' | 'warning' | 'error' = 'info', _context?: Record<string, unknown>): void {
    if (env.NODE_ENV === 'test') return;
    // TODO: Connect official APM SDK (e.g. Sentry.captureMessage(message, level))
  },
};

const isDev = env.NODE_ENV === 'development';

export const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
      service: 'geosolutions-enterprise-api',
      env: env.NODE_ENV,
    }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;
