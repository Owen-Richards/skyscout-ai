/**
 * User Menu Component
 * Following Single Responsibility Principle - handles only user authentication UI
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
} from '@skyscout/ui';
import { ChevronDown, LogOut, Star } from 'lucide-react';
import { USER_MENU_ITEMS } from '../../constants/navigation';
import { useAppTranslation } from '../../contexts/translation-context';
import type { UserProfile } from '../../types/navigation';

interface UserMenuProps {
  readonly className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { tUser } = useAppTranslation();
  // Mock user state - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    tier: 'Gold',
  });

  if (!isLoggedIn) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {tUser('sign in')}
        </Link>
        <Button
          asChild
          variant="sky-primary"
          className="relative overflow-hidden"
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{user.name}</span>
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {user.tier}
              </Badge>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{tUser('account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {USER_MENU_ITEMS.map(group => (
          <DropdownMenuGroup key={group.group}>
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tUser(item.label)}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        ))}

        <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
          <LogOut className="h-4 w-4 mr-2" />
          {tUser('sign out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
