/**
 * Flight Search Component
 *
 * Modern, domain-driven flight search component following clean architecture principles.
 * Uses the flight domain services and implements the latest React patterns.
 */

'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Form,
} from '@skyscout/ui';
import { AlertCircleIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
  FlightSearchCriteria,
  FlightSearchResult,
} from '../../domains/flights';
import { useFlightSearch } from '../../hooks/use-flight-search';

interface FlightSearchProps {
  className?: string;
  onResults?: (results: FlightSearchResult[]) => void;
  defaultCriteria?: Partial<FlightSearchCriteria>;
}

export function FlightSearch({
  className,
  onResults,
  defaultCriteria,
}: FlightSearchProps) {
  // State management with proper typing
  const [searchCriteria, setSearchCriteria] = useState<
    Partial<FlightSearchCriteria>
  >(defaultCriteria || {});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Custom hook for flight search logic
  const { searchFlights, isLoading, error, results, clearError } =
    useFlightSearch();

  // Memoized validation
  const isValid = useMemo(() => {
    if (
      !searchCriteria.from ||
      !searchCriteria.to ||
      !searchCriteria.departDate
    ) {
      setValidationErrors(['Please fill in all required fields']);
      return false;
    }

    setValidationErrors([]);
    return true;
  }, [searchCriteria]);

  // Handle form submission
  const handleSearch = useCallback(async () => {
    if (!isValid) return;

    try {
      clearError();
      const criteria = searchCriteria as FlightSearchCriteria;
      const searchResults = await searchFlights(criteria);
      onResults?.(searchResults);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, [searchCriteria, isValid, searchFlights, onResults, clearError]);

  // Update search criteria
  const updateCriteria = useCallback(
    (updates: Partial<FlightSearchCriteria>) => {
      setSearchCriteria(prev => ({ ...prev, ...updates }));
    },
    []
  );

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-primary" />
          Search Flights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form className="space-y-6">
          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationField
              label="From"
              value={searchCriteria.from || ''}
              onChange={value => updateCriteria({ from: value })}
              placeholder="Origin airport"
              error={validationErrors.find(e => e.includes('Origin'))}
            />
            <LocationField
              label="To"
              value={searchCriteria.to || ''}
              onChange={value => updateCriteria({ to: value })}
              placeholder="Destination airport"
              error={validationErrors.find(e => e.includes('destination'))}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateField
              label="Departure"
              value={
                searchCriteria.departDate?.toISOString().split('T')[0] || ''
              }
              onChange={value =>
                updateCriteria({
                  departDate: value ? new Date(value) : undefined,
                })
              }
              min={new Date().toISOString().split('T')[0]}
              error={validationErrors.find(e => e.includes('Departure'))}
            />
            <DateField
              label="Return (Optional)"
              value={
                searchCriteria.returnDate?.toISOString().split('T')[0] || ''
              }
              onChange={value =>
                updateCriteria({
                  returnDate: value ? new Date(value) : undefined,
                })
              }
              min={
                searchCriteria.departDate?.toISOString().split('T')[0] ||
                new Date().toISOString().split('T')[0]
              }
              error={validationErrors.find(e => e.includes('Return'))}
            />
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PassengerField
              label="Passengers"
              value={searchCriteria.passengers || 1}
              onChange={value => updateCriteria({ passengers: value })}
            />
            <ClassField
              label="Class"
              value={searchCriteria.class || 'economy'}
              onChange={value =>
                updateCriteria({
                  class: value as 'economy' | 'premium' | 'business' | 'first',
                })
              }
            />
          </div>

          {/* Error Display */}
          {(validationErrors.length > 0 || error) && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <AlertCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Please fix the following issues:
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {error && <li>{error.message}</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <Button
            type="button"
            onClick={handleSearch}
            disabled={!isValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon className="w-4 h-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>
        </Form>

        {/* Results Preview */}
        {results && (
          <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm text-green-800">
              Found {results.length} flights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Supporting Components (would typically be in separate files)
interface LocationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

function LocationField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: LocationFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value.toUpperCase())}
        placeholder={placeholder}
        maxLength={3}
        className={cn(
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  error?: string;
}

function DateField({ label, value, onChange, min, error }: DateFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        className={cn(
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface PassengerFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function PassengerField({ label, value, onChange }: PassengerFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <option key={num} value={num}>
            {num} {num === 1 ? 'Passenger' : 'Passengers'}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ClassFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ClassField({ label, value, onChange }: ClassFieldProps) {
  const classes = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium_economy', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {classes.map(cls => (
          <option key={cls.value} value={cls.value}>
            {cls.label}
          </option>
        ))}
      </select>
    </div>
  );
}
