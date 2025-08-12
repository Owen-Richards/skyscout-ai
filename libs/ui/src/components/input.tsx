import * as React from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-background text-foreground text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 hover:border-ring/50 focus:border-ring',
  {
    variants: {
      variant: {
        default:
          'border-input bg-background/50 shadow-sm hover:shadow-md hover:bg-background focus-visible:shadow-md focus-visible:bg-background',
        error:
          'border-destructive bg-background/50 focus-visible:ring-destructive shadow-sm shadow-destructive/10 hover:bg-background focus-visible:bg-background',
        success:
          'border-green-500 bg-background/50 focus-visible:ring-green-500 shadow-sm shadow-green-500/10 hover:bg-background focus-visible:bg-background',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * The input label text (for accessibility)
   */
  label?: string;
  /**
   * Error message to display below input
   */
  error?: string;
  /**
   * Helper text to display below input
   */
  helperText?: string;
  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Success state
   */
  success?: boolean;
  /**
   * Required field indicator
   */
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      size,
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      loading = false,
      success = false,
      required = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;

    // Determine variant based on state
    const currentVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors">
              {startIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant, size, className }),
              startIcon && 'pl-10',
              (endIcon || loading) && 'pr-10'
            )}
            ref={ref}
            id={inputId}
            disabled={disabled || loading}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(errorId, helperTextId)}
            aria-required={required}
            {...props}
          />

          {(endIcon || loading) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors">
              {loading ? (
                <div
                  className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
                  role="status"
                  aria-label="Loading"
                />
              ) : (
                endIcon
              )}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-destructive mt-1"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperTextId} className="text-sm text-muted-foreground mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
