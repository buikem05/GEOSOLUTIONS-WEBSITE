// app/(auth)/layout.tsx — Auth pages layout (no navbar/footer)

import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {children}
    </div>
  );
}
