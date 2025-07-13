import * as React from 'react';
import { cn } from '../lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-2',
        lg: 'h-11 px-4 py-2',
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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant, size, className }),
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              loading && 'pr-10'
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {loading ? (
                <div
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"
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
