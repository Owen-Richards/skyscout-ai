/**
 * Search Service Interface
 * Following Dependency Inversion Principle - depend on abstractions, not concretions
 */

import type { FlightSearchCriteria, SearchLocation } from '../types/search';

export interface ISearchService {
  searchLocations(query: string): Promise<SearchLocation[]>;
  validateSearchCriteria(
    criteria: FlightSearchCriteria
  ): Promise<ValidationResult>;
  performSearch(criteria: FlightSearchCriteria): Promise<SearchResult>;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: Record<string, string>;
}

export interface SearchResult {
  readonly results: readonly FlightResult[];
  readonly totalCount: number;
  readonly searchId: string;
}

export interface FlightResult {
  readonly id: string;
  readonly origin: SearchLocation;
  readonly destination: SearchLocation;
  readonly price: number;
  readonly currency: string;
  readonly airline: string;
  readonly duration: string;
  readonly stops: number;
  readonly departureTime: string;
  readonly arrivalTime: string;
}

/**
 * Mock Search Service Implementation
 * In production, this would integrate with actual flight APIs
 */
export class MockSearchService implements ISearchService {
  private readonly mockLocations: SearchLocation[] = [
    {
      code: 'JFK',
      name: 'John F. Kennedy International',
      city: 'New York',
      country: 'USA',
    },
    {
      code: 'LAX',
      name: 'Los Angeles International',
      city: 'Los Angeles',
      country: 'USA',
    },
    { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
    {
      code: 'CDG',
      name: 'Charles de Gaulle',
      city: 'Paris',
      country: 'France',
    },
    {
      code: 'NRT',
      name: 'Narita International',
      city: 'Tokyo',
      country: 'Japan',
    },
    {
      code: 'SYD',
      name: 'Kingsford Smith',
      city: 'Sydney',
      country: 'Australia',
    },
  ];

  async searchLocations(query: string): Promise<SearchLocation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowercaseQuery = query.toLowerCase();
    return this.mockLocations.filter(
      location =>
        location.name.toLowerCase().includes(lowercaseQuery) ||
        location.city.toLowerCase().includes(lowercaseQuery) ||
        location.code.toLowerCase().includes(lowercaseQuery)
    );
  }

  async validateSearchCriteria(
    criteria: FlightSearchCriteria
  ): Promise<ValidationResult> {
    const errors: Record<string, string> = {};

    if (!criteria.origin) {
      errors.origin = 'Origin is required';
    }

    if (!criteria.destination) {
      errors.destination = 'Destination is required';
    }

    if (!criteria.departureDate) {
      errors.departureDate = 'Departure date is required';
    } else {
      const departureDate = new Date(criteria.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (departureDate < today) {
        errors.departureDate = 'Departure date cannot be in the past';
      }
    }

    if (criteria.tripType === 'round-trip' && criteria.returnDate) {
      const departureDate = new Date(criteria.departureDate);
      const returnDate = new Date(criteria.returnDate);

      if (returnDate <= departureDate) {
        errors.returnDate = 'Return date must be after departure date';
      }
    }

    if (criteria.passengers < 1 || criteria.passengers > 9) {
      errors.passengers = 'Passengers must be between 1 and 9';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async performSearch(criteria: FlightSearchCriteria): Promise<SearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock search results
    const results: FlightResult[] = [
      {
        id: '1',
        origin:
          typeof criteria.origin === 'string'
            ? this.mockLocations[0]
            : criteria.origin,
        destination:
          typeof criteria.destination === 'string'
            ? this.mockLocations[1]
            : criteria.destination,
        price: 299,
        currency: 'USD',
        airline: 'SkyScout Airlines',
        duration: '5h 30m',
        stops: 0,
        departureTime: '08:00',
        arrivalTime: '13:30',
      },
    ];

    return {
      results,
      totalCount: results.length,
      searchId: `search_${Date.now()}`,
    };
  }
}
