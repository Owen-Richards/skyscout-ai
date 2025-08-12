/**
 * Refactored Flight Filters Component
 *
 * Now follows Single Responsibility Principle:
 * - Uses custom hook for state management
 * - Composed of smaller, focused components
 * - Reduced complexity from 42 to ~8
 */

'use client';

import { Button, cn } from '@skyscout/ui';
import { Clock, Filter, Navigation, Plane, X } from 'lucide-react';
import { useEffect } from 'react';

// Domain imports
import {
  useFlightFilters,
  type FilterValues,
} from '../../hooks/use-flight-filters';
import {
  AIRLINE_OPTIONS,
  FILTER_PRESETS,
  STOP_OPTIONS,
  TIME_OPTIONS,
} from '../../types/filter-data';

// Component imports
import { FilterPresets } from './filter-presets';
import { OptionsFilter } from './options-filter';
import { PriceRangeFilter } from './price-range-filter';

interface FlightFiltersProps {
  onFiltersChange: (filters: FilterValues) => void;
  className?: string;
}

export function FlightFilters({
  onFiltersChange,
  className,
}: FlightFiltersProps) {
  const {
    activeFilters,
    priceRange,
    setPriceRange,
    expandedSections,
    updateFilter,
    applyPreset,
    clearFilters,
    toggleSection,
    getActiveFilterCount,
  } = useFlightFilters(onFiltersChange);

  // Update parent when filters change
  useEffect(() => {
    onFiltersChange({ ...activeFilters, priceRange });
  }, [activeFilters, priceRange, onFiltersChange]);

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <span className="text-sm text-muted-foreground">
              ({getActiveFilterCount()} active)
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Quick Filter Presets */}
      <FilterPresets presets={FILTER_PRESETS} onPresetSelect={applyPreset} />

      {/* Price Range Filter */}
      <PriceRangeFilter
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        isExpanded={expandedSections.has('price')}
        onToggle={() => toggleSection('price')}
      />

      {/* Stops Filter */}
      <OptionsFilter
        title="Stops"
        icon={Navigation}
        options={STOP_OPTIONS}
        selectedValues={activeFilters.stops || []}
        onOptionToggle={optionId => updateFilter('stops', optionId)}
        isExpanded={expandedSections.has('stops')}
        onToggle={() => toggleSection('stops')}
      />

      {/* Airlines Filter */}
      <OptionsFilter
        title="Airlines"
        icon={Plane}
        options={AIRLINE_OPTIONS}
        selectedValues={activeFilters.airlines || []}
        onOptionToggle={optionId => updateFilter('airlines', optionId)}
        isExpanded={expandedSections.has('airlines')}
        onToggle={() => toggleSection('airlines')}
      />

      {/* Departure Time Filter */}
      <OptionsFilter
        title="Departure Time"
        icon={Clock}
        options={TIME_OPTIONS}
        selectedValues={activeFilters.departureTime || []}
        onOptionToggle={optionId => updateFilter('departureTime', optionId)}
        isExpanded={expandedSections.has('departureTime')}
        onToggle={() => toggleSection('departureTime')}
      />
    </div>
  );
}
