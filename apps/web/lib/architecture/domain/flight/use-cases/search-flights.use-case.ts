/**
 * Search Flights Use Case
 * Application layer use case following clean architecture
 */

import { Flight } from '../entities/flight.entity';
import { Airport, Price } from '../value-objects';

export interface FlightSearchCriteria {
  readonly origin: Airport;
  readonly destination: Airport;
  readonly departureDate: Date;
  readonly returnDate?: Date;
  readonly passengers: {
    readonly adults: number;
    readonly children: number;
    readonly infants: number;
  };
  readonly cabin: 'economy' | 'premium_economy' | 'business' | 'first';
  readonly maxPrice?: Price;
  readonly preferredAirlines?: string[];
  readonly maxStops?: number;
}

export interface FlightSearchResult {
  readonly flights: Flight[];
  readonly totalResults: number;
  readonly searchTime: number;
  readonly suggestions: string[];
}

// Port (Interface) for external flight search service
export interface IFlightSearchPort {
  search(criteria: FlightSearchCriteria): Promise<FlightSearchResult>;
}

// Use Case Implementation
export class SearchFlightsUseCase {
  constructor(private readonly flightSearchPort: IFlightSearchPort) {}

  async execute(criteria: FlightSearchCriteria): Promise<FlightSearchResult> {
    // Validate input
    this.validateSearchCriteria(criteria);

    // Execute search through port
    const searchResult = await this.flightSearchPort.search(criteria);

    // Apply business rules and enhancements
    const enhancedResult = this.enhanceSearchResults(searchResult, criteria);

    return enhancedResult;
  }

  private validateSearchCriteria(criteria: FlightSearchCriteria): void {
    if (criteria.departureDate < new Date()) {
      throw new Error('Departure date cannot be in the past');
    }

    if (criteria.returnDate && criteria.returnDate <= criteria.departureDate) {
      throw new Error('Return date must be after departure date');
    }

    if (criteria.passengers.adults < 1) {
      throw new Error('At least one adult passenger is required');
    }

    const totalPassengers =
      criteria.passengers.adults +
      criteria.passengers.children +
      criteria.passengers.infants;

    if (totalPassengers > 9) {
      throw new Error('Maximum 9 passengers allowed');
    }
  }

  private enhanceSearchResults(
    result: FlightSearchResult,
    criteria: FlightSearchCriteria
  ): FlightSearchResult {
    // Sort flights by price by default
    const sortedFlights = result.flights.sort(
      (a, b) => a.price.getAmount() - b.price.getAmount()
    );

    // Filter by max price if specified
    const filteredFlights = criteria.maxPrice
      ? sortedFlights.filter(flight =>
          flight.price.isLessThan(criteria.maxPrice!)
        )
      : sortedFlights;

    // Filter by max stops if specified
    const finalFlights =
      criteria.maxStops !== undefined
        ? filteredFlights.filter(flight => flight.stops <= criteria.maxStops!)
        : filteredFlights;

    // Generate suggestions based on search results
    const suggestions = this.generateSuggestions(finalFlights, criteria);

    return {
      flights: finalFlights,
      totalResults: finalFlights.length,
      searchTime: result.searchTime,
      suggestions,
    };
  }

  private generateSuggestions(
    flights: Flight[],
    criteria: FlightSearchCriteria
  ): string[] {
    const suggestions: string[] = [];

    if (flights.length === 0) {
      suggestions.push('Try flexible dates for better options');
      suggestions.push('Consider nearby airports');
      return suggestions;
    }

    const directFlights = flights.filter(f => f.isDirectFlight());
    if (directFlights.length > 0 && directFlights.length < flights.length) {
      suggestions.push(`${directFlights.length} direct flights available`);
    }

    const avgPrice =
      flights.reduce((sum, f) => sum + f.price.getAmount(), 0) / flights.length;
    const cheapestFlight = flights[0]; // Already sorted by price

    if (cheapestFlight.price.getAmount() < avgPrice * 0.8) {
      suggestions.push('Great deal found - book soon!');
    }

    return suggestions;
  }
}
