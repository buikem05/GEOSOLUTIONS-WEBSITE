// components/layout/Footer.tsx — Static Server Component

import Link from 'next/link';

const quickLinks = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/techhub', label: 'Tech Hub' },
  { href: '/contact', label: 'Contact' },
];

const services = [
  { href: '/services', label: 'JAMB / UTME Prep' },
  { href: '/services', label: 'WAEC / NECO' },
  { href: '/services', label: 'CBT Training' },
  { href: '/services', label: 'Admission Processing' },
  { href: '/services', label: 'IELTS Coaching' },
  { href: '/techhub',  label: 'Tech Training' },
];

const socials = [
  { href: '#', label: 'Facebook',  icon: 'fab fa-facebook-f' },
  { href: '#', label: 'Twitter',   icon: 'fab fa-twitter' },
  { href: '#', label: 'Instagram', icon: 'fab fa-instagram' },
  { href: '#', label: 'WhatsApp',  icon: 'fab fa-whatsapp' },
  { href: '#', label: 'YouTube',   icon: 'fab fa-youtube' },
];

export function Footer() {
  return (
    <footer className="bg-geo-950 text-white">
      <div className="geo-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-geo-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">
                GEO<em className="not-italic text-geo-400">SOLUTION</em>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering students since 2012 with quality education, tech skills, and career development services in Lagos, Nigeria.
            </p>
            <div className="flex gap-3">
              {socials.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-slate-400 hover:bg-geo-600 hover:text-white transition-all duration-200"
                >
                  <span className="text-sm">
                    {label === 'Facebook'  && 'f'}
                    {label === 'Twitter'   && 'X'}
                    {label === 'Instagram' && '📷'}
                    {label === 'WhatsApp'  && '💬'}
                    {label === 'YouTube'   && '▶'}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-geo-500 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-geo-500 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-geo-400 mt-0.5 flex-shrink-0">📍</span>
                <span className="text-slate-400 text-sm">12, Abayomi Street, Opposite Abeokuta Mosques, Irawo Ajegunle, Ikorodu Road, Lagos</span>
              </div>
              <div className="flex gap-3">
                <span className="text-geo-400 flex-shrink-0">📞</span>
                <span className="text-slate-400 text-sm">+2347014673935<br />+2347061054873</span>
              </div>
              <div className="flex gap-3">
                <span className="text-geo-400 flex-shrink-0">✉️</span>
                <span className="text-slate-400 text-sm">Geoslutions360@gmail.com<br />Geotechacademy@gmail.com</span>
              </div>
              <div className="flex gap-3">
                <span className="text-geo-400 flex-shrink-0">🌐</span>
                <span className="text-slate-400 text-sm">Geoeduservices.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 <span className="text-slate-300">Geosolution Educational Services</span>. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">Designed with ❤️ in Lagos</p>
        </div>
      </div>
    </footer>
  );
}
