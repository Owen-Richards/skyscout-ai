import { HeroSection } from './components/hero-section'
import { SearchForm } from './components/search-form'
import { FeaturedDeals } from './components/featured-deals'
import { MapView } from './components/map-view'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <SearchForm />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <FeaturedDeals />
          <MapView />
        </div>
      </div>
    </main>
  )
}
