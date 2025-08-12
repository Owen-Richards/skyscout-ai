/**
 * Service Layer Pattern with Dependency Injection
 * Provides clean separation between business logic and UI
 */

import { useCallback } from 'react';

import type {
  AnalyticsService,
  ApiClient,
  CacheService,
} from '../../libs/shared/src/infrastructure/service-interfaces';
import type {
  FlightDetails,
  PriceDataPoint,
} from '../../libs/shared/src/patterns/cqrs-patterns';
import { container } from '../../libs/shared/src/patterns/service-container';

// Flight Search Query type (simplified for this example)
export interface FlightSearchQuery {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  flightClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface IFlightSearchService {
  search(query: FlightSearchQuery): Promise<FlightDetails[]>;
  getDeals(): Promise<FlightDetails[]>;
  getPriceHistory(route: string): Promise<PriceDataPoint[]>;
}

export class FlightSearchService implements IFlightSearchService {
  constructor(
    private apiClient: ApiClient,
    private cache: CacheService,
    private analytics: AnalyticsService
  ) {}

  async search(query: FlightSearchQuery): Promise<FlightDetails[]> {
    // Check cache first
    const cacheKey = this.generateCacheKey(query);
    const cached = await this.cache.get<FlightDetails[]>(cacheKey);

    if (cached) {
      this.analytics.track('flight_search_cache_hit', { query });
      return cached;
    }

    try {
      // Make API call
      const response = await this.apiClient.post<FlightDetails[]>(
        '/flights/search',
        query
      );
      const results = response.data;

      // Cache results
      await this.cache.set(cacheKey, results, 300); // 5 minutes

      // Track search
      this.analytics.track('flight_search_success', {
        query,
        resultCount: results.length,
      });

      return results;
    } catch (error) {
      this.analytics.track('flight_search_error', { query, error });
      throw error;
    }
  }

  async getDeals(): Promise<FlightDetails[]> {
    const cached = await this.cache.get<FlightDetails[]>('flight_deals');
    if (cached) return cached;

    const response =
      await this.apiClient.get<FlightDetails[]>('/flights/deals');
    const deals = response.data;

    await this.cache.set('flight_deals', deals, 600); // 10 minutes
    return deals;
  }

  async getPriceHistory(route: string): Promise<PriceDataPoint[]> {
    const response = await this.apiClient.get<PriceDataPoint[]>(
      `/flights/price-history/${route}`
    );
    return response.data;
  }

  private generateCacheKey(query: FlightSearchQuery): string {
    return `flight_search_${JSON.stringify(query)}`;
  }
}

// Service registration (in app initialization)
container.register(
  'flightSearchService',
  () =>
    new FlightSearchService(
      container.get('apiClient'),
      container.get('cacheService'),
      container.get('analyticsService')
    )
);

// Usage in hooks (example pattern - would need proper state management)
export function useFlightSearch() {
  const flightService = container.get<IFlightSearchService>(
    'flightSearchService'
  );

  const search = useCallback(
    async (query: FlightSearchQuery) => {
      try {
        const results = await flightService.search(query);
        // Handle results (would integrate with state management)
        return results;
      } catch (error) {
        // Handle error (would integrate with state management)
        throw error;
      }
    },
    [flightService]
  );

  return { search };
}
