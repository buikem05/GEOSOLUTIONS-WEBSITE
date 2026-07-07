'use client';

// components/layout/Navbar.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/about',    label: 'About' },
  { href: '/services', label: 'Courses' },
  { href: '/techhub',  label: 'Tech Hub' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/contact',  label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-geo border-b border-slate-100 dark:border-dark-border'
            : 'bg-transparent'
        )}
      >
        <div className="geo-container">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="Geo Academy Logo"
                width={48}
                height={48}
                className="rounded-xl object-contain"
                priority
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-bold text-geo-800 dark:text-white leading-tight tracking-wide">
                  GEO<em className="not-italic text-geo-500">SOLUTION</em>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">
                  Educational Services
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]) && href !== '/';
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-geo-800 dark:text-geo-300 bg-geo-50 dark:bg-geo-900/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-geo-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'text-slate-600 dark:text-slate-300',
                    'bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-dark-border',
                    'transition-all duration-200'
                  )}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  id="theme-toggle"
                >
                  {isDark ? (
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white dark:bg-dark-surface border-t border-slate-100 dark:border-dark-border shadow-geo-lg">
            <div className="geo-container py-4 flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === href
                      ? 'text-geo-800 dark:text-geo-300 bg-geo-50 dark:bg-geo-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-dark-border">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-18" />
    </>
  );
}
