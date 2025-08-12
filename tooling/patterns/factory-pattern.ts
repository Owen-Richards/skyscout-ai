/**
 * Factory Pattern Implementation
 * Provides flexible object creation and configuration
 */

// Abstract Factory Pattern
export interface INotificationFactory {
  createEmailNotification(): INotification;
  createSMSNotification(): INotification;
  createPushNotification(): INotification;
}

export interface INotification {
  send(recipient: string, message: string): Promise<boolean>;
  getType(): string;
}

// Concrete notification implementations
export class EmailNotification implements INotification {
  async send(recipient: string, message: string): Promise<boolean> {
    console.log(`Sending email to ${recipient}: ${message}`);
    // Implement actual email sending logic
    return true;
  }

  getType(): string {
    return 'email';
  }
}

export class SMSNotification implements INotification {
  async send(recipient: string, message: string): Promise<boolean> {
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // Implement actual SMS sending logic
    return true;
  }

  getType(): string {
    return 'sms';
  }
}

export class PushNotification implements INotification {
  async send(recipient: string, message: string): Promise<boolean> {
    console.log(`Sending push notification to ${recipient}: ${message}`);
    // Implement actual push notification logic
    return true;
  }

  getType(): string {
    return 'push';
  }
}

// Concrete factory implementations
export class StandardNotificationFactory implements INotificationFactory {
  createEmailNotification(): INotification {
    return new EmailNotification();
  }

  createSMSNotification(): INotification {
    return new SMSNotification();
  }

  createPushNotification(): INotification {
    return new PushNotification();
  }
}

// Builder Pattern for complex object creation
export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  preferences: {
    class: 'economy' | 'premium_economy' | 'business' | 'first';
    airlines?: string[];
    maxStops?: number;
    budget?: {
      min: number;
      max: number;
      currency: string;
    };
    timePreferences?: {
      preferredDepartureTime?: 'morning' | 'afternoon' | 'evening';
      maxFlightDuration?: number;
    };
  };
  searchOptions: {
    flexibleDates: boolean;
    includeNearbyAirports: boolean;
    sortBy: 'price' | 'duration' | 'departure' | 'arrival';
    sortOrder: 'asc' | 'desc';
  };
}

export class FlightSearchRequestBuilder {
  private request: Partial<FlightSearchRequest> = {
    passengers: { adults: 1, children: 0, infants: 0 },
    preferences: { class: 'economy' },
    searchOptions: {
      flexibleDates: false,
      includeNearbyAirports: false,
      sortBy: 'price',
      sortOrder: 'asc',
    },
  };

  setRoute(origin: string, destination: string): FlightSearchRequestBuilder {
    this.request.origin = origin;
    this.request.destination = destination;
    return this;
  }

  setDepartureDate(date: Date): FlightSearchRequestBuilder {
    this.request.departureDate = date;
    return this;
  }

  setReturnDate(date: Date): FlightSearchRequestBuilder {
    this.request.returnDate = date;
    return this;
  }

  setPassengers(
    adults: number,
    children = 0,
    infants = 0
  ): FlightSearchRequestBuilder {
    this.request.passengers = { adults, children, infants };
    return this;
  }

  setClass(
    flightClass: FlightSearchRequest['preferences']['class']
  ): FlightSearchRequestBuilder {
    if (!this.request.preferences)
      this.request.preferences = { class: 'economy' };
    this.request.preferences.class = flightClass;
    return this;
  }

  setAirlines(airlines: string[]): FlightSearchRequestBuilder {
    if (!this.request.preferences)
      this.request.preferences = { class: 'economy' };
    this.request.preferences.airlines = airlines;
    return this;
  }

  setMaxStops(maxStops: number): FlightSearchRequestBuilder {
    if (!this.request.preferences)
      this.request.preferences = { class: 'economy' };
    this.request.preferences.maxStops = maxStops;
    return this;
  }

  setBudget(
    min: number,
    max: number,
    currency = 'USD'
  ): FlightSearchRequestBuilder {
    if (!this.request.preferences)
      this.request.preferences = { class: 'economy' };
    this.request.preferences.budget = { min, max, currency };
    return this;
  }

  setTimePreferences(
    preferredDepartureTime?: 'morning' | 'afternoon' | 'evening',
    maxFlightDuration?: number
  ): FlightSearchRequestBuilder {
    if (!this.request.preferences)
      this.request.preferences = { class: 'economy' };
    this.request.preferences.timePreferences = {
      preferredDepartureTime,
      maxFlightDuration,
    };
    return this;
  }

  setSearchOptions(
    options: Partial<FlightSearchRequest['searchOptions']>
  ): FlightSearchRequestBuilder {
    const prev = this.request.searchOptions ?? {
      flexibleDates: false,
      includeNearbyAirports: false,
      sortBy: 'price',
      sortOrder: 'asc',
    };
    this.request.searchOptions = {
      flexibleDates: options.flexibleDates ?? prev.flexibleDates,
      includeNearbyAirports:
        options.includeNearbyAirports ?? prev.includeNearbyAirports,
      sortBy: options.sortBy ?? prev.sortBy,
      sortOrder: options.sortOrder ?? prev.sortOrder,
    };
    return this;
  }

  enableFlexibleDates(): FlightSearchRequestBuilder {
    if (!this.request.searchOptions) {
      this.request.searchOptions = {
        flexibleDates: true,
        includeNearbyAirports: false,
        sortBy: 'price',
        sortOrder: 'asc',
      };
    } else {
      this.request.searchOptions.flexibleDates = true;
    }
    return this;
  }

  enableNearbyAirports(): FlightSearchRequestBuilder {
    if (!this.request.searchOptions) {
      this.request.searchOptions = {
        flexibleDates: false,
        includeNearbyAirports: true,
        sortBy: 'price',
        sortOrder: 'asc',
      };
    } else {
      this.request.searchOptions.includeNearbyAirports = true;
    }
    return this;
  }

  sortBy(
    sortBy: FlightSearchRequest['searchOptions']['sortBy'],
    sortOrder: FlightSearchRequest['searchOptions']['sortOrder'] = 'asc'
  ): FlightSearchRequestBuilder {
    if (!this.request.searchOptions) {
      this.request.searchOptions = {
        flexibleDates: false,
        includeNearbyAirports: false,
        sortBy,
        sortOrder,
      };
    } else {
      this.request.searchOptions.sortBy = sortBy;
      this.request.searchOptions.sortOrder = sortOrder;
    }
    return this;
  }

  build(): FlightSearchRequest {
    if (!this.request.origin || !this.request.destination) {
      throw new Error('Origin and destination are required');
    }
    if (!this.request.departureDate) {
      throw new Error('Departure date is required');
    }

    return this.request as FlightSearchRequest;
  }

  reset(): FlightSearchRequestBuilder {
    this.request = {
      passengers: { adults: 1, children: 0, infants: 0 },
      preferences: { class: 'economy' },
      searchOptions: {
        flexibleDates: false,
        includeNearbyAirports: false,
        sortBy: 'price',
        sortOrder: 'asc',
      },
    };
    return this;
  }
}

// Factory Method Pattern
export abstract class SearchEngineFactory {
  abstract createSearchEngine(): ISearchEngine;

  // Template method
  public async performSearch(
    request: FlightSearchRequest
  ): Promise<SearchResult[]> {
    const engine = this.createSearchEngine();
    return await engine.search(request);
  }
}

export interface ISearchEngine {
  search(request: FlightSearchRequest): Promise<SearchResult[]>;
  getName(): string;
}

export interface SearchResult {
  id: string;
  flights: Array<{
    airline: string;
    flightNumber: string;
    departure: Date;
    arrival: Date;
    origin: string;
    destination: string;
    duration: number;
  }>;
  totalPrice: number;
  currency: string;
  totalDuration: number;
  stops: number;
}

export class AmadeusSearchEngine implements ISearchEngine {
  async search(request: FlightSearchRequest): Promise<SearchResult[]> {
    console.log(
      `Searching with Amadeus API for ${request.origin} to ${request.destination}`
    );
    // Implement actual Amadeus API integration
    return [];
  }

  getName(): string {
    return 'Amadeus';
  }
}

export class SabreSearchEngine implements ISearchEngine {
  async search(request: FlightSearchRequest): Promise<SearchResult[]> {
    console.log(
      `Searching with Sabre API for ${request.origin} to ${request.destination}`
    );
    // Implement actual Sabre API integration
    return [];
  }

  getName(): string {
    return 'Sabre';
  }
}

export class AmadeusSearchEngineFactory extends SearchEngineFactory {
  createSearchEngine(): ISearchEngine {
    return new AmadeusSearchEngine();
  }
}

export class SabreSearchEngineFactory extends SearchEngineFactory {
  createSearchEngine(): ISearchEngine {
    return new SabreSearchEngine();
  }
}

// Registry Pattern for dynamic factory selection
export class SearchEngineRegistry {
  private static factories = new Map<string, SearchEngineFactory>();

  static register(name: string, factory: SearchEngineFactory): void {
    this.factories.set(name, factory);
  }

  static getFactory(name: string): SearchEngineFactory | undefined {
    return this.factories.get(name);
  }

  static getAvailableEngines(): string[] {
    return Array.from(this.factories.keys());
  }

  static createEngine(name: string): ISearchEngine | undefined {
    const factory = this.getFactory(name);
    return factory?.createSearchEngine();
  }
}

// Initialize registry
SearchEngineRegistry.register('amadeus', new AmadeusSearchEngineFactory());
SearchEngineRegistry.register('sabre', new SabreSearchEngineFactory());

// Usage examples
export class FlightSearchService {
  constructor(
    private notificationFactory: INotificationFactory,
    private searchEngineRegistry: typeof SearchEngineRegistry
  ) {}

  async searchFlights(
    searchParams: {
      origin: string;
      destination: string;
      departureDate: Date;
      returnDate?: Date;
      passengers?: number;
      class?: 'economy' | 'premium_economy' | 'business' | 'first';
    },
    userId: string
  ): Promise<SearchResult[]> {
    // Build search request using builder pattern
    const requestBuilder = new FlightSearchRequestBuilder()
      .setRoute(searchParams.origin, searchParams.destination)
      .setDepartureDate(searchParams.departureDate)
      .setPassengers(searchParams.passengers || 1);

    if (searchParams.returnDate) {
      requestBuilder.setReturnDate(searchParams.returnDate);
    }

    if (searchParams.class) {
      requestBuilder.setClass(searchParams.class);
    }

    const request = requestBuilder.build();

    // Use factory to get search engines
    const availableEngines = this.searchEngineRegistry.getAvailableEngines();
    const searchPromises = availableEngines.map(engineName => {
      const engine = this.searchEngineRegistry.createEngine(engineName);
      return engine ? engine.search(request) : Promise.resolve([]);
    });

    // Execute searches in parallel
    const results = await Promise.all(searchPromises);
    const allResults = results.flat();

    // Send notification using factory
    const emailNotification =
      this.notificationFactory.createEmailNotification();
    await emailNotification.send(
      userId,
      `Found ${allResults.length} flights from ${searchParams.origin} to ${searchParams.destination}`
    );

    return allResults;
  }
}

// Factory for creating different types of search requests
export class SearchRequestFactory {
  static createQuickSearch(
    origin: string,
    destination: string,
    departureDate: Date
  ): FlightSearchRequest {
    return new FlightSearchRequestBuilder()
      .setRoute(origin, destination)
      .setDepartureDate(departureDate)
      .setClass('economy')
      .setPassengers(1)
      .sortBy('price')
      .build();
  }

  static createFlexibleSearch(
    origin: string,
    destination: string,
    departureDate: Date,
    budget: { min: number; max: number }
  ): FlightSearchRequest {
    return new FlightSearchRequestBuilder()
      .setRoute(origin, destination)
      .setDepartureDate(departureDate)
      .setBudget(budget.min, budget.max)
      .enableFlexibleDates()
      .enableNearbyAirports()
      .sortBy('price')
      .build();
  }

  static createBusinessSearch(
    origin: string,
    destination: string,
    departureDate: Date,
    preferredAirlines: string[]
  ): FlightSearchRequest {
    return new FlightSearchRequestBuilder()
      .setRoute(origin, destination)
      .setDepartureDate(departureDate)
      .setClass('business')
      .setAirlines(preferredAirlines)
      .setMaxStops(1)
      .setTimePreferences('morning')
      .sortBy('departure')
      .build();
  }
}
