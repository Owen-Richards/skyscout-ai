/**
 * Navigation Logo Component
 * Following Single Responsibility Principle - handles only logo display
 */

import Link from 'next/link';
import { Plane } from 'lucide-react';
import { SkyScoutNavBrand } from '../ui/skyscout-brand';

interface NavigationLogoProps {
  readonly className?: string;
}

export function NavigationLogo({ className }: NavigationLogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center space-x-2 transition-transform hover:scale-105 ${className}`}
    >
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 dark:from-sky-500 dark:via-blue-600 dark:to-cyan-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
        <Plane className="h-5 w-5 text-white drop-shadow-md" />
      </div>
      <SkyScoutNavBrand />
    </Link>
  );
}
