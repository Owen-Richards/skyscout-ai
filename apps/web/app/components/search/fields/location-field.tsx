/**
 * Location Search Field Component
 * Following Single Responsibility Principle - handles only location input
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@skyscout/ui';
import type { SearchFieldProps, SearchLocation } from '../../../types/search';

interface LocationFieldProps
  extends Omit<SearchFieldProps<string>, 'onChange'> {
  readonly onChange: (location: SearchLocation | string) => void;
  readonly suggestions?: readonly SearchLocation[];
  readonly onSearch?: (query: string) => void;
  readonly type: 'origin' | 'destination';
}

export function LocationField({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled,
  required,
  className,
  suggestions = [],
  onSearch,
  type,
}: LocationFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    onSearch?.(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handleSuggestionClick = (location: SearchLocation) => {
    const displayValue = `${location.name} (${location.code})`;
    setInputValue(displayValue);
    onChange(location);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 ${error ? 'border-destructive' : ''}`}
          onFocus={() => setIsOpen(inputValue.length > 0)}
          aria-label={`${type === 'origin' ? 'Departure' : 'Arrival'} location`}
          aria-describedby={error ? `${type}-error` : undefined}
        />
      </div>

      {error && (
        <p id={`${type}-error`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map(location => (
            <button
              key={location.code}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none"
              onClick={() => handleSuggestionClick(location)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">
                    {location.name} ({location.code})
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {location.city}, {location.country}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
