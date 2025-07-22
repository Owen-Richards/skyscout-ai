/**
 * Accommodation Deals Component
 * Showcases the best deals from Hotels, Airbnb, VRBO, and more
 * Designed to outperform Booking.com and Skyscanner with AI-powered optimization
 */

'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@skyscout/ui';
import {
  MapPin,
  Star,
  Heart,
  ArrowRight,
  Users,
  Bed,
  Bath,
  Home,
  Zap,
  Clock,
  TrendingDown,
  Sparkles,
  Target,
  Trophy,
  Shield,
} from 'lucide-react';
import { cn } from '@skyscout/ui';
import type { AccommodationDeal } from '../../types/hotels';

export function AccommodationDeals({ className }: { className?: string }) {
  const [deals] = useState<AccommodationDeal[]>([
    {
      id: '1',
      name: 'Luxury Central Park Apartment',
      type: 'apartment',
      provider: {
        id: 'airbnb',
        name: 'Airbnb',
        logo: '/logos/airbnb.png',
        type: 'airbnb',
        trustScore: 95,
        averageBookingTime: 5,
        cancellationPolicy: 'Flexible',
        bookingFee: 0,
        features: ['No booking fees', 'Local host', 'Authentic experience'],
      },
      originalPrice: 320,
      aiOptimizedPrice: 185,
      savings: 135,
      savingsPercent: 42,
      location: {
        address: '123 Central Park West',
        city: 'New York',
        country: 'USA',
        coordinates: { lat: 40.7829, lng: -73.9654 },
        landmarks: ['Central Park', 'Lincoln Center', 'Columbus Circle'],
        distanceToCenter: 0.5,
      },
      rating: {
        overall: 4.9,
        reviews: 127,
        breakdown: {
          cleanliness: 4.9,
          location: 5.0,
          value: 4.8,
          service: 4.9,
          comfort: 4.8,
        },
      },
      amenities: [
        'WiFi',
        'Kitchen',
        'Washer',
        'AC',
        'Workspace',
        'Gym',
        'Pool',
      ],
      images: ['/images/apt1.jpg'],
      description: 'Stunning apartment with Central Park views',
      highlights: ['Park views', 'Full kitchen', 'Prime location'],
      roomDetails: {
        beds: 2,
        bathrooms: 2,
        maxGuests: 4,
        size: 1200,
      },
      policies: {
        checkIn: '3:00 PM',
        checkOut: '11:00 AM',
        cancellation: 'Free cancellation until 24h before',
        petPolicy: 'Pets allowed',
        smokingPolicy: 'No smoking',
      },
      aiInsights: {
        priceConfidence: 98,
        popularityTrend: 'rising',
        bookingUrgency: 'high',
        similarPropertiesAverage: 280,
        optimalBookingWindow: 'Book in next 2 days',
      },
      isWishlisted: false,
      lastBooked: '8 minutes ago',
      bookingsToday: 12,
      dealType: 'ai-optimized',
      validUntil: '2024-07-25',
    },
    {
      id: '2',
      name: 'Boutique Hotel Tokyo Shibuya',
      type: 'hotel',
      provider: {
        id: 'direct',
        name: 'Hotel Direct',
        logo: '/logos/hotel-direct.png',
        type: 'direct',
        trustScore: 92,
        averageBookingTime: 3,
        cancellationPolicy: 'Moderate',
        bookingFee: 0,
        features: [
          'Best rate guarantee',
          'Direct booking perks',
          'No middleman',
        ],
      },
      originalPrice: 180,
      aiOptimizedPrice: 125,
      savings: 55,
      savingsPercent: 31,
      location: {
        address: 'Shibuya Crossing District',
        city: 'Tokyo',
        country: 'Japan',
        coordinates: { lat: 35.6595, lng: 139.7006 },
        landmarks: ['Shibuya Crossing', 'Harajuku', 'Meiji Shrine'],
        distanceToCenter: 2.1,
      },
      rating: {
        overall: 4.7,
        reviews: 893,
        breakdown: {
          cleanliness: 4.8,
          location: 4.9,
          value: 4.6,
          service: 4.7,
          comfort: 4.6,
        },
      },
      amenities: [
        'WiFi',
        'Breakfast',
        '24/7 Reception',
        'Gym',
        'Business Center',
      ],
      images: ['/images/hotel1.jpg'],
      description: 'Modern boutique hotel in the heart of Shibuya',
      highlights: ['Shibuya views', 'Traditional + modern', 'Rooftop bar'],
      roomDetails: {
        beds: 1,
        bathrooms: 1,
        maxGuests: 2,
        size: 300,
      },
      policies: {
        checkIn: '3:00 PM',
        checkOut: '11:00 AM',
        cancellation: 'Free cancellation until 48h before',
        petPolicy: 'No pets',
        smokingPolicy: 'Designated smoking areas',
      },
      aiInsights: {
        priceConfidence: 95,
        popularityTrend: 'stable',
        bookingUrgency: 'medium',
        similarPropertiesAverage: 165,
        optimalBookingWindow: 'Book within 5 days',
      },
      isWishlisted: true,
      lastBooked: '15 minutes ago',
      bookingsToday: 28,
      dealType: 'exclusive',
      validUntil: '2024-07-28',
    },
    {
      id: '3',
      name: 'Beachfront Villa Santorini',
      type: 'villa',
      provider: {
        id: 'vrbo',
        name: 'VRBO',
        logo: '/logos/vrbo.png',
        type: 'vrbo',
        trustScore: 89,
        averageBookingTime: 7,
        cancellationPolicy: 'Strict',
        bookingFee: 45,
        features: ['Vacation homes', 'Whole property', 'Family-friendly'],
      },
      originalPrice: 450,
      aiOptimizedPrice: 299,
      savings: 151,
      savingsPercent: 34,
      location: {
        address: 'Oia Sunset District',
        city: 'Santorini',
        country: 'Greece',
        coordinates: { lat: 36.4618, lng: 25.3753 },
        landmarks: ['Oia Sunset Point', 'Blue Dome Churches', 'Red Beach'],
        distanceToCenter: 1.2,
      },
      rating: {
        overall: 4.8,
        reviews: 234,
        breakdown: {
          cleanliness: 4.9,
          location: 4.9,
          value: 4.7,
          service: 4.6,
          comfort: 4.8,
        },
      },
      amenities: [
        'Private Pool',
        'Ocean View',
        'Kitchen',
        'Terrace',
        'BBQ',
        'Parking',
      ],
      images: ['/images/villa1.jpg'],
      description: 'Luxury villa with infinity pool and sunset views',
      highlights: ['Infinity pool', 'Sunset views', 'Private terrace'],
      roomDetails: {
        beds: 3,
        bathrooms: 2,
        maxGuests: 6,
        size: 1800,
      },
      policies: {
        checkIn: '4:00 PM',
        checkOut: '10:00 AM',
        cancellation: 'Strict - No refund after booking',
        petPolicy: 'No pets allowed',
        smokingPolicy: 'Outdoor smoking only',
      },
      aiInsights: {
        priceConfidence: 87,
        popularityTrend: 'rising',
        bookingUrgency: 'high',
        similarPropertiesAverage: 420,
        optimalBookingWindow: 'Book now - limited availability',
      },
      isWishlisted: false,
      lastBooked: '23 minutes ago',
      bookingsToday: 6,
      dealType: 'last-minute',
      validUntil: '2024-07-23',
    },
  ]);

  const [wishlistedDeals, setWishlistedDeals] = useState<Set<string>>(
    new Set()
  );

  const toggleWishlist = (dealId: string) => {
    setWishlistedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
      } else {
        newSet.add(dealId);
      }
      return newSet;
    });
  };

  const getDealTypeColor = (dealType: AccommodationDeal['dealType']) => {
    switch (dealType) {
      case 'flash':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      case 'ai-optimized':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'last-minute':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'exclusive':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'early-bird':
        return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDealTypeIcon = (dealType: AccommodationDeal['dealType']) => {
    switch (dealType) {
      case 'flash':
        return <Zap className="w-3 h-3" />;
      case 'ai-optimized':
        return <Sparkles className="w-3 h-3" />;
      case 'last-minute':
        return <Clock className="w-3 h-3" />;
      case 'exclusive':
        return <Trophy className="w-3 h-3" />;
      case 'early-bird':
        return <Target className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const formatDealType = (dealType: AccommodationDeal['dealType']) => {
    switch (dealType) {
      case 'flash':
        return '⚡ Flash Deal';
      case 'ai-optimized':
        return '🤖 AI Optimized';
      case 'last-minute':
        return '⏰ Last Minute';
      case 'exclusive':
        return '🏆 Exclusive';
      case 'early-bird':
        return '🎯 Early Bird';
      default:
        return 'Deal';
    }
  };

  const getProviderBadge = (provider: AccommodationDeal['provider']) => {
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
      {/* Header with competitive advantage */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🏠 Best Accommodation Deals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered deals from Hotels, Airbnb, VRBO & more - often better
            than Booking.com
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {deals.reduce((sum, deal) => sum + (deal.bookingsToday || 0), 0)}{' '}
              booked today
            </span>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <Shield className="w-3 h-3 mr-1" />
            Best Price Guarantee
          </Badge>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map(deal => {
          const providerBadge = getProviderBadge(deal.provider);

          return (
            <Card
              key={deal.id}
              className={cn(
                'group relative overflow-hidden bg-card border-border hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20',
                deal.dealType === 'flash' &&
                  'ring-1 ring-red-500/30 animate-pulse',
                deal.aiInsights.bookingUrgency === 'high' &&
                  'ring-1 ring-orange-500/30'
              )}
            >
              {/* AI Confidence Badge */}
              {deal.aiInsights.priceConfidence > 90 && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                  <Sparkles className="w-3 h-3" />
                  AI Verified
                </div>
              )}

              <div className="p-4 space-y-4">
                {/* Deal Type and Provider */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={cn(
                      'text-xs border',
                      getDealTypeColor(deal.dealType)
                    )}
                  >
                    {getDealTypeIcon(deal.dealType)}
                    <span className="ml-1">
                      {formatDealType(deal.dealType)}
                    </span>
                  </Badge>
                  <Badge className={cn('text-xs border', providerBadge.color)}>
                    <span className="mr-1">{providerBadge.emoji}</span>
                    {deal.provider.name}
                  </Badge>
                </div>

                {/* Property Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center border border-border relative overflow-hidden">
                  <Home className="w-12 h-12 text-muted-foreground" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold text-foreground">
                      {deal.rating.overall}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({deal.rating.reviews})
                    </span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                    {deal.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {deal.location.city}, {deal.location.country}
                    </span>
                    <span>•</span>
                    <span>{deal.location.distanceToCenter}km to center</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />
                      <span>
                        {deal.roomDetails.beds} bed
                        {deal.roomDetails.beds > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />
                      <span>{deal.roomDetails.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{deal.roomDetails.maxGuests} guests</span>
                    </div>
                  </div>
                </div>

                {/* Price and Savings */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${deal.aiOptimizedPrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${deal.originalPrice}
                    </span>
                    <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {deal.savingsPercent}% off
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Save ${deal.savings} vs average • Per night
                  </p>
                </div>

                {/* AI Insights */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Insight</span>
                    </div>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      {deal.aiInsights.optimalBookingWindow}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {deal.aiInsights.priceConfidence}% confident this is the
                    best price
                  </div>
                </div>

                {/* Social Proof */}
                {(deal.bookingsToday || deal.lastBooked) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {deal.bookingsToday && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{deal.bookingsToday} booked today</span>
                      </div>
                    )}
                    {deal.lastBooked && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Last booked {deal.lastBooked}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWishlist(deal.id)}
                    className={cn(
                      'border-border hover:border-border/80',
                      (wishlistedDeals.has(deal.id) || deal.isWishlisted) &&
                        'border-red-500 text-red-500'
                    )}
                  >
                    {wishlistedDeals.has(deal.id) || deal.isWishlisted ? (
                      <Heart className="w-4 h-4 fill-current" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Competitive Advantage Banner */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                🎯 Why Choose SkyScout?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">
                    AI Price Optimization:
                  </strong>{' '}
                  Our AI scans all platforms (Hotels, Airbnb, VRBO, Booking.com)
                  to find prices others miss.
                </div>
                <div>
                  <strong className="text-foreground">No Hidden Fees:</strong>{' '}
                  What you see is what you pay. No surprise booking fees like
                  other platforms.
                </div>
                <div>
                  <strong className="text-foreground">
                    Real-time Monitoring:
                  </strong>{' '}
                  We track availability and prices every minute to secure the
                  best deals instantly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
