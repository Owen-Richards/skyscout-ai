/**
 * Application Types Index
 * Centralized exports for all type definitions
 */

// Export all deal types
export * from './deals';

// Export hero types
export * from './hero';

// Export navigation types
export * from './navigation';

// Export search types
export * from './search';

// Export specific flight types to avoid conflicts
export type { FlightResult, FlightBooking, FlightFilter } from './flights';
