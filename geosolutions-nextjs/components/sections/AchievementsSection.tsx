'use client';

// components/sections/AchievementsSection.tsx

import { useEffect, useRef, useState } from 'react';

const achievements = [
  { count: 1000, suffix: '+', label: 'Students Trained' },
  { count: 300,  suffix: '+', label: 'Tech Students Empowered' },
  { count: 95,   suffix: '%', label: 'Exam Pass Rate' },
  { count: 12,   suffix: '',  label: 'Years of Excellence' },
];

function Counter({ count, suffix, label }: typeof achievements[0]) {
  const [val, setVal] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.6 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!active) return;
    let s = 0;
    const step = count / (1500 / 16);
    const t = setInterval(() => { s = Math.min(s + step, count); setVal(Math.floor(s)); if (s >= count) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [active, count]);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 group">
      <span className="text-4xl md:text-5xl font-extrabold text-white">
        {val.toLocaleString()}{suffix}
      </span>
      <span className="text-geo-300 text-sm font-medium tracking-wide uppercase">{label}</span>
    </div>
  );
}

export function AchievementsSection() {
  return (
    <section className="py-20 bg-hero-gradient">
      <div className="geo-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {achievements.map((a) => <Counter key={a.label} {...a} />)}
        </div>
      </div>
    </section>
  );
}
