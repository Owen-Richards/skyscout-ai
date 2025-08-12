/**
 * Dependency Injection Container Implementation
 * Enables clean architecture with inversion of control
 */

// Core DI Container
export interface IContainer {
  register<T>(token: string, factory: () => T, singleton?: boolean): void;
  resolve<T>(token: string): T;
  registerSingleton<T>(token: string, factory: () => T): void;
  createScope(): IContainer;
}

export class DIContainer implements IContainer {
  private services = new Map<string, ServiceRegistration>();
  private singletons = new Map<string, unknown>();
  private parent?: IContainer;

  constructor(parent?: IContainer) {
    this.parent = parent;
  }

  register<T>(token: string, factory: () => T, singleton = false): void {
    this.services.set(token, {
      factory: factory as () => unknown,
      singleton,
    });
  }

  registerSingleton<T>(token: string, factory: () => T): void {
    this.register(token, factory, true);
  }

  resolve<T>(token: string): T {
    const registration = this.services.get(token);

    if (!registration) {
      if (this.parent) {
        return this.parent.resolve<T>(token);
      }
      throw new Error(`Service ${token} not registered`);
    }

    if (registration.singleton) {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, registration.factory());
      }
      return this.singletons.get(token) as T;
    }

    return registration.factory() as T;
  }

  createScope(): IContainer {
    return new DIContainer(this);
  }
}

interface ServiceRegistration {
  factory: () => unknown;
  singleton: boolean;
}

// Type definitions for services
export interface IApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface IAnalyticsService {
  track(event: string, data: Record<string, unknown>): Promise<void>;
}

// Decorators for automatic registration
export function Injectable(token?: string) {
  return function <T extends new (...args: unknown[]) => object>(
    constructor: T
  ) {
    const serviceToken = token || constructor.name;

    // Register in global container
    container.register(serviceToken, () => new constructor());

    return constructor;
  };
}

export function Singleton(token?: string) {
  return function <T extends new (...args: unknown[]) => object>(
    constructor: T
  ) {
    const serviceToken = token || constructor.name;

    // Register as singleton in global container
    container.registerSingleton(serviceToken, () => new constructor());

    return constructor;
  };
}

// Global container instance
export const container = new DIContainer();

// Service registration for common dependencies
export function setupDependencies() {
  // API Client
  container.registerSingleton('ApiClient', () => ({
    get: async (url: string) => fetch(url).then(r => r.json()),
    post: async (url: string, data: unknown) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
  }));

  // Cache Service
  container.registerSingleton('CacheService', () => ({
    get: async <T>(key: string): Promise<T | null> => {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    },
    set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
      const expiry = ttl ? Date.now() + ttl * 1000 : null;
      localStorage.setItem(key, JSON.stringify({ value, expiry }));
    },
    delete: async (key: string): Promise<void> => {
      localStorage.removeItem(key);
    },
  }));

  // Analytics Service
  container.registerSingleton('AnalyticsService', () => ({
    track: async (event: string, data: Record<string, unknown>) => {
      console.log(`Analytics: ${event}`, data);
      // Implement actual analytics tracking
    },
  }));
}

// Usage examples
export interface FlightSearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface FlightResult {
  id: string;
  airline: string;
  price: number;
  departure: string;
  arrival: string;
}

export class FlightSearchService {
  constructor(
    private apiClient = container.resolve<IApiClient>('ApiClient'),
    private cache = container.resolve<ICacheService>('CacheService'),
    private analytics = container.resolve<IAnalyticsService>('AnalyticsService')
  ) {}

  async searchFlights(query: FlightSearchQuery): Promise<FlightResult[]> {
    // Implementation using injected dependencies
    const cacheKey = `flights_${JSON.stringify(query)}`;

    const cached = await this.cache.get<FlightResult[]>(cacheKey);
    if (cached) {
      await this.analytics.track('flight_search_cache_hit', { query });
      return cached;
    }

    const results = await this.apiClient.post<FlightResult[]>(
      '/flights/search',
      query
    );
    await this.cache.set(cacheKey, results, 300); // 5 minutes

    await this.analytics.track('flight_search_success', {
      query,
      resultCount: results.length,
    });

    return results;
  }
}

// React Hook for DI
export function useService<T>(token: string): T {
  return container.resolve<T>(token);
}

// Example service usage
export function createFlightSearchHook() {
  return function useFlightSearch() {
    const flightService = useService<FlightSearchService>(
      'FlightSearchService'
    );

    const searchFlights = async (
      query: FlightSearchQuery
    ): Promise<FlightResult[]> => {
      return await flightService.searchFlights(query);
    };

    return { searchFlights };
  };
}
