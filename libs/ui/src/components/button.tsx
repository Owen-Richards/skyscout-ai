'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap select-none relative overflow-hidden tracking-wide transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed motion-reduce:transition-none',
  {
    variants: {
      variant: {
        // Primary variant using theme variables
        default:
          'bg-primary text-primary-foreground font-medium shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200',

        // Premium gradient variant with theme awareness
        premium:
          'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 dark:from-primary/90 dark:to-primary/70',

        // Glass effect using theme variables
        glass:
          'bg-background/20 backdrop-blur-md border border-border/30 text-foreground font-medium shadow-lg hover:bg-background/30 hover:shadow-xl transition-all duration-200',

        // Soft neumorphism variant with theme awareness
        soft: 'bg-gradient-to-br from-secondary/50 to-secondary/70 text-secondary-foreground font-medium shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)] hover:scale-[1.01] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] active:scale-[0.99]',

        destructive:
          'bg-destructive text-destructive-foreground font-medium shadow-lg hover:bg-destructive/90 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200',

        outline:
          'border-2 border-input bg-background/50 backdrop-blur-sm text-foreground font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200',

        secondary:
          'bg-secondary text-secondary-foreground font-medium shadow-sm hover:bg-secondary/80 hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200',

        ghost:
          'text-foreground font-medium hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] backdrop-blur-sm transition-all duration-200',

        link: 'text-primary font-medium underline-offset-4 hover:underline hover:text-primary/80 hover:scale-[1.02] active:scale-[0.98] tracking-normal transition-all duration-200',

        success:
          'bg-green-600 text-white font-medium shadow-lg hover:bg-green-700 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 dark:bg-green-700 dark:hover:bg-green-600',

        warning:
          'bg-amber-500 text-white font-medium shadow-lg hover:bg-amber-600 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 dark:bg-amber-600 dark:hover:bg-amber-500',

        // Aviation-themed variants with proper theme variables
        'sky-primary':
          'bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:from-sky-300 hover:via-blue-400 hover:to-cyan-500 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 dark:from-sky-500 dark:via-blue-600 dark:to-cyan-700',

        'flight-action':
          'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:from-blue-500 hover:via-indigo-600 hover:to-purple-700 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-900',

        altitude:
          'bg-gradient-to-br from-slate-600 via-blue-700 to-indigo-800 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:from-slate-500 hover:via-blue-600 hover:to-indigo-700 dark:from-slate-700 dark:via-blue-800 dark:to-indigo-900',

        // Sunset/Dawn themed variants with theme awareness
        dawn: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:from-orange-300 hover:via-pink-400 hover:to-purple-500 dark:from-orange-500 dark:via-pink-600 dark:to-purple-700',

        sunset:
          'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:from-yellow-300 hover:via-orange-400 hover:to-red-500 dark:from-yellow-500 dark:via-orange-600 dark:to-red-700',

        // Material Design 3 inspired filled tonal with enhanced styling
        'filled-tonal':
          'bg-secondary/60 text-secondary-foreground font-medium shadow-sm hover:bg-secondary/80 hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] backdrop-blur-sm transition-all duration-200',

        // Enhanced toggle button variant
        toggle:
          'border-2 border-input bg-background/50 backdrop-blur-sm text-foreground font-medium hover:bg-accent hover:text-accent-foreground hover:border-accent data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/50 data-[state=on]:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-200',
      },
      size: {
        // Enhanced default sizes with better typography and spacing
        default:
          'h-10 px-5 py-2.5 text-sm rounded-xl font-medium tracking-wide',
        sm: 'h-8 px-3.5 py-2 text-xs rounded-lg font-medium tracking-wide',
        lg: 'h-12 px-8 py-3.5 text-base rounded-2xl font-medium tracking-wide',
        xl: 'h-14 px-10 py-4 text-lg rounded-2xl font-semibold tracking-wide',

        // Enhanced icon sizes with perfect visual balance
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-12 w-12 rounded-2xl',
        'icon-xl': 'h-14 w-14 rounded-2xl',

        // Touch-friendly sizes with enhanced accessibility
        touch:
          'h-11 px-6 py-3 text-sm rounded-xl min-w-[44px] font-medium tracking-wide',
        'touch-lg':
          'h-12 px-8 py-3.5 text-base rounded-2xl min-w-[48px] font-medium tracking-wide',

        // Compact sizes for dense UIs with improved readability
        compact: 'h-7 px-3 py-1.5 text-xs rounded-lg font-medium',
        'compact-icon': 'h-7 w-7 rounded-lg',

        // Premium sizes for special actions
        premium:
          'h-12 px-9 py-3.5 text-base rounded-2xl font-semibold tracking-wide',
        hero: 'h-16 px-12 py-5 text-xl rounded-3xl font-bold tracking-wide',
      },
      emphasis: {
        // Enhanced emphasis levels with better visual hierarchy
        high: 'font-semibold tracking-wide shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.15)]',
        medium:
          'font-medium tracking-wide shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)]',
        low: 'font-normal tracking-normal shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:shadow-[0_2px_6px_0_rgba(0,0,0,0.08)]',
        none: 'font-normal tracking-normal shadow-none',
      },
      // New visual effect variants
      effect: {
        none: '',
        glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]',
        'glow-warm': 'hover:shadow-[0_0_20px_rgba(251,146,60,0.5)]',
        'glow-success': 'hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]',
        'glow-danger': 'hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]',
        shimmer:
          'relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      emphasis: 'medium',
      effect: 'none',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * Shows a loading spinner and disables interaction
   */
  loading?: boolean;
  /**
   * Icon displayed on the left side of the button text
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon displayed on the right side of the button text
   */
  rightIcon?: React.ReactNode;
  /**
   * Makes the button expand to full width of its container
   */
  fullWidth?: boolean;
  /**
   * Adds Material Design inspired ripple effect on click
   * @default false
   */
  ripple?: boolean;
  /**
   * Toggle state for toggle buttons (used with variant="toggle")
   */
  pressed?: boolean;
  /**
   * Callback when toggle state changes
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Minimum width override for consistent button sizes
   */
  minWidth?: string;
  /**
   * Button shape override with enhanced radius options
   * @default 'default'
   */
  shape?: 'default' | 'rounded' | 'square' | 'pill' | 'organic';
  /**
   * Visual effect variants for enhanced interactivity
   * @default 'none'
   */
  effect?:
    | 'none'
    | 'glow'
    | 'glow-warm'
    | 'glow-success'
    | 'glow-danger'
    | 'shimmer';
  /**
   * Accessibility label for screen readers
   */
  'aria-label'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      emphasis,
      effect,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      fullWidth = false,
      ripple = false,
      pressed,
      onPressedChange,
      minWidth,
      shape = 'default',
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;
    const isToggle = variant === 'toggle';
    const [rippleArray, setRippleArray] = React.useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    // Enhanced shape styles with organic curves
    const shapeStyles = {
      default: '',
      rounded: 'rounded-full',
      square: 'rounded-none',
      pill: 'rounded-full px-8',
      organic:
        'rounded-[2rem_1rem_2rem_1rem] hover:rounded-[1rem_2rem_1rem_2rem] transition-all duration-500',
    };

    // Enhanced ripple effect with better physics
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ripple && !isDisabled) {
          const button = event.currentTarget;
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 1.5; // Larger ripple for better effect
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;

          const newRipple = {
            x,
            y,
            size,
            key: Date.now(),
          };

          setRippleArray(prev => [...prev, newRipple]);

          // Remove ripple after animation with proper timing
          setTimeout(() => {
            setRippleArray(prev => prev.filter(r => r.key !== newRipple.key));
          }, 800);
        }

        // Handle toggle functionality
        if (isToggle && onPressedChange) {
          onPressedChange(!pressed);
        }

        onClick?.(event);
      },
      [ripple, isDisabled, isToggle, pressed, onPressedChange, onClick]
    );

    // Determine loading icon size based on button size
    const getLoadingIconSize = () => {
      if (size === 'sm' || size === 'compact') return 'h-3 w-3';
      if (
        size === 'lg' ||
        size === 'xl' ||
        size === 'premium' ||
        size === 'hero'
      )
        return 'h-5 w-5';
      return 'h-4 w-4';
    };

    // Enhanced accessibility attributes
    const accessibilityProps = {
      'aria-label':
        ariaLabel || (typeof children === 'string' ? children : undefined),
      'aria-disabled': isDisabled,
      'aria-pressed': isToggle ? pressed : undefined,
      'data-state': isToggle ? (pressed ? 'on' : 'off') : undefined,
      role: isToggle ? 'button' : undefined,
    };

    // When using asChild, we need to pass through only the children
    // to avoid React.Children.only errors with Slot
    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, emphasis, effect, className }),
            fullWidth && 'w-full',
            shapeStyles[shape]
          )}
          ref={ref}
          {...accessibilityProps}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, emphasis, effect, className }),
          fullWidth && 'w-full',
          shapeStyles[shape],
          minWidth && `min-w-[${minWidth}]`,
          // Enhanced focus styles
          'focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:ring-offset-4',
          // Improved disabled styles
          isDisabled &&
            'saturate-50 cursor-not-allowed transform-none hover:transform-none hover:shadow-none'
        )}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        style={minWidth ? { minWidth } : undefined}
        {...accessibilityProps}
        {...props}
      >
        {/* Enhanced ripple effect container */}
        {ripple && (
          <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
            {rippleArray.map(ripple => (
              <span
                key={ripple.key}
                className="absolute bg-white/30 rounded-full animate-ping opacity-75"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  animationDuration: '800ms',
                  animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  animationFillMode: 'forwards',
                }}
              />
            ))}
          </span>
        )}

        {/* Enhanced loading state with better visual hierarchy */}
        {loading && (
          <Loader2
            className={cn(
              'animate-spin flex-shrink-0',
              getLoadingIconSize(),
              children ? 'mr-2.5' : '',
              size === 'sm' && children && 'mr-2',
              size === 'lg' && children && 'mr-3',
              size === 'xl' && children && 'mr-3.5'
            )}
            aria-hidden="true"
          />
        )}

        {/* Enhanced left icon with perfect spacing */}
        {!loading && leftIcon && (
          <span
            className={cn(
              'flex-shrink-0 flex items-center justify-center relative z-10',
              children ? 'mr-2.5' : '',
              size === 'sm' && children && 'mr-2',
              size === 'compact' && children && 'mr-1.5',
              size === 'lg' && children && 'mr-3',
              size === 'xl' && children && 'mr-3.5',
              size === 'premium' && children && 'mr-3.5',
              size === 'hero' && children && 'mr-4',
              // Icon size adjustments
              (size === 'sm' || size === 'compact') &&
                '[&>svg]:h-3.5 [&>svg]:w-3.5',
              size === 'default' && '[&>svg]:h-4 [&>svg]:w-4',
              (size === 'lg' || size === 'premium') &&
                '[&>svg]:h-5 [&>svg]:w-5',
              (size === 'xl' || size === 'hero') && '[&>svg]:h-6 [&>svg]:w-6'
            )}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        {/* Enhanced button text content with better typography */}
        {children && (
          <span
            className={cn(
              'relative z-10 flex items-center justify-center',
              'truncate',
              // Enhanced text sizing
              size === 'hero' && 'text-xl font-bold',
              size === 'xl' && 'text-lg font-semibold',
              size === 'premium' && 'text-base font-semibold',
              size === 'lg' && 'text-base font-medium',
              size === 'default' && 'text-sm font-medium',
              size === 'sm' && 'text-xs font-medium',
              size === 'compact' && 'text-xs font-medium'
            )}
          >
            {children}
          </span>
        )}

        {/* Enhanced right icon with perfect spacing */}
        {!loading && rightIcon && (
          <span
            className={cn(
              'flex-shrink-0 flex items-center justify-center relative z-10',
              children ? 'ml-2.5' : '',
              size === 'sm' && children && 'ml-2',
              size === 'compact' && children && 'ml-1.5',
              size === 'lg' && children && 'ml-3',
              size === 'xl' && children && 'ml-3.5',
              size === 'premium' && children && 'ml-3.5',
              size === 'hero' && children && 'ml-4',
              // Icon size adjustments
              (size === 'sm' || size === 'compact') &&
                '[&>svg]:h-3.5 [&>svg]:w-3.5',
              size === 'default' && '[&>svg]:h-4 [&>svg]:w-4',
              (size === 'lg' || size === 'premium') &&
                '[&>svg]:h-5 [&>svg]:w-5',
              (size === 'xl' || size === 'hero') && '[&>svg]:h-6 [&>svg]:w-6'
            )}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
