/**
 * Hotels Page - Dedicated Accommodation Search
 * Comprehensive accommodation booking experience
 * Designed to outperform Booking.com, Skyscanner with AI optimization
 */

'use client';

import { HotelsSection } from '../components/hotels';
import { Navigation } from '../components/layout/navigation';

export default function HotelsPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="flex-1">
        {/* Hotels Header */}
        <section className="relative bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🏠 Find Your Perfect Stay
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Search Hotels, Airbnb, VRBO & more with AI-powered optimization.
              Better deals than Booking.com, guaranteed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-foreground font-medium">
                  AI-Powered Price Optimization
                </span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-foreground font-medium">
                  Multi-Platform Comparison
                </span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="text-foreground font-medium">
                  No Hidden Fees
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <HotelsSection />
          </div>
        </section>

        {/* Competitive Advantage Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500/5 to-blue-500/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                🎯 Why Choose SkyScout for Accommodations?
              </h2>
              <p className="text-lg text-muted-foreground">
                We don't just compare prices - we optimize them with AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-background border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  AI Price Optimization
                </h3>
                <p className="text-muted-foreground">
                  Our AI scans billions of price combinations across Hotels.com,
                  Booking.com, Airbnb, VRBO, and direct bookings to find prices
                  others miss.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-background border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Real-Time Monitoring
                </h3>
                <p className="text-muted-foreground">
                  We monitor prices every minute and automatically apply
                  discounts, flash sales, and exclusive member rates in
                  real-time.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-background border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Best Price Guarantee
                </h3>
                <p className="text-muted-foreground">
                  Find a lower price elsewhere within 24 hours? We'll match it
                  and give you an additional 10% discount.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg px-6 py-3">
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  💰
                </span>
                <span className="text-foreground font-medium">
                  Average savings:{' '}
                  <strong className="text-green-600 dark:text-green-400">
                    $127 per booking
                  </strong>{' '}
                  vs. Booking.com
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
