/**
 * Main Navigation Component
 * Refactored following SOLID principles and Clean Code practices
 *
 * - Single Responsibility: Only handles navigation layout
 * - Open/Closed: Easy to extend with new navigation items
 * - Liskov Substitution: Components can be replaced without breaking functionality
 * - Interface Segregation: Specific interfaces for each component
 * - Dependency Inversion: Depends on abstractions (hooks, constants)
 */

'use client';

import { ThemeToggle, cn } from '@skyscout/ui';
import { useNavigationState } from '../../hooks/use-navigation';
import { SettingsMenu } from '../navigation/settings-menu';
import { MobileMenuToggle } from './mobile-menu-toggle';
import { NavigationItems } from './navigation-items';
import { NavigationLogo } from './navigation-logo';
import { UserMenu } from './user-menu';

interface NavigationProps {
  readonly className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu } =
    useNavigationState();

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={cn(
          'sticky top-0 z-50 w-full border-b navigation-container theme-instant',
          isScrolled
            ? 'bg-background/95 backdrop-blur-lg shadow-lg'
            : 'bg-background/80 backdrop-blur-sm',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <NavigationLogo />

            {/* Desktop Navigation */}
            <NavigationItems variant="desktop" />

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <SettingsMenu className="hidden md:flex" />
              <UserMenu className="hidden md:flex" />
              <MobileMenuToggle
                isOpen={isMobileMenuOpen}
                onToggle={toggleMobileMenu}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <NavigationItems variant="mobile" />
              <div className="pt-4 border-t space-y-4">
                <SettingsMenu />
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
