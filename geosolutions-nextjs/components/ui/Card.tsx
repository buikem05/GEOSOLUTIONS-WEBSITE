'use client';

// components/ui/Card.tsx

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  glass = false,
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? [
              'bg-white/8 dark:bg-white/5',
              'backdrop-blur-md',
              'border-white/15 dark:border-white/8',
              'shadow-glass',
            ].join(' ')
          : [
              'bg-white dark:bg-dark-card',
              'border-slate-100 dark:border-dark-border',
              'shadow-geo',
            ].join(' '),
        hover && [
          'hover:shadow-geo-lg hover:-translate-y-1',
          'cursor-pointer',
        ].join(' '),
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
