'use client';

import { useState } from 'react';
import { Button, Card, Badge } from '@skyscout/ui';
import {
  Plane,
  Clock,
  Star,
  Heart,
  ArrowRight,
  Wifi,
  Coffee,
  Monitor,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import type { FlightOffer } from '@skyscout/shared';
import { cn } from '@skyscout/ui';

interface FlightResultsProps {
  results: FlightOffer[];
  isLoading: boolean;
  onAddToWishlist: (flight: FlightOffer) => void;
  onBookFlight: (flight: FlightOffer) => void;
  className?: string;
}

export function FlightResults({
  results,
  isLoading,
  onAddToWishlist,
  onBookFlight,
  className,
}: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'confidence'>(
    'price'
  );
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
    new Set()
  );

  const handleWishlist = (flight: FlightOffer) => {
    const newWishlisted = new Set(wishlistedItems);
    if (newWishlisted.has(flight.id)) {
      newWishlisted.delete(flight.id);
    } else {
      newWishlisted.add(flight.id);
      onAddToWishlist(flight);
    }
    setWishlistedItems(newWishlisted);
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'confidence':
        return b.confidence - a.confidence;
      default:
        return 0;
    }
  });

  const getPredictionIcon = (prediction: string) => {
    if (prediction.includes('drop') || prediction.includes('decrease')) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    if (prediction.includes('increase') || prediction.includes('rise')) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90)
      return {
        variant: 'default' as const,
        text: 'Excellent Deal',
        color: 'bg-green-500',
      };
    if (confidence >= 80)
      return {
        variant: 'secondary' as const,
        text: 'Great Price',
        color: 'bg-blue-500',
      };
    if (confidence >= 70)
      return {
        variant: 'outline' as const,
        text: 'Good Value',
        color: 'bg-yellow-500',
      };
    return {
      variant: 'outline' as const,
      text: 'Fair Price',
      color: 'bg-gray-500',
    };
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Searching for the best flights...
          </h2>
          <div className="flex items-center gap-2 text-primary">
            <Zap className="h-5 w-5 animate-pulse" />
            <span className="font-medium">AI at work</span>
          </div>
        </div>

        {/* Loading skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-muted rounded" />
                  <div className="w-24 h-3 bg-muted rounded" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-16 h-6 bg-muted rounded" />
                <div className="w-12 h-4 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Results header with sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{results.length} flights found</h2>
          <p className="text-muted-foreground">
            Sorted by {sortBy} • Updated just now
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          {(['price', 'duration', 'confidence'] as const).map(option => (
            <Button
              key={option}
              variant={sortBy === option ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy(option)}
              className="capitalize"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Flight results */}
      <div className="space-y-4">
        {sortedResults.map((flight, index) => {
          const confidence = getConfidenceBadge(flight.confidence);
          const isWishlisted = wishlistedItems.has(flight.id);

          return (
            <Card
              key={flight.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-primary/20"
            >
              {/* Best deal banner */}
              {index === 0 && (
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Best Deal - Save up to $200
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Flight info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Airline logo placeholder */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {flight.airline}
                        </h3>
                        <p className="text-muted-foreground">
                          {flight.aircraft}
                        </p>
                      </div>

                      {/* Confidence badge */}
                      <Badge variant={confidence.variant} className="ml-auto">
                        {confidence.text}
                      </Badge>
                    </div>

                    {/* Route and timing */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">{flight.origin}</div>
                        <div className="text-sm text-muted-foreground">
                          Departure
                        </div>
                      </div>

                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-px bg-border" />
                        <div className="flex flex-col items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {flight.duration}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {flight.stops === 0
                              ? 'Non-stop'
                              : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      <div className="text-center">
                        <div className="font-bold text-lg">
                          {flight.destination}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Arrival
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Wifi className="h-4 w-4" />
                        <span>WiFi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coffee className="h-4 w-4" />
                        <span>Meals</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor className="h-4 w-4" />
                        <span>Entertainment</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and actions */}
                  <div className="lg:text-right space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        ${flight.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per person • {flight.currency}
                      </div>
                    </div>

                    {/* AI Prediction */}
                    <div className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-lg">
                      {getPredictionIcon(flight.prediction)}
                      <span className="font-medium">AI Insight:</span>
                      <span className="text-muted-foreground">
                        {flight.prediction}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => onBookFlight(flight)}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleWishlist(flight)}
                        className={cn(
                          'w-full transition-colors',
                          isWishlisted
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'hover:border-primary/20'
                        )}
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4 mr-2 transition-colors',
                            isWishlisted ? 'fill-current text-red-500' : ''
                          )}
                        />
                        {isWishlisted ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load more button */}
      {results.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            Load More Flights
          </Button>
        </div>
      )}

      {/* Pro tips for better deals */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Pro Tips for Better Deals
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
              <li>
                • Try flexible dates - save up to 30% by shifting your trip by
                1-2 days
              </li>
              <li>
                • Consider nearby airports - sometimes worth the extra travel
                time
              </li>
              <li>
                • Book Tuesday departures - typically 20% cheaper than weekend
                flights
              </li>
              <li>• Set price alerts for routes you search frequently</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
