/**
 * Advanced Search Form Component
 * Following SOLID principles and Clean Code practices
 *
 * - Single Responsibility: Only handles search form presentation
 * - Open/Closed: Easy to extend with new field types
 * - Liskov Substitution: Field components are interchangeable
 * - Interface Segregation: Each field has specific props
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 */

'use client';

import { Search, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { Button, Card } from '@skyscout/ui';
import { LocationField, DateField, PassengerField } from '../fields';
import { useSearchForm } from '../../../hooks/use-search-form';
import type { SearchResult } from '../../../services/search.service';

interface AdvancedSearchFormProps {
  readonly className?: string;
  readonly onSearchResults?: (results: SearchResult) => void;
  readonly showAdvancedOptions?: boolean;
}

export function AdvancedSearchForm({
  className,
  onSearchResults,
  showAdvancedOptions = false,
}: AdvancedSearchFormProps) {
  const {
    criteria,
    formState,
    locationSuggestions,
    canSubmit,
    updateField,
    searchLocations,
    submitSearch,
    resetForm,
    swapLocations,
  } = useSearchForm({
    onSearchComplete: onSearchResults,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitSearch();
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  // Calculate minimum return date (day after departure)
  const minReturnDate = criteria.departureDate
    ? new Date(new Date(criteria.departureDate).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    : minDate;

  return (
    <Card className={`p-6 w-full max-w-6xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Find Your Perfect Flight
          </h2>
          <p className="text-muted-foreground">
            Search across hundreds of airlines to find the best deals
          </p>
        </div>

        {/* Trip Type Selector */}
        <div className="flex justify-center gap-2">
          <Button
            type="button"
            variant={criteria.tripType === 'round-trip' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateField('tripType', 'round-trip')}
          >
            Round Trip
          </Button>
          <Button
            type="button"
            variant={criteria.tripType === 'one-way' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateField('tripType', 'one-way')}
          >
            One Way
          </Button>
          <Button
            type="button"
            variant={criteria.tripType === 'multi-city' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateField('tripType', 'multi-city')}
          >
            Multi-City
          </Button>
        </div>

        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="relative">
            <LocationField
              type="origin"
              label="From"
              placeholder="Departure city"
              value={typeof criteria.origin === 'string' ? criteria.origin : ''}
              onChange={value => updateField('origin', value)}
              suggestions={locationSuggestions.origin}
              onSearch={query => searchLocations(query, 'origin')}
              error={formState.errors.origin}
              required
            />

            {/* Swap Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={swapLocations}
              className="absolute -right-2 top-8 z-10 h-8 w-8 p-0 bg-background border border-border hover:bg-muted"
              aria-label="Swap origin and destination"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Destination */}
          <LocationField
            type="destination"
            label="To"
            placeholder="Destination city"
            value={
              typeof criteria.destination === 'string'
                ? criteria.destination
                : ''
            }
            onChange={value => updateField('destination', value)}
            suggestions={locationSuggestions.destination}
            onSearch={query => searchLocations(query, 'destination')}
            error={formState.errors.destination}
            required
          />

          {/* Departure Date */}
          <DateField
            type="departure"
            label="Departure"
            value={criteria.departureDate}
            onChange={value => updateField('departureDate', value)}
            min={minDate}
            error={formState.errors.departureDate}
            required
          />

          {/* Return Date */}
          {criteria.tripType === 'round-trip' && (
            <DateField
              type="return"
              label="Return"
              value={criteria.returnDate || ''}
              onChange={value => updateField('returnDate', value)}
              min={minReturnDate}
              error={formState.errors.returnDate}
            />
          )}

          {/* Passengers */}
          <PassengerField
            label="Passengers"
            value={criteria.passengers}
            onChange={value => updateField('passengers', value)}
            error={formState.errors.passengers}
          />
        </div>

        {/* Advanced Options */}
        {showAdvancedOptions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Class
              </label>
              <select
                value={criteria.filters.class}
                onChange={e =>
                  updateField('filters', {
                    ...criteria.filters,
                    class: e.target.value as
                      | 'economy'
                      | 'premium'
                      | 'business'
                      | 'first',
                  })
                }
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stops
              </label>
              <select
                value={criteria.filters.stops}
                onChange={e =>
                  updateField('filters', {
                    ...criteria.filters,
                    stops: e.target.value as 'any' | 'nonstop' | '1-stop',
                  })
                }
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="any">Any number of stops</option>
                <option value="nonstop">Non-stop only</option>
                <option value="1-stop">1 stop or fewer</option>
              </select>
            </div>
          </div>
        )}

        {/* Error Display */}
        {formState.errors.general && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">
              {formState.errors.general}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={formState.isLoading}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <Button
            type="submit"
            variant="flight-action"
            disabled={!canSubmit}
            loading={formState.isLoading}
            className="gap-2 min-w-32 relative overflow-hidden"
          >
            <Search className="h-4 w-4" />
            {formState.isLoading ? 'Searching...' : 'Search Flights'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
