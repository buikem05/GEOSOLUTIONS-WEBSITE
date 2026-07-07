// app/not-found.tsx — Custom 404 page

import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Geosolution Educational Services',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-geo-50 to-white dark:from-dark-bg dark:to-dark-surface text-center px-6">
      <div className="text-8xl font-extrabold text-geo-100 dark:text-geo-900 select-none mb-4">
        404
      </div>
      <div className="w-20 h-20 rounded-3xl bg-geo-800 flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow">
        🔍
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist. It may have been moved or deleted.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/">
          <Button size="lg" id="back-to-home">Back to Home</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="lg">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
