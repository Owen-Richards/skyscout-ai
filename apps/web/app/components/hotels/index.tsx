/**
 * Hotels Section - Main Component
 * Comprehensive accommodation booking experience
 * Designed to outperform Booking.com, Skyscanner with AI optimization
 */

'use client';

import { AccommodationSearchForm } from './accommodation-search-form';
import { AccommodationDeals } from './accommodation-deals';
import { HotelTrendingDestinations } from './hotel-trending-destinations';
import { ProviderComparison } from './provider-comparison';

export function HotelsSection() {
  return (
    <div className="space-y-12">
      {/* Search Form */}
      <section>
        <AccommodationSearchForm />
      </section>

      {/* Trending Destinations */}
      <section>
        <HotelTrendingDestinations />
      </section>

      {/* Provider Comparison */}
      <section>
        <ProviderComparison />
      </section>

      {/* Featured Deals */}
      <section>
        <AccommodationDeals />
      </section>
    </div>
  );
}
