import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm',
        outline:
          'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
        success:
          'border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 shadow-sm',
        warning:
          'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800 shadow-sm',
        info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 shadow-sm',
        ghost:
          'border-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Icon to display before the badge text
   */
  icon?: React.ReactNode;
  /**
   * Whether the badge should have a dot indicator
   */
  dot?: boolean;
  /**
   * Badge as a clickable element
   */
  interactive?: boolean;
}

interface BadgeButtonProps
  extends Omit<BadgeProps, keyof React.HTMLAttributes<HTMLDivElement>>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, icon, dot, interactive, children, ...props },
    ref
  ) => {
    if (interactive) {
      const buttonProps = props as unknown as BadgeButtonProps;
      return (
        <button
          className={cn(
            badgeVariants({ variant, size }),
            'cursor-pointer hover:scale-105 active:scale-95',
            className
          )}
          {...buttonProps}
        >
          {dot && (
            <span
              className={cn(
                'mr-1.5 h-2 w-2 rounded-full',
                variant === 'default' && 'bg-primary-foreground',
                variant === 'secondary' && 'bg-secondary-foreground',
                variant === 'destructive' && 'bg-destructive-foreground',
                variant === 'success' && 'bg-green-600 dark:bg-green-400',
                variant === 'warning' && 'bg-amber-600 dark:bg-amber-400',
                variant === 'info' && 'bg-blue-600 dark:bg-blue-400',
                variant === 'outline' && 'bg-foreground',
                variant === 'ghost' && 'bg-foreground'
              )}
              aria-hidden="true"
            />
          )}
          {icon && (
            <span className="mr-1 h-3 w-3" aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              variant === 'default' && 'bg-primary-foreground',
              variant === 'secondary' && 'bg-secondary-foreground',
              variant === 'destructive' && 'bg-destructive-foreground',
              variant === 'success' && 'bg-green-600 dark:bg-green-400',
              variant === 'warning' && 'bg-amber-600 dark:bg-amber-400',
              variant === 'info' && 'bg-blue-600 dark:bg-blue-400',
              variant === 'outline' && 'bg-foreground',
              variant === 'ghost' && 'bg-foreground'
            )}
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="mr-1 h-3 w-3" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
