// store/uiStore.ts — Global UI state store

'use client';

import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  id: string;
  message: string;
  type: ToastType;
}

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  toast: ToastState | null;
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeTab: 'overview',
  toast: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  showToast: (message, type = 'success') =>
    set({ toast: { id: Date.now().toString(), message, type } }),

  dismissToast: () => set({ toast: null }),
}));
