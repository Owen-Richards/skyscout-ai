/**
 * Flight Service Implementation
 *
 * Application layer service that orchestrates flight domain operations.
 * Implements the Facade pattern to simplify complex flight operations.
 */

import {
  Flight,
  FlightComparison,
  FlightDomainRules,
  FlightSearchCriteria,
  FlightSearchResult,
  IFlightBookingService,
  IFlightComparisonService,
  IFlightSearchService,
  Passenger,
} from './domain';

export class FlightSearchService implements IFlightSearchService {
  constructor(
    private apiClient: IFlightApiClient,
    private cacheService: ICacheService,
    private eventBus: IEventBus
  ) {}

  async search(criteria: FlightSearchCriteria): Promise<FlightSearchResult> {
    // Validate business rules
    const validationErrors = FlightDomainRules.validateSearchCriteria(criteria);
    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors);
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(criteria);
    const cached = await this.cacheService.get<FlightSearchResult>(cacheKey);
    if (cached) {
      this.eventBus.emit('FLIGHT_SEARCH_CACHE_HIT', { criteria, cacheKey });
      return cached;
    }

    // Search flights
    const startTime = Date.now();
    const result = await this.apiClient.searchFlights(criteria);
    const searchTime = Date.now() - startTime;

    // Cache results
    await this.cacheService.set(cacheKey, result, { ttl: 300 }); // 5 minutes

    // Emit domain event
    this.eventBus.emit('FLIGHT_SEARCHED', {
      type: 'FLIGHT_SEARCHED',
      criteria,
      resultCount: result.flights.length,
      timestamp: new Date(),
      searchTime,
    });

    return result;
  }

  async getFlightDetails(flightId: string): Promise<Flight> {
    const cacheKey = `flight:details:${flightId}`;
    const cached = await this.cacheService.get<Flight>(cacheKey);
    if (cached) return cached;

    const flight = await this.apiClient.getFlightDetails(flightId);
    await this.cacheService.set(cacheKey, flight, { ttl: 600 }); // 10 minutes

    return flight;
  }

  async trackPrices(criteria: FlightSearchCriteria): Promise<string> {
    const trackingId = await this.apiClient.createPriceAlert(criteria);

    this.eventBus.emit('PRICE_TRACKING_STARTED', {
      trackingId,
      criteria,
      timestamp: new Date(),
    });

    return trackingId;
  }

  private generateCacheKey(criteria: FlightSearchCriteria): string {
    return `flight:search:${JSON.stringify(criteria)}`;
  }
}

export class FlightBookingService implements IFlightBookingService {
  constructor(
    private apiClient: IFlightApiClient,
    private paymentService: IPaymentService,
    private eventBus: IEventBus
  ) {}

  async checkAvailability(flightId: string): Promise<boolean> {
    const availability = await this.apiClient.checkAvailability(flightId);
    return availability > 0;
  }

  async createBooking(
    flightId: string,
    passengers: Passenger[]
  ): Promise<string> {
    // Validate passengers
    this.validatePassengers(passengers);

    // Check availability
    const isAvailable = await this.checkAvailability(flightId);
    if (!isAvailable) {
      throw new FlightNotAvailableError(flightId);
    }

    // Create booking
    const bookingId = await this.apiClient.createBooking({
      flightId,
      passengers,
      timestamp: new Date(),
    });

    // Emit domain event
    this.eventBus.emit('FLIGHT_BOOKING_INITIATED', {
      type: 'FLIGHT_BOOKING_INITIATED',
      flightId,
      bookingId,
      passengerCount: passengers.length,
      timestamp: new Date(),
    });

    return bookingId;
  }

  async getBookingStatus(bookingId: string): Promise<string> {
    return this.apiClient.getBookingStatus(bookingId);
  }

  private validatePassengers(passengers: Passenger[]): void {
    if (passengers.length === 0) {
      throw new ValidationError(['At least one passenger is required']);
    }

    for (const passenger of passengers) {
      if (!passenger.firstName || !passenger.lastName) {
        throw new ValidationError(['Passenger name is required']);
      }
    }
  }
}

export class FlightComparisonService implements IFlightComparisonService {
  constructor(private searchService: FlightSearchService) {}

  async compareFlights(flightIds: string[]): Promise<FlightComparison> {
    if (flightIds.length < 2) {
      throw new ValidationError(['At least 2 flights required for comparison']);
    }

    const flights = await Promise.all(
      flightIds.map(id => this.getFlightDetails(id))
    );

    return this.analyzeFlights(flights);
  }

  getRanking(flights: Flight[]): Flight[] {
    // Implement scoring algorithm
    return flights
      .map(flight => ({
        ...flight,
        score: this.calculateScore(flight),
      }))
      .sort((a, b) => b.score - a.score);
  }

  async getRecommendations(criteria: FlightSearchCriteria): Promise<Flight[]> {
    // This could use ML/AI for personalized recommendations
    const searchResult = await this.searchService.search(criteria);
    return this.getRanking(searchResult.flights).slice(0, 5);
  }

  private async getFlightDetails(_flightId: string): Promise<Flight> {
    // This would delegate to the search service
    throw new Error('Method not implemented');
  }

  private analyzeFlights(flights: Flight[]): FlightComparison {
    const prices = flights.map(f => f.price.amount);
    const durations = flights.map(f => f.totalDuration);

    const bestPrice = flights.reduce((best, current) =>
      current.price.amount < best.price.amount ? current : best
    );

    const bestDuration = flights.reduce((best, current) =>
      current.totalDuration < best.totalDuration ? current : best
    );

    const bestOverall = this.getRanking(flights)[0];

    return {
      flights,
      bestPrice,
      bestDuration,
      bestOverall,
      analysis: {
        averagePrice:
          prices.reduce((sum, price) => sum + price, 0) / prices.length,
        averageDuration:
          durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length,
        priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
        durationRange: {
          min: Math.min(...durations),
          max: Math.max(...durations),
        },
      },
    };
  }

  private calculateScore(flight: Flight): number {
    // Implement scoring algorithm based on:
    // - Price competitiveness
    // - Duration efficiency
    // - Airline rating
    // - Stops penalty
    // - Time of day preferences

    let score = 50; // Base score

    // Price scoring (lower price = higher score)
    // This would need market data for proper scoring
    score += Math.max(0, 30 - flight.price.amount / 100);

    // Duration scoring (shorter = higher score)
    score += Math.max(0, 20 - flight.totalDuration / 60);

    // Stops penalty
    score -= flight.stops * 5;

    // Direct flight bonus
    if (flight.stops === 0) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }
}

// Error Classes
export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(`Validation failed: ${errors.join(', ')}`);
    this.name = 'ValidationError';
  }
}

export class FlightNotAvailableError extends Error {
  constructor(flightId: string) {
    super(`Flight ${flightId} is not available for booking`);
    this.name = 'FlightNotAvailableError';
  }
}

// Infrastructure Interfaces
export interface IFlightApiClient {
  searchFlights(criteria: FlightSearchCriteria): Promise<FlightSearchResult>;
  getFlightDetails(flightId: string): Promise<Flight>;
  checkAvailability(flightId: string): Promise<number>;
  createBooking(booking: FlightBookingRequest): Promise<string>;
  getBookingStatus(bookingId: string): Promise<string>;
  createPriceAlert(criteria: FlightSearchCriteria): Promise<string>;
}

export interface FlightBookingRequest {
  flightId: string;
  passengers: Passenger[];
  timestamp: Date;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface IEventBus {
  emit(event: string, data: Record<string, unknown>): void;
  subscribe(
    event: string,
    handler: (data: Record<string, unknown>) => void
  ): () => void;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  details: Record<string, unknown>;
}

export interface IPaymentService {
  processPayment(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod
  ): Promise<string>;
  refundPayment(paymentId: string, amount?: number): Promise<void>;
}

// Facade for easy consumption
export class FlightFacade {
  constructor(
    private searchService: FlightSearchService,
    private bookingService: FlightBookingService,
    private comparisonService: FlightComparisonService
  ) {}

  // Search operations
  async searchFlights(
    criteria: FlightSearchCriteria
  ): Promise<FlightSearchResult> {
    return this.searchService.search(criteria);
  }

  async getFlightDetails(flightId: string): Promise<Flight> {
    return this.searchService.getFlightDetails(flightId);
  }

  // Booking operations
  async bookFlight(flightId: string, passengers: Passenger[]): Promise<string> {
    return this.bookingService.createBooking(flightId, passengers);
  }

  async checkAvailability(flightId: string): Promise<boolean> {
    return this.bookingService.checkAvailability(flightId);
  }

  // Comparison operations
  async compareFlights(flightIds: string[]): Promise<FlightComparison> {
    return this.comparisonService.compareFlights(flightIds);
  }

  async getRecommendations(criteria: FlightSearchCriteria): Promise<Flight[]> {
    return this.comparisonService.getRecommendations(criteria);
  }

  // Price tracking
  async trackPrices(criteria: FlightSearchCriteria): Promise<string> {
    return this.searchService.trackPrices(criteria);
  }
}
