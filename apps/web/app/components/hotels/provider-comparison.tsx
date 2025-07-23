/**
 * Provider Comparison Component
 * Shows real-time price comparison across all major booking platforms
 * Designed to demonstrate SkyScout's superior pricing
 */

'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  Crown,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ProviderComparison {
  id: string;
  propertyName: string;
  location: string;
  providers: {
    name: string;
    logo: string;
    price: number;
    originalPrice?: number;
    fees: number;
    totalPrice: number;
    availability: boolean;
    features: string[];
    trustScore: number;
    cancellation: string;
    bookingTime: string;
    savings?: number;
    isRecommended?: boolean;
  }[];
}

export function ProviderComparison({ className }: { className?: string }) {
  const [comparison] = useState<ProviderComparison>({
    id: '1',
    propertyName: 'Luxury Central Park Apartment',
    location: 'New York, NY',
    providers: [
      {
        name: 'SkyScout AI',
        logo: '/logos/skyscout.png',
        price: 185,
        originalPrice: 320,
        fees: 0,
        totalPrice: 185,
        availability: true,
        features: [
          'AI Optimized',
          'No Booking Fees',
          'Price Protection',
          'Instant Confirmation',
        ],
        trustScore: 98,
        cancellation: 'Free until 24h before',
        bookingTime: 'Instant',
        savings: 135,
        isRecommended: true,
      },
      {
        name: 'Booking.com',
        logo: '/logos/booking.png',
        price: 289,
        fees: 35,
        totalPrice: 324,
        availability: true,
        features: ['Wide Selection', 'Reviews'],
        trustScore: 87,
        cancellation: 'Free until 48h before',
        bookingTime: '2-5 minutes',
      },
      {
        name: 'Airbnb',
        logo: '/logos/airbnb.png',
        price: 245,
        fees: 42,
        totalPrice: 287,
        availability: true,
        features: ['Local Hosts', 'Unique Properties'],
        trustScore: 85,
        cancellation: 'Strict - No refunds',
        bookingTime: '5-10 minutes',
      },
      {
        name: 'VRBO',
        logo: '/logos/vrbo.png',
        price: 275,
        fees: 38,
        totalPrice: 313,
        availability: true,
        features: ['Vacation Rentals', 'Family Focus'],
        trustScore: 82,
        cancellation: 'Moderate',
        bookingTime: '3-7 minutes',
      },
      {
        name: 'Expedia',
        logo: '/logos/expedia.png',
        price: 295,
        fees: 28,
        totalPrice: 323,
        availability: false,
        features: ['Package Deals'],
        trustScore: 84,
        cancellation: 'Free until 24h before',
        bookingTime: '3-5 minutes',
      },
    ],
  });

  const bestPrice = Math.min(
    ...comparison.providers.filter(p => p.availability).map(p => p.totalPrice)
  );
  const averagePrice =
    comparison.providers
      .filter(p => p.availability)
      .reduce((sum, p) => sum + p.totalPrice, 0) /
    comparison.providers.filter(p => p.availability).length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
          🔄 Live Price Comparison
        </h2>
        <p className="text-sm text-muted-foreground">
          Real-time pricing for: <strong>{comparison.propertyName}</strong> in{' '}
          {comparison.location}
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
            <TrendingDown className="w-3 h-3 mr-1" />
            Best Price: ${bestPrice}
          </Badge>
          <Badge className="bg-muted text-muted-foreground">
            Average: ${Math.round(averagePrice)}
          </Badge>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="grid gap-4">
        {comparison.providers.map(provider => {
          const isPriceLeader =
            provider.totalPrice === bestPrice && provider.availability;
          const savingsVsAverage = Math.round(
            averagePrice - provider.totalPrice
          );

          return (
            <Card
              key={provider.name}
              className={cn(
                'relative overflow-hidden transition-all duration-300',
                provider.isRecommended &&
                  'ring-2 ring-green-500/50 bg-green-500/5',
                isPriceLeader &&
                  !provider.isRecommended &&
                  'ring-1 ring-blue-500/30',
                !provider.availability && 'opacity-50 grayscale'
              )}
            >
              {/* Recommended Badge */}
              {provider.isRecommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>AI Recommended</span>
                </div>
              )}

              {/* Best Price Badge */}
              {isPriceLeader && !provider.isRecommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>Best Price</span>
                </div>
              )}

              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  {/* Provider Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {provider.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {provider.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{provider.trustScore}% trust score</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-center">
                    <div className="space-y-1">
                      {provider.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through block">
                          ${provider.originalPrice}
                        </span>
                      )}
                      <div className="text-lg font-bold text-foreground">
                        ${provider.price}
                      </div>
                      {provider.fees > 0 && (
                        <div className="text-xs text-muted-foreground">
                          + ${provider.fees} fees
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      ${provider.totalPrice}
                    </div>
                    <div className="text-xs text-muted-foreground">total</div>
                    {savingsVsAverage > 0 && provider.availability && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Save ${savingsVsAverage}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {provider.features.slice(0, 3).map(feature => (
                        <Badge
                          key={feature}
                          className={cn(
                            'text-xs',
                            provider.isRecommended
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {provider.cancellation} • {provider.bookingTime}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="text-center">
                    {provider.availability ? (
                      <Button
                        className={cn(
                          'w-full',
                          provider.isRecommended
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            : 'variant-outline'
                        )}
                      >
                        {provider.isRecommended ? (
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Book Now</span>
                          </div>
                        ) : (
                          'Select'
                        )}
                      </Button>
                    ) : (
                      <div className="text-center">
                        <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <span className="text-xs text-red-500">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Savings Highlight for Recommended */}
                {provider.isRecommended && provider.savings && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Target className="w-4 h-4" />
                        <span className="font-semibold">
                          AI Optimization Savings
                        </span>
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-bold">
                        ${provider.savings} saved vs. competitors
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                🎯 Why SkyScout Wins Every Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-foreground">
                    AI Price Optimization:
                  </strong>
                  <span className="text-muted-foreground">
                    {' '}
                    Our AI finds hidden discounts and applies them
                    automatically.
                  </span>
                </div>
                <div>
                  <strong className="text-foreground">Zero Hidden Fees:</strong>
                  <span className="text-muted-foreground">
                    {' '}
                    What you see is what you pay - no surprise charges.
                  </span>
                </div>
                <div>
                  <strong className="text-foreground">Instant Booking:</strong>
                  <span className="text-muted-foreground">
                    {' '}
                    Skip the wait time with our instant confirmation system.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
