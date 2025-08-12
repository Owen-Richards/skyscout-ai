/**
 * Flight Domain - Business Logic Layer
 *
 * This module encapsulates all flight-related business logic following Domain-Driven Design principles.
 * It provides a clean separation between business rules and infrastructure concerns.
 */

import { z } from 'zod';

// Value Objects
export const AirportCode = z
  .string()
  .length(3)
  .regex(/^[A-Z]{3}$/);
export const FlightClass = z.enum([
  'economy',
  'premium_economy',
  'business',
  'first',
]);
export const Currency = z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']);

// Domain Entities
export const FlightSearchCriteria = z.object({
  origin: AirportCode,
  destination: AirportCode,
  departureDate: z.string().datetime(),
  returnDate: z.string().datetime().optional(),
  passengers: z.number().min(1).max(9),
  class: FlightClass.default('economy'),
  currency: Currency.default('USD'),
  maxStops: z.number().min(0).max(3).optional(),
  preferredAirlines: z.array(z.string()).optional(),
  maxPrice: z.number().positive().optional(),
});

export const Price = z.object({
  amount: z.number().positive(),
  currency: Currency,
  displayText: z.string(),
});

export const Segment = z.object({
  id: z.string(),
  origin: AirportCode,
  destination: AirportCode,
  departure: z.string().datetime(),
  arrival: z.string().datetime(),
  airline: z.string(),
  flightNumber: z.string(),
  aircraft: z.string().optional(),
  duration: z.number().positive(), // minutes
  class: FlightClass,
});

export const Flight = z.object({
  id: z.string(),
  segments: z.array(Segment).min(1),
  price: Price,
  availability: z.number().min(0),
  bookingUrl: z.string().url().optional(),
  amenities: z.array(z.string()).optional(),
  baggagePolicy: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  totalDuration: z.number().positive(), // minutes
  stops: z.number().min(0),
  score: z.number().min(0).max(100), // relevance score
});

export const FlightSearchResult = z.object({
  flights: z.array(Flight),
  totalResults: z.number().min(0),
  searchId: z.string(),
  searchTime: z.number().positive(),
  filters: z.object({
    airlines: z.array(z.string()),
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
    durationRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
    stops: z.array(z.number()),
  }),
});

// Passenger type for booking
export const Passenger = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().datetime(),
  passportNumber: z.string().optional(),
  nationality: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specialRequests: z.array(z.string()).optional(),
});

export const FlightComparison = z.object({
  flights: z.array(Flight),
  bestPrice: Flight,
  bestDuration: Flight,
  bestOverall: Flight,
  analysis: z.object({
    averagePrice: z.number(),
    averageDuration: z.number(),
    priceRange: z.object({ min: z.number(), max: z.number() }),
    durationRange: z.object({ min: z.number(), max: z.number() }),
  }),
});

// Domain Services
export interface IFlightSearchService {
  search(criteria: FlightSearchCriteria): Promise<FlightSearchResult>;
  getFlightDetails(flightId: string): Promise<Flight>;
  trackPrices(criteria: FlightSearchCriteria): Promise<string>; // Returns tracking ID
}

export interface IFlightBookingService {
  checkAvailability(flightId: string): Promise<boolean>;
  createBooking(flightId: string, passengers: Passenger[]): Promise<string>; // Returns booking ID
  getBookingStatus(bookingId: string): Promise<string>;
}

export interface IFlightComparisonService {
  compareFlights(flightIds: string[]): Promise<FlightComparison>;
  getRanking(flights: Flight[]): Flight[];
  getRecommendations(criteria: FlightSearchCriteria): Promise<Flight[]>;
}

// Domain Events
export interface FlightSearchedEvent {
  type: 'FLIGHT_SEARCHED';
  criteria: FlightSearchCriteria;
  resultCount: number;
  timestamp: Date;
  userId?: string;
}

export interface FlightBookedEvent {
  type: 'FLIGHT_BOOKED';
  flightId: string;
  bookingId: string;
  price: Price;
  timestamp: Date;
  userId: string;
}

export interface PriceAlertEvent {
  type: 'PRICE_ALERT';
  flightId: string;
  oldPrice: Price;
  newPrice: Price;
  timestamp: Date;
  userId: string;
}

// Type Exports
export type FlightSearchCriteria = z.infer<typeof FlightSearchCriteria>;
export type Flight = z.infer<typeof Flight>;
export type FlightSearchResult = z.infer<typeof FlightSearchResult>;
export type Price = z.infer<typeof Price>;
export type Segment = z.infer<typeof Segment>;
export type FlightClass = z.infer<typeof FlightClass>;
export type Currency = z.infer<typeof Currency>;
export type Passenger = z.infer<typeof Passenger>;
export type FlightComparison = z.infer<typeof FlightComparison>;

// Business Rules
export class FlightDomainRules {
  static validateSearchCriteria(criteria: FlightSearchCriteria): string[] {
    const errors: string[] = [];

    // Business rule: Departure date must be in the future
    if (new Date(criteria.departureDate) <= new Date()) {
      errors.push('Departure date must be in the future');
    }

    // Business rule: Return date must be after departure date
    if (
      criteria.returnDate &&
      new Date(criteria.returnDate) <= new Date(criteria.departureDate)
    ) {
      errors.push('Return date must be after departure date');
    }

    // Business rule: Origin and destination cannot be the same
    if (criteria.origin === criteria.destination) {
      errors.push('Origin and destination cannot be the same');
    }

    return errors;
  }

  static calculateTotalDuration(segments: Segment[]): number {
    return segments.reduce((total, segment) => total + segment.duration, 0);
  }

  static calculateStops(segments: Segment[]): number {
    return Math.max(0, segments.length - 1);
  }

  static isDirectFlight(flight: Flight): boolean {
    return flight.segments.length === 1;
  }

  static canBook(flight: Flight): boolean {
    return flight.availability > 0 && !!flight.bookingUrl;
  }
}

// Domain Utilities
export class FlightUtils {
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  static formatPrice(price: Price): string {
    return price.displayText || `${price.currency} ${price.amount.toFixed(2)}`;
  }

  static getAirlineName(code: string): string {
    // This would typically come from a service/database
    const airlineMap: Record<string, string> = {
      AA: 'American Airlines',
      DL: 'Delta Air Lines',
      UA: 'United Airlines',
      BA: 'British Airways',
      LH: 'Lufthansa',
      // Add more as needed
    };
    return airlineMap[code] || code;
  }

  static sortFlightsByPrice(flights: Flight[], ascending = true): Flight[] {
    return [...flights].sort((a, b) => {
      const comparison = a.price.amount - b.price.amount;
      return ascending ? comparison : -comparison;
    });
  }

  static sortFlightsByDuration(flights: Flight[], ascending = true): Flight[] {
    return [...flights].sort((a, b) => {
      const comparison = a.totalDuration - b.totalDuration;
      return ascending ? comparison : -comparison;
    });
  }

  static filterByStops(flights: Flight[], maxStops: number): Flight[] {
    return flights.filter(flight => flight.stops <= maxStops);
  }

  static filterByPriceRange(
    flights: Flight[],
    minPrice: number,
    maxPrice: number
  ): Flight[] {
    return flights.filter(
      flight =>
        flight.price.amount >= minPrice && flight.price.amount <= maxPrice
    );
  }
}
