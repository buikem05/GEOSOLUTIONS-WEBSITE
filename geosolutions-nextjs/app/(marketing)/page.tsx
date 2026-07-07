// app/(marketing)/page.tsx — Home page (SSG by default in App Router)

import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { TechHubSection } from '@/components/sections/TechHubSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { AboutTeaser } from '@/components/sections/AboutTeaser';

export const metadata: Metadata = {
  title: 'Geosolution Educational Services — Study Anywhere, Anytime',
  description:
    'Geosolution Educational Services empowers students with quality academic coaching, CBT training, admissions support, and cutting-edge tech skills in Lagos, Nigeria.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AchievementsSection />
      <AboutTeaser />
      <TechHubSection />
      <TestimonialsSection />
      <GallerySection />
    </>
  );
}
