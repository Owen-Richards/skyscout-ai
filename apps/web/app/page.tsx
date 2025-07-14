import { Navigation } from './components/advanced-navigation';
import { Button } from '@skyscout/ui';
import { Plane, Search, TrendingUp, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="flex-1">
        <div className="min-h-screen bg-background">
          {/* Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Discover Your Next
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {' '}
                  Adventure
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Find the best flight deals with AI-powered search. Compare
                prices across airlines and book with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  leftIcon={<Search className="h-5 w-5" />}
                >
                  Search Flights
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Globe className="h-5 w-5" />}
                >
                  Explore Destinations
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Why Choose SkyScout AI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-card rounded-xl border shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Smart Search
                  </h3>
                  <p className="text-muted-foreground">
                    AI-powered search finds the best deals across hundreds of
                    airlines
                  </p>
                </div>
                <div className="text-center p-6 bg-card rounded-xl border shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Price Tracking
                  </h3>
                  <p className="text-muted-foreground">
                    Get alerts when prices drop for your favorite destinations
                  </p>
                </div>
                <div className="text-center p-6 bg-card rounded-xl border shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Easy Booking
                  </h3>
                  <p className="text-muted-foreground">
                    Book directly with airlines or through our trusted partners
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
