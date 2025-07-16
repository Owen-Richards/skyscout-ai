/**
 * Enhanced Card Component for SkyScout AI
 * Optimized for flight results with multiple variants and full accessibility
 * Generated with AI assistance following project patterns
 */

'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// AI-generated variants using CVA pattern
const cardVariants = cva(
  'rounded-lg border text-card-foreground shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        outlined: 'bg-transparent border-2',
        elevated: 'bg-card border-border shadow-lg hover:shadow-xl',
        interactive:
          'bg-card border-border hover:shadow-md hover:border-primary/50 cursor-pointer',
        flight:
          'bg-gradient-to-r from-card/50 to-card border-border/50 backdrop-blur-sm',
        deal: 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20',
        premium:
          'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20',
        glass:
          'bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border-white/20 dark:border-gray-700/20',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      rounded: {
        default: 'rounded-lg',
        sm: 'rounded-md',
        lg: 'rounded-xl',
        full: 'rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
);

// AI-generated TypeScript interfaces with comprehensive flight data support
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether the card is in a loading state
   */
  loading?: boolean;
  /**
   * Whether the card is selected (for flight selection)
   */
  selected?: boolean;
  /**
   * Whether the card is disabled
   */
  disabled?: boolean;
  /**
   * Flight-specific props for enhanced functionality
   */
  flightData?: {
    price?: number;
    currency?: string;
    savings?: number;
    confidence?: number;
    trending?: boolean;
  };
  /**
   * Callback for card interactions
   */
  onSelect?: () => void;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

// AI-generated component with full accessibility and flight optimization
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      loading = false,
      selected = false,
      disabled = false,
      flightData,
      onSelect,
      ariaLabel,
      children,
      ...props
    },
    ref
  ) => {
    // AI-suggested conditional styling based on state
    const cardClasses = cn(
      cardVariants({ variant, size, rounded }),
      {
        'opacity-50 cursor-not-allowed': disabled,
        'ring-2 ring-primary ring-offset-2': selected,
        'animate-pulse': loading,
        'hover:scale-[1.02] active:scale-[0.98]':
          variant === 'interactive' && !disabled,
        'border-emerald-500/50 shadow-emerald-500/20':
          flightData?.savings && flightData.savings > 0,
        'border-amber-500/50 shadow-amber-500/20': flightData?.trending,
      },
      className
    );

    // AI-generated accessibility attributes
    const accessibilityProps = {
      role: onSelect ? 'button' : undefined,
      tabIndex: onSelect && !disabled ? 0 : undefined,
      'aria-label': ariaLabel,
      'aria-selected': selected,
      'aria-disabled': disabled,
      'aria-busy': loading,
      onKeyDown: onSelect
        ? (e: React.KeyboardEvent) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              onSelect();
            }
          }
        : undefined,
      onClick: onSelect && !disabled ? onSelect : undefined,
    };

    return (
      <div ref={ref} className={cardClasses} {...accessibilityProps} {...props}>
        {/* AI-generated loading skeleton */}
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        ) : (
          <>
            {/* AI-suggested flight data overlay */}
            {flightData && (
              <div className="absolute top-2 right-2 flex gap-1">
                {flightData.trending && (
                  <div className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Trending
                  </div>
                )}
                {flightData.savings && flightData.savings > 0 && (
                  <div className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
                    Save ${flightData.savings}
                  </div>
                )}
                {flightData.confidence && flightData.confidence > 90 && (
                  <div className="bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    {flightData.confidence}% Confident
                  </div>
                )}
              </div>
            )}
            {children}
          </>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// AI-generated sub-components for common card layouts
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

// AI-generated flight-specific card variants
const FlightCard = forwardRef<HTMLDivElement, CardProps>(
  ({ flightData, children, ...props }, ref) => (
    <Card
      ref={ref}
      variant="flight"
      className="relative overflow-hidden"
      flightData={flightData}
      {...props}
    >
      {children}
    </Card>
  )
);
FlightCard.displayName = 'FlightCard';

const DealCard = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card
      ref={ref}
      variant="deal"
      className="relative overflow-hidden border-emerald-500/30"
      {...props}
    >
      {children}
    </Card>
  )
);
DealCard.displayName = 'DealCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  FlightCard,
  DealCard,
  cardVariants,
};

// AI-generated TypeScript exports for better intellisense
export type { CardProps };
