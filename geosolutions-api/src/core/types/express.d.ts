import { Role } from '@prisma/client';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  sessionId?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
      sessionId?: number;
      cookies: Record<string, string>;
    }
  }
}
