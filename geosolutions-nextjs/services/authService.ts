// services/authService.ts — Authentication service
// No React imports. Fully portable to React Native.
// All calls go through Next.js proxy routes (/api/auth/*).

import api from './api';
import type { User, LoginPayload, RegisterPayload } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export const authService = {
  /**
   * Login — Next.js proxy sets the HttpOnly cookie, returns the User object only.
   */
  async login(payload: LoginPayload): Promise<User> {
    const data = await api.post<ApiResponse<{ user: User }>>('/api/auth/login', payload);
    if (!data.status || !data.data?.user) {
      throw new Error(data.message ?? 'Login failed.');
    }
    return data.data.user;
  },

  /**
   * Register — creates account (status: pending). No cookie set.
   */
  async register(payload: RegisterPayload): Promise<{ userId: string; message: string }> {
    const data = await api.post<ApiResponse<{ userId: string; message: string }>>(
      '/api/auth/register',
      payload
    );
    if (!data.status || !data.data) {
      throw new Error(data.message ?? 'Registration failed.');
    }
    return data.data;
  },

  /**
   * Get current user from the session cookie (server-validated).
   */
  async getMe(): Promise<User | null> {
    try {
      const data = await api.get<ApiResponse<User>>('/api/auth/me');
      return data.status ? (data.data ?? null) : null;
    } catch {
      return null;
    }
  },

  /**
   * Logout — clears the HttpOnly cookie on the server.
   */
  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  /**
   * Update profile.
   */
  async updateProfile(payload: {
    fullName: string;
    email?: string;
    phone?: string;
    subject?: string;
  }): Promise<User> {
    const data = await api.patch<ApiResponse<User>>('/api/auth/update_profile', payload);
    if (!data.status || !data.data) throw new Error(data.message ?? 'Update failed.');
    return data.data;
  },

  /**
   * Change password.
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const data = await api.post<ApiResponse>('/api/auth/change_password', {
      currentPassword,
      newPassword,
    });
    if (!data.status) throw new Error(data.message ?? 'Password change failed.');
  },
};
