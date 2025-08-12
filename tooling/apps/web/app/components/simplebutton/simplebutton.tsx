/**
 * Simplebutton Component
 * Feature-specific component with business logic
 */

import { ComponentProps, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@skyscout/ui';

// Component variants using class-variance-authority
const simplebuttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Component props interface
export interface SimplebuttonProps
  extends ComponentProps<'div'>,
    VariantProps<typeof simplebuttonVariants> {
  /**
   * Additional custom props for Simplebutton
   */
  loading?: boolean;
  /**
   * Icon to display (optional)
   */
  icon?: React.ReactNode;
  /**
   * Callback when action is performed
   */
  onAction?: () => void;
}

// Component implementation with forwardRef for proper ref handling
export const Simplebutton = forwardRef<
  HTMLElementTagNameMap['div'],
  SimplebuttonProps
>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      icon,
      onAction,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && !loading && onAction) {
        onAction();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(simplebuttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    );
  }
);

Simplebutton.displayName = 'Simplebutton';

// Export variants for external use
export { simplebuttonVariants };
export type { SimplebuttonProps };
