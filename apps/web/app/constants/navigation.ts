/**
 * Navigation configuration constants
 * Multi-modal navigation with progressive disclosure
 * Following the Open/Closed Principle - easy to extend without modification
 */

import {
  Bell,
  Briefcase,
  Bus,
  Calendar,
  Car,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  Home,
  Hotel,
  LucideIcon,
  MapPin,
  Plane,
  Search,
  Settings,
  Shield,
  Ship,
  Tent,
  Ticket,
  Train,
  Truck,
  User,
  Users,
} from 'lucide-react';

import type { NavigationItem, UserMenuGroup } from '../types/navigation';

// Navigation Keys for type safety
export type NavKey =
  | 'search'
  | 'stays'
  | 'transport'
  | 'activities'
  | 'deals'
  | 'alerts'
  | 'trips'
  | 'groups'
  | 'settings'
  | 'user'
  | 'more';

// Navigation Leaf Node
export interface NavLeaf {
  key: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  description?: string;
  popular?: boolean; // For "popular now" quick links
}

// Navigation Group Structure
export interface NavGroup {
  key: NavKey;
  label: string;
  icon?: LucideIcon;
  href?: string; // for simple leaves like deals
  priority: number; // lower = more important (stays visible first)
  children?: NavLeaf[]; // for mega menus
  badge?: string;
  description?: string;
}

// Main Navigation Structure (Multi-Modal)
export const NAV: NavGroup[] = [
  {
    key: 'search',
    label: 'Search',
    icon: Search,
    priority: 0,
    description: 'Global search across all travel options',
  },
  {
    key: 'stays',
    label: 'Stays',
    icon: Home,
    priority: 1,
    description: 'All accommodation types',
    children: [
      {
        key: 'hotels',
        label: 'Hotels',
        href: '/stays/hotels',
        icon: Hotel,
        description: 'Traditional hotels and resorts',
        popular: true,
      },
      {
        key: 'rentals',
        label: 'Vacation Rentals',
        href: '/stays/rentals',
        icon: Home,
        description: 'Apartments, houses, and unique stays',
      },
      {
        key: 'hostels',
        label: 'Hostels',
        href: '/stays/hostels',
        icon: MapPin,
        description: 'Budget-friendly shared accommodations',
      },
      {
        key: 'camping',
        label: 'Camping',
        href: '/stays/camping',
        icon: Tent,
        description: 'Campsites, glamping, and outdoor stays',
        popular: true,
      },
    ],
  },
  {
    key: 'transport',
    label: 'Transport',
    icon: Plane,
    priority: 2,
    description: 'All transportation modes',
    children: [
      {
        key: 'flights',
        label: 'Flights',
        href: '/transport/flights',
        icon: Plane,
        description: 'Domestic and international flights',
        popular: true,
      },
      {
        key: 'trains',
        label: 'Trains',
        href: '/transport/trains',
        icon: Train,
        description: 'Rail travel and high-speed trains',
      },
      {
        key: 'buses',
        label: 'Buses',
        href: '/transport/buses',
        icon: Bus,
        description: 'Intercity and regional bus services',
      },
      {
        key: 'boats',
        label: 'Ferries & Boats',
        href: '/transport/boats',
        icon: Ship,
        description: 'Ferry services and boat transportation',
      },
      {
        key: 'cars',
        label: 'Car Rental',
        href: '/transport/cars',
        icon: Car,
        description: 'Rent cars from global providers',
        popular: true,
      },
      {
        key: 'rv',
        label: 'RV',
        href: '/transport/rv',
        icon: Truck,
        description: 'Recreational vehicles and motorhomes',
      },
    ],
  },
  {
    key: 'activities',
    label: 'Activities',
    icon: Ticket,
    priority: 3,
    description: 'Tours, tickets, and experiences',
    children: [
      {
        key: 'tours',
        label: 'Tours & Tickets',
        href: '/activities',
        icon: Ticket,
        description: 'Local tours, attractions, and experiences',
      },
    ],
  },
  {
    key: 'deals',
    label: 'Deals',
    icon: Gift,
    priority: 4,
    href: '/deals',
    badge: 'Hot',
    description: 'Special offers and limited-time deals',
  },
  {
    key: 'alerts',
    label: 'Price Alerts',
    icon: Bell,
    priority: 5,
    href: '/alerts',
    description: 'AI-powered price tracking and notifications',
  },
  {
    key: 'trips',
    label: 'My Trips',
    icon: Calendar,
    priority: 6,
    href: '/trips',
    description: 'Manage your bookings and itineraries',
  },
  {
    key: 'groups',
    label: 'Group Planning',
    icon: Users,
    priority: 7,
    href: '/groups',
    description: 'Collaborative trip planning with friends',
  },
];

// Legacy support - keeping existing simple structure for backwards compatibility
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
