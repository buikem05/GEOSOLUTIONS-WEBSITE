// app/(marketing)/services/page.tsx — Services & Courses Page (SSG)

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Our Services & Courses | Geosolution Educational Services',
  description: 'Comprehensive academic coaching for JAMB/UTME, WAEC, NECO, CBT Training, IELTS, Admission Processing, and professional Tech Courses in Lagos, Nigeria.',
};

const examServices = [
  {
    title: 'JAMB / UTME Coaching',
    badge: 'Most Popular',
    desc: 'Intensive syllabus coverage, daily mock CBT tests, speed and accuracy drills, and post-UTME guidance.',
    features: ['100+ CBT Practice Sessions', 'Experienced Subject Specialists', 'Career & Course Advisory', 'High Score Target Methodology'],
    icon: '📖',
  },
  {
    title: 'WAEC / NECO / GCE Prep',
    badge: 'High Pass Rate',
    desc: 'Structured classroom teaching tailored to West African examination standards with practical laboratory sessions.',
    features: ['Past Questions Demystified', 'Science & Arts Classes', 'Continuous Assessment Exams', 'Dedicated Mentorship'],
    icon: '✏️',
  },
  {
    title: 'CBT Training Labs',
    badge: 'Essential',
    desc: 'State-of-the-art computer labs designed to eliminate computer anxiety and master time management for digital exams.',
    features: ['Simulated JAMB Interface', 'Typing & Mouse Navigation Drills', 'Instant Score Analytics', 'Individual Desktop Workstations'],
    icon: '🖥️',
  },
  {
    title: 'IELTS & Study Abroad',
    badge: 'International',
    desc: 'Specialized coaching for IELTS Academic and General Training with proven strategies for Reading, Writing, Speaking, and Listening.',
    features: ['Band 7.5+ Guaranteed Strategy', 'Weekly Full-Length Mock Tests', 'One-on-One Speaking Drills', 'Visa & Admission Consulting'],
    icon: '🌍',
  },
  {
    title: 'Admission Processing',
    badge: 'Consulting',
    desc: 'Professional guidance through university screening, departmental cut-off analysis, choice of institution, and direct entry applications.',
    features: ['JAMB CAPS Monitoring', 'Change of Course/Institution Support', 'University Screening Advisory', 'Parental Guidance Sessions'],
    icon: '🏫',
  },
  {
    title: 'Private & Online Tutoring',
    badge: 'Flexible',
    desc: 'Customized one-on-one home or virtual tutoring designed around the student’s unique pace and academic goals.',
    features: ['Flexible Timings', 'Personalized Learning Plan', 'Weekly Parent Progress Reports', 'Interactive Virtual Whiteboards'],
    icon: '💻',
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Header */}
      <section className="geo-container text-center max-w-3xl mx-auto space-y-6 animate-slide-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-geo-100 dark:bg-geo-900/40 text-geo-700 dark:text-geo-300 text-sm font-semibold border border-geo-200 dark:border-geo-800">
          What We Offer
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          World-Class Educational & <span className="text-geo-600 dark:text-geo-400">Career Support</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          From passing O-Level exams with flying colors to mastering global digital skills, our structured programs are built for guaranteed results.
        </p>
      </section>

      {/* Grid of Services */}
      <section className="geo-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examServices.map((s) => (
            <Card key={s.title} hover padding="lg" className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{s.icon}</span>
                  <span className="px-3 py-1 rounded-full bg-geo-50 dark:bg-geo-900/30 text-geo-700 dark:text-geo-300 text-xs font-bold uppercase tracking-wider border border-geo-200 dark:border-geo-800">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                <div className="border-t border-slate-100 dark:border-dark-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">What You Get:</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="text-green-500 font-bold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/register" className="w-full block">
                  <Button variant="primary" size="md" className="w-full">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Hub Banner Callout */}
      <section className="geo-container">
        <div className="rounded-3xl bg-hero-gradient p-8 md:p-14 text-white grid lg:grid-cols-2 gap-8 items-center shadow-geo-lg relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <span className="px-4 py-1.5 rounded-full bg-white/10 text-geo-200 text-xs font-bold uppercase tracking-widest border border-white/20">
              GeoTech Academy
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Looking for Digital Skills & Tech Courses?
            </h2>
            <p className="text-geo-100 text-sm md:text-base leading-relaxed">
              Discover our hands-on training programs in Web Development, UI/UX Design, Data Analysis, Cybersecurity, and Graphics Design.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/techhub">
                <Button variant="gold" size="lg">
                  Explore Tech Hub
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-geo-900">
                  Request Syllabus
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl hidden lg:block">
            <Image
              src="/images/img17.jpeg"
              alt="Students learning web development in GeoTech Academy lab"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
