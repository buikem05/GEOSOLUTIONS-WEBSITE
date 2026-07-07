'use client';

// components/sections/HeroSection.tsx

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface StatItem {
  count: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { count: 6000, suffix: '+', label: 'Students Trained' },
  { count: 1000, suffix: '+', label: 'Tech Graduates' },
  { count: 12,   suffix: '',  label: 'Years of Excellence' },
];

function useCountUp(target: number, suffix: string, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return `${value.toLocaleString()}${suffix}`;
}

function StatCounter({ count, suffix, label }: StatItem) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); observer.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const displayed = useCountUp(count, suffix, active);
  return (
    <div ref={ref} className="flex flex-col items-center sm:items-start">
      <strong className="text-2xl md:text-3xl font-extrabold text-geo-800 dark:text-white">
        {displayed}
      </strong>
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-geo-50 dark:from-dark-bg dark:via-dark-surface dark:to-geo-950/30">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-geo-100 dark:bg-geo-900/20 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-geo-50 dark:bg-geo-900/10 blur-3xl opacity-40" />
      </div>

      <div className="geo-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left — Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-geo-100 dark:bg-geo-900/40 text-geo-700 dark:text-geo-300 text-sm font-semibold border border-geo-200 dark:border-geo-800">
              <span className="text-amber-400">⭐</span>
              Trusted Since 2012 — Lagos, Nigeria
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Experience{' '}
              <span className="text-geo-800 dark:text-geo-400">World-Class</span>{' '}
              Education By Expert Educators{' '}
              <span className="block text-geo-600 dark:text-geo-500 mt-2">
                Committed To Delivering Experience Without Boundaries
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Geosolution Educational Services empowers students with quality academic coaching, CBT training, admissions support, and cutting-edge tech skills — all under one roof.
            </p>

            {/* Search bar */}
            <div className="flex gap-2 max-w-lg">
              <input
                type="text"
                placeholder="Search courses, exams, or programs…"
                className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-geo-500 shadow-sm"
                aria-label="Search courses"
              />
              <Button variant="primary" size="md" className="rounded-2xl flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((s) => (
                <StatCounter key={s.label} {...s} />
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-geo-lg">
              <Image
                src="/images/img8.jpeg"
                alt="Students in CBT training session at Geosolution"
                width={640}
                height={480}
                className="w-full h-[480px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-geo-900/40 to-transparent" />
            </div>

            {/* Floating badge — rating */}
            <div className="absolute -left-8 top-12 glass rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-geo-lg animate-float">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-bold text-white text-sm">4.9 Rating</p>
                <p className="text-white/70 text-xs">Satisfaction Score</p>
              </div>
            </div>

            {/* Floating badge — students */}
            <div className="absolute -right-6 bottom-16 glass rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-geo-lg animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-bold text-white text-sm">9,000+</p>
                <p className="text-white/70 text-xs">Students Empowered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
