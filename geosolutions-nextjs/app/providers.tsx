'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import ToastNotification from '@/components/ui/Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
      <ToastNotification />
    </ThemeProvider>
  );
}
