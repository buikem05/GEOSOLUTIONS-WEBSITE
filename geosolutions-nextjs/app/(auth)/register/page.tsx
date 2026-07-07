'use client';

// app/(auth)/register/page.tsx

import { useState, type FormEvent, type ChangeEvent } from 'react';
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

export default function RegisterPage() {
  const { register } = useAuth();
  const [role, setRole] = useState<Role>('student');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    password: '', identifier: '', subject: '', adminCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Full name, email and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone || undefined,
        identifier:
          role === 'student' || role === 'computer'
            ? form.identifier
            : role === 'admin'
            ? form.adminCode
            : undefined,
        subject: role === 'teacher' ? form.subject : undefined,
      });
      setSuccessName(form.fullName.split(' ')[0]);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-geo-50 to-white dark:from-dark-bg dark:to-dark-surface p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-5xl mx-auto mb-6">✓</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Account Created!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Welcome, <strong className="text-slate-800 dark:text-white">{successName}</strong>!<br /><br />
            Your account is currently <strong>pending admin approval</strong>. You will be able to login once an administrator approves your account.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" id="go-to-login">Go to Login</Button>
            </Link>
            <Button variant="outline" size="lg" onClick={() => { setSuccess(false); setForm({ fullName: '', email: '', phone: '', password: '', identifier: '', subject: '', adminCode: '' }); }}>
              Register Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white dark:bg-dark-surface overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <Image src="/images/logo.jpg" alt="Geo Academy Logo" width={44} height={44} className="rounded-xl" />
            <div>
              <p className="font-bold text-geo-800 dark:text-white text-base leading-none">GEO<em className="not-italic text-geo-500">SOLUTION</em></p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Educational Services</p>
            </div>
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create <span className="text-geo-600 dark:text-geo-400">Account</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Register to access the student results portal.</p>

          {error && (
            <div role="alert" className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={['flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all',
                      role === r.value ? 'bg-geo-800 border-geo-800 text-white shadow-geo' : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-geo-300'].join(' ')}>
                    <span>{r.emoji}</span>{r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input id="fullName" label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="e.g. Amara Okafor" required />
              <Input id="email" label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="phone" label="Phone Number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+2347014673935" />
              {(role === 'student' || role === 'computer') && (
                <Input id="regNumber" label="REG NUMBER" value={form.identifier} onChange={set('identifier')} placeholder="GEO/2024/001" />
              )}
              {role === 'teacher' && (
                <Input id="subject" label="Subject Taught" value={form.subject} onChange={set('subject')} placeholder="e.g. Mathematics" />
              )}
              {role === 'admin' && (
                <Input id="adminCode" label="Admin Code" value={form.adminCode} onChange={set('adminCode')} placeholder="Enter admin code" />
              )}
            </div>

            <Input id="reg-password" label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Minimum 6 characters" showPasswordToggle required />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2" id="register-submit">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-geo-600 dark:text-geo-400 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>

      {/* RIGHT — Decorative */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden bg-hero-gradient">
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="text-center relative z-10 space-y-6 max-w-sm">
          <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center text-5xl shadow-glass mx-auto">🎓</div>
          <h2 className="text-3xl font-bold text-white">Join GEO ACADEMY</h2>
          <p className="text-geo-200">Create your account and begin your academic journey with us.</p>
          <div className="glass rounded-2xl p-6 text-left">
            <p className="text-white/90 text-sm leading-relaxed mb-4">&ldquo;The registration was seamless. Once approved by the admin, I had full access to all my academic records and could see my progress in real time.&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">CI</div>
              <div>
                <p className="text-white font-semibold text-sm">Chisom Ibe</p>
                <p className="text-geo-300 text-xs">Year 3 Student · GEO/2022/044</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {['⚡ Quick Setup', '✅ Admin Verified', '🎯 Role Based'].map((c) => (
              <span key={c} className="px-4 py-2 rounded-full glass text-white text-sm border border-white/20">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
