// lib/constants.ts — App-wide constants

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  TECH_HUB: '/techhub',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_DASHBOARD: '/student',
  TEACHER_DASHBOARD: '/teacher',
  ADMIN_DASHBOARD: '/admin',
} as const;

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  COMPUTER: 'computer',
} as const;

export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  student: ROUTES.STUDENT_DASHBOARD,
  teacher: ROUTES.TEACHER_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
  computer: ROUTES.STUDENT_DASHBOARD,
};

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? 'geo_session';

export const EXPRESS_API_URL =
  process.env.EXPRESS_API_URL ?? 'http://localhost:3001/api';

export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
