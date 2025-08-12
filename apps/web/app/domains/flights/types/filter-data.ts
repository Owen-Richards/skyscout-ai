/**
 * Flight Filter Data
 *
 * Constants and configuration for flight filters
 */

import { DollarSign, Plane, Star, Zap } from 'lucide-react';
import type { FilterOption, FilterPreset } from '../hooks/use-flight-filters';

export const STOP_OPTIONS: FilterOption[] = [
  { id: 'nonstop', label: 'Non-stop', count: 12 },
  { id: '1-stop', label: '1 stop', count: 28 },
  { id: '2-stops', label: '2+ stops', count: 15 },
];

export const AIRLINE_OPTIONS: FilterOption[] = [
  { id: 'delta', label: 'Delta Airlines', count: 8 },
  { id: 'american', label: 'American Airlines', count: 12 },
  { id: 'united', label: 'United Airlines', count: 6 },
  { id: 'southwest', label: 'Southwest Airlines', count: 9 },
  { id: 'jetblue', label: 'JetBlue Airways', count: 4 },
];

export const TIME_OPTIONS: FilterOption[] = [
  { id: 'early-morning', label: 'Early morning (6AM - 12PM)', count: 18 },
  { id: 'afternoon', label: 'Afternoon (12PM - 6PM)', count: 22 },
  { id: 'evening', label: 'Evening (6PM - 12AM)', count: 15 },
];

export const DURATION_OPTIONS: FilterOption[] = [
  { id: 'short', label: 'Under 5 hours', count: 25 },
  { id: 'medium', label: '5-10 hours', count: 18 },
  { id: 'long', label: 'Over 10 hours', count: 12 },
];

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'best-value',
    label: 'Best Value',
    icon: Star,
    filters: { stops: ['1-stop'], priceRange: [300, 800] },
  },
  {
    id: 'fastest',
    label: 'Fastest',
    icon: Zap,
    filters: { stops: ['nonstop'], duration: ['short'] },
  },
  {
    id: 'cheapest',
    label: 'Cheapest',
    icon: DollarSign,
    filters: { priceRange: [0, 500] },
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: Plane,
    filters: { airlines: ['delta', 'american'], stops: ['nonstop'] },
  },
];
