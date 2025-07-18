/**
 * Flight Search Hero Component
 * Engaging hero section with prominent search form and visual appeal
 */

'use client';

import { FlightSearchForm } from './flight-search-form';
import { cn } from '@skyscout/ui';
import type { FlightSearch } from '@skyscout/shared';

interface FlightSearchHeroProps {
  onSearch: (searchData: FlightSearch) => void;
  className?: string;
}

export function FlightSearchHero({
  onSearch,
  className,
}: FlightSearchHeroProps) {
  return (
    <section
      className={cn(
        'relative pt-24 pb-16 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800',
        className
      )}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Attention-grabbing header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Flight
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered search • Real-time prices • Instant booking
          </p>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live prices</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>500+ airlines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>AI-powered insights</span>
            </div>
          </div>
        </div>

        {/* Main Search Form */}
        <div className="relative z-10">
          <FlightSearchForm
            onSearch={onSearch}
            className="glass-card p-8 rounded-2xl shadow-2xl bg-background/95 backdrop-blur-lg border border-border/20"
          />
        </div>
      </div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-400/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400/10 rounded-full animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-indigo-400/10 rounded-full animate-float-slow" />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-gradient-to-r from-sky-300/20 to-blue-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-gradient-to-r from-indigo-300/15 to-purple-300/15 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
    </section>
  );
}
