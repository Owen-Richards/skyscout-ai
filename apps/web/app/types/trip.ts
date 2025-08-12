/**
 * Trip Planning & Budgeting Types
 * Comprehensive types for trip planning, itinerary management, and expense tracking
 */

// Base Trip Types
export interface Trip {
  id: string;
  name: string;
  description?: string;
  destinations: TripDestination[];
  startDate: string;
  endDate: string;
  duration: number; // days
  status: 'planning' | 'booked' | 'in-progress' | 'completed' | 'cancelled';
  visibility: 'private' | 'shared' | 'public';

  // Participants
  travelers: TripTraveler[];
  createdBy: string;
  sharedWith: string[];

  // Budget & Expenses
  budget: TripBudget;
  expenses: TripExpense[];

  // Itinerary
  itinerary: TripItinerary;

  // Bookings & Reservations
  bookings: TripBooking[];

  // AI Recommendations
  recommendations: TripRecommendation[];

  // Trip Settings
  currency: string;
  timezone: string;
  preferences: TripPreferences;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
}

export interface TripDestination {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  arrivalDate: string;
  departureDate: string;
  isMainDestination: boolean;
  order: number;

  // Local Info
  timezone: string;
  currency: string;
  language: string[];

  // Stay Duration
  nights: number;

  // Transportation between destinations
  transportToNext?: {
    type: 'flight' | 'train' | 'bus' | 'car' | 'ferry';
    duration: string;
    estimatedCost: number;
    bookingId?: string;
  };
}

export interface TripTraveler {
  id: string;
  userId?: string; // If registered user
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  passportNumber?: string;
  role: 'organizer' | 'co-organizer' | 'traveler';
  preferences: TravelerPreferences;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface TravelerPreferences {
  dietaryRestrictions: string[];
  accessibility: string[];
  activityInterests: string[];
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  accommodationPreferences: string[];
  transportationPreferences: string[];
}

// Budget Management
export interface TripBudget {
  totalBudget: number;
  currency: string;
  categories: BudgetCategory[];
  actualSpent: number;
  remainingBudget: number;
  perPersonBudget: number;
  sharedExpenses: boolean;

  // Budget Tracking
  dailyBudget: number;
  spentToday: number;
  projectedTotal: number;
  budgetAlerts: BudgetAlert[];

  // Currency & Exchange
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  lastUpdated: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  isEssential: boolean;
  subcategories?: BudgetSubcategory[];

  // Category-specific settings
  allowOverspend: boolean;
  alertThreshold: number; // percentage
  notes?: string;
}

export interface BudgetSubcategory {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  parentCategoryId: string;
}

export interface BudgetAlert {
  id: string;
  type:
    | 'over-budget'
    | 'approaching-limit'
    | 'currency-change'
    | 'unusual-expense';
  severity: 'low' | 'medium' | 'high';
  message: string;
  categoryId?: string;
  amount?: number;
  threshold?: number;
  createdAt: string;
  acknowledged: boolean;
}

// Expense Tracking
export interface TripExpense {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  convertedAmount: number; // in trip base currency
  exchangeRate: number;

  // Expense Details
  description: string;
  category: string;
  subcategory?: string;
  vendor?: string;
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };

  // Timing
  date: string;
  destinationId?: string;
  itineraryItemId?: string;

  // Participants
  paidBy: string; // traveler ID
  splitBetween: ExpenseSplit[];
  isShared: boolean;

  // Documentation
  receipt?: {
    imageUrl: string;
    ocrText?: string;
    merchantName?: string;
    tax?: number;
    tip?: number;
  };

  // Categorization
  tags: string[];
  isPlanned: boolean; // vs actual expense
  bookingReference?: string;

  // AI Features
  aiCategorized: boolean;
  aiConfidence?: number;
  suggestedCategory?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ExpenseSplit {
  travelerId: string;
  amount: number;
  percentage: number;
  settled: boolean;
  settledAt?: string;
}

// Itinerary Planning
export interface TripItinerary {
  id: string;
  tripId: string;
  days: ItineraryDay[];

  // Itinerary Settings
  autoSchedule: boolean;
  bufferTime: number; // minutes between activities
  workingHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };

  // AI Features
  aiOptimized: boolean;
  lastOptimizedAt?: string;
  optimizationScore?: number;

  // Sharing
  isPublic: boolean;
  sharedUrl?: string;
  templateId?: string;
}

export interface ItineraryDay {
  id: string;
  date: string;
  destinationId: string;
  items: ItineraryItem[];

  // Day Summary
  totalCost: number;
  estimatedDuration: number; // minutes
  walkingDistance: number; // km

  // Day Settings
  theme?: string;
  notes?: string;
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
}

export interface ItineraryItem {
  id: string;
  type:
    | 'activity'
    | 'attraction'
    | 'restaurant'
    | 'accommodation'
    | 'transportation'
    | 'free-time'
    | 'custom';
  title: string;
  description?: string;

  // Timing
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutes
  isFlexible: boolean;

  // Location
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    placeId?: string;
  };

  // Cost
  estimatedCost: number;
  actualCost?: number;
  currency: string;
  costPerPerson: boolean;

  // Details
  category: string;
  subcategory?: string;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  duration_category?: 'quick' | 'half-day' | 'full-day';

  // Booking & Reservations
  bookingRequired: boolean;
  bookingUrl?: string;
  bookingReference?: string;
  bookingStatus: 'none' | 'required' | 'booked' | 'confirmed' | 'cancelled';

  // Content
  images: string[];
  website?: string;
  phone?: string;
  rating?: number;
  reviews?: number;

  // AI Features
  recommendedBy: 'user' | 'ai' | 'guidebook' | 'social';
  aiScore?: number;
  personalizedReason?: string;
  similarTo?: string[];

  // User Interaction
  isFavorite: boolean;
  isCompleted: boolean;
  completedAt?: string;
  userRating?: number;
  userNotes?: string;

  // Group Features
  interestedTravelers: string[]; // traveler IDs
  votingScore?: number;
  addedBy: string;

  // Transportation
  transportationToNext?: {
    type: 'walking' | 'driving' | 'public' | 'taxi' | 'bike';
    duration: number;
    cost?: number;
    instructions?: string;
  };

  // Metadata
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Bookings & Reservations
export interface TripBooking {
  id: string;
  tripId: string;
  type:
    | 'flight'
    | 'hotel'
    | 'car'
    | 'activity'
    | 'restaurant'
    | 'train'
    | 'ferry'
    | 'other';

  // Booking Details
  title: string;
  description?: string;
  bookingReference: string;
  confirmationNumber?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

  // Provider Information
  provider: {
    name: string;
    website?: string;
    phone?: string;
    email?: string;
    logo?: string;
  };

  // Timing
  checkIn?: string;
  checkOut?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;

  // Cost
  totalCost: number;
  currency: string;
  paidAmount: number;
  remainingAmount: number;
  paymentDue?: string;

  // Participants
  travelers: string[]; // traveler IDs
  guestNames?: string[];

  // Location
  location?: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };

  // Documents
  documents: BookingDocument[];

  // Cancellation
  cancellationPolicy?: string;
  cancellationDeadline?: string;
  refundableAmount?: number;

  // Integration
  itineraryItemId?: string;
  expenseId?: string;

  // Metadata
  bookedAt: string;
  bookedBy: string;
  lastModified: string;
}

export interface BookingDocument {
  id: string;
  type: 'ticket' | 'voucher' | 'confirmation' | 'receipt' | 'invoice' | 'terms';
  name: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

// AI Recommendations
export interface TripRecommendation {
  id: string;
  tripId: string;
  type:
    | 'activity'
    | 'restaurant'
    | 'accommodation'
    | 'route'
    | 'budget'
    | 'timing'
    | 'packing';

  // Recommendation Details
  title: string;
  description: string;
  reason: string;
  confidence: number; // 0-100

  // Context
  destinationId?: string;
  date?: string;
  category: string;

  // Recommendation Data
  data: Record<string, unknown>; // Flexible data structure based on type

  // Cost Impact
  costImpact?: {
    amount: number;
    type: 'increase' | 'decrease' | 'neutral';
    explanation: string;
  };

  // Time Impact
  timeImpact?: {
    duration: number;
    type: 'add' | 'save' | 'neutral';
    explanation: string;
  };

  // Personalization
  personalizedFor: string[]; // traveler IDs
  basedon: (
    | 'preferences'
    | 'history'
    | 'trends'
    | 'weather'
    | 'events'
    | 'budget'
  )[];

  // User Interaction
  status: 'pending' | 'accepted' | 'rejected' | 'modified' | 'expired';
  userFeedback?: {
    helpful: boolean;
    reason?: string;
    alternativeSuggestion?: string;
  };

  // Priority & Timing
  priority: 'low' | 'medium' | 'high' | 'urgent';
  validUntil?: string;
  bestTimeToBook?: string;

  // Metadata
  createdAt: string;
  actedOnAt?: string;
  source: 'ai' | 'local_expert' | 'community' | 'guidebook';
}

// Trip Preferences
export interface TripPreferences {
  // Travel Style
  travelStyle: (
    | 'budget'
    | 'mid-range'
    | 'luxury'
    | 'backpacking'
    | 'family'
    | 'business'
    | 'romantic'
    | 'adventure'
    | 'cultural'
    | 'relaxation'
  )[];

  // Activity Preferences
  activityTypes: string[];
  avoidActivities: string[];

  // Accommodation
  accommodationTypes: (
    | 'hotel'
    | 'hostel'
    | 'apartment'
    | 'villa'
    | 'resort'
    | 'camping'
    | 'unique'
  )[];
  roomPreferences: string[];
  amenities: string[];

  // Transportation
  preferredTransportation: (
    | 'flight'
    | 'train'
    | 'bus'
    | 'car'
    | 'bike'
    | 'walking'
  )[];
  avoidTransportation: string[];

  // Dining
  diningPreferences: string[];
  cuisineTypes: string[];
  dietaryRestrictions: string[];
  budgetPerMeal: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };

  // Cultural
  languages: string[];
  culturalInterests: string[];

  // Accessibility
  accessibilityNeeds: string[];
  mobilityRequirements: string[];

  // Budget
  spendingPatterns: {
    accommodation: number; // percentage
    food: number;
    activities: number;
    transportation: number;
    shopping: number;
    other: number;
  };

  // Timing
  preferredTravelTimes: string[];
  avoidSeasons: string[];
  flexibleDates: boolean;

  // Group Dynamics
  groupDecisionMaking: 'consensus' | 'voting' | 'organizer-decides';
  conflictResolution: 'discussion' | 'voting' | 'compromise';

  // Privacy
  shareItinerary: boolean;
  shareLocation: boolean;
  shareBudget: boolean;
  shareRecommendations: boolean;

  // Notifications
  budgetAlerts: boolean;
  itineraryReminders: boolean;
  bookingDeadlines: boolean;
  weatherUpdates: boolean;
  localEvents: boolean;
  priceDrops: boolean;

  // AI Features
  aiOptimization: boolean;
  aiRecommendations: boolean;
  aibudgetTracking: boolean;
  personalizedSuggestions: boolean;
}

// Analytics & Insights
export interface TripAnalytics {
  tripId: string;

  // Budget Analytics
  budgetVariance: number;
  costPerDay: number;
  costPerPerson: number;
  topExpenseCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];

  // Activity Analytics
  activitiesCompleted: number;
  totalActivities: number;
  completionRate: number;
  topActivityTypes: string[];
  timeUtilization: number; // percentage of planned time used

  // Travel Patterns
  destinationsVisited: number;
  totalDistance: number;
  transportationBreakdown: {
    type: string;
    cost: number;
    time: number;
    distance: number;
  }[];

  // Satisfaction Metrics
  averageRating: number;
  highlightActivities: string[];
  improvementSuggestions: string[];

  // Efficiency Metrics
  bookingLeadTime: number;
  lastMinuteChanges: number;
  cancellationRate: number;

  // Comparison Data
  vsOriginalPlan: {
    budgetVariance: number;
    timeVariance: number;
    activityChanges: number;
  };
  vsSimilarTrips: {
    costComparison: 'below' | 'average' | 'above';
    experienceScore: number;
    uniquenessScore: number;
  };
}

// Search & Discovery
export interface TripTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  destinations: string[];
  estimatedBudget: {
    min: number;
    max: number;
    currency: string;
  };
  travelStyle: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
  season: string[];

  // Template Content
  itinerary: Omit<ItineraryItem, 'id' | 'tripId'>[];
  budgetBreakdown: BudgetCategory[];
  packingList: string[];
  tips: string[];

  // Metadata
  author: string;
  rating: number;
  uses: number;
  tags: string[];
  isVerified: boolean;
  lastUpdated: string;

  // Customization
  customizable: boolean;
  requiredFields: string[];
  optionalFields: string[];
}

// Collaboration & Sharing
export interface TripCollaboration {
  tripId: string;
  collaborators: TripCollaborator[];
  permissions: TripPermissions;
  activityLog: TripActivity[];
  comments: TripComment[];
  votes: TripVote[];
}

export interface TripCollaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer' | 'contributor';
  permissions: string[];
  invitedAt: string;
  joinedAt?: string;
  lastActiveAt: string;
  status: 'pending' | 'active' | 'inactive';
}

export interface TripPermissions {
  canEditItinerary: string[]; // user IDs
  canEditBudget: string[];
  canAddExpenses: string[];
  canMakeBookings: string[];
  canInviteOthers: string[];
  canExportData: string[];
}

export interface TripActivity {
  id: string;
  userId: string;
  action: string;
  target: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface TripComment {
  id: string;
  userId: string;
  content: string;
  target: string; // itinerary item, expense, etc.
  targetId: string;
  timestamp: string;
  replies: TripComment[];
}

export interface TripVote {
  id: string;
  userId: string;
  target: string;
  targetId: string;
  vote: 'up' | 'down' | 'love' | 'dislike';
  timestamp: string;
}

// All types are exported individually above
