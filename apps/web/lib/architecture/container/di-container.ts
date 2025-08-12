/**
 * Dependency Injection Container
 * Centralized service registration and resolution
 */

import {
  IFlightSearchPort,
  SearchFlightsUseCase,
} from '../domain/flight/use-cases/search-flights.use-case';
import { FlightSearchAdapter } from '../infrastructure/adapters/flight-search.adapter';

// Service Registry
interface ServiceRegistry {
  // Ports (Interfaces)
  flightSearchPort: IFlightSearchPort;

  // Use Cases
  searchFlightsUseCase: SearchFlightsUseCase;
}

class DIContainer {
  private static instance: DIContainer;
  private services: Partial<ServiceRegistry> = {};

  private constructor() {}

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public register<K extends keyof ServiceRegistry>(
    key: K,
    factory: () => ServiceRegistry[K]
  ): void {
    this.services[key] = factory();
  }

  public resolve<K extends keyof ServiceRegistry>(key: K): ServiceRegistry[K] {
    const service = this.services[key];
    if (!service) {
      throw new Error(`Service ${String(key)} not registered`);
    }
    return service;
  }

  // Bootstrap method to register all services
  public bootstrap(): void {
    // Register adapters (infrastructure)
    this.register('flightSearchPort', () => new FlightSearchAdapter());

    // Register use cases (application layer)
    this.register(
      'searchFlightsUseCase',
      () => new SearchFlightsUseCase(this.resolve('flightSearchPort'))
    );
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Initialize services
container.bootstrap();
