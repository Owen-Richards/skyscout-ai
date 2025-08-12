/**
 * Flight Filters Hook
 *
 * Custom hook that manages flight filter state and logic
 * Follows Single Responsibility Principle by handling only filter logic
 */

import { useCallback, useState } from 'react';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterValues {
  stops?: string[];
  airlines?: string[];
  departureTime?: string[];
  duration?: string[];
  priceRange?: [number, number];
  [key: string]: string[] | [number, number] | undefined;
}

export interface FilterPreset {
  id: string;
  label: string;
  icon: any;
  filters: Partial<FilterValues>;
}

export function useFlightFilters(
  onFiltersChange: (filters: FilterValues) => void
) {
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'stops', 'airlines'])
  );

  const updateFilter = useCallback(
    (category: keyof FilterValues, value: string, isMultiSelect = true) => {
      setActiveFilters(prev => {
        const newFilters = { ...prev };

        if (isMultiSelect) {
          if (!newFilters[category]) newFilters[category] = [];
          const currentValues = Array.isArray(newFilters[category])
            ? (newFilters[category] as string[])
            : [];

          if (currentValues.includes(value)) {
            const filteredValues = currentValues.filter(
              (v: string) => v !== value
            );
            if (filteredValues.length === 0) {
              delete newFilters[category];
            } else {
              newFilters[category] = filteredValues;
            }
          } else {
            newFilters[category] = [...currentValues, value];
          }
        } else {
          const currentValue = Array.isArray(newFilters[category])
            ? (newFilters[category] as unknown[])?.[0]
            : newFilters[category];
          if (currentValue === value) {
            delete newFilters[category];
          } else {
            newFilters[category] = [value];
          }
        }

        return newFilters;
      });
    },
    []
  );

  const applyPreset = useCallback(
    (preset: FilterPreset) => {
      const newFilters: FilterValues = {};

      Object.entries(preset.filters).forEach(([key, value]) => {
        if (key === 'priceRange' && Array.isArray(value) && value.length >= 2) {
          // Ensure type safety for price range values
          const min = typeof value[0] === 'number' ? value[0] : 0;
          const max = typeof value[1] === 'number' ? value[1] : 1000;
          newFilters.priceRange = [min, max];
          setPriceRange([min, max]);
        } else if (Array.isArray(value)) {
          newFilters[key] = value;
        }
      });

      setActiveFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setPriceRange([0, 2000]);
    onFiltersChange({});
  }, [onFiltersChange]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newSections = new Set(prev);
      if (newSections.has(section)) {
        newSections.delete(section);
      } else {
        newSections.add(section);
      }
      return newSections;
    });
  }, []);

  const getActiveFilterCount = useCallback(() => {
    return Object.keys(activeFilters).length;
  }, [activeFilters]);

  return {
    activeFilters,
    priceRange,
    setPriceRange,
    expandedSections,
    updateFilter,
    applyPreset,
    clearFilters,
    toggleSection,
    getActiveFilterCount,
  };
}
