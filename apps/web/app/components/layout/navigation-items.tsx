/**
 * Navigation Items Component
 * Following Single Responsibility Principle - handles only navigation links
 */

import Link from 'next/link';
import { Badge, cn } from '@skyscout/ui';
import { useActiveRoute } from '../../hooks/use-navigation';
import { NAVIGATION_ITEMS } from '../../constants/navigation';

interface NavigationItemsProps {
  readonly className?: string;
  readonly variant?: 'desktop' | 'mobile';
}

export function NavigationItems({
  className,
  variant = 'desktop',
}: NavigationItemsProps) {
  const { isActiveRoute } = useActiveRoute();

  const baseItemClass =
    variant === 'desktop'
      ? 'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200'
      : 'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200';

  const containerClass =
    variant === 'desktop'
      ? 'hidden lg:flex items-center space-x-1'
      : 'flex flex-col space-y-2';

  return (
    <div className={cn(containerClass, className)}>
      {NAVIGATION_ITEMS.map(item => {
        const isActive = isActiveRoute(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              baseItemClass,
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
}
