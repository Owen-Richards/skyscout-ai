/**
 * Modern State Management Architecture
 * Using Zustand for better DX than Redux
 */

// features/flight-search/stores/flight-search.store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { FlightResult, FlightSearchQuery } from '../types';

interface FlightSearchState {
  // State
  query: FlightSearchQuery | null;
  results: FlightResult[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;

  // Actions
  setQuery: (query: FlightSearchQuery) => void;
  setResults: (results: FlightResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;
}

export const useFlightSearchStore = create<FlightSearchState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        query: null,
        results: [],
        isLoading: false,
        error: null,
        filters: {
          maxPrice: null,
          airlines: [],
          departureTime: null,
          stops: 'any',
        },

        // Actions
        setQuery: query =>
          set(state => {
            state.query = query;
            state.error = null;
          }),

        setResults: results =>
          set(state => {
            state.results = results;
            state.isLoading = false;
          }),

        setLoading: loading =>
          set(state => {
            state.isLoading = loading;
          }),

        setError: error =>
          set(state => {
            state.error = error;
            state.isLoading = false;
          }),

        updateFilters: newFilters =>
          set(state => {
            Object.assign(state.filters, newFilters);
          }),

        clearSearch: () =>
          set(state => {
            state.query = null;
            state.results = [];
            state.error = null;
            state.isLoading = false;
          }),
      })),
      {
        name: 'flight-search-store',
        partialize: state => ({
          query: state.query,
          filters: state.filters,
        }),
      }
    ),
    { name: 'FlightSearch' }
  )
);

// Selectors for optimized re-renders
export const useFlightSearchQuery = () =>
  useFlightSearchStore(state => state.query);
export const useFlightSearchResults = () =>
  useFlightSearchStore(state => state.results);
export const useFlightSearchLoading = () =>
  useFlightSearchStore(state => state.isLoading);
export const useFlightSearchError = () =>
  useFlightSearchStore(state => state.error);
export const useFlightSearchFilters = () =>
  useFlightSearchStore(state => state.filters);

// Usage in components
export function SearchForm() {
  const { setQuery, setLoading } = useFlightSearchStore();
  const isLoading = useFlightSearchLoading();

  const handleSearch = async (formData: FlightSearchQuery) => {
    setLoading(true);
    setQuery(formData);
    // Search logic handled by service layer
  };
}
