// components/sections/TechHubSection.tsx — Server Component

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const techCards = [
  { icon: '💻', title: 'Web Development', sub: 'HTML, CSS, JavaScript, React & Node.js' },
  { icon: '📱', title: 'Mobile App Development', sub: 'Android, iOS & cross-platform apps' },
  { icon: '🛡️', title: 'Cybersecurity', sub: 'Ethical hacking, network security & forensics' },
  { icon: '📊', title: 'Data Analysis', sub: 'Excel, Python, SQL, Power BI & Tableau' },
];

const gridImages = [
  { src: '/images/img17.jpeg', alt: 'Tech training session' },
  { src: '/images/img1.jpeg',  alt: 'Students on laptops' },
  { src: '/images/img8.jpeg',  alt: 'CBT lab with instructor' },
];

export function TechHubSection() {
  return (
    <section className="geo-section bg-slate-900 dark:bg-dark-bg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="geo-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-geo-600/20 text-geo-400 text-sm font-semibold border border-geo-700">
              Tech Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Launch Your Tech Career
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Our GeoTech Academy has empowered 300+ young Nigerians with in-demand digital skills — from web development to data analysis and cybersecurity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techCards.map((card) => (
                <div
                  key={card.title}
                  className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-geo-700 transition-all duration-300 group"
                >
                  <span className="text-2xl flex-shrink-0">{card.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-geo-400 transition-colors">{card.title}</h4>
                    <p className="text-xs text-slate-400">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/techhub">
              <Button size="lg" variant="gold">
                Explore Tech Hub
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Images grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative h-48 rounded-2xl overflow-hidden">
              <Image src={gridImages[0].src} alt={gridImages[0].alt} fill className="object-cover" />
            </div>
            {gridImages.slice(1).map(({ src, alt }) => (
              <div key={src} className="relative h-40 rounded-2xl overflow-hidden">
                <Image src={src} alt={alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
