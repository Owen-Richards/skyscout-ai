/**
 * Passenger Count Field Component
 * Following Single Responsibility Principle - handles only passenger count
 */

'use client';

import { Users, Plus, Minus } from 'lucide-react';
import { Button } from '@skyscout/ui';
import type { SearchFieldProps } from '../../../types/search';

interface PassengerFieldProps extends SearchFieldProps<number> {
  readonly min?: number;
  readonly max?: number;
}

export function PassengerField({
  value,
  onChange,
  label,
  error,
  disabled,
  className,
  min = 1,
  max = 9,
}: PassengerFieldProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const passengerText = value === 1 ? 'passenger' : 'passengers';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <div className="flex items-center border border-input rounded-md pl-10 pr-2 py-2 h-10 bg-background">
          <span className="flex-1 text-sm">
            {value} {passengerText}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDecrement}
              disabled={disabled || value <= min}
              className="h-6 w-6 p-0"
              aria-label="Decrease passenger count"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleIncrement}
              disabled={disabled || value >= max}
              className="h-6 w-6 p-0"
              aria-label="Increase passenger count"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
