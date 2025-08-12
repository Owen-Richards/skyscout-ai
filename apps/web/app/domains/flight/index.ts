/**
 * Flight Domain Index
 *
 * Barrel export for the flight domain following clean architecture principles.
 * This provides a unified interface to the flight domain.
 */

// Domain Models and Types
export * from './domain';

// Application Services
export * from './services';

// Re-export key types for convenience
export type {
  Currency,
  Flight,
  FlightClass,
  FlightComparison,
  FlightSearchCriteria,
  FlightSearchResult,
  IFlightBookingService,
  IFlightComparisonService,
  IFlightSearchService,
  Passenger,
  Price,
  Segment,
} from './domain';

export type {
  FlightBookingRequest,
  ICacheService,
  IEventBus,
  IFlightApiClient,
  IPaymentService,
  PaymentMethod,
} from './services';
