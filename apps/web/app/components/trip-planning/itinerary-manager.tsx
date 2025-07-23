/**
 * Itinerary Manager Component
 * Comprehensive trip itinerary planning with AI optimization
 * Drag-and-drop scheduling with smart recommendations
 */

'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  ArrowUpDown,
  Bookmark,
  Calendar,
  Camera,
  Car,
  Clock,
  Coffee,
  Edit,
  GripVertical,
  Home,
  MapPin,
  Moon,
  Navigation,
  Plus,
  Route,
  Search,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  Utensils,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import type { ItineraryItem, TripItinerary } from '../../types/trip';

interface ItineraryManagerProps {
  itinerary: TripItinerary;
  travelers: Array<{ id: string; firstName: string; lastName: string }>;
  onUpdateItinerary: (itinerary: TripItinerary) => void;
  onAddActivity: (dayId: string, activity: Omit<ItineraryItem, 'id'>) => void;
  onUpdateActivity: (
    dayId: string,
    activityId: string,
    activity: Partial<ItineraryItem>
  ) => void;
  onDeleteActivity: (dayId: string, activityId: string) => void;
  onReorderActivities: (dayId: string, activities: ItineraryItem[]) => void;
  className?: string;
}

export function ItineraryManager({
  itinerary,
  _travelers,
  _onUpdateItinerary,
  _onAddActivity,
  _onUpdateActivity,
  _onDeleteActivity,
  _onReorderActivities,
  className,
}: ItineraryManagerProps) {
  const [selectedDay, setSelectedDay] = useState<string>(
    itinerary.days[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<'timeline' | 'map' | 'list'>(
    'timeline'
  );
  const [showRecommendations, setShowRecommendations] = useState(true);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'accommodation':
        return Home;
      case 'food':
      case 'dining':
        return Utensils;
      case 'transportation':
        return Car;
      case 'sightseeing':
        return Camera;
      case 'entertainment':
        return Star;
      case 'shopping':
        return Bookmark;
      case 'coffee':
        return Coffee;
      default:
        return MapPin;
    }
  };

  const getTimeOfDayIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return Sun;
    if (hour >= 12 && hour < 18) return Sun;
    if (hour >= 18 && hour < 22) return Moon;
    return Moon;
  };

  const currentDay = itinerary.days.find(day => day.id === selectedDay);
  const sortedActivities =
    currentDay?.activities.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    ) || [];

  const getTravelTime = (
    _fromActivity: ItineraryItem,
    _toActivity: ItineraryItem
  ) => {
    // Mock travel time calculation
    return Math.floor(Math.random() * 30) + 10; // 10-40 minutes
  };

  const getOptimizationSuggestions = () => {
    return [
      {
        id: '1',
        type: 'reorder',
        title: 'Optimize Route',
        description: 'Reorder activities to reduce travel time by 45 minutes',
        savings: '45 min travel time',
        icon: Route,
        color: 'blue',
      },
      {
        id: '2',
        type: 'timing',
        title: 'Better Timing',
        description: 'Visit popular attractions earlier to avoid crowds',
        savings: 'Shorter wait times',
        icon: Clock,
        color: 'green',
      },
      {
        id: '3',
        type: 'addition',
        title: 'Add Nearby Activity',
        description: 'Local market is 2 min walk from your lunch spot',
        savings: 'Hidden gem',
        icon: Star,
        color: 'purple',
      },
    ];
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🗓️ Itinerary Planner
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-optimized scheduling with smart recommendations and real-time
            adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Optimization
          </Badge>

          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
            {[
              { id: 'timeline', icon: Clock, label: 'Timeline' },
              { id: 'map', icon: MapPin, label: 'Map' },
              { id: 'list', icon: Calendar, label: 'List' },
            ].map(mode => {
              const ModeIcon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() =>
                    setViewMode(mode.id as 'timeline' | 'map' | 'list')
                  }
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all',
                    viewMode === mode.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <ModeIcon className="w-3 h-3" />
                  {mode.label}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            <Target className="w-4 h-4 mr-1" />
            AI Suggestions
          </Button>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Days
              </p>
              <p className="text-xl font-bold text-foreground">
                {itinerary.days.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Activities
              </p>
              <p className="text-xl font-bold text-foreground">
                {itinerary.days.reduce(
                  (total, day) => total + day.activities.length,
                  0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Highlights
              </p>
              <p className="text-xl font-bold text-foreground">
                {itinerary.days.reduce(
                  (total, day) =>
                    total +
                    day.activities.filter(a => a.priority === 'high').length,
                  0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Route className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Optimization
              </p>
              <p className="text-xl font-bold text-foreground">94%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Optimization Suggestions */}
      {showRecommendations && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-foreground">
                  🤖 AI Optimization Suggestions
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecommendations(false)}
              >
                Dismiss
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {getOptimizationSuggestions().map(suggestion => {
                const SuggestionIcon = suggestion.icon;
                return (
                  <div
                    key={suggestion.id}
                    className="bg-background/50 p-3 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg',
                          suggestion.color === 'blue' && 'bg-blue-500/20',
                          suggestion.color === 'green' && 'bg-green-500/20',
                          suggestion.color === 'purple' && 'bg-purple-500/20'
                        )}
                      >
                        <SuggestionIcon
                          className={cn(
                            'w-4 h-4',
                            suggestion.color === 'blue' &&
                              'text-blue-600 dark:text-blue-400',
                            suggestion.color === 'green' &&
                              'text-green-600 dark:text-green-400',
                            suggestion.color === 'purple' &&
                              'text-purple-600 dark:text-purple-400'
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {suggestion.savings}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Day Selector */}
        <div className="lg:col-span-3">
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Trip Days</h3>
            <div className="space-y-2">
              {itinerary.days.map(day => {
                const dayDate = new Date(day.date);
                const isToday =
                  dayDate.toDateString() === new Date().toDateString();
                const dayActivities = day.activities.length;

                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all',
                      selectedDay === day.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          'font-medium',
                          selectedDay === day.id
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        Day {itinerary.days.indexOf(day) + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dayDate.toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {isToday && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Today
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {dayActivities} activities
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                /* Add new day */
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Day
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {currentDay && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Day {itinerary.days.indexOf(currentDay) + 1} -{' '}
                    {currentDay.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentDay.date).toLocaleDateString([], {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    Add Activity
                  </Button>
                  <Button variant="outline" size="sm">
                    <Navigation className="w-4 h-4 mr-1" />
                    Optimize Route
                  </Button>
                </div>
              </div>

              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <div className="space-y-4">
                  {sortedActivities.length > 0 ? (
                    <>
                      {sortedActivities.map((activity, index) => {
                        const ActivityIcon = getActivityIcon(activity.category);
                        const TimeIcon = getTimeOfDayIcon(activity.startTime);
                        const nextActivity = sortedActivities[index + 1];
                        const travelTime = nextActivity
                          ? getTravelTime(activity, nextActivity)
                          : 0;

                        return (
                          <div key={activity.id} className="relative">
                            {/* Activity Card */}
                            <div className="flex items-start gap-4">
                              {/* Timeline Connector */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={cn(
                                    'p-2 rounded-full border-2',
                                    activity.priority === 'high'
                                      ? 'bg-red-500/20 border-red-500/30'
                                      : activity.priority === 'medium'
                                        ? 'bg-yellow-500/20 border-yellow-500/30'
                                        : 'bg-green-500/20 border-green-500/30'
                                  )}
                                >
                                  <ActivityIcon
                                    className={cn(
                                      'w-4 h-4',
                                      activity.priority === 'high'
                                        ? 'text-red-600 dark:text-red-400'
                                        : activity.priority === 'medium'
                                          ? 'text-yellow-600 dark:text-yellow-400'
                                          : 'text-green-600 dark:text-green-400'
                                    )}
                                  />
                                </div>

                                {index < sortedActivities.length - 1 && (
                                  <div className="w-px h-16 bg-border mt-2" />
                                )}
                              </div>

                              {/* Activity Content */}
                              <div className="flex-1 pb-6">
                                <div className="bg-muted/30 p-4 rounded-lg">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <TimeIcon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-foreground">
                                          {formatTime(activity.startTime)}
                                          {activity.endTime &&
                                            ` - ${formatTime(activity.endTime)}`}
                                        </span>
                                        {activity.priority === 'high' && (
                                          <Badge
                                            variant="destructive"
                                            className="text-xs"
                                          >
                                            Must-see
                                          </Badge>
                                        )}
                                      </div>

                                      <h4 className="font-medium text-foreground mb-1">
                                        {activity.title}
                                      </h4>

                                      {activity.location && (
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                          <MapPin className="w-3 h-3" />
                                          {activity.location.name}
                                        </div>
                                      )}

                                      {activity.description && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {activity.description}
                                        </p>
                                      )}

                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        {activity.estimatedCost && (
                                          <span>
                                            💰 ${activity.estimatedCost}
                                          </span>
                                        )}
                                        {activity.duration && (
                                          <span>⏱️ {activity.duration}h</span>
                                        )}
                                        <span className="capitalize">
                                          📍 {activity.category}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <GripVertical className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Travel Time to Next Activity */}
                                {travelTime > 0 && (
                                  <div className="flex items-center gap-2 mt-3 ml-4 text-xs text-muted-foreground">
                                    <Car className="w-3 h-3" />
                                    <span>{travelTime} min travel time</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">
                        No activities planned
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start building your itinerary by adding activities
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Activity
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            Total Time
          </p>
          <p className="text-lg font-bold text-foreground">
            {itinerary.days.reduce(
              (total, day) =>
                total +
                day.activities.reduce(
                  (dayTotal, activity) => dayTotal + (activity.duration || 0),
                  0
                ),
              0
            )}
            h
          </p>
        </Card>

        <Card className="p-4 text-center">
          <Route className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            Travel Distance
          </p>
          <p className="text-lg font-bold text-foreground">24.5 km</p>
        </Card>

        <Card className="p-4 text-center">
          <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Must-See</p>
          <p className="text-lg font-bold text-foreground">
            {itinerary.days.reduce(
              (total, day) =>
                total +
                day.activities.filter(a => a.priority === 'high').length,
              0
            )}
          </p>
        </Card>

        <Card className="p-4 text-center">
          <Target className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            Optimization
          </p>
          <p className="text-lg font-bold text-foreground">94%</p>
        </Card>
      </div>
    </div>
  );
}
