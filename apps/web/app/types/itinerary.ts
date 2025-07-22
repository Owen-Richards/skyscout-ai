/**
 * Trip Itinerary Types
 * Comprehensive itinerary planning and management
 */

export interface ItineraryLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type:
    | 'attraction'
    | 'restaurant'
    | 'hotel'
    | 'activity'
    | 'transport'
    | 'meeting';
  category: string;
  rating?: number;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  estimatedDuration: number; // minutes
  openingHours?: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
  website?: string;
  phone?: string;
  description?: string;
  tags: string[];
}

export interface ItineraryActivity {
  id: string;
  title: string;
  description: string;
  location: ItineraryLocation;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  cost?: number;
  isBooked: boolean;
  bookingConfirmation?: string;
  notes?: string;
  priority: 'must-do' | 'recommended' | 'optional';
  weather_dependent: boolean;
  accessibility_features: string[];
  aiSuggestions: {
    alternativeTimes: string[];
    nearbyAttractions: string[];
    tipsSuggestions: string[];
  };
}

export interface ItineraryDay {
  id: string;
  date: string;
  theme?: string;
  activities: ItineraryActivity[];
  meals: {
    breakfast?: ItineraryActivity;
    lunch?: ItineraryActivity;
    dinner?: ItineraryActivity;
  };
  transportation: {
    method: 'walking' | 'car' | 'public' | 'taxi' | 'bike';
    estimatedCost: number;
    duration: number;
    notes?: string;
  }[];
  totalCost: number;
  estimatedWalkingDistance: number; // meters
  recommendations: {
    packingList: string[];
    tips: string[];
    weatherConsiderations: string[];
  };
}

export interface TripItinerary {
  id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  travelers: {
    id: string;
    name: string;
    age?: number;
    preferences: string[];
    accessibility_needs: string[];
  }[];
  preferences: {
    pace: 'relaxed' | 'moderate' | 'intensive';
    interests: string[];
    budget_range: string;
    accommodation_type: string[];
  };
  weather: {
    [date: string]: {
      condition: string;
      temperature: {
        high: number;
        low: number;
      };
      precipitation: number;
      advisory?: string;
    };
  };
  aiOptimizations: {
    routeOptimization: {
      originalDistance: number;
      optimizedDistance: number;
      timeSaved: number;
    };
    costOptimization: {
      originalCost: number;
      optimizedCost: number;
      savings: number;
    };
    personalizedRecommendations: {
      based_on: string[];
      suggestions: {
        activity: string;
        reason: string;
        confidence: number;
      }[];
    };
  };
  sharing: {
    isPublic: boolean;
    collaborators: string[];
    shareableLink?: string;
  };
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  description: string;
  destination: string;
  duration: number; // days
  type: 'family' | 'romantic' | 'adventure' | 'business' | 'solo' | 'group';
  difficulty: 'easy' | 'moderate' | 'challenging';
  estimatedCost: {
    budget: number;
    midrange: number;
    luxury: number;
  };
  highlights: string[];
  activities: ItineraryActivity[];
  reviews: {
    rating: number;
    count: number;
    featured: {
      text: string;
      author: string;
      date: string;
    }[];
  };
}

export interface ItineraryRecommendation {
  type: 'activity' | 'restaurant' | 'optimization' | 'timing' | 'budget';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'difficult';
  savings?: number;
  timeImpact?: number;
  aiConfidence: number;
  source: 'ai' | 'user_reviews' | 'local_expert' | 'historical_data';
}
