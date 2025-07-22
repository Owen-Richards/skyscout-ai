/**
 * Trip Itinerary Planner Component
 * AI-powered itinerary creation and management
 * Standalone feature integrating with flights, hotels, and budget
 */

'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@skyscout/ui';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Star,
  Heart,
  Navigation,
  Camera,
  Utensils,
  Car,
  Train,
  Plane,
  Walking,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Plus,
  Edit,
  Share,
  Download,
  Sparkles,
  Target,
  CheckCircle,
  TrendingUp,
  Route,
  Flag,
} from 'lucide-react';
import { cn } from '@skyscout/ui';
import type { TripItinerary, ItineraryDay } from '../../types/itinerary';

export function TripItineraryPlanner({ className }: { className?: string }) {
  const [itineraries] = useState<TripItinerary[]>([
    {
      id: '1',
      tripName: 'Japan Adventure',
      destination: 'Tokyo, Japan',
      startDate: '2024-09-15',
      endDate: '2024-09-25',
      travelers: [
        {
          id: '1',
          name: 'John Doe',
          age: 28,
          preferences: ['photography', 'food', 'culture'],
          accessibility_needs: [],
        },
        {
          id: '2',
          name: 'Jane Smith',
          age: 26,
          preferences: ['art', 'shopping', 'nature'],
          accessibility_needs: [],
        },
      ],
      preferences: {
        pace: 'moderate',
        interests: ['culture', 'food', 'technology', 'nature'],
        budget_range: 'mid-range',
        accommodation_type: ['hotel', 'ryokan'],
      },
      days: [
        {
          id: 'day1',
          date: '2024-09-15',
          theme: 'Arrival & Shibuya Exploration',
          activities: [
            {
              id: 'activity1',
              title: 'Arrive at Narita Airport',
              description:
                'Land in Tokyo and take the Narita Express to Shibuya',
              location: {
                id: 'narita',
                name: 'Narita International Airport',
                address: 'Narita, Chiba, Japan',
                coordinates: { lat: 35.7648, lng: 140.3864 },
                type: 'transport',
                category: 'airport',
                estimatedDuration: 120,
                tags: ['arrival', 'transport'],
              },
              startTime: '14:30',
              endTime: '16:30',
              duration: 120,
              cost: 50,
              isBooked: true,
              bookingConfirmation: 'NE12345',
              priority: 'must-do',
              weather_dependent: false,
              accessibility_features: ['elevator_access', 'english_support'],
              aiSuggestions: {
                alternativeTimes: ['15:00', '16:00'],
                nearbyAttractions: ['Narita-san Temple'],
                tipsSuggestions: [
                  'Get IC card at airport',
                  'Download Google Translate',
                ],
              },
            },
            {
              id: 'activity2',
              title: 'Check into Hotel',
              description: 'Boutique hotel in Shibuya with city views',
              location: {
                id: 'hotel1',
                name: 'Shibuya Sky Hotel',
                address: '1-1-1 Shibuya, Tokyo',
                coordinates: { lat: 35.6595, lng: 139.7006 },
                type: 'hotel',
                category: 'accommodation',
                rating: 4.7,
                estimatedDuration: 30,
                tags: ['hotel', 'shibuya', 'city-view'],
              },
              startTime: '17:00',
              endTime: '17:30',
              duration: 30,
              isBooked: true,
              priority: 'must-do',
              weather_dependent: false,
              accessibility_features: ['wheelchair_accessible'],
              aiSuggestions: {
                alternativeTimes: ['16:30', '17:30'],
                nearbyAttractions: ['Shibuya Crossing', 'Hachiko Statue'],
                tipsSuggestions: [
                  'Ask for room upgrade',
                  'Store luggage if early',
                ],
              },
            },
            {
              id: 'activity3',
              title: 'Shibuya Crossing Experience',
              description: 'Famous scramble crossing and Hachiko statue',
              location: {
                id: 'shibuya_crossing',
                name: 'Shibuya Crossing',
                address: 'Shibuya Crossing, Tokyo',
                coordinates: { lat: 35.6595, lng: 139.7005 },
                type: 'attraction',
                category: 'landmark',
                rating: 4.8,
                estimatedDuration: 60,
                openingHours: {
                  monday: { open: '00:00', close: '23:59' },
                  tuesday: { open: '00:00', close: '23:59' },
                  wednesday: { open: '00:00', close: '23:59' },
                  thursday: { open: '00:00', close: '23:59' },
                  friday: { open: '00:00', close: '23:59' },
                  saturday: { open: '00:00', close: '23:59' },
                  sunday: { open: '00:00', close: '23:59' },
                },
                tags: ['landmark', 'photo-spot', 'free'],
              },
              startTime: '18:00',
              endTime: '19:00',
              duration: 60,
              cost: 0,
              isBooked: false,
              priority: 'must-do',
              weather_dependent: false,
              accessibility_features: ['wheelchair_accessible'],
              aiSuggestions: {
                alternativeTimes: ['17:30', '18:30', '19:00'],
                nearbyAttractions: ['Shibuya Sky', 'Center Gai'],
                tipsSuggestions: [
                  'Best photos from Starbucks overlook',
                  'Visit during rush hour for crowds',
                ],
              },
            },
          ],
          meals: {
            dinner: {
              id: 'dinner1',
              title: 'Authentic Ramen Experience',
              description: 'Traditional tonkotsu ramen at famous local spot',
              location: {
                id: 'ramen1',
                name: 'Ippudo Ramen Shibuya',
                address: '2-1-1 Shibuya, Tokyo',
                coordinates: { lat: 35.658, lng: 139.7016 },
                type: 'restaurant',
                category: 'ramen',
                rating: 4.6,
                priceRange: '$$',
                estimatedDuration: 45,
                openingHours: {
                  monday: { open: '11:00', close: '23:00' },
                  tuesday: { open: '11:00', close: '23:00' },
                  wednesday: { open: '11:00', close: '23:00' },
                  thursday: { open: '11:00', close: '23:00' },
                  friday: { open: '11:00', close: '23:00' },
                  saturday: { open: '11:00', close: '23:00' },
                  sunday: { open: '11:00', close: '23:00' },
                },
                tags: ['ramen', 'authentic', 'popular'],
              },
              startTime: '19:30',
              endTime: '20:15',
              duration: 45,
              cost: 25,
              isBooked: false,
              priority: 'recommended',
              weather_dependent: false,
              accessibility_features: ['english_menu'],
              aiSuggestions: {
                alternativeTimes: ['19:00', '20:00'],
                nearbyAttractions: ['Don Quijote Shibuya'],
                tipsSuggestions: ['Try the chashu pork', 'Order gyoza as side'],
              },
            },
          },
          transportation: [
            {
              method: 'public',
              estimatedCost: 50,
              duration: 120,
              notes: 'Narita Express to Shibuya',
            },
            {
              method: 'walking',
              estimatedCost: 0,
              duration: 45,
              notes: 'Walking between nearby attractions',
            },
          ],
          totalCost: 125,
          estimatedWalkingDistance: 1200,
          recommendations: {
            packingList: [
              'Comfortable walking shoes',
              'Camera',
              'Portable charger',
            ],
            tips: [
              'Download offline maps',
              'Keep IC card handy',
              'Try convenience store snacks',
            ],
            weatherConsiderations: [
              'Light jacket for evening',
              'Umbrella (just in case)',
            ],
          },
        },
      ],
      weather: {
        '2024-09-15': {
          condition: 'partly_cloudy',
          temperature: { high: 26, low: 20 },
          precipitation: 10,
        },
      },
      aiOptimizations: {
        routeOptimization: {
          originalDistance: 15000,
          optimizedDistance: 12000,
          timeSaved: 45,
        },
        costOptimization: {
          originalCost: 2800,
          optimizedCost: 2450,
          savings: 350,
        },
        personalizedRecommendations: {
          based_on: [
            'photography interest',
            'moderate pace',
            'cultural preferences',
          ],
          suggestions: [
            {
              activity: 'Golden Hour Photography at Tokyo Tower',
              reason: 'Perfect for photography enthusiasts',
              confidence: 95,
            },
            {
              activity: 'Cooking Class in Tsukiji',
              reason: 'Matches food and cultural interests',
              confidence: 88,
            },
          ],
        },
      },
      sharing: {
        isPublic: false,
        collaborators: ['jane.smith@email.com'],
      },
    },
  ]);

  const [selectedItinerary] = useState<TripItinerary>(itineraries[0]);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay>(
    itineraries[0].days[0]
  );

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'partly_cloudy':
        return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTransportIcon = (method: string) => {
    switch (method) {
      case 'walking':
        return <Walking className="w-4 h-4" />;
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'train':
        return <Train className="w-4 h-4" />;
      case 'plane':
        return <Plane className="w-4 h-4" />;
      default:
        return <Navigation className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'attraction':
        return <Camera className="w-4 h-4" />;
      case 'hotel':
        return <MapPin className="w-4 h-4" />;
      case 'transport':
        return <Navigation className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'must-do':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      case 'recommended':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'optional':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🗺️ Trip Itinerary Planner
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered itinerary creation with personalized recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border hover:border-border/80"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Itinerary
          </Button>
        </div>
      </div>

      {/* Itinerary Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {selectedItinerary.tripName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{selectedItinerary.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {selectedItinerary.startDate} to {selectedItinerary.endDate}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{selectedItinerary.travelers.length} travelers</span>
              </div>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Optimized
          </Badge>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Route className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-foreground">
                Route Optimized
              </span>
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {selectedItinerary.aiOptimizations.routeOptimization.timeSaved}{' '}
              min saved
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-foreground">
                Cost Optimized
              </span>
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(
                selectedItinerary.aiOptimizations.costOptimization.savings
              )}{' '}
              saved
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-foreground">
                Personalized
              </span>
            </div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {
                selectedItinerary.aiOptimizations.personalizedRecommendations
                  .suggestions.length
              }{' '}
              AI suggestions
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Flag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-foreground">
                Activities
              </span>
            </div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {selectedDay.activities.length} planned
            </div>
          </div>
        </div>
      </Card>

      {/* Day Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {selectedItinerary.days.map((day, index) => {
          const weather = selectedItinerary.weather[day.date];
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex-shrink-0 p-3 rounded-lg border transition-all',
                day.id === selectedDay.id
                  ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'bg-background border-border hover:border-border/80'
              )}
            >
              <div className="text-sm font-medium">Day {index + 1}</div>
              <div className="text-xs text-muted-foreground">{day.date}</div>
              {weather && (
                <div className="flex items-center gap-1 mt-1">
                  {getWeatherIcon(weather.condition)}
                  <span className="text-xs">{weather.temperature.high}°</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">
                {selectedDay.theme ||
                  `Day ${selectedItinerary.days.indexOf(selectedDay) + 1} Activities`}
              </h4>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                  {formatCurrency(selectedDay.totalCost)} total
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:border-border/80"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit Day
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {selectedDay.activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                  {/* Time */}
                  <div className="flex-shrink-0 w-20 text-sm text-muted-foreground text-right">
                    <div>{formatTime(activity.startTime)}</div>
                    <div className="text-xs">{activity.duration}min</div>
                  </div>

                  {/* Timeline Line */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-background" />
                    {index < selectedDay.activities.length - 1 && (
                      <div className="w-px h-16 bg-border mt-2" />
                    )}
                  </div>

                  {/* Activity Card */}
                  <Card className="flex-1 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500/20 p-1.5 rounded">
                          {getActivityIcon(activity.location.type)}
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground">
                            {activity.title}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {activity.location.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.cost && activity.cost > 0 && (
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(activity.cost)}
                          </span>
                        )}
                        <Badge
                          className={cn(
                            'text-xs border',
                            getPriorityColor(activity.priority)
                          )}
                        >
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {activity.location.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{activity.location.rating}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{activity.duration} minutes</span>
                      </div>
                      {activity.isBooked && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Booked</span>
                        </div>
                      )}
                    </div>

                    {/* AI Tips */}
                    {activity.aiSuggestions.tipsSuggestions.length > 0 && (
                      <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            AI Tips
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.aiSuggestions.tipsSuggestions[0]}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Day Summary & Recommendations */}
        <div className="space-y-4">
          {/* Weather */}
          {selectedItinerary.weather[selectedDay.date] && (
            <Card className="p-4">
              <h5 className="font-medium text-foreground mb-3">
                Weather Forecast
              </h5>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(
                    selectedItinerary.weather[selectedDay.date].condition
                  )}
                  <span className="text-sm capitalize">
                    {selectedItinerary.weather[
                      selectedDay.date
                    ].condition.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    {
                      selectedItinerary.weather[selectedDay.date].temperature
                        .high
                    }
                    ° /{' '}
                    {
                      selectedItinerary.weather[selectedDay.date].temperature
                        .low
                    }
                    °
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Transportation */}
          <Card className="p-4">
            <h5 className="font-medium text-foreground mb-3">Transportation</h5>
            <div className="space-y-2">
              {selectedDay.transportation.map((transport, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {getTransportIcon(transport.method)}
                    <span className="capitalize">{transport.method}</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(transport.estimatedCost)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Packing Recommendations */}
          <Card className="p-4">
            <h5 className="font-medium text-foreground mb-3">Packing List</h5>
            <div className="space-y-1">
              {selectedDay.recommendations.packingList.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h5 className="font-medium text-foreground">
                AI Recommendations
              </h5>
            </div>
            <div className="space-y-2">
              {selectedItinerary.aiOptimizations.personalizedRecommendations.suggestions.map(
                (suggestion, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-foreground">
                      {suggestion.activity}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {suggestion.reason}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      {suggestion.confidence}% confidence
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Add to Calendar
        </Button>
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <Heart className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>
  );
}
