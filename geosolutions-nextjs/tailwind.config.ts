import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  darkMode: 'class', // controlled by next-themes
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ──────────────────────────────────────────
        geo: {
          // Primary blue (from legacy #1e3a8a)
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',  // Primary brand blue
          900: '#1e3270',
          950: '#172554',
        },
        // Accent green
        'geo-green': {
          50:  '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // Accent gold
        'geo-gold': {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Dark mode surfaces
        dark: {
          bg:      '#0a0f1e',  // page background
          surface: '#111827',  // card background
          card:    '#1f2937',  // elevated card
          border:  '#374151',  // border color
          muted:   '#6b7280',  // muted text
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        sans:    ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom scale for headings
        'display-xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['3rem',    { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'geo':    '0 4px 24px rgba(30, 58, 138, 0.12)',
        'geo-lg': '0 8px 48px rgba(30, 58, 138, 0.18)',
        'glass':  '0 8px 32px rgba(0,0,0,0.12)',
        'glow':   '0 0 24px rgba(59, 130, 246, 0.4)',
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #2563eb 100%)',
        'card-gradient':   'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        'gold-gradient':   'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'green-gradient':  'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        'glass-gradient':  'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'float':      'float 3s ease-in-out infinite',
        'count-up':   'countUp 0.3s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
