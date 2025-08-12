/**
 * Flight Search Hook
 *
 * Custom hook that provides flight search functionality with proper state management,
 * error handling, and caching using React Query patterns.
 */

import { useCallback, useState } from 'react';
import {
  FlightFacade,
  FlightSearchCriteria,
  FlightSearchResult,
} from '../domains/flights';

interface UseFlightSearchReturn {
  searchFlights: (
    criteria: FlightSearchCriteria
  ) => Promise<FlightSearchResult[]>;
  isLoading: boolean;
  error: Error | null;
  results: FlightSearchResult[] | null;
  clearError: () => void;
  clearResults: () => void;
}

export function useFlightSearch(): UseFlightSearchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<FlightSearchResult[] | null>(null);

  const searchFlights = useCallback(async (criteria: FlightSearchCriteria) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would use dependency injection
      // to get the FlightFacade instance
      const flightFacade = getFlightFacade();
      const searchResults = await flightFacade.search(criteria);

      setResults(searchResults);
      return searchResults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Search failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
  }, []);

  return {
    searchFlights,
    isLoading,
    error,
    results,
    clearError,
    clearResults,
  };
}

// Mock implementation - in a real app this would come from a DI container
function getFlightFacade(): FlightFacade {
  return {
    search: async (
      criteria: FlightSearchCriteria
    ): Promise<FlightSearchResult[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return mock flight results
      return [
        {
          id: '1',
          airline: 'SkyScout Airlines',
          flightNumber: 'SS101',
          price: 299,
          duration: '2h 30m',
          departure: {
            airport: criteria.from,
            time: new Date(criteria.departDate.getTime() + 8 * 60 * 60 * 1000), // 8 AM
          },
          arrival: {
            airport: criteria.to,
            time: new Date(
              criteria.departDate.getTime() + 10.5 * 60 * 60 * 1000
            ), // 10:30 AM
          },
        },
        {
          id: '2',
          airline: 'AirConnect',
          flightNumber: 'AC205',
          price: 349,
          duration: '2h 45m',
          departure: {
            airport: criteria.from,
            time: new Date(criteria.departDate.getTime() + 14 * 60 * 60 * 1000), // 2 PM
          },
          arrival: {
            airport: criteria.to,
            time: new Date(
              criteria.departDate.getTime() + 16.75 * 60 * 60 * 1000
            ), // 4:45 PM
          },
        },
      ];
    },
    book: async (_flightId: string): Promise<boolean> => {
      // Simulate booking
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    },
  };
}
