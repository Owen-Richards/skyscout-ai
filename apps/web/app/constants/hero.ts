/**
 * Hero section configuration constants
 * Following the DRY principle - centralized configuration
 */

import { TrendingUp, Clock, Shield, Sparkles } from 'lucide-react';

import type { HeroFeature, HeroStat } from '../types/hero';

export const HERO_FEATURES: readonly HeroFeature[] = [
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'AI-powered price prediction and alerts',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Live flight status and gate changes',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Protected transactions and data privacy',
  },
  {
    icon: Sparkles,
    title: 'Smart Recommendations',
    description: 'Personalized travel suggestions',
  },
] as const;

export const HERO_STATS: readonly HeroStat[] = [
  { value: '10M+', label: 'Happy Travelers' },
  { value: '500+', label: 'Airlines' },
  { value: '95%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'Support' },
] as const;
