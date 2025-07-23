/**
 * Hotel Trending Destinations Component
 * Shows popular destinations with accommodation deals
 * Designed to outperform Booking.com with better prices and options
 */

'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  ArrowRight,
  Building,
  Calendar,
  Heart,
  Home,
  MapPin,
  Plane,
  Shield,
  Sparkles,
  Star,
  Target,
  TreePine,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface TrendingDestination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  averagePrice: number;
  dealPrice: number;
  savings: number;
  popularityIncrease: number;
  totalProperties: number;
  aiDeals: number;
  highlights: string[];
  accommodationTypes: {
    hotels: number;
    apartments: number;
    villas: number;
    unique: number;
  };
  bestProvider: {
    name: string;
    type: 'airbnb' | 'vrbo' | 'hotel' | 'direct';
    discount: number;
  };
  climate: string;
  bestTime: string;
  flightDeals?: {
    fromPrice: number;
    airline: string;
  };
  specialOffers: string[];
}

export function HotelTrendingDestinations({
  className,
}: {
  className?: string;
}) {
  const [destinations] = useState<TrendingDestination[]>([
    {
      id: '1',
      name: 'Santorini',
      country: 'Greece',
      image: '/images/santorini.jpg',
      description: 'Stunning sunsets and white-washed buildings',
      averagePrice: 320,
      dealPrice: 199,
      savings: 121,
      popularityIncrease: 45,
      totalProperties: 2847,
      aiDeals: 342,
      highlights: ['Sunset views', 'Cave hotels', 'Wine tours'],
      accommodationTypes: {
        hotels: 1200,
        apartments: 800,
        villas: 600,
        unique: 247,
      },
      bestProvider: {
        name: 'Local Hosts',
        type: 'airbnb',
        discount: 38,
      },
      climate: '24°C sunny',
      bestTime: 'Apr-Oct',
      flightDeals: {
        fromPrice: 299,
        airline: 'Aegean Airlines',
      },
      specialOffers: [
        'Free breakfast',
        '2-for-1 wine tours',
        'Airport transfers',
      ],
    },
    {
      id: '2',
      name: 'Kyoto',
      country: 'Japan',
      image: '/images/kyoto.jpg',
      description: 'Traditional temples and cherry blossoms',
      averagePrice: 180,
      dealPrice: 135,
      savings: 45,
      popularityIncrease: 67,
      totalProperties: 3421,
      aiDeals: 456,
      highlights: ['Temples', 'Gardens', 'Traditional inns'],
      accommodationTypes: {
        hotels: 1800,
        apartments: 900,
        villas: 200,
        unique: 521,
      },
      bestProvider: {
        name: 'Ryokan Direct',
        type: 'direct',
        discount: 25,
      },
      climate: '22°C mild',
      bestTime: 'Mar-May, Sep-Nov',
      flightDeals: {
        fromPrice: 649,
        airline: 'JAL',
      },
      specialOffers: ['Tea ceremony', 'Zen garden access', 'Kimono rental'],
    },
    {
      id: '3',
      name: 'Tulum',
      country: 'Mexico',
      image: '/images/tulum.jpg',
      description: 'Boho-chic vibes meet ancient Mayan ruins',
      averagePrice: 220,
      dealPrice: 155,
      savings: 65,
      popularityIncrease: 89,
      totalProperties: 1876,
      aiDeals: 287,
      highlights: ['Beach clubs', 'Cenotes', 'Eco-luxury'],
      accommodationTypes: {
        hotels: 800,
        apartments: 400,
        villas: 500,
        unique: 176,
      },
      bestProvider: {
        name: 'VRBO Villas',
        type: 'vrbo',
        discount: 30,
      },
      climate: '28°C tropical',
      bestTime: 'Dec-Apr',
      flightDeals: {
        fromPrice: 389,
        airline: 'Aeromexico',
      },
      specialOffers: ['Cenote tours', 'Yoga classes', 'Mayan ruins access'],
    },
    {
      id: '4',
      name: 'Lisbon',
      country: 'Portugal',
      image: '/images/lisbon.jpg',
      description: 'Historic charm with modern elegance',
      averagePrice: 120,
      dealPrice: 89,
      savings: 31,
      popularityIncrease: 78,
      totalProperties: 4123,
      aiDeals: 523,
      highlights: ['Tram rides', 'Fado music', 'Port wine'],
      accommodationTypes: {
        hotels: 2000,
        apartments: 1500,
        villas: 300,
        unique: 323,
      },
      bestProvider: {
        name: 'Airbnb Hosts',
        type: 'airbnb',
        discount: 26,
      },
      climate: '21°C perfect',
      bestTime: 'Mar-Oct',
      flightDeals: {
        fromPrice: 299,
        airline: 'TAP Air Portugal',
      },
      specialOffers: ['Tram passes', 'Fado dinner', 'Wine tastings'],
    },
  ]);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (destinationId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(destinationId)) {
        newSet.delete(destinationId);
      } else {
        newSet.add(destinationId);
      }
      return newSet;
    });
  };

  const getProviderBadge = (provider: TrendingDestination['bestProvider']) => {
    switch (provider.type) {
      case 'airbnb':
        return {
          color:
            'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30',
          emoji: '🏠',
        };
      case 'vrbo':
        return {
          color:
            'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
          emoji: '🏖️',
        };
      case 'hotel':
        return {
          color:
            'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
          emoji: '🏨',
        };
      case 'direct':
        return {
          color:
            'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
          emoji: '🎯',
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground border-border',
          emoji: '🏠',
        };
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🔥 Trending Destinations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Popular places with the best accommodation deals across all
            platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            AI Optimized
          </Badge>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <Shield className="w-3 h-3 mr-1" />
            Best Price Guarantee
          </Badge>
        </div>
      </div>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinations.map(destination => {
          const providerBadge = getProviderBadge(destination.bestProvider);
          const savingsPercent = Math.round(
            (destination.savings / destination.averagePrice) * 100
          );

          return (
            <Card
              key={destination.id}
              className="group relative overflow-hidden bg-card border-border hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              {/* Trending Badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                <TrendingUp className="w-3 h-3" />+
                {destination.popularityIncrease}%
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(destination.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all"
              >
                <Heart
                  className={cn(
                    'w-4 h-4 transition-colors',
                    favorites.has(destination.id)
                      ? 'text-red-500 fill-current'
                      : 'text-muted-foreground'
                  )}
                />
              </button>

              <div className="p-4 space-y-3">
                {/* Destination Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-border relative overflow-hidden">
                  <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      {destination.bestTime}
                    </span>
                  </div>
                </div>

                {/* Destination Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {destination.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {destination.climate}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {destination.description}
                  </p>
                </div>

                {/* Price and Provider */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${destination.dealPrice}
                      </span>
                      <span className="text-xs text-muted-foreground line-through ml-1">
                        ${destination.averagePrice}
                      </span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                      {savingsPercent}% off
                    </Badge>
                  </div>

                  <Badge className={cn('text-xs border', providerBadge.color)}>
                    <span className="mr-1">{providerBadge.emoji}</span>
                    Best on {destination.bestProvider.name}
                  </Badge>
                </div>

                {/* Property Types */}
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div className="text-center">
                    <Building className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <span className="text-muted-foreground">
                      {destination.accommodationTypes.hotels}
                    </span>
                  </div>
                  <div className="text-center">
                    <Home className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <span className="text-muted-foreground">
                      {destination.accommodationTypes.apartments}
                    </span>
                  </div>
                  <div className="text-center">
                    <TreePine className="w-4 h-4 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                    <span className="text-muted-foreground">
                      {destination.accommodationTypes.villas}
                    </span>
                  </div>
                  <div className="text-center">
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                    <span className="text-muted-foreground">
                      {destination.accommodationTypes.unique}
                    </span>
                  </div>
                </div>

                {/* AI Deals Counter */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Deals Available</span>
                    </div>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {destination.aiDeals}
                    </span>
                  </div>
                </div>

                {/* Flight Deal */}
                {destination.flightDeals && (
                  <div className="flex items-center justify-between text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Plane className="w-3 h-3" />
                      <span>
                        Flights from ${destination.flightDeals.fromPrice}
                      </span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {destination.flightDeals.airline}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  View Deals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Competitive Advantage */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                🎯 Why Our Trending Destinations Beat the Competition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">
                    Real-Time Popularity:
                  </strong>{' '}
                  Our AI tracks booking trends across all platforms to identify
                  rising destinations before they become expensive.
                </div>
                <div>
                  <strong className="text-foreground">
                    Multi-Provider Comparison:
                  </strong>{' '}
                  We compare Airbnb, VRBO, Hotels.com, and Booking.com to find
                  the absolute best deals.
                </div>
                <div>
                  <strong className="text-foreground">
                    Package Optimization:
                  </strong>{' '}
                  Bundle flights + hotels for additional savings that other
                  platforms can't match.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
