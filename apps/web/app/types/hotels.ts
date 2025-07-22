/**
 * Hotel-related type definitions
 * Comprehensive types for accommodation search, results, and bookings
 * Includes Hotels, Airbnb, VRBO, and other accommodation types
 */

export interface AccommodationSearchCriteria {
  readonly destination: string;
  readonly checkIn: string;
  readonly checkOut: string;
  readonly guests: {
    readonly adults: number;
    readonly children: number;
    readonly rooms: number;
  };
  readonly accommodationType:
    | 'all'
    | 'hotel'
    | 'apartment'
    | 'house'
    | 'unique'
    | 'luxury';
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly amenities: readonly string[];
  readonly rating: number;
  readonly sortBy:
    | 'price'
    | 'rating'
    | 'distance'
    | 'popularity'
    | 'ai-recommended';
}

export interface AccommodationProvider {
  readonly id: string;
  readonly name: string;
  readonly logo: string;
  readonly type:
    | 'hotel'
    | 'airbnb'
    | 'vrbo'
    | 'booking'
    | 'expedia'
    | 'agoda'
    | 'direct';
  readonly trustScore: number;
  readonly averageBookingTime: number; // minutes
  readonly cancellationPolicy: string;
  readonly bookingFee: number;
  readonly features: readonly string[];
}

export interface AccommodationDeal {
  readonly id: string;
  readonly name: string;
  readonly type:
    | 'hotel'
    | 'apartment'
    | 'house'
    | 'villa'
    | 'resort'
    | 'bnb'
    | 'unique';
  readonly provider: AccommodationProvider;
  readonly originalPrice: number;
  readonly aiOptimizedPrice: number;
  readonly savings: number;
  readonly savingsPercent: number;
  readonly location: {
    readonly address: string;
    readonly city: string;
    readonly country: string;
    readonly coordinates: {
      readonly lat: number;
      readonly lng: number;
    };
    readonly landmarks: readonly string[];
    readonly distanceToCenter: number;
  };
  readonly rating: {
    readonly overall: number;
    readonly reviews: number;
    readonly breakdown: {
      readonly cleanliness: number;
      readonly location: number;
      readonly value: number;
      readonly service: number;
      readonly comfort: number;
    };
  };
  readonly amenities: readonly string[];
  readonly images: readonly string[];
  readonly description: string;
  readonly highlights: readonly string[];
  readonly roomDetails: {
    readonly beds: number;
    readonly bathrooms: number;
    readonly maxGuests: number;
    readonly size: number; // sqft
  };
  readonly policies: {
    readonly checkIn: string;
    readonly checkOut: string;
    readonly cancellation: string;
    readonly petPolicy: string;
    readonly smokingPolicy: string;
  };
  readonly aiInsights: {
    readonly priceConfidence: number;
    readonly popularityTrend: 'rising' | 'stable' | 'declining';
    readonly bookingUrgency: 'low' | 'medium' | 'high';
    readonly similarPropertiesAverage: number;
    readonly optimalBookingWindow: string;
  };
  readonly isWishlisted?: boolean;
  readonly lastBooked?: string;
  readonly bookingsToday?: number;
  readonly dealType?:
    | 'flash'
    | 'early-bird'
    | 'last-minute'
    | 'exclusive'
    | 'ai-optimized';
  readonly validUntil?: string;
}

export interface TrendingDestination {
  readonly id: string;
  readonly city: string;
  readonly country: string;
  readonly continent: string;
  readonly image: string;
  readonly averagePrice: number;
  readonly priceChange: number;
  readonly priceChangePercent: number;
  readonly popularity: number;
  readonly searchesThisWeek: number;
  readonly searchGrowth: number;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly topAccommodationTypes: readonly string[];
  readonly seasonality: 'peak' | 'shoulder' | 'off-peak';
  readonly popularMonths: readonly string[];
  readonly weather: {
    readonly current: number;
    readonly condition: string;
    readonly icon: string;
  };
  readonly accommodationCount: {
    readonly hotels: number;
    readonly apartments: number;
    readonly houses: number;
    readonly unique: number;
  };
  readonly dealBadge?: string;
  readonly isWishlisted?: boolean;
  readonly trendingRank: number;
}

export interface AccommodationFilter {
  readonly type:
    | 'price'
    | 'rating'
    | 'amenities'
    | 'accommodation-type'
    | 'distance'
    | 'provider';
  readonly label: string;
  readonly value:
    | string
    | number
    | boolean
    | readonly string[]
    | readonly number[];
  readonly active: boolean;
}

export interface WishlistItem extends AccommodationDeal {
  readonly dateAdded: string;
  readonly priceAlert: boolean;
  readonly priceHistory: readonly {
    readonly date: string;
    readonly price: number;
  }[];
  readonly notes?: string;
}

export interface PriceAlert {
  readonly id: string;
  readonly accommodationId: string;
  readonly userId: string;
  readonly targetPrice: number;
  readonly currentPrice: number;
  readonly destination: string;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly triggeredAt?: string;
}

export interface RecentSearch {
  readonly id: string;
  readonly searchCriteria: AccommodationSearchCriteria;
  readonly searchDate: string;
  readonly resultCount: number;
  readonly lowestPrice?: number;
  readonly userId?: string;
}

export interface AccommodationBooking {
  readonly id: string;
  readonly accommodationId: string;
  readonly userId: string;
  readonly guestDetails: readonly {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly phone: string;
  }[];
  readonly contactInfo: {
    readonly email: string;
    readonly phone: string;
  };
  readonly specialRequests?: string;
  readonly totalPrice: number;
  readonly taxes: number;
  readonly fees: number;
  readonly bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  readonly bookingReference: string;
  readonly createdAt: string;
  readonly paymentMethod: string;
  readonly provider: AccommodationProvider;
}

export interface AIInsight {
  readonly type:
    | 'price-prediction'
    | 'availability-alert'
    | 'best-time-to-book'
    | 'alternative-suggestion'
    | 'upgrade-opportunity';
  readonly title: string;
  readonly description: string;
  readonly confidence: number;
  readonly actionable: boolean;
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
  readonly metadata?: Record<string, string | number | boolean>;
}

export interface AccommodationComparison {
  readonly accommodationId: string;
  readonly providers: readonly {
    readonly provider: AccommodationProvider;
    readonly price: number;
    readonly originalPrice?: number;
    readonly availability: boolean;
    readonly bookingUrl: string;
    readonly cancellationPolicy: string;
    readonly additionalFees: readonly {
      readonly name: string;
      readonly amount: number;
    }[];
  }[];
  readonly aiRecommendation: {
    readonly bestProvider: string;
    readonly reason: string;
    readonly potentialSavings: number;
  };
}
