/**
 * Mega Menu Component Helper
 * For now, using DropdownMenu pattern until @radix-ui/react-popover is available
 * This provides the structure for mega menu content
 */

'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

// Placeholder components - will be replaced with proper Popover when @radix-ui/react-popover is added
export const Popover = ({ children }: { children: React.ReactNode }) =>
  children;

export const PopoverTrigger = ({ children }: { children: React.ReactNode }) =>
  children;

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      'animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
      className
    )}
    {...props}
  />
));
PopoverContent.displayName = 'PopoverContent';
