/**
 * Progressive Navigation Header
 * Sophisticated multi-modal navigation with intelligent progressive disclosure
 * Handles complex travel platform services without overwhelming users
 * Strategic competitive advantage through superior UX and information architecture
 */

'use client';

import { Badge, Button, cn, ThemeToggle } from '@skyscout/ui';
import { ChevronDown, Command, MoreHorizontal, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type NavGroup } from '../../constants/navigation';
import { useNavOverflow, useNavViewport } from '../../hooks/use-nav-overflow';
import { useNavigationState } from '../../hooks/use-navigation';
import { NavigationLogo } from '../layout/navigation-logo';
import { UserMenu } from '../layout/user-menu';
import { CommandPalette } from './command-palette';
import { MegaMenu } from './mega-menu';
import { SettingsMenu } from './settings-menu';

interface ProgressiveNavigationProps {
  readonly className?: string;
}

export function ProgressiveNavigation({
  className,
}: ProgressiveNavigationProps) {
  const { isScrolled } = useNavigationState();
  const { visibleItems, overflowItems, hasOverflow, containerRef } =
    useNavOverflow();
  const viewportInfo = useNavViewport();

  // Menu state management
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationRef = useRef<HTMLElement>(null);

  // Handle menu interactions with smart delays
  const handleMenuOpen = useCallback((menuKey: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(menuKey);
  }, []);

  const handleMenuClose = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredItem(null);
    }, 150); // Slight delay to prevent accidental closures
  }, []);

  const handleMenuHover = useCallback((menuKey: string | null) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setHoveredItem(menuKey);
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
        setHoveredItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  const renderNavigationItem = useCallback(
    (item: NavGroup) => {
      const Icon = item.icon;
      const isActive = activeMenu === item.key;
      const isHovered = hoveredItem === item.key;
      const hasChildren = item.children && item.children.length > 0;
      const isSearchItem = item.key === 'search';

      // Responsive text display based on viewport
      const showText = viewportInfo.type !== 'mobile';
      const showKeyboardHint =
        viewportInfo.type === 'desktop' || viewportInfo.type === 'ultrawide';
      const compactMode =
        viewportInfo.type === 'mobile' || viewportInfo.type === 'tablet';

      // Special handling for search - opens command palette
      if (isSearchItem) {
        return (
          <Button
            key={item.key}
            variant="ghost"
            size={compactMode ? 'sm' : 'default'}
            className={cn(
              'flex items-center gap-2 h-auto',
              compactMode ? 'px-2 py-2' : 'px-3 py-2',
              'hover:bg-accent hover:text-accent-foreground',
              'transition-all duration-200',
              viewportInfo.isTouch && 'min-h-[44px]' // Touch-friendly targets
            )}
            onClick={() => setIsCommandPaletteOpen(true)}
          >
            {Icon && (
              <Icon className={cn(compactMode ? 'h-4 w-4' : 'h-4 w-4')} />
            )}
            {showText && (
              <span
                className={cn(
                  viewportInfo.type === 'tablet' ? 'text-sm' : 'text-base'
                )}
              >
                {item.label}
              </span>
            )}
            {showKeyboardHint && (
              <kbd className="h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100 hidden lg:inline-flex">
                ⌘K
              </kbd>
            )}
          </Button>
        );
      }

      return (
        <div
          key={item.key}
          className="relative"
          onMouseEnter={() => {
            if (!viewportInfo.isTouch) {
              handleMenuHover(item.key);
              if (hasChildren) {
                handleMenuOpen(item.key);
              }
            }
          }}
          onMouseLeave={() => {
            if (!viewportInfo.isTouch) {
              handleMenuHover(null);
              if (hasChildren) {
                handleMenuClose();
              }
            }
          }}
        >
          <Button
            variant="ghost"
            size={compactMode ? 'sm' : 'default'}
            className={cn(
              'flex items-center gap-2 h-auto',
              compactMode ? 'px-2 py-2' : 'px-3 py-2',
              'hover:bg-accent hover:text-accent-foreground',
              'transition-all duration-200',
              (isActive || isHovered) && 'bg-accent text-accent-foreground',
              viewportInfo.isTouch && 'min-h-[44px]' // Touch-friendly targets
            )}
            onClick={() => {
              if (hasChildren) {
                if (viewportInfo.isTouch || isActive) {
                  // For touch devices or when already active, toggle
                  setActiveMenu(isActive ? null : item.key);
                } else {
                  handleMenuOpen(item.key);
                }
              } else if (item.href) {
                window.location.href = item.href;
              }
            }}
          >
            {Icon && (
              <Icon className={cn(compactMode ? 'h-4 w-4' : 'h-4 w-4')} />
            )}
            {showText && (
              <span
                className={cn(
                  viewportInfo.type === 'tablet' ? 'text-sm' : 'text-base'
                )}
              >
                {item.label}
              </span>
            )}
            {item.badge && showText && (
              <Badge
                variant="secondary"
                className={cn('ml-1', compactMode ? 'text-xs px-1' : 'text-xs')}
              >
                {item.badge}
              </Badge>
            )}
            {hasChildren && showText && (
              <ChevronDown
                className={cn(
                  'transition-transform duration-200',
                  compactMode ? 'h-3 w-3' : 'h-3 w-3',
                  isActive && 'rotate-180'
                )}
              />
            )}
          </Button>

          {/* Mega Menu */}
          {hasChildren && isActive && (
            <MegaMenu
              navGroup={item}
              onClose={() => setActiveMenu(null)}
              className={cn(
                'left-0',
                // Responsive positioning
                viewportInfo.type === 'mobile' &&
                  'left-1/2 transform -translate-x-1/2',
                viewportInfo.type === 'tablet' && 'left-0'
              )}
              viewportInfo={viewportInfo}
            />
          )}
        </div>
      );
    },
    [
      activeMenu,
      hoveredItem,
      handleMenuOpen,
      handleMenuClose,
      handleMenuHover,
      viewportInfo,
    ]
  );

  const renderOverflowMenu = useCallback(() => {
    if (!hasOverflow) return null;

    const showText = viewportInfo.type !== 'mobile';
    const compactMode =
      viewportInfo.type === 'mobile' || viewportInfo.type === 'tablet';

    return (
      <div
        className="relative"
        onMouseEnter={() => {
          if (!viewportInfo.isTouch) {
            handleMenuHover('more');
            handleMenuOpen('more');
          }
        }}
        onMouseLeave={() => {
          if (!viewportInfo.isTouch) {
            handleMenuHover(null);
            handleMenuClose();
          }
        }}
      >
        <Button
          variant="ghost"
          size={compactMode ? 'sm' : 'default'}
          className={cn(
            'flex items-center gap-2 h-auto',
            compactMode ? 'px-2 py-2' : 'px-3 py-2',
            'hover:bg-accent hover:text-accent-foreground',
            'transition-all duration-200',
            activeMenu === 'more' && 'bg-accent text-accent-foreground',
            viewportInfo.isTouch && 'min-h-[44px]'
          )}
          onClick={() => {
            if (viewportInfo.isTouch) {
              setActiveMenu(activeMenu === 'more' ? null : 'more');
            }
          }}
        >
          <MoreHorizontal className={cn(compactMode ? 'h-4 w-4' : 'h-4 w-4')} />
          {showText && (
            <span
              className={cn(
                viewportInfo.type === 'tablet' ? 'text-sm' : 'text-base'
              )}
            >
              More
            </span>
          )}
          <Badge
            variant="outline"
            className={cn('ml-1', compactMode ? 'text-xs px-1' : 'text-xs')}
          >
            {overflowItems.length}
          </Badge>
        </Button>

        {/* Overflow Menu Dropdown */}
        {activeMenu === 'more' && (
          <div
            className={cn(
              'absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50',
              // Responsive sizing
              viewportInfo.type === 'mobile' &&
                'fixed inset-x-4 top-auto bottom-16 mt-0',
              viewportInfo.type === 'tablet' && 'min-w-[250px]',
              'min-w-[200px]'
            )}
          >
            <div
              className={cn(viewportInfo.type === 'mobile' ? 'p-3' : 'py-2')}
            >
              {overflowItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={cn(
                      'w-full flex items-center gap-3 text-left hover:bg-accent transition-colors rounded-lg',
                      viewportInfo.type === 'mobile'
                        ? 'px-3 py-3'
                        : 'px-4 py-2',
                      viewportInfo.isTouch && 'min-h-[48px]'
                    )}
                    onClick={() => {
                      if (item.href) {
                        window.location.href = item.href;
                      }
                      setActiveMenu(null);
                    }}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          viewportInfo.type === 'mobile' ? 'h-4 w-4' : 'h-4 w-4'
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        viewportInfo.type === 'mobile' ? 'text-base' : 'text-sm'
                      )}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'ml-auto',
                          viewportInfo.type === 'mobile' ? 'text-xs' : 'text-xs'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }, [
    hasOverflow,
    overflowItems,
    activeMenu,
    handleMenuHover,
    handleMenuOpen,
    handleMenuClose,
    viewportInfo,
    setActiveMenu,
  ]);

  return (
    <>
      <nav
        ref={navigationRef}
        className={cn(
          'sticky top-0 z-40 w-full border-b',
          'bg-background/95 backdrop-blur-lg',
          'transition-all duration-300',
          isScrolled && 'shadow-lg',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <NavigationLogo />

            {/* Main Navigation - Desktop Only */}
            <div
              ref={containerRef as React.RefObject<HTMLDivElement>}
              className={cn(
                'hidden lg:flex items-center space-x-1',
                'flex-1 justify-center max-w-4xl mx-8'
              )}
            >
              {visibleItems.map(renderNavigationItem)}
              {renderOverflowMenu()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Quick search for mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsCommandPaletteOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Command palette hint for desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setIsCommandPaletteOpen(true)}
                aria-label="Open command palette"
              >
                <Command className="h-4 w-4" />
              </Button>

              <ThemeToggle />
              <SettingsMenu className="hidden md:flex" />
              <UserMenu className="hidden md:flex" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {viewportInfo.type === 'mobile' && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 overflow-x-auto">
                  {visibleItems.slice(0, 4).map(item => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.key}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-xs whitespace-nowrap min-h-[44px]"
                        onClick={() => {
                          if (item.key === 'search') {
                            setIsCommandPaletteOpen(true);
                          } else if (item.href) {
                            window.location.href = item.href;
                          }
                        }}
                      >
                        {Icon && <Icon className="h-3 w-3" />}
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
                <div className="flex items-center space-x-2">
                  <SettingsMenu />
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Tablet Navigation */}
        {viewportInfo.type === 'tablet' && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                {visibleItems.slice(0, 6).map(item => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.key}
                      variant="ghost"
                      className="flex items-center gap-2 text-sm p-3 justify-start min-h-[48px]"
                      onClick={() => {
                        if (item.key === 'search') {
                          setIsCommandPaletteOpen(true);
                        } else if (item.href) {
                          window.location.href = item.href;
                        }
                      }}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
