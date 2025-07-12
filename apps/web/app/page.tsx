import { FeaturedDeals } from './components/featured-deals';
import { HeroSection } from './components/hero-section';
import { MapView } from './components/map-view';
import { SearchForm } from './components/search-form';
import { ButtonDemo } from './components/button-demo';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <SearchForm />

        {/* UI Library Demo */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            UI Components Demo
          </h2>
          <ButtonDemo />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <FeaturedDeals />
          <MapView />
        </div>
      </div>
    </main>
  );
}
