import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Geosolution Educational Services — Study Anywhere, Anytime',
    template: '%s | Geosolution Educational Services',
  },
  description:
    'Geosolution Educational Services — JAMB, WAEC, NECO, CBT Training, Admission Processing, Tech Hub and more in Lagos, Nigeria. Empowering students since 2012.',
  keywords: [
    'JAMB', 'WAEC', 'NECO', 'CBT training', 'Lagos', 'Nigeria',
    'admission processing', 'IELTS', 'Tech Hub', 'Geosolution',
  ],
  authors: [{ name: 'Geosolution Educational Services' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://geoeduservices.com',
    siteName: 'Geosolution Educational Services',
    title: 'Geosolution Educational Services — Study Anywhere, Anytime',
    description:
      'Quality academic coaching, CBT training, admissions support, and tech skills in Lagos, Nigeria.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geosolution Educational Services',
    description: 'Quality education and tech training in Lagos, Nigeria.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
