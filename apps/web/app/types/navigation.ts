/**
 * Navigation-related type definitions
 * Following the Interface Segregation Principle - specific interfaces for specific needs
 */

import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly description: string;
  readonly featured?: boolean;
  readonly badge?: string;
}

export interface UserMenuGroup {
  readonly group: string;
  readonly items: readonly UserMenuItem[];
}

export interface UserMenuItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface UserProfile {
  readonly name: string;
  readonly email: string;
  readonly avatar: string | null;
  readonly tier: string;
}

export interface NavigationState {
  readonly isMobileMenuOpen: boolean;
  readonly isScrolled: boolean;
  readonly pathname: string;
}
