/**
 * Navigation configuration constants
 * Following the Open/Closed Principle - easy to extend without modification
 */

import {
  Plane,
  MapPin,
  Briefcase,
  Gift,
  User,
  Calendar,
  Heart,
  CreditCard,
  Settings,
  Bell,
  Headphones,
  Shield,
} from 'lucide-react';

import type { NavigationItem, UserMenuGroup } from '../types/navigation';

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    label: 'Flights',
    href: '/flights',
    icon: Plane,
    description: 'Search and book flights',
    featured: true,
  },
  {
    label: 'Hotels',
    href: '/hotels',
    icon: MapPin,
    description: 'Find and book accommodations',
  },
  {
    label: 'Cars',
    href: '/cars',
    icon: Briefcase,
    description: 'Rent a car for your trip',
  },
  {
    label: 'Deals',
    href: '/deals',
    icon: Gift,
    description: 'Special offers and promotions',
    badge: 'Hot',
  },
] as const;

export const USER_MENU_ITEMS: readonly UserMenuGroup[] = [
  {
    group: 'Account',
    items: [
      { label: 'My Profile', href: '/profile', icon: User },
      { label: 'My Trips', href: '/trips', icon: Calendar },
      { label: 'Saved Flights', href: '/saved', icon: Heart },
      { label: 'Payment Methods', href: '/payment', icon: CreditCard },
    ],
  },
  {
    group: 'Preferences',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
  {
    group: 'Support',
    items: [
      { label: 'Help Center', href: '/help', icon: Headphones },
      { label: 'Travel Insurance', href: '/insurance', icon: Shield },
    ],
  },
] as const;
