/**
 * Flight-related type definitions
 * Comprehensive types for flight search, results, and user interactions
 */

export interface FlightSearchCriteria {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType?: 'round-trip' | 'one-way' | 'multi-city';
}

export interface FlightResult {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  airline: string;
  duration: string;
  stops: number;
  aircraft?: string;
  confidence: number;
  priceChange?: number;
  carbonFootprint?: 'low' | 'medium' | 'high';
  amenities?: string[];
  bookingClass: string;
  departureTime?: string;
  arrivalTime?: string;
  layovers?: Array<{
    airport: string;
    duration: string;
  }>;
  baggage?: {
    carry: boolean;
    checked: number;
  };
  refundable?: boolean;
  changeable?: boolean;
  seatSelection?: boolean;
  wifi?: boolean;
  entertainment?: boolean;
  meals?: boolean;
  powerOutlets?: boolean;
}

export interface FlightFilter {
  type:
    | 'price'
    | 'airline'
    | 'stops'
    | 'departure-time'
    | 'duration'
    | 'amenities'
    | 'carbon-footprint';
  label: string;
  value: string | number | boolean | string[] | number[];
  active: boolean;
}

export interface WishlistItem extends FlightResult {
  dateAdded: string;
  priceAlert: boolean;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  flightId: string;
  userId: string;
  targetPrice: number;
  currentPrice: number;
  route: string;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface TrendingDestination {
  code: string;
  name: string;
  city: string;
  country: string;
  averagePrice: number;
  priceChange: number;
  popularityScore: number;
  image: string;
  bestTimeToVisit: string;
  description: string;
}

export interface FlightDeal {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  price: number;
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  validUntil: string;
  image: string;
  featured: boolean;
  dealType: 'flash' | 'seasonal' | 'last-minute' | 'early-bird';
}

export interface RecentSearch {
  id: string;
  searchCriteria: FlightSearchCriteria;
  searchDate: string;
  resultCount: number;
  lowestPrice?: number;
  userId?: string;
}

export interface FlightBooking {
  id: string;
  flightId: string;
  userId: string;
  passengerDetails: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber?: string;
    seatNumber?: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
  };
  totalPrice: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingReference: string;
  createdAt: string;
  paymentMethod: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  terminals?: number;
  runways?: number;
  airlines?: string[];
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
  rating: number;
  fleet: string[];
  routes: string[];
  amenities: string[];
  baggagePolicy: {
    carryOn: {
      weight: number;
      dimensions: string;
    };
    checked: {
      weight: number;
      price: number;
    };
  };
}

export interface FlightStats {
  totalSearches: number;
  averagePrice: number;
  popularRoutes: Array<{
    route: string;
    count: number;
    averagePrice: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
  }>;
  bookingsByDay: Array<{
    date: string;
    bookings: number;
  }>;
}

export interface AIInsight {
  type:
    | 'price-prediction'
    | 'deal-alert'
    | 'best-time-to-book'
    | 'route-suggestion';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, string | number | boolean>;
}
