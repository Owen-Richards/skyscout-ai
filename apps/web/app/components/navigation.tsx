/**
 * Navigation Component
 * Main navigation bar with mega menus, overflow handling, and progressive disclosure
 *
 * Features:
 * - Multi-modal transport and accommodation options
 * - Progressive disclosure based on screen space
 * - Mega menus with hover/focus interactions
 * - Command palette integration (Cmd/Ctrl+K)
 * - Responsive overflow handling
 */

'use client';

import { cn } from '@skyscout/ui';
import { Command, MoreHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@skyscout/ui';
import { NAV, type NavKey } from '../constants/navigation';
import { useNavOverflow, useNavViewport } from '../hooks/use-nav-overflow';
import { MegaMenu } from './navigation/mega-menu';

interface NavigationProps {
  readonly className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { visibleItems, overflowItems, hasOverflow, containerRef } =
    useNavOverflow();
  const viewport = useNavViewport();
  const [activeMenu, setActiveMenu] = useState<NavKey | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }

      // Escape to close menus
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setIsCommandOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        activeMenu &&
        !(e.target as Element).closest('[data-navigation-menu]')
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [activeMenu]);

  if (viewport === 'mobile') {
    return <MobileNavigation className={className} />;
  }

  return (
    <nav
      ref={containerRef}
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        'bg-background/95 backdrop-blur-lg shadow-lg',
        'navigation-container', // For theme optimization
        className
      )}
      data-navigation-menu
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              SkyScout
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            {visibleItems.map(navGroup => (
              <div key={navGroup.key} className="relative">
                <Button
                  variant="ghost"
                  className={cn(
                    'relative h-10 px-3 text-sm font-medium transition-colors',
                    'hover:text-primary hover:bg-primary/10',
                    'focus:text-primary focus:bg-primary/10',
                    activeMenu === navGroup.key && 'text-primary bg-primary/10'
                  )}
                  onMouseEnter={() => setActiveMenu(navGroup.key)}
                  onFocus={() => setActiveMenu(navGroup.key)}
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === navGroup.key ? null : navGroup.key
                    )
                  }
                >
                  <navGroup.icon className="w-4 h-4 mr-2" />
                  {navGroup.label}
                  {navGroup.items && navGroup.items.length > 0 && (
                    <div className="ml-1 w-1 h-1 bg-current rounded-full opacity-50" />
                  )}
                </Button>

                {/* Mega Menu */}
                {activeMenu === navGroup.key && navGroup.items && (
                  <MegaMenu
                    navGroup={navGroup}
                    onClose={() => setActiveMenu(null)}
                    className="absolute top-full left-0 mt-1"
                  />
                )}
              </div>
            ))}

            {/* Overflow Menu */}
            {hasOverflow && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-3 text-sm font-medium hover:text-primary hover:bg-primary/10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="sr-only">More navigation options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {overflowItems.map(navGroup => (
                    <DropdownMenuItem key={navGroup.key} asChild>
                      <button
                        className="w-full flex items-center px-2 py-2 text-sm"
                        onClick={() => setActiveMenu(navGroup.key)}
                      >
                        <navGroup.icon className="w-4 h-4 mr-2" />
                        {navGroup.label}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Search */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center space-x-2 text-muted-foreground border-dashed"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Search</span>
              <div className="flex items-center space-x-1 text-xs opacity-60">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </Button>

            {/* Theme Toggle, Settings, User - these would be imported/created separately */}
            <div className="flex items-center space-x-2 min-w-[150px] justify-end">
              {/* Placeholder for theme toggle, settings, user menu */}
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Portal - would be implemented as separate component */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-background border rounded-lg shadow-xl p-4">
            <div className="text-center text-muted-foreground">
              Command Palette (Implementation pending)
              <br />
              <button
                onClick={() => setIsCommandOpen(false)}
                className="mt-2 text-primary hover:underline"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Mobile Navigation Component
function MobileNavigation({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              SkyScout
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
          <div className="border-t bg-background/95 backdrop-blur-lg">
            <div className="py-4 space-y-2">
              {NAV.slice(0, 6).map(navGroup => (
                <Link
                  key={navGroup.key}
                  href={navGroup.href || '#'}
                  className="flex items-center px-4 py-3 text-sm font-medium hover:bg-muted rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <navGroup.icon className="w-5 h-5 mr-3" />
                  {navGroup.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
