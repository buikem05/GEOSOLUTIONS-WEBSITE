// app/(marketing)/about/page.tsx — About Us Page (SSG)

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'About Us | Geosolution Educational Services',
  description: 'Learn about Geosolution Educational Services — established in 2012 in Lagos, Nigeria, dedicated to academic excellence, CBT training, and digital skills development.',
};

const stats = [
  { value: '12+', label: 'Years of Excellence' },
  { value: '9,000+', label: 'Students Empowered' },
  { value: '95%', label: 'Exam Success Rate' },
  { value: '50+', label: 'Expert Tutors & Mentors' },
];

const values = [
  { icon: '🎯', title: 'Excellence', description: 'We maintain the highest standards in teaching, mentorship, and exam preparation.' },
  { icon: '💡', title: 'Innovation', description: 'Leveraging modern CBT labs and interactive digital tools to enhance learning.' },
  { icon: '🤝', title: 'Integrity', description: 'Transparent guidance, honest admissions consulting, and ethical practices.' },
  { icon: '🌱', title: 'Empowerment', description: 'Equipping youth with both academic qualifications and practical tech skills.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Header */}
      <section className="geo-container text-center max-w-4xl mx-auto space-y-6 animate-slide-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-geo-100 dark:bg-geo-900/40 text-geo-700 dark:text-geo-300 text-sm font-semibold border border-geo-200 dark:border-geo-800">
          Our Story & Vision
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Empowering Nigerian Youth Since <span className="text-geo-600 dark:text-geo-400">2012</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Geosolution Educational Services commenced operations on October 22, 2012, with a relentless vision to transform academic coaching, CBT readiness, and technical education in Lagos and beyond.
        </p>
      </section>

      {/* Stats Section */}
      <section className="bg-hero-gradient py-16 text-white">
        <div className="geo-container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{s.value}</p>
              <p className="text-geo-200 text-sm font-medium uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Split Story Section */}
      <section className="geo-container grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-geo-lg border border-slate-100 dark:border-dark-border">
          <Image
            src="/images/img14.jpeg"
            alt="Geosolution Campus Building in Ikorodu Road, Lagos"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-geo-950/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="font-bold text-lg">Our Headquarters</p>
            <p className="text-xs text-slate-300">12 Abayomi Street, Opposite Abeokuta Mosques, Irawo Ajegunle, Ikorodu Road, Lagos</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            A Legacy of Academic and Digital Transformation
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            What started as a focused tutoring centre for UTME and WAEC candidates has grown into a comprehensive educational ecosystem. Recognizing the shift towards digital assessments, we pioneered rigorous Computer-Based Test (CBT) training centers to ensure our students never lose marks to technical unfamiliarity.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            With our dedicated <strong>GeoTech Academy</strong>, we bridge the gap between traditional education and global tech careers, producing skilled web developers, UI/UX designers, and data analysts ready for the modern workforce.
          </p>
          <div className="pt-4 flex gap-4">
            <Link href="/services">
              <Button size="lg">Explore Our Programs</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Visit Our Campus</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 dark:bg-dark-surface py-20">
        <div className="geo-container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Core Values</h2>
            <p className="text-slate-500 dark:text-slate-400">The guiding pillars behind every class, mentorship session, and student interaction.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} hover padding="lg" className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-geo-50 dark:bg-geo-900/40 flex items-center justify-center text-3xl">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
