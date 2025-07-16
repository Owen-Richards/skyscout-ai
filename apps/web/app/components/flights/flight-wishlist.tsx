/**
 * Flight Wishlist Component
 * Manages saved flights with smart organization and quick booking
 */

'use client';

import { useState } from 'react';
import { Button, Card, Badge } from '@skyscout/ui';
import {
  Heart,
  X,
  Plane,
  Calendar,
  Clock,
  Bell,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Share2,
  Download,
} from 'lucide-react';
import type { FlightOffer } from '@skyscout/shared';
import { cn } from '@skyscout/ui';

interface FlightWishlistProps {
  items: FlightOffer[];
  onRemoveItem: (id: string) => void;
  onBookItem: (flight: FlightOffer) => void;
  className?: string;
}

export function FlightWishlist({
  items,
  onRemoveItem,
  onBookItem,
  className,
}: FlightWishlistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'added' | 'price' | 'departure'>(
    'added'
  );

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'departure':
        return (
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime()
        );
      default:
        return 0; // Keep original order for 'added'
    }
  });

  const getPriceChangeIcon = (prediction: string) => {
    if (prediction.includes('drop') || prediction.includes('decrease')) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    if (prediction.includes('increase') || prediction.includes('rise')) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (items.length === 0) return null;

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {/* Floating wishlist button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
      >
        <Heart className="h-6 w-6 fill-current" />

        {/* Item count badge */}
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-primary text-primary-foreground"
        >
          {items.length}
        </Badge>
      </Button>

      {/* Wishlist panel */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-96 max-h-[70vh] overflow-hidden shadow-2xl border-2">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                <h3 className="font-semibold">Flight Wishlist</h3>
                <Badge variant="secondary">{items.length}</Badge>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm border border-border rounded px-2 py-1 bg-background"
                >
                  <option value="added">Recently Added</option>
                  <option value="price">Price: Low to High</option>
                  <option value="departure">Departure Date</option>
                </select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 mt-3">
              <Button variant="ghost" size="sm" className="h-8">
                <Bell className="h-4 w-4 mr-1" />
                Set Alerts
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Wishlist items */}
          <div className="max-h-96 overflow-y-auto">
            {sortedItems.map(flight => (
              <div
                key={flight.id}
                className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-3">
                  {/* Flight route */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">
                        {flight.origin} → {flight.destination}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(flight.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Flight details */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(flight.departureDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{flight.duration}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">
                        ${flight.price}
                      </div>
                    </div>
                  </div>

                  {/* Airline and prediction */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {flight.airline}
                    </span>

                    {getPriceChangeIcon(flight.prediction) && (
                      <div className="flex items-center gap-1 text-xs">
                        {getPriceChangeIcon(flight.prediction)}
                        <span className="text-muted-foreground">
                          Price change predicted
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onBookItem(flight)}
                      className="flex-1 h-8 bg-gradient-to-r from-primary to-primary/80"
                    >
                      Book Now
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>

                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Bell className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t bg-muted/20">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Navigate to full wishlist page
                  console.log('Navigate to full wishlist');
                }}
              >
                View All Saved Flights
              </Button>

              <div className="text-xs text-center text-muted-foreground">
                💡 Tip: Set price alerts to never miss a deal
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
