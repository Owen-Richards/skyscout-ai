/**
 * Flight Search Page
 * The ultimate flight discovery experience with AI-powered recommendations
 * Optimized for user engagement and conversion
 */

'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { FlightSearchHero } from '../components/flights/flight-search-hero';
import { FlightResults } from '../components/flights/flight-results';
import { FlightFilters } from '../components/flights/flight-filters';
import { FlightMap } from '../components/flights/flight-map';
import { RecentSearches } from '../components/flights/recent-searches';
import { TrendingDestinations } from '../components/flights/trending-destinations';
import { FlightDeals } from '../components/flights/flight-deals';
import { Button, Card } from '@skyscout/ui';
import {
  MapPin,
  List,
  Heart,
  Bell,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Plane,
  Clock,
  Star,
} from 'lucide-react';
import type { FlightSearch, FlightOffer } from '@skyscout/shared';
import { cn } from '@skyscout/ui';

export default function FlightsPage() {
  const [searchResults, setSearchResults] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<FlightOffer[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<FlightSearch | null>(null);

  const handleSearch = async (searchData: FlightSearch) => {
    setIsLoading(true);
    setSearchPerformed(true);
    setCurrentSearch(searchData);

    try {
      // Simulate API call - replace with actual tRPC call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock results - replace with real data
      const mockResults: FlightOffer[] = [
        {
          id: '1',
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: searchData.departureDate,
          arrivalDate: searchData.returnDate || searchData.departureDate,
          price: 589,
          currency: 'USD',
          airline: 'SkyLink Airways',
          duration: '8h 45m',
          stops: 0,
          aircraft: 'Boeing 787',
          confidence: 92,
          prediction: 'Price likely to drop 12% in next 3 days',
        },
        {
          id: '2',
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: searchData.departureDate,
          arrivalDate: searchData.returnDate || searchData.departureDate,
          price: 642,
          currency: 'USD',
          airline: 'CloudHopper Airlines',
          duration: '9h 15m',
          stops: 1,
          aircraft: 'Airbus A350',
          confidence: 88,
          prediction: 'Great deal - 25% below average',
        },
        {
          id: '3',
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: searchData.departureDate,
          arrivalDate: searchData.returnDate || searchData.departureDate,
          price: 498,
          currency: 'USD',
          airline: 'Budget Wings',
          duration: '11h 30m',
          stops: 2,
          aircraft: 'Boeing 737',
          confidence: 95,
          prediction: 'Excellent value - book now!',
        },
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = (flight: FlightOffer) => {
    setWishlistItems(prev => [...prev, flight]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section with Enhanced Search */}
      <FlightSearchHero onSearch={handleSearch} />

      {/* Search Results Section */}
      {searchPerformed && (
        <section className="px-4 py-8">
          <div className="container mx-auto max-w-7xl">
            {/* Search Summary Header */}
            <div className="mb-6">
              <Card className="bg-gray-800/50 border-gray-700 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Search className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {currentSearch?.origin} → {currentSearch?.destination}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {currentSearch?.departureDate}
                        {currentSearch?.returnDate &&
                          ` - ${currentSearch.returnDate}`}
                        {currentSearch?.passengers &&
                          ` • ${currentSearch.passengers} passenger${currentSearch.passengers > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={showFilters ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        showFilters
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'border-gray-600 hover:border-gray-500'
                      )}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>

                    <div className="flex rounded-lg border border-gray-600 overflow-hidden">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={cn(
                          'rounded-none',
                          viewMode === 'list'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'hover:bg-gray-700'
                        )}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'map' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                        className={cn(
                          'rounded-none',
                          viewMode === 'map'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'hover:bg-gray-700'
                        )}
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Results Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              {showFilters && (
                <div className="lg:col-span-1">
                  <div className="sticky top-4">
                    <FlightFilters
                      onFiltersChange={() => {}}
                      results={searchResults}
                    />
                  </div>
                </div>
              )}

              {/* Main Results Area */}
              <div
                className={cn(
                  'space-y-6',
                  showFilters ? 'lg:col-span-3' : 'lg:col-span-4'
                )}
              >
                {viewMode === 'list' ? (
                  <FlightResults
                    results={searchResults}
                    isLoading={isLoading}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ) : (
                  <Suspense
                    fallback={
                      <Card className="h-96 bg-gray-800/50 border-gray-700 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">Loading map...</p>
                        </div>
                      </Card>
                    }
                  >
                    <FlightMap results={searchResults} />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Discovery Section - Always Visible */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-7xl space-y-12">
          {/* Flight Deals */}
          <FlightDeals />

          {/* Trending Destinations */}
          <TrendingDestinations />

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Alerts */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <Bell className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Smart Price Alerts
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Get notified when prices drop for your saved routes. Our AI
                    predicts the best time to book.
                  </p>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    Set Alert
                  </Button>
                </div>
              </div>
            </Card>

            {/* Wishlist */}
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Flight Wishlist
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Save your favorite flights and destinations. Track prices
                    and get booking recommendations.
                  </p>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    View Wishlist
                    {wishlistItems.length > 0 && (
                      <span className="ml-2 bg-white text-red-500 text-xs px-2 py-1 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    AI Travel Insights
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Personalized recommendations based on your preferences and
                    travel patterns.
                  </p>
                  <Button
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Get Insights
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Searches - Only show if user has searched */}
          {searchPerformed && <RecentSearches />}
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="px-4 py-8 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="container mx-auto max-w-7xl">
          <Card className="bg-gray-800/50 border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white">
                  Pro Travel Tips
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Maximize Your Travel Savings
              </h2>
              <p className="text-gray-300">
                Expert tips to help you find the best deals and travel smarter
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">Book Early</h3>
                <p className="text-sm text-gray-400">
                  Best deals are typically 6-8 weeks before domestic flights
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Flexible Dates</h3>
                <p className="text-sm text-gray-400">
                  Save up to 40% by being flexible with your travel dates
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white">Price Alerts</h3>
                <p className="text-sm text-gray-400">
                  Set alerts to get notified when prices drop for your routes
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-orange-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Plane className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white">Compare Airlines</h3>
                <p className="text-sm text-gray-400">
                  Check multiple airlines and booking sites for the best deals
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
