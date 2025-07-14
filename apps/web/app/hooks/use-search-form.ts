/**
 * Search Form Hook
 * Following Single Responsibility Principle - manages only search form state and logic
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  FlightSearchCriteria,
  SearchLocation,
  SearchFormState,
  SearchFilters,
} from '../types/search';
import {
  MockSearchService,
  type ISearchService,
  type SearchResult,
} from '../services/search.service';

interface UseSearchFormProps {
  searchService?: ISearchService;
  onSearchComplete?: (results: SearchResult) => void;
  initialValues?: Partial<FlightSearchCriteria>;
}

export function useSearchForm({
  searchService = new MockSearchService(),
  onSearchComplete,
  initialValues = {},
}: UseSearchFormProps = {}) {
  // Initialize form state with defaults
  const [criteria, setCriteria] = useState<FlightSearchCriteria>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'round-trip',
    filters: {
      class: 'economy',
      stops: 'any',
    },
    ...initialValues,
  });

  const [formState, setFormState] = useState<SearchFormState>({
    isLoading: false,
    errors: {},
    hasBeenSubmitted: false,
  });

  const [locationSuggestions, setLocationSuggestions] = useState<{
    origin: SearchLocation[];
    destination: SearchLocation[];
  }>({
    origin: [],
    destination: [],
  });

  // Field update handler - follows Open/Closed Principle
  const updateField = useCallback(
    <K extends keyof FlightSearchCriteria>(
      field: K,
      value: FlightSearchCriteria[K]
    ) => {
      setCriteria(prev => ({ ...prev, [field]: value }));

      // Clear field-specific errors when user makes changes
      if (formState.errors[field]) {
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: '' },
        }));
      }
    },
    [formState.errors]
  );

  const updateFilters = useCallback((filters: Partial<SearchFilters>) => {
    setCriteria(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  // Location search handler
  const searchLocations = useCallback(
    async (query: string, field: 'origin' | 'destination') => {
      if (query.length < 2) {
        setLocationSuggestions(prev => ({ ...prev, [field]: [] }));
        return;
      }

      try {
        const suggestions = await searchService.searchLocations(query);
        setLocationSuggestions(prev => ({ ...prev, [field]: suggestions }));
      } catch (error) {
        console.error('Failed to search locations:', error);
        setLocationSuggestions(prev => ({ ...prev, [field]: [] }));
      }
    },
    [searchService]
  );

  // Form validation
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      const validation = await searchService.validateSearchCriteria(criteria);

      setFormState(prev => ({
        ...prev,
        errors: validation.errors,
        hasBeenSubmitted: true,
      }));

      return validation.isValid;
    } catch (error) {
      console.error('Validation failed:', error);
      setFormState(prev => ({
        ...prev,
        errors: { general: 'Validation failed. Please try again.' },
        hasBeenSubmitted: true,
      }));
      return false;
    }
  }, [criteria, searchService]);

  // Form submission
  const submitSearch = useCallback(async (): Promise<void> => {
    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setFormState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const results = await searchService.performSearch(criteria);
      onSearchComplete?.(results);

      setFormState(prev => ({
        ...prev,
        isLoading: false,
        errors: {},
      }));
    } catch (error) {
      console.error('Search failed:', error);
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        errors: { general: 'Search failed. Please try again.' },
      }));
    }
  }, [criteria, searchService, onSearchComplete, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setCriteria({
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      tripType: 'round-trip',
      filters: {
        class: 'economy',
        stops: 'any',
      },
    });
    setFormState({
      isLoading: false,
      errors: {},
      hasBeenSubmitted: false,
    });
    setLocationSuggestions({ origin: [], destination: [] });
  }, []);

  // Swap origin and destination
  const swapLocations = useCallback(() => {
    setCriteria(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  }, []);

  // Computed values
  const isValid = useMemo(() => {
    return (
      Object.keys(formState.errors).length === 0 && formState.hasBeenSubmitted
    );
  }, [formState.errors, formState.hasBeenSubmitted]);

  const canSubmit = useMemo(() => {
    return (
      !formState.isLoading &&
      Boolean(criteria.origin && criteria.destination && criteria.departureDate)
    );
  }, [
    formState.isLoading,
    criteria.origin,
    criteria.destination,
    criteria.departureDate,
  ]);

  return {
    // State
    criteria,
    formState,
    locationSuggestions,

    // Computed
    isValid,
    canSubmit,

    // Actions
    updateField,
    updateFilters,
    searchLocations,
    submitSearch,
    resetForm,
    swapLocations,
  };
}
