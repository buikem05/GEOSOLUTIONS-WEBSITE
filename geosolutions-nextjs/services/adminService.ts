// services/adminService.ts — Admin API calls (framework-agnostic)

import api from './api';
import type { User, UserStatus } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export const adminService = {
  async getUsers(): Promise<User[]> {
    const res = await api.get<ApiResponse<User[]>>('/api/admin/users');
    return res.data ?? [];
  },

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    const res = await api.patch<ApiResponse<User>>(`/api/admin/users/${userId}/status`, { status });
    if (!res.status || !res.data) throw new Error(res.message ?? 'Failed to update user.');
    return res.data;
  },

  async deleteUser(userId: string): Promise<void> {
    const res = await api.delete<ApiResponse>(`/api/admin/users/${userId}`);
    if (!res.status) throw new Error(res.message ?? 'Failed to delete user.');
  },
};
