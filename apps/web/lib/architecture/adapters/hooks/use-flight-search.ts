/**
 * Flight Search React Hook
 * Adapter layer - connects React components to use cases
 */

import { useCallback, useState } from 'react';
import {
  FlightSearchCriteria,
  FlightSearchResult,
  SearchFlightsUseCase,
} from '../../domain/flight/use-cases/search-flights.use-case';
import { FlightSearchAdapter } from '../../infrastructure/adapters/flight-search.adapter';

// DI Container - in a real app this would be injected
const flightSearchAdapter = new FlightSearchAdapter();
const searchFlightsUseCase = new SearchFlightsUseCase(flightSearchAdapter);

interface UseFlightSearchState {
  isLoading: boolean;
  data: FlightSearchResult | null;
  error: string | null;
}

export function useFlightSearch() {
  const [state, setState] = useState<UseFlightSearchState>({
    isLoading: false,
    data: null,
    error: null,
  });

  const searchFlights = useCallback(async (criteria: FlightSearchCriteria) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await searchFlightsUseCase.execute(criteria);
      setState({
        isLoading: false,
        data: result,
        error: null,
      });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      setState({
        isLoading: false,
        data: null,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      data: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    searchFlights,
    clearResults,
  };
}
