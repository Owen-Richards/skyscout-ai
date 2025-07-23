/**
 * Flight Deals Component
 * Showcases current flight deals with urgency and social proof
 */

'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Clock,
  Flame,
  Heart,
  Plane,
  Star,
  Timer,
  TrendingDown,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface FlightDeal {
  id: string;
  origin: string;
  destination: string;
  airline: string;
  price: number;
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  validUntil: string;
  bookingsToday: number;
  lastBooked: string;
  departureDate: string;
  returnDate?: string;
  stops: number;
  duration: string;
  dealType: 'flash' | 'limited-time' | 'error-fare' | 'seasonal';
  trendingScore?: number;
  isWishlisted?: boolean;
}

export function FlightDeals({ className }: { className?: string }) {
  const [deals] = useState<FlightDeal[]>([
    {
      id: '1',
      origin: 'NYC',
      destination: 'Paris',
      airline: 'Air France',
      price: 398,
      originalPrice: 899,
      savings: 501,
      savingsPercent: 56,
      validUntil: '2024-01-15',
      bookingsToday: 47,
      lastBooked: '12 minutes ago',
      departureDate: '2024-02-14',
      returnDate: '2024-02-21',
      stops: 0,
      duration: '7h 30m',
      dealType: 'flash',
      trendingScore: 94,
      isWishlisted: false,
    },
    {
      id: '2',
      origin: 'LAX',
      destination: 'Tokyo',
      airline: 'Japan Airlines',
      price: 542,
      originalPrice: 1299,
      savings: 757,
      savingsPercent: 58,
      validUntil: '2024-01-18',
      bookingsToday: 89,
      lastBooked: '3 minutes ago',
      departureDate: '2024-03-10',
      returnDate: '2024-03-20',
      stops: 0,
      duration: '11h 45m',
      dealType: 'error-fare',
      trendingScore: 98,
      isWishlisted: true,
    },
    {
      id: '3',
      origin: 'MIA',
      destination: 'Barcelona',
      airline: 'Iberia',
      price: 289,
      originalPrice: 748,
      savings: 459,
      savingsPercent: 61,
      validUntil: '2024-01-20',
      bookingsToday: 34,
      lastBooked: '28 minutes ago',
      departureDate: '2024-04-05',
      returnDate: '2024-04-15',
      stops: 1,
      duration: '9h 15m',
      dealType: 'seasonal',
      trendingScore: 89,
      isWishlisted: false,
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

  const getDealTypeColor = (dealType: FlightDeal['dealType']) => {
    switch (dealType) {
      case 'flash':
        return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30';
      case 'error-fare':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'limited-time':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'seasonal':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDealTypeIcon = (dealType: FlightDeal['dealType']) => {
    switch (dealType) {
      case 'flash':
        return <Zap className="w-3 h-3" />;
      case 'error-fare':
        return <Trophy className="w-3 h-3" />;
      case 'limited-time':
        return <Timer className="w-3 h-3" />;
      case 'seasonal':
        return <Calendar className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const formatDealType = (dealType: FlightDeal['dealType']) => {
    switch (dealType) {
      case 'flash':
        return '🔥 Flash Deal';
      case 'error-fare':
        return '🏆 Error Fare';
      case 'limited-time':
        return '⏰ Limited Time';
      case 'seasonal':
        return '🌍 Seasonal';
      default:
        return 'Deal';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with trending info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🔥 Trending Flight Deals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hand-picked deals that won't last long
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {deals.reduce((sum, deal) => sum + deal.bookingsToday, 0)} booked
            today
          </span>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map(deal => (
          <Card
            key={deal.id}
            className={cn(
              'group relative overflow-hidden bg-card border-border hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20',
              deal.dealType === 'flash' &&
                'ring-1 ring-red-500/30 animate-pulse'
            )}
          >
            {/* Trending Score Badge */}
            {deal.trendingScore && deal.trendingScore > 90 && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Hot
              </div>
            )}

            <div className="p-4 space-y-4">
              {/* Deal Type and Airline */}
              <div className="flex items-center justify-between">
                <Badge
                  className={cn(
                    'text-xs border',
                    getDealTypeColor(deal.dealType)
                  )}
                >
                  {getDealTypeIcon(deal.dealType)}
                  <span className="ml-1">{formatDealType(deal.dealType)}</span>
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {deal.airline}
                </div>
              </div>

              {/* Route */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-foreground">
                    {deal.origin}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Plane className="w-4 h-4 mx-2" />
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {deal.destination}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {deal.stops === 0
                      ? 'Nonstop'
                      : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}
                  </span>
                  <span>{deal.duration}</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${deal.price}
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
                  Save ${deal.savings} per person
                </p>
              </div>

              {/* Travel Dates */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(deal.departureDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {deal.returnDate &&
                    ` - ${new Date(deal.returnDate).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                      }
                    )}`}
                </span>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{deal.bookingsToday} booked today</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Last booked {deal.lastBooked}</span>
                </div>
              </div>

              {/* Urgency Timer */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <Clock className="w-3 h-3" />
                    <span>Deal expires</span>
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    {new Date(deal.validUntil).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
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
        ))}
      </div>

      {/* Pro Tip */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">💡 Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Add deals to your wishlist to get instant notifications when
                prices drop even further! Our AI tracks price patterns and
                alerts you to the perfect booking moment.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
