/**
 * Navigation Logo Component
 * Following Single Responsibility Principle - handles only logo display
 */

import Link from 'next/link';
import { Plane } from 'lucide-react';

interface NavigationLogoProps {
  readonly className?: string;
}

export function NavigationLogo({ className }: NavigationLogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center space-x-2 transition-transform hover:scale-105 ${className}`}
    >
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <Plane className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-foreground">SkyScout AI</span>
    </Link>
  );
}
