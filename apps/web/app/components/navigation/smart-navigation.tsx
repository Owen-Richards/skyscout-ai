/**
 * Smart Navigation System
 * Progressive disclosure with adaptive complexity based on user behavior
 */

'use client';

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@skyscout/ui';
import {
  Calendar,
  ChevronRight,
  MapPin,
  Plane,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface SmartNavigationProps {
  readonly className?: string;
  readonly userLevel?: 'beginner' | 'intermediate' | 'expert';
}

export function SmartNavigation({
  className,
  userLevel = 'beginner',
}: SmartNavigationProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  // Simple entry points for beginners
  const simpleNavItems = [
    { label: 'Find Flights', icon: Plane, href: '/flights', primary: true },
    { label: 'Hotels', icon: MapPin, href: '/hotels' },
    { label: 'My Trips', icon: Calendar, href: '/trips' },
  ];

  // Advanced features revealed progressively
  const advancedFeatures = [
    { label: 'Group Planning', icon: Users, href: '/groups', badge: 'New' },
    {
      label: 'Price Alerts',
      icon: TrendingUp,
      href: '/alerts',
      badge: 'Smart',
    },
    { label: 'Multi-Modal', icon: Settings, href: '/transport', badge: 'Pro' },
    { label: 'Concierge', icon: Shield, href: '/concierge', badge: 'Premium' },
  ];

  return (
    <nav className={cn('flex items-center space-x-6', className)}>
      {/* Simple Navigation (Always Visible) */}
      <div className="flex items-center space-x-4">
        {simpleNavItems.map(item => (
          <Button
            key={item.href}
            variant={item.primary ? 'sky-primary' : 'ghost'}
            size="sm"
            className="relative"
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Progressive Disclosure Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative overflow-hidden group"
          >
            <Zap className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            More Features
            {userLevel !== 'beginner' && (
              <Badge className="ml-2 text-xs">{advancedFeatures.length}</Badge>
            )}
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 font-medium">
              Advanced Features
            </div>
            {advancedFeatures.map(feature => (
              <DropdownMenuItem key={feature.href} className="group">
                <feature.icon className="w-4 h-4 mr-3 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{feature.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getFeatureDescription(feature.label)}
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Level Indicator */}
      {userLevel !== 'beginner' && (
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium capitalize">{userLevel}</span>
        </div>
      )}
    </nav>
  );
}

function getFeatureDescription(label: string): string {
  const descriptions = {
    'Group Planning': 'Plan trips with friends, vote on options',
    'Price Alerts': 'AI-powered price predictions',
    'Multi-Modal': 'Flights, trains, buses, cars, RV, camping',
    Concierge: 'White-glove trip assistance',
  };
  return descriptions[label as keyof typeof descriptions] || '';
}
