import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ToggleButtonProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  /**
   * Icon for the toggle button
   */
  icon?: React.ReactNode;
  /**
   * Text label for the toggle button
   */
  label?: string;
  /**
   * Adds a ripple effect on click
   */
  ripple?: boolean;
}

const ToggleButton = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleButtonProps
>(
  (
    { className, variant, size, icon, label, ripple = false, ...props },
    ref
  ) => {
    const [rippleArray, setRippleArray] = React.useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    // Ripple effect handler
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ripple) {
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
      },
      [ripple]
    );

    return (
      <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, size, className }))}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effect container */}
        {ripple && (
          <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
            {rippleArray.map(ripple => (
              <span
                key={ripple.key}
                className="absolute animate-ping bg-current opacity-30 rounded-full"
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

        {/* Icon */}
        {icon && (
          <span
            className={cn(
              'flex-shrink-0 relative z-10',
              label && 'mr-2',
              size === 'sm' && 'mr-1.5',
              size === 'lg' && 'mr-3'
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {/* Label */}
        {label && (
          <span className="text-sm font-medium relative z-10 truncate">
            {label}
          </span>
        )}
      </TogglePrimitive.Root>
    );
  }
);

ToggleButton.displayName = TogglePrimitive.Root.displayName;

export { ToggleButton, toggleVariants };
