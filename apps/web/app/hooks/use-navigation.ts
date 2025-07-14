/**
 * Navigation-specific hooks
 * Following Single Responsibility Principle - each hook has one clear purpose
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { NavigationState } from '../types/navigation';

/**
 * Hook for managing navigation state
 * Separates state management logic from UI components
 */
export function useNavigationState(): NavigationState & {
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
} {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    isMobileMenuOpen,
    isScrolled,
    pathname,
    toggleMobileMenu,
    closeMobileMenu,
  };
}

/**
 * Hook for navigation route checking
 * Pure function approach for route comparison
 */
export function useActiveRoute() {
  const pathname = usePathname();

  const isActiveRoute = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return { isActiveRoute, pathname };
}
