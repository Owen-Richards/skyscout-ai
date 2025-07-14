/**
 * Date Field Component
 * Following Single Responsibility Principle - handles only date input
 */

'use client';

import { Calendar } from 'lucide-react';
import { Input } from '@skyscout/ui';
import type { SearchFieldProps } from '../../../types/search';

interface DateFieldProps extends SearchFieldProps<string> {
  readonly min?: string;
  readonly max?: string;
  readonly type: 'departure' | 'return';
}

export function DateField({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled,
  required,
  className,
  min,
  max,
  type,
}: DateFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="date"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`pl-10 ${error ? 'border-destructive' : ''}`}
          aria-label={`${type === 'departure' ? 'Departure' : 'Return'} date`}
          aria-describedby={error ? `${type}-date-error` : undefined}
        />
      </div>

      {error && (
        <p id={`${type}-date-error`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
