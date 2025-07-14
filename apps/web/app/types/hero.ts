/**
 * Hero section related types
 * Following Single Responsibility Principle - each type has one clear purpose
 */

import { LucideIcon } from 'lucide-react';

export interface HeroFeature {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export interface HeroStat {
  readonly value: string;
  readonly label: string;
}

export interface HeroSectionProps {
  readonly className?: string;
}
