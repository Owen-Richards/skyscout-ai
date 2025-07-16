/**
 * SkyScout AI Brand Text Component
 * Following Single Responsibility Principle - handles only brand text styling
 */

import { cn } from '@skyscout/ui';

interface SkyScoutBrandProps {
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  readonly className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  hero: 'text-5xl md:text-7xl',
};

export function SkyScoutBrand({ size = 'lg', className }: SkyScoutBrandProps) {
  return (
    <span className={cn('font-bold', sizeClasses[size], className)}>
      <span className="inline-block bg-gradient-to-r from-sky-500 via-sky-600 to-blue-500 dark:from-sky-300 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
        Sky
      </span>
      <span className="inline-block bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-500 dark:to-cyan-400 bg-clip-text text-transparent">
        Scout
      </span>
      <span className="inline-block bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent ml-1">
        AI
      </span>
    </span>
  );
}

// Hero variant - Professional design without animations
export function SkyScoutHeroBrand({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <h1
      className={cn(
        'text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg',
        className
      )}
    >
      <span className="inline-block bg-gradient-to-r from-sky-400 via-sky-500 to-blue-400 dark:from-sky-200 dark:via-sky-300 dark:to-blue-300 bg-clip-text text-transparent">
        Sky
      </span>
      <span className="inline-block bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-400 dark:from-blue-300 dark:via-indigo-400 dark:to-cyan-300 bg-clip-text text-transparent ml-1">
        Scout
      </span>
      <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 dark:from-cyan-300 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent ml-1">
        AI
      </span>
    </h1>
  );
}

// Navigation variant optimized for header
export function SkyScoutNavBrand({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <span className={cn('text-xl font-bold', className)}>
      <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-500 dark:from-sky-300 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
        Sky
      </span>
      <span className="bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-500 dark:to-cyan-400 bg-clip-text text-transparent">
        Scout
      </span>
      <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent ml-1">
        AI
      </span>
    </span>
  );
}
