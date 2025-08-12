/**
 * Flight Search Infrastructure Adapter
 * Implements the port interface for external flight search APIs
 */

import { Flight } from '../../domain/flight/entities/flight.entity';
import {
  FlightSearchCriteria,
  FlightSearchResult,
  IFlightSearchPort,
} from '../../domain/flight/use-cases/search-flights.use-case';
import { Price } from '../../domain/flight/value-objects';

export class FlightSearchAdapter implements IFlightSearchPort {
  async search(criteria: FlightSearchCriteria): Promise<FlightSearchResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock flight data - in real implementation, this would call external APIs
    const mockFlights = this.generateMockFlights(criteria);

    return {
      flights: mockFlights,
      totalResults: mockFlights.length,
      searchTime: 850, // milliseconds
      suggestions: [],
    };
  }

  private generateMockFlights(criteria: FlightSearchCriteria): Flight[] {
    const flights: Flight[] = [];

    // Generate some mock flights
    const airlines = [
      'United Airlines',
      'Delta Air Lines',
      'American Airlines',
      'Southwest Airlines',
    ];
    const prices = [299, 399, 459, 529, 689];
    const stops = [0, 1, 2];

    for (let i = 0; i < 5; i++) {
      const airline = airlines[i % airlines.length];
      const priceAmount = prices[i % prices.length];
      const flightStops = stops[i % stops.length];

      const flight = Flight.create({
        origin: criteria.origin,
        destination: criteria.destination,
        departureTime: criteria.departureDate,
        arrivalTime: new Date(
          criteria.departureDate.getTime() + (3 + flightStops) * 60 * 60 * 1000
        ), // 3-5 hours flight
        price: Price.create(priceAmount, 'USD'),
        airline,
        flightNumber: `${this.getAirlineCode(airline)}${1000 + i}`,
        aircraft: 'Boeing 737',
        stops: flightStops,
        duration: (3 + flightStops) * 60, // 3-5 hours in minutes
      });

      flights.push(flight);
    }

    return flights;
  }

  private getAirlineCode(airline: string): string {
    const codes: Record<string, string> = {
      'United Airlines': 'UA',
      'Delta Air Lines': 'DL',
      'American Airlines': 'AA',
      'Southwest Airlines': 'WN',
    };
    return codes[airline] || 'XX';
  }
}
