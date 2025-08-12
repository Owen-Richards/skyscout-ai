/**
 * Flight Search Types
 */

export interface FlightSearchCriteria {
  from: string;
  to: string;
  departDate: Date;
  returnDate?: Date;
  passengers: number;
  class: 'economy' | 'premium' | 'business' | 'first';
}

export interface FlightSearchResult {
  id: string;
  airline: string;
  flightNumber: string;
  price: number;
  duration: string;
  departure: {
    airport: string;
    time: Date;
  };
  arrival: {
    airport: string;
    time: Date;
  };
}

export interface FlightFacade {
  search: (criteria: FlightSearchCriteria) => Promise<FlightSearchResult[]>;
  book: (flightId: string) => Promise<boolean>;
}
