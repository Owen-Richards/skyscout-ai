import * as React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../lib/utils';
import { Input, InputProps } from './input';

/**
 * Form context type
 */
export interface FormContextType {
  formId: string;
}

/**
 * Field render props
 */
export interface FieldRenderProps {
  name: string;
  value: unknown;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

/**
 * Root form component props
 */
export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /**
   * Form validation schema (Zod)
   */
  schema?: z.ZodSchema;
  /**
   * Default form values
   */
  defaultValues?: Record<string, unknown>;
  /**
   * Form submission handler
   */
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  /**
   * Form mode (controlled by react-hook-form)
   */
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
  /**
   * Revalidate mode
   */
  reValidateMode?: 'onSubmit' | 'onBlur' | 'onChange';
}

/**
 * Form root component with react-hook-form integration
 */
const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      className,
      children,
      schema: _schema,
      defaultValues = {},
      onSubmit,
      mode = 'onSubmit',
      reValidateMode = 'onChange',
      id,
      ...props
    },
    ref
  ) => {
    const formId = id || React.useId();

    const methods = useForm({
      // Note: zodResolver integration can be added later with proper type setup
      defaultValues,
      mode,
      reValidateMode,
    });

    const handleSubmit = async (data: Record<string, unknown>) => {
      if (onSubmit) {
        try {
          await onSubmit(data);
        } catch (error) {
          console.error('Form submission error:', error);
          // You can add global error handling here
        }
      }
    };

    return (
      <FormProvider {...methods}>
        <form
          ref={ref}
          id={formId}
          className={cn('space-y-4', className)}
          onSubmit={methods.handleSubmit(handleSubmit)}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormProvider>
    );
  }
);

Form.displayName = 'Form';

/**
 * Form field wrapper component props
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Field name (must match schema field)
   */
  name: string;
  /**
   * Field description/helper text
   */
  description?: string;
  /**
   * Whether field is required
   */
  required?: boolean;
  /**
   * Custom render function for field
   */
  render?: (field: FieldRenderProps) => React.ReactNode;
}

/**
 * Form field wrapper with validation integration
 */
const FormField: React.FC<FormFieldProps> = ({
  name,
  description,
  render,
  className,
  children,
  ...divProps
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const fieldError = errors[name];
  const fieldValue = watch(name);
  const registration = register(name);

  const field: FieldRenderProps = {
    name,
    value: fieldValue,
    onChange: registration.onChange,
    onBlur: registration.onBlur,
    error: fieldError?.message as string | undefined,
  };

  return (
    <div {...divProps} className={cn('space-y-2', className)}>
      {render ? render(field) : children}
      {description && !fieldError && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';

/**
 * Form input component that integrates with form context
 */
export interface FormInputProps extends Omit<InputProps, 'name' | 'error'> {
  /**
   * Field name (must match schema field)
   */
  name: string;
  /**
   * Field description/helper text
   */
  description?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, description, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const fieldError = errors[name];
    const { ref: registerRef, ...registration } = register(name);

    return (
      <FormField name={name} description={description}>
        <Input
          {...props}
          {...registration}
          name={name}
          ref={e => {
            registerRef(e);
            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              ref.current = e;
            }
          }}
          error={fieldError?.message as string | undefined}
          aria-invalid={fieldError ? 'true' : 'false'}
        />
      </FormField>
    );
  }
);

FormInput.displayName = 'FormInput';

/**
 * Form submit button component
 */
export interface FormSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Loading text to display during submission
   */
  loadingText?: string;
  /**
   * Whether to disable button when form is invalid
   */
  disableOnInvalid?: boolean;
}

const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  (
    {
      children,
      loadingText = 'Submitting...',
      disableOnInvalid = true,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const {
      formState: { isSubmitting, isValid },
    } = useFormContext();

    const isDisabled =
      disabled || isSubmitting || (disableOnInvalid && !isValid);

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'h-10 px-4 py-2',
          className
        )}
        {...props}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

FormSubmit.displayName = 'FormSubmit';

/**
 * Form error display component
 */
export interface FormErrorProps {
  /**
   * Field name to display error for
   */
  name?: string;
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Additional class names
   */
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ name, message, className }) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = name ? errors[name] : null;
  const errorMessage = message || (error?.message as string);

  if (!errorMessage) return null;

  return (
    <p
      className={cn('text-sm text-destructive', className)}
      role="alert"
      aria-live="polite"
    >
      {errorMessage}
    </p>
  );
};

FormError.displayName = 'FormError';

export { Form, FormField, FormInput, FormSubmit, FormError };
