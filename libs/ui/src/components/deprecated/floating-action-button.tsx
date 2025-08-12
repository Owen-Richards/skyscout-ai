'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronUp, MapPin, Plane, Plus, Search, Star } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

const fabVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none relative overflow-hidden shadow-lg hover:shadow-xl',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25 hover:shadow-primary/40',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/25 hover:shadow-secondary/40',
        success:
          'bg-green-600 text-white hover:bg-green-700 shadow-green-600/25 hover:shadow-green-600/40',
        warning:
          'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25 hover:shadow-amber-500/40',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/25 hover:shadow-destructive/40',
        // Aviation-themed variants for SkyScout
        'sky-primary':
          'bg-sky-blue text-foreground hover:bg-sky-blue/90 shadow-sky-blue/25 hover:shadow-sky-blue/40',
        'flight-action':
          'bg-flight-blue text-white hover:bg-flight-blue/90 shadow-flight-blue/25 hover:shadow-flight-blue/40',
        altitude:
          'bg-altitude-blue text-white hover:bg-altitude-blue/90 shadow-altitude-blue/25 hover:shadow-altitude-blue/40',
        // Material Design surface variants
        surface:
          'bg-background text-foreground border border-border/50 hover:bg-accent shadow-background/25 hover:shadow-background/40',
        'surface-variant':
          'bg-muted text-muted-foreground hover:bg-muted/80 shadow-muted/25 hover:shadow-muted/40',
      },
      size: {
        // Standard Material Design FAB sizes
        default: 'h-14 w-14 rounded-2xl', // 56dp default
        mini: 'h-10 w-10 rounded-xl', // 40dp mini
        large: 'h-24 w-24 rounded-3xl', // 96dp large (for special actions)
        // Extended FAB (with text)
        extended: 'h-14 px-4 rounded-2xl min-w-[80px]',
        'extended-lg': 'h-16 px-6 rounded-2xl min-w-[96px]',
      },
      elevation: {
        low: 'shadow-md hover:shadow-lg',
        medium: 'shadow-lg hover:shadow-xl',
        high: 'shadow-xl hover:shadow-2xl',
      },
      position: {
        'bottom-right': 'fixed bottom-4 right-4 z-50',
        'bottom-left': 'fixed bottom-4 left-4 z-50',
        'top-right': 'fixed top-4 right-4 z-50',
        'top-left': 'fixed top-4 left-4 z-50',
        'bottom-center':
          'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
        'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
        static: 'relative',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      elevation: 'medium',
      position: 'static',
    },
  }
);

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  asChild?: boolean;
  /**
   * Icon for the FAB
   */
  icon?: React.ReactNode;
  /**
   * Text label for extended FABs
   */
  label?: string;
  /**
   * Adds a ripple effect on click (Material Design inspired)
   */
  ripple?: boolean;
  /**
   * Show/hide animation state
   */
  visible?: boolean;
  /**
   * Tooltip text for accessibility
   */
  tooltip?: string;
  /**
   * Aviation action preset (overrides icon and styling)
   */
  aviationAction?:
    | 'search-flights'
    | 'book-flight'
    | 'track-flight'
    | 'favorites'
    | 'map-view'
    | 'scroll-to-top';
}

// Aviation action presets
const aviationPresets = {
  'search-flights': {
    icon: <Search className="h-6 w-6" />,
    variant: 'flight-action' as const,
    tooltip: 'Search flights',
  },
  'book-flight': {
    icon: <Plane className="h-6 w-6" />,
    variant: 'sky-primary' as const,
    tooltip: 'Book a flight',
  },
  'track-flight': {
    icon: <MapPin className="h-6 w-6" />,
    variant: 'altitude' as const,
    tooltip: 'Track flight',
  },
  favorites: {
    icon: <Star className="h-6 w-6" />,
    variant: 'warning' as const,
    tooltip: 'View favorites',
  },
  'map-view': {
    icon: <MapPin className="h-6 w-6" />,
    variant: 'default' as const,
    tooltip: 'Show map',
  },
  'scroll-to-top': {
    icon: <ChevronUp className="h-6 w-6" />,
    variant: 'secondary' as const,
    tooltip: 'Scroll to top',
  },
};

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    {
      className,
      variant,
      size,
      elevation,
      position,
      asChild = false,
      icon,
      label,
      disabled,
      ripple = true,
      visible = true,
      tooltip,
      aviationAction,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const [rippleArray, setRippleArray] = React.useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    // Apply aviation preset if specified
    const preset = aviationAction ? aviationPresets[aviationAction] : null;
    const finalVariant = preset?.variant || variant;
    const finalIcon = preset?.icon || icon || <Plus className="h-6 w-6" />;
    const finalTooltip = preset?.tooltip || tooltip;

    // Determine if this is an extended FAB
    const isExtended =
      size === 'extended' || size === 'extended-lg' || Boolean(label);

    // Ripple effect handler
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ripple && !disabled) {
          const button = event.currentTarget;
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;

          const newRipple = {
            x,
            y,
            size,
            key: Date.now(),
          };

          setRippleArray(prev => [...prev, newRipple]);

          // Remove ripple after animation
          setTimeout(() => {
            setRippleArray(prev => prev.filter(r => r.key !== newRipple.key));
          }, 600);
        }

        onClick?.(event);
      },
      [ripple, disabled, onClick]
    );

    // Handle scroll to top action
    const handleScrollToTop = React.useCallback(() => {
      if (aviationAction === 'scroll-to-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, [aviationAction]);

    const handleCombinedClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        handleClick(event);
        handleScrollToTop();
      },
      [handleClick, handleScrollToTop]
    );

    // Show/hide animation classes
    const visibilityClasses = visible
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-75 translate-y-2 pointer-events-none';

    if (asChild) {
      return (
        <Slot
          className={cn(
            fabVariants({ variant: finalVariant, size, elevation, position }),
            visibilityClasses,
            className
          )}
          ref={ref}
          {...props}
        >
          {React.Children.only(props.children)}
        </Slot>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          fabVariants({ variant: finalVariant, size, elevation, position }),
          visibilityClasses,
          className
        )}
        disabled={disabled}
        onClick={handleCombinedClick}
        title={finalTooltip}
        aria-label={finalTooltip || label || 'Floating action button'}
        {...props}
      >
        {/* Ripple effect container */}
        {ripple && (
          <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
            {rippleArray.map(ripple => (
              <span
                key={ripple.key}
                className="absolute animate-ping bg-white/30 rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  animationDuration: '600ms',
                  animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            ))}
          </span>
        )}

        {/* Content container with proper spacing for extended FABs */}
        <div
          className={cn(
            'flex items-center justify-center relative z-10',
            isExtended && 'gap-2'
          )}
        >
          {/* Icon */}
          <span
            className={cn(
              'flex-shrink-0',
              size === 'mini' && '[&_svg]:h-4 [&_svg]:w-4',
              size === 'large' && '[&_svg]:h-8 [&_svg]:w-8'
            )}
            aria-hidden="true"
          >
            {finalIcon}
          </span>

          {/* Label for extended FABs */}
          {isExtended && label && (
            <span
              className={cn(
                'font-medium whitespace-nowrap',
                size === 'extended' && 'text-sm',
                size === 'extended-lg' && 'text-base'
              )}
            >
              {label}
            </span>
          )}
        </div>
      </Comp>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { fabVariants, FloatingActionButton };
