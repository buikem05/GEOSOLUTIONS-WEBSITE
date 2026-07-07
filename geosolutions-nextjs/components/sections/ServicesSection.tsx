// components/sections/ServicesSection.tsx — Server Component (SSG-safe)

import Link from 'next/link';
import Image from 'next/image';

const academicServices = [
  { icon: '📖', title: 'JAMB / UTME', subtitle: '100+ Students Yearly' },
  { icon: '✏️', title: 'WAEC / NECO', subtitle: 'Expert Coaching' },
  { icon: '🖥️', title: 'CBT Training', subtitle: 'Computer-Based Tests' },
  { icon: '🏫', title: 'Online & Private Tutoring', subtitle: 'Personalised Learning' },
  { icon: '🌍', title: 'IELTS Training', subtitle: 'Study Abroad Prep' },
];

const techServices = [
  { icon: '💻', title: 'Computer Foundation Class' },
  { icon: '🎨', title: 'Web Design' },
  { icon: '⚡', title: 'Full Stack Developer' },
  { icon: '🖼️', title: 'Advanced & Basic Graphics Design' },
  { icon: '🎯', title: 'UI/UX Design' },
  { icon: '₿',  title: 'Crypto Currency Trading' },
  { icon: '🖌️', title: 'Canva' },
  { icon: '🤝', title: 'Affiliate Marketing' },
  { icon: '📣', title: 'Digital Marketing' },
  { icon: '📊', title: 'Data Analytics' },
];

const consultationServices = [
  { img: '/images/admission_consultation.png', alt: 'Admission Consultation', title: 'Admission Consultation' },
  { img: '/images/utme_prep.png',              alt: 'UTME Prep',              title: 'UTME Prep' },
  { img: '/images/waec_neco.png',              alt: 'WAEC/NECO Prep',        title: 'WAEC / NECO' },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
        {children}
      </h2>
      <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-geo-800 dark:bg-geo-500" />
    </div>
  );
}

function ServiceCard({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-geo-300 dark:hover:border-geo-700 hover:shadow-geo transition-all duration-300 hover:-translate-y-1 text-center">
      <div className="w-14 h-14 rounded-2xl bg-geo-50 dark:bg-geo-900/30 flex items-center justify-center text-2xl group-hover:bg-geo-100 dark:group-hover:bg-geo-800/30 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-snug">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="geo-section bg-slate-50 dark:bg-dark-surface">
      <div className="geo-container">
        <SectionTitle>Our Academic Services</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {academicServices.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>

        <SectionTitle>Our Tech Services</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {techServices.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>

        <SectionTitle>Consultation Services</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {consultationServices.map((s) => (
            <Link
              key={s.title}
              href="/services"
              className="group relative overflow-hidden rounded-2xl shadow-geo hover:shadow-geo-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-52">
                <Image src={s.img} alt={s.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-geo-900/80 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-base">{s.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
