// app/(marketing)/techhub/page.tsx — Tech Hub & Digital Skills Page (SSG)

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'GeoTech Academy — Digital Skills & Tech Training | Geosolution',
  description: 'Master in-demand digital skills: Full-stack Web Development, UI/UX Design, Data Analysis, Cybersecurity, and Graphic Design at GeoTech Academy in Lagos, Nigeria.',
};

const courses = [
  {
    title: 'Full-Stack Web Development',
    duration: '4 - 6 Months',
    level: 'Beginner to Advanced',
    desc: 'Learn to build modern, responsive, and scalable web applications from scratch using HTML5, CSS3, JavaScript (ES6+), React, Node.js, Express, and MongoDB.',
    skills: ['HTML/CSS & Tailwind', 'JavaScript & TypeScript', 'React & Next.js', 'Node.js & REST APIs', 'Git & GitHub Workflow'],
    icon: '💻',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'UI/UX Design & Prototyping',
    duration: '3 Months',
    level: 'Beginner Friendly',
    desc: 'Master user research, wireframing, high-fidelity UI design, and interactive prototyping using Figma. Build user-centered digital experiences.',
    skills: ['Design Thinking & UX Research', 'Wireframing & User Flows', 'Figma Mastery', 'Design Systems & Tokens', 'Interactive Prototyping'],
    icon: '🎨',
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Data Analysis & Business Intelligence',
    duration: '3 - 4 Months',
    level: 'Intermediate',
    desc: 'Transform raw data into actionable business insights. Master data cleaning, visualization, SQL databases, Python for Data Science, and Power BI/Tableau.',
    skills: ['Advanced Microsoft Excel', 'SQL Database Querying', 'Python (Pandas & NumPy)', 'Power BI & Tableau Dashboards', 'Data Storytelling'],
    icon: '📊',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Cybersecurity & Ethical Hacking',
    duration: '4 Months',
    level: 'Intermediate',
    desc: 'Learn how to protect networks, systems, and data from cyber threats. Master vulnerability assessment, penetration testing, and security protocols.',
    skills: ['Network Fundamentals & Linux', 'Vulnerability Scanning', 'Ethical Hacking Techniques', 'System Hardening', 'Incident Response'],
    icon: '🛡️',
    color: 'from-red-500 to-rose-600',
  },
  {
    title: 'Advanced Graphics Design & Branding',
    duration: '2 Months',
    level: 'All Levels',
    desc: 'Create visual concepts that communicate ideas that inspire, inform, and captivate consumers. Master Adobe Photoshop, Illustrator, CorelDRAW, and Canva.',
    skills: ['Logo Design & Brand Identity', 'Adobe Photoshop & Illustrator', 'CorelDRAW Essentials', 'Social Media Flyer Design', 'Print Media Preparation'],
    icon: '🖌️',
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Computer Foundation & Digital Literacy',
    duration: '6 Weeks',
    level: 'Beginner',
    desc: 'The perfect stepping stone into the digital world. Master typing, file management, internet navigation, and Microsoft Office Suite (Word, Excel, PowerPoint).',
    skills: ['Windows OS Mastery', 'Microsoft Word Document Formatting', 'Microsoft Excel Basics', 'PowerPoint Presentations', 'Email & Cloud Storage'],
    icon: '🖥️',
    color: 'from-cyan-500 to-blue-600',
  },
];

const features = [
  { title: 'Project-Based Learning', desc: 'Build real-world portfolio projects that you can showcase to employers and clients immediately.' },
  { title: '1-on-1 Mentorship', desc: 'Direct access to experienced industry instructors for technical guidance and career coaching.' },
  { title: 'Fully Equipped Tech Lab', desc: 'Learn in an uninterrupted air-conditioned lab with constant electricity and high-speed internet.' },
  { title: 'Internship Opportunities', desc: 'Top-performing students are connected to remote internships and local tech job placements.' },
];

export default function TechHubPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Banner */}
      <section className="geo-container">
        <div className="rounded-3xl bg-slate-950 text-white p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center shadow-geo-lg relative overflow-hidden border border-slate-800">
          <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-geo-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10 animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-geo-900/80 text-geo-300 text-xs font-bold uppercase tracking-widest border border-geo-700">
              GeoTech Academy
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Future-Proof Your Career With <span className="text-transparent bg-clip-text bg-gradient-to-r from-geo-400 to-geo-200">High-Income Tech Skills</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              We train the next generation of African digital leaders. Gain practical, industry-relevant expertise through hands-on coding, design, and data labs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register">
                <Button variant="gold" size="lg">
                  Enroll in a Course
                </Button>
              </Link>
              <Link href="#courses">
                <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800">
                  View Curriculums
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="/images/img17.jpeg"
              alt="GeoTech Academy Students collaborating in the tech lab"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Why Learn With Us */}
      <section className="geo-container space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Learn at GeoTech Academy?</h2>
          <p className="text-slate-500 dark:text-slate-400">We don’t just teach theory; we prepare you for global tech opportunities.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card key={f.title} padding="lg" className="space-y-3 bg-white dark:bg-dark-card">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-geo-100 dark:bg-geo-900/40 text-geo-800 dark:text-geo-300 font-bold text-sm">
                0{i + 1}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Course Catalog Grid */}
      <section id="courses" className="geo-container space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-4 py-1 rounded-full bg-geo-100 dark:bg-geo-900/40 text-geo-700 dark:text-geo-300 text-xs font-bold uppercase tracking-wider">
            Curriculum
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Our Tech Training Programs</h2>
          <p className="text-slate-500 dark:text-slate-400">Choose your path and start mastering the tools used by top tech companies worldwide.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c) => (
            <Card key={c.title} hover padding="lg" className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-2xl shadow-md`}>
                    {c.icon}
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold uppercase tracking-wider text-geo-700 dark:text-geo-400">{c.duration}</span>
                    <span className="text-[11px] text-slate-400">{c.level}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>

                <div className="border-t border-slate-100 dark:border-dark-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">Key Competencies:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-dark-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/register" className="w-full block">
                  <Button variant="primary" size="md" className="w-full">
                    Enroll in this Course
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
