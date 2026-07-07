'use client';

// app/(auth)/login/page.tsx

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Role } from '@/types/auth';

const roles: { value: Role; label: string; emoji: string }[] = [
  { value: 'student',  label: 'Student',       emoji: '🎓' },
  { value: 'teacher',  label: 'Teacher',        emoji: '📚' },
  { value: 'computer', label: 'Computer',       emoji: '💻' },
  { value: 'admin',    label: 'Administrator',  emoji: '🛡️' },
];

const floatingIcons = ['🎓', '📊', '📐', '🔬', '📖'];

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ role, identifier: identifier.trim(), password });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white dark:bg-dark-surface">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <Image src="/images/logo.jpg" alt="Geo Academy Logo" width={44} height={44} className="rounded-xl" />
            <div>
              <p className="font-bold text-geo-800 dark:text-white text-base leading-none">
                GEO<em className="not-italic text-geo-500">SOLUTION</em>
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Educational Services</p>
            </div>
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Welcome <span className="text-geo-600 dark:text-geo-400">Back!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Log in to your account to continue.</p>

          {error && (
            <div role="alert" className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={[
                      'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200',
                      role === r.value
                        ? 'bg-geo-800 border-geo-800 text-white shadow-geo'
                        : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-geo-300 dark:hover:border-geo-700',
                    ].join(' ')}
                  >
                    <span>{r.emoji}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="identifier"
              label="Identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter REG NUMBER (e.g. GEO/2024/001)"
              autoComplete="username"
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              showPasswordToggle
              required
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="remember-me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-geo-600 focus:ring-geo-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">Remember my credentials</span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              id="login-submit"
            >
              Login to Portal
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-geo-600 dark:text-geo-400 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — Decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-hero-gradient">
        {/* Floating background orbs */}
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-geo-400/10 blur-3xl" />

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingIcons.map((icon, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-20 animate-float"
              style={{
                top: `${15 + i * 18}%`,
                left: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Center illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 gap-6">
          <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center text-5xl shadow-glass">
            🏫
          </div>
          <h2 className="text-3xl font-bold text-white">Academic Excellence</h2>
          <p className="text-geo-200 max-w-xs leading-relaxed">
            Track your results, monitor progress, achieve greatness.
          </p>

          {/* Testimonial card */}
          <div className="glass rounded-2xl p-6 max-w-sm text-left mt-4">
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              &ldquo;GEO ACADEMY&apos;s portal transformed how I track my academic progress. Everything I need is in one place — results, announcements, and feedback from teachers.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">TN</div>
              <div>
                <p className="text-white font-semibold text-sm">Tunde Nwachukwu</p>
                <p className="text-geo-300 text-xs">Senior Student · GEO/2023/015</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex gap-3 justify-center relative z-10 flex-wrap">
          {['📈 Real-time Results', '🔒 Secure Access', '📱 Mobile Friendly'].map((chip) => (
            <span key={chip} className="px-4 py-2 rounded-full glass text-white text-sm font-medium border border-white/20">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
