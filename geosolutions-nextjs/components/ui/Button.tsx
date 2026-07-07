'use client';

// components/ui/Button.tsx

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-geo-800 text-white border border-geo-800',
    'hover:bg-geo-700 hover:border-geo-700',
    'dark:bg-geo-600 dark:border-geo-600 dark:hover:bg-geo-500',
    'shadow-geo hover:shadow-geo-lg',
  ].join(' '),
  outline: [
    'bg-transparent text-geo-800 border border-geo-800',
    'hover:bg-geo-800 hover:text-white',
    'dark:text-geo-300 dark:border-geo-600 dark:hover:bg-geo-600 dark:hover:text-white',
  ].join(' '),
  ghost: [
    'bg-transparent text-geo-800 border border-transparent',
    'hover:bg-geo-50 hover:border-geo-200',
    'dark:text-geo-300 dark:hover:bg-geo-900/30',
  ].join(' '),
  danger: [
    'bg-red-600 text-white border border-red-600',
    'hover:bg-red-700 hover:border-red-700',
  ].join(' '),
  gold: [
    'bg-geo-gold-500 text-white border border-geo-gold-500',
    'hover:bg-geo-gold-600 hover:border-geo-gold-600',
    'shadow-geo',
  ].join(' '),
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl',
          'transition-all duration-200 ease-out',
          'focus-visible:ring-2 focus-visible:ring-geo-500 focus-visible:ring-offset-2',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
