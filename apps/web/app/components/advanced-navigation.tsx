'use client';

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ThemeToggle,
} from '@skyscout/ui';
import {
  Bell,
  Briefcase,
  Calendar,
  ChevronDown,
  CreditCard,
  Gift,
  Globe,
  Headphones,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Plane,
  Search,
  Settings,
  Shield,
  Star,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

interface NavigationProps {
  className?: string;
}

// Navigation items configuration
const navigationItems = [
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
];

// User menu items when logged in
const userMenuItems = [
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
];

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Mock user state - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user] = React.useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    tier: 'Gold',
  });

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-lg shadow-lg'
            : 'bg-background/80 backdrop-blur-sm',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Plane className="h-5 w-5 text-white transform rotate-45" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  SkyScout
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  AI-Powered Travel
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map(item => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? 'text-primary bg-primary/10 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                    {item.featured && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button - Hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Language & Region</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="mr-2">🇺🇸</span>
                    English (US)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="mr-2">🇬🇧</span>
                    English (UK)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="mr-2">🇪🇸</span>
                    Español
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="mr-2">🇫🇷</span>
                    Français
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <ThemeToggle size="icon" variant="ghost" className="flex" />

              {/* User Menu or Auth Buttons */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 px-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {user.tier}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-sm text-muted-foreground font-normal">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {userMenuItems.map((group, groupIndex) => (
                      <React.Fragment key={groupIndex}>
                        <DropdownMenuGroup>
                          {group.items.map(item => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link
                                href={item.href}
                                className="flex items-center"
                              >
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                        {groupIndex < userMenuItems.length - 1 && (
                          <DropdownMenuSeparator />
                        )}
                      </React.Fragment>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsLoggedIn(false)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoggedIn(true)}
                    className="hidden md:flex"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    effect="glow"
                    onClick={() => setIsLoggedIn(true)}
                    className="hidden md:flex"
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navigationItems.map(item => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-xl transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-accent'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Search */}
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Search className="h-4 w-4" />}
                  className="justify-start"
                >
                  Search flights, hotels, cars...
                </Button>

                {/* Mobile Auth Buttons */}
                {!isLoggedIn && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setIsLoggedIn(true)}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="default"
                      fullWidth
                      effect="glow"
                      onClick={() => setIsLoggedIn(true)}
                    >
                      Get Started
                    </Button>
                  </div>
                )}

                {/* Mobile User Info */}
                {isLoggedIn && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-xl">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {user.tier} Member
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Theme Settings */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Appearance</span>
                    <span className="text-xs text-muted-foreground">
                      Choose your theme
                    </span>
                  </div>
                  <ThemeToggle
                    size="sm"
                    variant="outline"
                    showLabels={true}
                    showSystem={true}
                    className="ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
