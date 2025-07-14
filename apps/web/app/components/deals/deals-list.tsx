/**
 * Deals List Component
 * Following Single Responsibility Principle - manages a list of deals
 */

'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { DealCard } from './deal-card';
import type { DealsListProps } from '../../types/deals';

export function DealsList({
  deals,
  onDealClick,
  onBookingClick,
  className,
  loading = false,
  error,
}: DealsListProps) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium mb-1">
            Failed to load deals
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-muted-foreground">
          No deals available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          🔥 AI-Curated Deals
        </h3>
        <p className="text-sm text-muted-foreground">
          {deals.length} deals found
        </p>
      </div>

      <div className="grid gap-4">
        {deals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            onClick={onDealClick}
            onBooking={onBookingClick}
            showPrediction
          />
        ))}
      </div>
    </div>
  );
}
