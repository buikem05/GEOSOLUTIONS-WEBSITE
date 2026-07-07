// hooks/useAuth.ts — Auth hook (React facade over authService + authStore)
// Fully portable to React Native by replacing router calls with navigation equivalents.

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useUIStore } from '@/store/uiStore';
import { ROLE_DASHBOARD_MAP } from '@/lib/constants';
import type { LoginPayload, RegisterPayload } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  const { showToast } = useUIStore();

  const login = useCallback(
    async (payload: LoginPayload) => {
      const loggedInUser = await authService.login(payload);
      setUser(loggedInUser);
      showToast(`Welcome back, ${loggedInUser.fullName.split(' ')[0]}!`, 'success');
      const destination = ROLE_DASHBOARD_MAP[loggedInUser.role] ?? '/';
      router.push(destination);
      return loggedInUser;
    },
    [router, setUser, showToast]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      return authService.register(payload);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearUser();
      router.push('/login');
    }
  }, [router, clearUser]);

  const refreshUser = useCallback(async () => {
    const freshUser = await authService.getMe();
    if (freshUser) {
      setUser(freshUser);
    } else {
      clearUser();
      router.push('/login');
    }
    return freshUser;
  }, [router, setUser, clearUser]);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };
}
