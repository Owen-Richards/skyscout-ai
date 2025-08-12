'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  ArrowRight,
  Camera,
  Clock,
  Flame,
  Heart,
  MapPin,
  Plane,
  Star,
  Thermometer,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface TrendingDestination {
  id: string;
  city: string;
  country: string;
  continent: string;
  code: string;
  image: string;
  imageUrl?: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  popularity: number;
  searchesThisWeek: number;
  searchGrowth: number;
  description: string;
  highlights: string[];
  topActivities: string[];
  seasonality: 'peak' | 'shoulder' | 'off-peak';
  popularMonths: string[];
  weather: {
    current: number;
    condition: string;
    icon: string;
  };
  flightTime: string;
  dealBadge?: string;
  isWishlisted?: boolean;
  trendingRank: number;
}

export function TrendingDestinations({ className }: { className?: string }) {
  const [destinations] = useState<TrendingDestination[]>([
    {
      id: '1',
      city: 'Paris',
      country: 'France',
      continent: 'Europe',
      code: 'CDG',
      image: '🗼',
      price: 698,
      priceChange: -127,
      priceChangePercent: -15,
      popularity: 97,
      searchesThisWeek: 12847,
      searchGrowth: 34,
      description:
        'The City of Light awaits with world-class museums and cuisine',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Champs-Élysées'],
      topActivities: ['Museums', 'Cafés', 'Architecture'],
      seasonality: 'shoulder',
      popularMonths: ['Apr', 'May', 'Sep', 'Oct'],
      weather: {
        current: 18,
        condition: 'Partly cloudy',
        icon: '⛅',
      },
      flightTime: '7h 30m',
      dealBadge: 'Spring Sale',
      isWishlisted: false,
      trendingRank: 1,
    },
    {
      id: '2',
      city: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      code: 'NRT',
      image: '🗾',
      price: 892,
      priceChange: 43,
      priceChangePercent: 5,
      popularity: 95,
      searchesThisWeek: 18394,
      searchGrowth: 67,
      description: 'Experience the perfect blend of tradition and innovation',
      highlights: ['Cherry blossoms', 'Amazing food', 'Rich culture'],
      topActivities: ['Temples', 'Food', 'Technology'],
      seasonality: 'peak',
      popularMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
      weather: {
        current: 22,
        condition: 'Sunny',
        icon: '☀️',
      },
      flightTime: '11h 45m',
      isWishlisted: true,
      trendingRank: 2,
    },
    {
      id: '3',
      city: 'Barcelona',
      country: 'Spain',
      continent: 'Europe',
      code: 'BCN',
      image: '🏛️',
      price: 547,
      priceChange: -89,
      priceChangePercent: -14,
      popularity: 88,
      searchesThisWeek: 9573,
      searchGrowth: 28,
      description: 'Stunning architecture meets vibrant beach culture',
      highlights: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter'],
      topActivities: ['Beach', 'Art', 'Nightlife'],
      seasonality: 'shoulder',
      popularMonths: ['May', 'Jun', 'Sep', 'Oct'],
      weather: {
        current: 25,
        condition: 'Clear',
        icon: '☀️',
      },
      flightTime: '8h 15m',
      dealBadge: 'Limited Time',
      isWishlisted: false,
      trendingRank: 3,
    },
    {
      id: '4',
      city: 'Dubai',
      country: 'UAE',
      continent: 'Asia',
      code: 'DXB',
      image: '🏗️',
      price: 743,
      priceChange: 23,
      priceChangePercent: 3,
      popularity: 91,
      searchesThisWeek: 14829,
      searchGrowth: 45,
      description: 'Luxury and innovation in the heart of the Middle East',
      highlights: ['Burj Khalifa', 'Shopping', 'Desert safaris'],
      topActivities: ['Shopping', 'Luxury', 'Desert'],
      seasonality: 'peak',
      popularMonths: ['Nov', 'Dec', 'Jan', 'Feb'],
      weather: {
        current: 28,
        condition: 'Sunny',
        icon: '☀️',
      },
      flightTime: '14h 20m',
      isWishlisted: false,
      trendingRank: 4,
    },
    {
      id: '5',
      city: 'Reykjavik',
      country: 'Iceland',
      continent: 'Europe',
      code: 'KEF',
      image: '🌋',
      price: 456,
      priceChange: -134,
      priceChangePercent: -23,
      popularity: 78,
      searchesThisWeek: 5847,
      searchGrowth: 89,
      description: 'Natural wonders and northern lights await',
      highlights: ['Northern Lights', 'Blue Lagoon', 'Geysers'],
      topActivities: ['Northern Lights', 'Geysers', 'Glaciers'],
      seasonality: 'off-peak',
      popularMonths: ['Jun', 'Jul', 'Aug', 'Sep'],
      weather: {
        current: 12,
        condition: 'Windy',
        icon: '🌬️',
      },
      flightTime: '5h 45m',
      dealBadge: 'Aurora Season',
      isWishlisted: false,
      trendingRank: 5,
    },
    {
      id: '6',
      city: 'Bali',
      country: 'Indonesia',
      continent: 'Asia',
      code: 'DPS',
      image: '🏝️',
      price: 967,
      priceChange: -156,
      priceChangePercent: -14,
      popularity: 85,
      searchesThisWeek: 11293,
      searchGrowth: 52,
      description: 'Tropical paradise with rich culture and stunning beaches',
      highlights: ['Ancient temples', 'Rice terraces', 'Beaches'],
      topActivities: ['Beaches', 'Temples', 'Wellness'],
      seasonality: 'shoulder',
      popularMonths: ['Apr', 'May', 'Jun', 'Sep'],
      weather: {
        current: 30,
        condition: 'Tropical',
        icon: '🌴',
      },
      flightTime: '18h 30m',
      isWishlisted: false,
      trendingRank: 6,
    },
  ]);

  const [wishlistedDestinations, setWishlistedDestinations] = useState<
    Set<string>
  >(new Set());

  const toggleWishlist = (destinationId: string) => {
    setWishlistedDestinations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(destinationId)) {
        newSet.delete(destinationId);
      } else {
        newSet.add(destinationId);
      }
      return newSet;
    });
  };

  const getSeasonalityColor = (
    seasonality: TrendingDestination['seasonality']
  ) => {
    switch (seasonality) {
      case 'peak':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      case 'shoulder':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'off-peak':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTrendingBadgeColor = (rank: number) => {
    if (rank <= 2) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (rank <= 4) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🌍 Trending Destinations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Discover where the world is traveling this season
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Updated hourly</span>
        </div>
      </div>

      {/* Featured Destination (#1 Trending) */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            🏆 #1 Trending
          </Badge>
        </div>
        <div className="absolute top-4 right-4 z-10">
          {destinations[0]?.dealBadge && (
            <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">
              <Flame className="w-3 h-3 mr-1" />
              {destinations[0].dealBadge}
            </Badge>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{destinations[0]?.image}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {destinations[0]?.city}, {destinations[0]?.country}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <span>
                        {destinations[0]?.weather.icon}{' '}
                        {destinations[0]?.weather.current}°C
                      </span>
                      <span>•</span>
                      <span>{destinations[0]?.weather.condition}</span>
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {destinations[0]?.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${destinations[0]?.price}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    avg. price
                  </div>
                  {destinations[0]?.priceChange &&
                    destinations[0].priceChange < 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center">
                        ↘ {Math.abs(destinations[0].priceChangePercent)}% off
                      </div>
                    )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">
                      +{destinations[0]?.searchGrowth}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    search growth
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-foreground font-semibold">
                    {destinations[0]?.searchesThisWeek.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    searches this week
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Top activities:
                </div>
                <div className="flex flex-wrap gap-2">
                  {destinations[0]?.topActivities.map((activity, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-border text-muted-foreground"
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Plane className="w-4 h-4 mr-2" />
                  Find Flights
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    destinations[0] && toggleWishlist(destinations[0].id)
                  }
                  className="border-border hover:border-border/80"
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 mr-2',
                      destinations[0]?.isWishlisted
                        ? 'fill-red-400 text-red-400'
                        : ''
                    )}
                  />
                  Save
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-border">
                <Camera className="w-12 h-12 text-muted-foreground" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-foreground font-semibold">
                  {destinations[0]?.city}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.slice(1).map(destination => (
          <Card
            key={destination.id}
            className="group relative overflow-hidden bg-card border-border hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            {/* Trending Rank Badge */}
            <div className="absolute top-3 left-3 z-10">
              <Badge
                className={cn(
                  'text-white border-0 text-xs',
                  getTrendingBadgeColor(destination.trendingRank)
                )}
              >
                #{destination.trendingRank}
              </Badge>
            </div>

            {/* Deal Badge */}
            {destination.dealBadge && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  {destination.dealBadge}
                </Badge>
              </div>
            )}

            <div className="p-4 space-y-4">
              {/* Image Placeholder with City Icon */}
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center border border-border relative overflow-hidden">
                <span className="text-4xl opacity-30">{destination.image}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                <div className="absolute bottom-2 left-2 text-foreground font-semibold text-sm">
                  {destination.city}
                </div>
              </div>

              {/* Destination Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {destination.city}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWishlist(destination.id)}
                    className="p-1 h-auto"
                  >
                    <Heart
                      className={cn(
                        'w-4 h-4',
                        wishlistedDestinations.has(destination.id) ||
                          destination.isWishlisted
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground hover:text-red-500'
                      )}
                    />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Thermometer className="w-3 h-3" />
                  <span>
                    {destination.weather.icon} {destination.weather.current}°C
                  </span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{destination.flightTime}</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ${destination.price}
                  </span>
                  {destination.priceChange !== 0 && (
                    <div
                      className={cn(
                        'text-xs flex items-center',
                        destination.priceChange > 0
                          ? 'text-red-500'
                          : 'text-green-600 dark:text-green-400'
                      )}
                    >
                      {destination.priceChange > 0 ? '↗' : '↘'}
                      <span className="ml-1">
                        {Math.abs(destination.priceChangePercent)}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Round trip from US • {destination.code}
                </p>
              </div>

              {/* Popularity & Season */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    +{destination.searchGrowth}% popularity
                  </span>
                </div>
                <Badge
                  className={cn(
                    'text-xs border',
                    getSeasonalityColor(destination.seasonality)
                  )}
                >
                  {destination.seasonality}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {destination.description}
              </p>

              {/* Popular Months */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Best months to visit:
                </div>
                <div className="flex flex-wrap gap-1">
                  {destination.popularMonths.slice(0, 3).map((month, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-border text-muted-foreground text-xs px-1 py-0"
                    >
                      {month}
                    </Badge>
                  ))}
                  {destination.popularMonths.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{destination.popularMonths.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                size="sm"
              >
                Explore Flights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pro Tip */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                💡 Travel Smart
              </h3>
              <p className="text-sm text-muted-foreground">
                Save destinations to your wishlist to track price drops and get
                notified about special deals. Our AI analyzes trends to help you
                book at the perfect moment.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* View All Button */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          View All Destinations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
