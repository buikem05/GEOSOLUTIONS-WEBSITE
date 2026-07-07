'use client';

// hooks/useUsers.ts — Hook for admin user management

import { useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { useUIStore } from '@/store/uiStore';
import type { User, UserStatus } from '@/types/auth';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useUIStore();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load users';
      setError(msg);
      showToast(msg, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateStatus = useCallback(async (userId: string, status: UserStatus) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await adminService.updateUserStatus(userId, status);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      showToast(`User status updated to ${status}`, 'success');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user status';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('User deleted successfully', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateStatus,
    deleteUser,
  };
}
