// components/sections/AboutTeaser.tsx — Server Component

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const highlights = [
  'JAMB, WAEC, NECO, GCE coaching',
  'Admission processing for top universities',
  'IELTS preparation for study abroad',
  'GeoTech Academy — industry-ready skills',
  'Located in Ikorodu Road, Lagos',
];

export function AboutTeaser() {
  return (
    <section className="geo-section bg-white dark:bg-dark-bg">
      <div className="geo-container">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-geo-lg h-[420px]">
              <Image
                src="/images/img14.jpeg"
                alt="Geosolution Educational Services building"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Year badge */}
            <div className="absolute -bottom-5 -right-5 bg-geo-800 rounded-2xl px-6 py-4 shadow-glow">
              <p className="text-3xl font-extrabold text-white leading-none">2012</p>
              <p className="text-geo-300 text-xs font-medium mt-0.5">Est. Year</p>
            </div>
            {/* Small floating image */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-2xl overflow-hidden shadow-geo-lg border-4 border-white dark:border-dark-bg hidden md:block">
              <Image
                src="/images/img19.jpeg"
                alt="Geosolution staff helping a student"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-geo-100 dark:bg-geo-900/30 text-geo-700 dark:text-geo-300 text-sm font-semibold">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Committed to Academic Excellence Since 2012
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Geosolution Educational Services commenced operations on{' '}
              <strong className="text-slate-800 dark:text-slate-200">October 22, 2012</strong>, with a
              strong commitment to academic excellence and human capital development. We offer a wide range
              of educational support services designed to help students achieve their full potential.
            </p>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-geo-100 dark:bg-geo-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-geo-600 dark:text-geo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/about">
              <Button size="lg">
                Learn More About Us
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
