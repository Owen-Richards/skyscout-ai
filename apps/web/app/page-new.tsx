import { DealsList } from './components/deals';
import { FeatureShowcase } from './components/feature-showcase';
import { HeroSection } from './components/hero';
import { Navigation } from './components/layout/navigation';
import { AdvancedSearchForm } from './components/search/forms';
import type { SearchResult } from './services/search.service';
import type { FlightDeal } from './types/deals';

// Mock data for demonstration
const mockDeals: FlightDeal[] = [
  {
    id: '1',
    origin: 'New York (JFK)',
    destination: 'Tokyo (NRT)',
    airline: 'ANA',
    duration: '14h 25m',
    stops: 'Non-stop',
    price: {
      current: 589,
      original: 899,
      currency: '$',
      savings: 310,
      savingsPercentage: 34,
    },
    aiPrediction: {
      message: 'Price likely to increase 15% in next 7 days',
      confidence: 85,
      trend: 'increasing',
      recommendedAction: 'book-now',
    },
    validUntil: '2025-07-20',
  },
  {
    id: '2',
    origin: 'Los Angeles (LAX)',
    destination: 'Paris (CDG)',
    airline: 'Air France',
    duration: '11h 45m',
    stops: 'Non-stop',
    price: {
      current: 456,
      original: 678,
      currency: '$',
      savings: 222,
      savingsPercentage: 33,
    },
    aiPrediction: {
      message: 'Good time to book - stable prices',
      confidence: 92,
      trend: 'stable',
      recommendedAction: 'book-now',
    },
    validUntil: '2025-07-18',
  },
  {
    id: '3',
    origin: 'Chicago (ORD)',
    destination: 'London (LHR)',
    airline: 'British Airways',
    duration: '8h 15m',
    stops: 'Non-stop',
    price: {
      current: 423,
      original: 599,
      currency: '$',
      savings: 176,
      savingsPercentage: 29,
    },
    aiPrediction: {
      message: 'Price may drop 8% in next 3 days',
      confidence: 78,
      trend: 'decreasing',
      recommendedAction: 'wait',
    },
    validUntil: '2025-07-16',
  },
];

export default function HomePage() {
  const handleSearchResults = (results: SearchResult) => {
    console.log('Search results:', results);
  };

  const handleDealClick = (deal: FlightDeal) => {
    console.log('Deal clicked:', deal);
  };

  const handleBookingClick = (deal: FlightDeal) => {
    console.log('Book deal:', deal);
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="flex-1">
        {/* Hero Section with Search */}
        <HeroSection />

        {/* Search Form Section */}
        <section className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8">
          <AdvancedSearchForm
            onSearchResults={handleSearchResults}
            showAdvancedOptions={false}
          />
        </section>

        {/* Featured Deals Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <DealsList
              deals={mockDeals}
              onDealClick={handleDealClick}
              onBookingClick={handleBookingClick}
              loading={false}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <FeatureShowcase />
        </section>
      </main>
    </>
  );
}
