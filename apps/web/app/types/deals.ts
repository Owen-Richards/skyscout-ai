/**
 * Deal-related type definitions
 * Following Single Responsibility Principle - focused on deal data structure
 */

export interface DealPrice {
  readonly current: number;
  readonly original?: number;
  readonly currency: string;
  readonly savings?: number;
  readonly savingsPercentage?: number;
}

export interface DealPrediction {
  readonly message: string;
  readonly confidence: number;
  readonly trend: 'increasing' | 'decreasing' | 'stable';
  readonly recommendedAction: 'book-now' | 'wait' | 'monitor';
}

export interface FlightDeal {
  readonly id: string;
  readonly origin: string;
  readonly destination: string;
  readonly airline: string;
  readonly duration: string;
  readonly stops: string;
  readonly price: DealPrice;
  readonly aiPrediction: DealPrediction;
  readonly departureDate?: string;
  readonly returnDate?: string;
  readonly validUntil: string;
  readonly bookingUrl?: string;
}

export interface DealsListProps {
  readonly deals: readonly FlightDeal[];
  readonly onDealClick?: (deal: FlightDeal) => void;
  readonly onBookingClick?: (deal: FlightDeal) => void;
  readonly className?: string;
  readonly loading?: boolean;
  readonly error?: string;
}

export interface DealCardProps {
  readonly deal: FlightDeal;
  readonly onClick?: (deal: FlightDeal) => void;
  readonly onBooking?: (deal: FlightDeal) => void;
  readonly className?: string;
  readonly showPrediction?: boolean;
}
