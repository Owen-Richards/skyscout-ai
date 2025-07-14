/**
 * Deal Card Component
 * Following Single Responsibility Principle - displays a single deal
 */

'use client';

import { Plane, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button, Card } from '@skyscout/ui';
import type { DealCardProps } from '../../types/deals';

export function DealCard({
  deal,
  onClick,
  onBooking,
  className,
  showPrediction = true,
}: DealCardProps) {
  const handleCardClick = () => {
    onClick?.(deal);
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBooking?.(deal);
  };

  const getTrendIcon = () => {
    switch (deal.aiPrediction.trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPredictionColor = () => {
    switch (deal.aiPrediction.recommendedAction) {
      case 'book-now':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'wait':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    }
  };

  return (
    <Card
      className={`p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {deal.origin} → {deal.destination}
            </h3>
            <p className="text-sm text-muted-foreground">{deal.airline}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            {deal.price.original && (
              <span className="text-sm line-through text-muted-foreground">
                {deal.price.currency}
                {deal.price.original}
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              {deal.price.currency}
              {deal.price.current}
            </span>
          </div>
          {deal.price.savings && (
            <p className="text-sm text-green-600 font-medium">
              Save {deal.price.currency}
              {deal.price.savings}
            </p>
          )}
        </div>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{deal.duration}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Stops: </span>
          <span>{deal.stops}</span>
        </div>
      </div>

      {/* AI Prediction */}
      {showPrediction && (
        <div className={`p-3 rounded-lg border mb-4 ${getPredictionColor()}`}>
          <div className="flex items-center gap-2 mb-1">
            {getTrendIcon()}
            <span className="text-sm font-medium">
              AI Prediction ({deal.aiPrediction.confidence}% confidence)
            </span>
          </div>
          <p className="text-xs">{deal.aiPrediction.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleCardClick}
        >
          View Details
        </Button>
        <Button size="sm" className="flex-1" onClick={handleBookingClick}>
          Book Now
        </Button>
      </div>
    </Card>
  );
}
