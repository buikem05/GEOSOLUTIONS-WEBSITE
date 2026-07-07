// components/sections/TestimonialsSection.tsx — Server Component

const testimonials = [
  {
    initials: 'AO',
    name: 'Adebola Okafor',
    role: 'JAMB Student, 2023',
    stars: 5,
    text: "Geosolution helped me score 298 in JAMB! The tutors are amazing and the CBT practice sessions gave me the confidence I needed. I got admission into UNILAG.",
  },
  {
    initials: 'KA',
    name: 'Kingsley Abe',
    role: 'Tech Hub Graduate, 2022',
    stars: 5,
    text: "The Tech Hub program changed my life. I went from zero coding knowledge to building full-stack apps in just 6 months. Now I work remotely for a UK company.",
  },
  {
    initials: 'FE',
    name: 'Funmilayo Eze',
    role: 'IELTS Student, 2024',
    stars: 5,
    text: "I struggled with IELTS twice before Geosolution. Their IELTS coaching is structured and thorough. I scored 7.5 and I'm now studying in Canada!",
  },
];

export function TestimonialsSection() {
  return (
    <section className="geo-section bg-white dark:bg-dark-bg">
      <div className="geo-container">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-geo-100 dark:bg-geo-900/30 text-geo-700 dark:text-geo-300 text-sm font-semibold mb-3">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            What Our Students Say
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Real stories from students who achieved their dreams with Geosolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative p-8 rounded-3xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card shadow-geo hover:shadow-geo-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote mark */}
              <div className="text-6xl font-serif text-geo-200 dark:text-geo-800 leading-none mb-4 select-none">
                &ldquo;
              </div>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {t.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-geo-500 to-geo-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
