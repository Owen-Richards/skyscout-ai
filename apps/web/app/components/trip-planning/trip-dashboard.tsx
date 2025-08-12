'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  Copy,
  DollarSign,
  Edit,
  Filter,
  Globe,
  Heart,
  List,
  MapPin,
  Plus,
  Share2,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import type { Trip, TripBudget } from '../../types/trip';

export function TripPlanningDashboard({ className }: { className?: string }) {
  const [trips] = useState<Trip[]>([
    {
      id: '1',
      name: 'European Adventure',
      description:
        'A 2-week journey through Europe exploring historic cities and local cultures',
      destinations: [
        {
          id: '1',
          name: 'Paris',
          city: 'Paris',
          country: 'France',
          countryCode: 'FR',
          coordinates: { lat: 48.8566, lng: 2.3522 },
          arrivalDate: '2024-04-15',
          departureDate: '2024-04-20',
          isMainDestination: true,
          order: 1,
          timezone: 'Europe/Paris',
          currency: 'EUR',
          language: ['French'],
          nights: 5,
        },
        {
          id: '2',
          name: 'Rome',
          city: 'Rome',
          country: 'Italy',
          countryCode: 'IT',
          coordinates: { lat: 41.9028, lng: 12.4964 },
          arrivalDate: '2024-04-20',
          departureDate: '2024-04-25',
          isMainDestination: true,
          order: 2,
          timezone: 'Europe/Rome',
          currency: 'EUR',
          language: ['Italian'],
          nights: 5,
          transportToNext: {
            type: 'flight',
            duration: '2h 15m',
            estimatedCost: 150,
          },
        },
        {
          id: '3',
          name: 'Barcelona',
          city: 'Barcelona',
          country: 'Spain',
          countryCode: 'ES',
          coordinates: { lat: 41.3851, lng: 2.1734 },
          arrivalDate: '2024-04-25',
          departureDate: '2024-04-29',
          isMainDestination: true,
          order: 3,
          timezone: 'Europe/Madrid',
          currency: 'EUR',
          language: ['Spanish', 'Catalan'],
          nights: 4,
        },
      ],
      startDate: '2024-04-15',
      endDate: '2024-04-29',
      duration: 14,
      status: 'planning',
      visibility: 'private',
      travelers: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'organizer',
          preferences: {
            dietaryRestrictions: [],
            accessibility: [],
            activityInterests: ['museums', 'food', 'history'],
            budgetRange: { min: 100, max: 300, currency: 'USD' },
            accommodationPreferences: ['hotel', 'apartment'],
            transportationPreferences: ['flight', 'train'],
          },
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'traveler',
          preferences: {
            dietaryRestrictions: ['vegetarian'],
            accessibility: [],
            activityInterests: ['art', 'shopping', 'nightlife'],
            budgetRange: { min: 150, max: 400, currency: 'USD' },
            accommodationPreferences: ['hotel'],
            transportationPreferences: ['flight'],
          },
        },
      ],
      createdBy: '1',
      sharedWith: ['2'],
      budget: {
        totalBudget: 6000,
        currency: 'USD',
        categories: [
          {
            id: '1',
            name: 'Accommodation',
            icon: '🏨',
            allocatedAmount: 2400,
            spentAmount: 800,
            remainingAmount: 1600,
            percentage: 40,
            isEssential: true,
            allowOverspend: false,
            alertThreshold: 90,
          },
          {
            id: '2',
            name: 'Food & Dining',
            icon: '🍽️',
            allocatedAmount: 1200,
            spentAmount: 320,
            remainingAmount: 880,
            percentage: 20,
            isEssential: true,
            allowOverspend: true,
            alertThreshold: 85,
          },
          {
            id: '3',
            name: 'Transportation',
            icon: '✈️',
            allocatedAmount: 1500,
            spentAmount: 1200,
            remainingAmount: 300,
            percentage: 25,
            isEssential: true,
            allowOverspend: false,
            alertThreshold: 95,
          },
          {
            id: '4',
            name: 'Activities',
            icon: '🎭',
            allocatedAmount: 600,
            spentAmount: 150,
            remainingAmount: 450,
            percentage: 10,
            isEssential: false,
            allowOverspend: true,
            alertThreshold: 80,
          },
          {
            id: '5',
            name: 'Shopping',
            icon: '🛍️',
            allocatedAmount: 300,
            spentAmount: 0,
            remainingAmount: 300,
            percentage: 5,
            isEssential: false,
            allowOverspend: true,
            alertThreshold: 100,
          },
        ],
        actualSpent: 2470,
        remainingBudget: 3530,
        perPersonBudget: 3000,
        sharedExpenses: true,
        dailyBudget: 429,
        spentToday: 0,
        projectedTotal: 5800,
        budgetAlerts: [
          {
            id: '1',
            type: 'approaching-limit',
            severity: 'medium',
            message: 'Transportation budget is 80% used',
            categoryId: '3',
            amount: 1200,
            threshold: 80,
            createdAt: '2024-03-15T10:00:00Z',
            acknowledged: false,
          },
        ],
        baseCurrency: 'USD',
        exchangeRates: {
          EUR: 0.85,
          GBP: 0.75,
        },
        lastUpdated: '2024-03-15T09:00:00Z',
      },
      expenses: [],
      itinerary: {
        id: '1',
        tripId: '1',
        days: [],
        autoSchedule: true,
        bufferTime: 30,
        workingHours: { start: '09:00', end: '22:00' },
        aiOptimized: true,
        isPublic: false,
      },
      bookings: [],
      recommendations: [],
      currency: 'USD',
      timezone: 'America/New_York',
      preferences: {
        travelStyle: ['mid-range', 'cultural'],
        activityTypes: ['museums', 'food tours', 'walking tours'],
        avoidActivities: [],
        accommodationTypes: ['hotel', 'apartment'],
        roomPreferences: ['private bathroom', 'wifi'],
        amenities: ['wifi', 'breakfast'],
        preferredTransportation: ['flight', 'train'],
        avoidTransportation: ['bus'],
        diningPreferences: ['local cuisine', 'fine dining'],
        cuisineTypes: ['italian', 'french', 'spanish'],
        dietaryRestrictions: ['vegetarian'],
        budgetPerMeal: { breakfast: 25, lunch: 35, dinner: 50 },
        languages: ['english'],
        culturalInterests: ['history', 'art', 'architecture'],
        accessibilityNeeds: [],
        mobilityRequirements: [],
        spendingPatterns: {
          accommodation: 40,
          food: 20,
          activities: 10,
          transportation: 25,
          shopping: 5,
          other: 0,
        },
        preferredTravelTimes: ['spring', 'fall'],
        avoidSeasons: ['winter'],
        flexibleDates: true,
        groupDecisionMaking: 'consensus',
        conflictResolution: 'discussion',
        shareItinerary: true,
        shareLocation: true,
        shareBudget: false,
        shareRecommendations: true,
        budgetAlerts: true,
        itineraryReminders: true,
        bookingDeadlines: true,
        weatherUpdates: true,
        localEvents: true,
        priceDrops: true,
        aiOptimization: true,
        aiRecommendations: true,
        aibudgetTracking: true,
        personalizedSuggestions: true,
      },
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-15T14:30:00Z',
      lastAccessedAt: '2024-03-15T14:30:00Z',
    },
  ]);

  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCreateTrip, setShowCreateTrip] = useState(false);

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'booked':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getBudgetStatus = (budget: TripBudget) => {
    const spentPercentage = (budget.actualSpent / budget.totalBudget) * 100;

    if (spentPercentage > 100) {
      return {
        status: 'over',
        color: 'text-red-600 dark:text-red-400',
        label: 'Over Budget',
      };
    } else if (spentPercentage > 80) {
      return {
        status: 'high',
        color: 'text-orange-600 dark:text-orange-400',
        label: 'High Usage',
      };
    } else if (spentPercentage > 50) {
      return {
        status: 'moderate',
        color: 'text-yellow-600 dark:text-yellow-400',
        label: 'On Track',
      };
    } else {
      return {
        status: 'low',
        color: 'text-green-600 dark:text-green-400',
        label: 'Under Budget',
      };
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const filteredTrips = trips.filter(trip => {
    if (filterStatus === 'all') return true;
    return trip.status === filterStatus;
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            🗺️ Trip Planner
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Plan, budget, and organize your perfect trip with AI assistance
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <Target className="w-3 h-3 mr-1" />
              Smart Budgeting
            </Badge>
          </div>

          <Button
            onClick={() => setShowCreateTrip(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Trips
              </p>
              <p className="text-2xl font-bold text-foreground">
                {
                  trips.filter(
                    t => t.status === 'planning' || t.status === 'booked'
                  ).length
                }
              </p>
            </div>
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Budget
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  trips.reduce((sum, trip) => sum + trip.budget.totalBudget, 0),
                  'USD'
                )}
              </p>
            </div>
            <div className="bg-green-500/20 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Destinations
              </p>
              <p className="text-2xl font-bold text-foreground">
                {trips.reduce((sum, trip) => sum + trip.destinations.length, 0)}
              </p>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Travel Days
              </p>
              <p className="text-2xl font-bold text-foreground">
                {trips.reduce((sum, trip) => sum + trip.duration, 0)}
              </p>
            </div>
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 bg-background text-foreground text-sm"
            >
              <option value="all">All Trips</option>
              <option value="planning">Planning</option>
              <option value="booked">Booked</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('grid')}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button
            variant={activeView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Trip Cards */}
      <div
        className={cn(
          'grid gap-6',
          activeView === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {filteredTrips.map(trip => {
          const budgetStatus = getBudgetStatus(trip.budget);
          const daysUntilTrip = Math.ceil(
            (new Date(trip.startDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <Card
              key={trip.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-purple-500/50"
            >
              <div className="p-6 space-y-4">
                {/* Trip Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {trip.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {trip.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        'text-xs border',
                        getStatusColor(trip.status)
                      )}
                    >
                      {trip.status.replace('-', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Destinations */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Destinations
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trip.destinations.slice(0, 3).map((destination, index) => (
                      <Badge
                        key={destination.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {destination.city}
                        {index < trip.destinations.length - 1 &&
                          trip.destinations.length <= 3 &&
                          ' →'}
                      </Badge>
                    ))}
                    {trip.destinations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{trip.destinations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {trip.duration} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {trip.travelers.length} traveler
                      {trip.travelers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {daysUntilTrip > 0 && (
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {daysUntilTrip} days away
                      </span>
                    </div>
                  )}
                </div>

                {/* Budget Overview */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Budget
                      </span>
                    </div>
                    <div className={cn('text-xs', budgetStatus.color)}>
                      {budgetStatus.label}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(
                          trip.budget.actualSpent,
                          trip.budget.currency
                        )}{' '}
                        spent
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(
                          trip.budget.totalBudget,
                          trip.budget.currency
                        )}{' '}
                        total
                      </span>
                    </div>

                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          budgetStatus.status === 'over'
                            ? 'bg-red-500'
                            : budgetStatus.status === 'high'
                              ? 'bg-orange-500'
                              : budgetStatus.status === 'moderate'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                        )}
                        style={{
                          width: `${Math.min((trip.budget.actualSpent / trip.budget.totalBudget) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Budget Alerts */}
                  {trip.budget.budgetAlerts.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>
                        {trip.budget.budgetAlerts.length} budget alert
                        {trip.budget.budgetAlerts.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Trip
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-border/80"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-border/80"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No trips found
              </h3>
              <p className="text-muted-foreground">
                {filterStatus === 'all'
                  ? 'Start planning your next adventure by creating a new trip'
                  : `No trips with status "${filterStatus}" found`}
              </p>
            </div>
            <Button
              onClick={() => setShowCreateTrip(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Trip
            </Button>
          </div>
        </Card>
      )}

      {/* Features Overview */}
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border-blue-500/20">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                🚀 Complete Trip Planning Suite
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Smart Budgeting:</strong>{' '}
                  AI-powered budget tracking with real-time expense
                  categorization, currency conversion, and spending alerts.
                </div>
                <div>
                  <strong className="text-foreground">
                    Intelligent Itineraries:
                  </strong>{' '}
                  Auto-generated itineraries based on your preferences, with
                  route optimization and local recommendations.
                </div>
                <div>
                  <strong className="text-foreground">
                    Collaborative Planning:
                  </strong>{' '}
                  Share trips with friends, vote on activities, split expenses,
                  and plan together in real-time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
