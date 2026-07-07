// app/(marketing)/contact/page.tsx — Contact Us Page (SSG & Client form)

import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const metadata: Metadata = {
  title: 'Contact Us & Campus Location | Geosolution Educational Services',
  description: 'Get in touch with Geosolution Educational Services. Visit our campus at 12 Abayomi Street, Ikorodu Road, Lagos, or call us for admissions inquiries.',
};

export default function ContactPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Header */}
      <section className="geo-container text-center max-w-3xl mx-auto space-y-4 animate-slide-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-geo-100 dark:bg-geo-900/40 text-geo-700 dark:text-geo-300 text-sm font-semibold border border-geo-200 dark:border-geo-800">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          We&apos;re Here to Help You <span className="text-geo-600 dark:text-geo-400">Succeed</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Have questions about JAMB registration, CBT training schedules, or tech course fees? Our admissions team is ready to assist you.
        </p>
      </section>

      {/* Grid: Contact Details & Form */}
      <section className="geo-container grid lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Contact info cards */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="lg" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-geo-50 dark:bg-geo-900/40 flex items-center justify-center text-2xl flex-shrink-0">
                📍
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Campus Headquarters</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  12 Abayomi Street, Opposite Abeokuta Mosques, Irawo Ajegunle, Ikorodu Road, Lagos State, Nigeria.
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-2xl flex-shrink-0">
                📞
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Phone & WhatsApp</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Call or WhatsApp our admissions desk:
                </p>
                <div className="mt-2 space-y-1 font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  <p>+234 802 345 6789</p>
                  <p>+234 708 901 2345</p>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-2xl flex-shrink-0">
                ✉️
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Email Inquiries</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  For general info, corporate partnerships, or verification:
                </p>
                <p className="mt-2 font-semibold text-geo-600 dark:text-geo-400 text-sm">
                  info@geosolutionedu.com
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-2xl flex-shrink-0">
                ⏰
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Working Hours</h3>
                <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between"><span>Monday – Friday:</span> <span className="font-medium text-slate-800 dark:text-white">8:00 AM – 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday (CBT Labs):</span> <span className="font-medium text-slate-800 dark:text-white">9:00 AM – 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday:</span> <span className="font-medium text-slate-800 dark:text-white">Closed</span></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Contact Form */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="p-8 md:p-10 space-y-6 shadow-geo-lg border-slate-200 dark:border-dark-border">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send Us a Message</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fill out the form below and an admissions counselor will contact you within 24 hours.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Your Full Name" placeholder="e.g. Adebayo Ogunlesi" required />
                <Input label="Email Address" type="email" placeholder="you@example.com" required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Phone / WhatsApp Number" placeholder="0802 345 6789" required />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Program of Interest
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-geo-500">
                    <option value="">Select a Program...</option>
                    <option value="jamb">JAMB / UTME Coaching</option>
                    <option value="waec">WAEC / NECO Preparation</option>
                    <option value="cbt">CBT Training Labs</option>
                    <option value="tech">GeoTech Academy (Digital Skills)</option>
                    <option value="ielts">IELTS / Study Abroad</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Message or Question
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-geo-500"
                  required
                />
              </div>

              <Button type="button" variant="primary" size="lg" className="w-full">
                Send Inquiry Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
