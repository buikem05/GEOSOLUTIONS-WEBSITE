// types/auth.ts — Core authentication types

export type Role = 'student' | 'teacher' | 'admin' | 'computer';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface User {
  id: string;
  role: Role;
  fullName: string;
  identifier: string;
  email: string;
  status: UserStatus;
  subject: string | null;
  phone: string | null;
  avatar: string | null;       // initials e.g. "AO"
  avatarUrl: string | null;    // uploaded image path
  createdAt: string | null;
}

export interface LoginPayload {
  role: Role;
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  identifier?: string;  // reg number / admin code
  subject?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JwtPayload {
  id: string;
  role: Role;
  status: UserStatus;
  exp: number;
  iat: number;
}
