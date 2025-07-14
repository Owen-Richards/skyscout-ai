'use client';

import { Button, FloatingActionButton, ToggleButton } from '@skyscout/ui';
import {
  BookmarkIcon,
  Download,
  Heart,
  Plane,
  Plus,
  Search,
  Settings,
  Share,
} from 'lucide-react';

export function ButtonDemo() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-card-foreground">
        Enhanced UI Components Demo
      </h2>

      <div className="space-y-6">
        {/* Enhanced Button Variants */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Enhanced Button Variants
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="premium" effect="glow">
              Premium
            </Button>
            <Button variant="glass">Glass</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
          </div>
        </div>

        {/* Aviation Theme with Enhanced Gradients */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Aviation Theme Gradients
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="sky-primary"
              leftIcon={<Plane className="h-4 w-4" />}
              effect="glow"
            >
              Sky Scout
            </Button>
            <Button
              variant="flight-action"
              leftIcon={<Plane className="h-4 w-4" />}
              effect="shimmer"
            >
              Book Flight
            </Button>
            <Button
              variant="altitude"
              leftIcon={<Search className="h-4 w-4" />}
            >
              Search Routes
            </Button>
            <Button variant="dawn" leftIcon={<Plus className="h-4 w-4" />}>
              Dawn Flight
            </Button>
            <Button variant="sunset" leftIcon={<Heart className="h-4 w-4" />}>
              Sunset Journey
            </Button>
          </div>
        </div>

        {/* Enhanced Button Sizes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Enhanced Button Sizes
          </h3>
          <div className="flex gap-3 items-center flex-wrap">
            <Button size="compact">Compact</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button size="premium" variant="premium">
              Premium
            </Button>
            <Button size="hero" variant="sky-primary">
              Hero
            </Button>
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="icon-lg" variant="success">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Touch Friendly Sizes */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Touch-Friendly Sizes
          </h3>
          <div className="flex gap-3 items-center flex-wrap">
            <Button size="touch" leftIcon={<Search className="h-4 w-4" />}>
              Touch Size
            </Button>
            <Button size="touch-lg" leftIcon={<Plus className="h-4 w-4" />}>
              Large Touch
            </Button>
          </div>
        </div>

        {/* Button Emphasis */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Button Emphasis Levels
          </h3>
          <div className="flex gap-3 items-center flex-wrap">
            <Button emphasis="high" variant="default">
              High Emphasis
            </Button>
            <Button emphasis="medium" variant="outline">
              Medium Emphasis
            </Button>
            <Button emphasis="low" variant="ghost">
              Low Emphasis
            </Button>
          </div>
        </div>

        {/* With Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Buttons with Icons
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button leftIcon={<Search className="h-4 w-4" />}>
              Search Flights
            </Button>
            <Button variant="outline" rightIcon={<Plus className="h-4 w-4" />}>
              Add Passenger
            </Button>
            <Button
              variant="success"
              leftIcon={<Download className="h-4 w-4" />}
              rightIcon={<Share className="h-4 w-4" />}
            >
              Download & Share
            </Button>
          </div>
        </div>

        {/* Visual Effects and Interactions */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Visual Effects & Interactions
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button
              effect="glow"
              ripple
              leftIcon={<Heart className="h-4 w-4" />}
            >
              Glow Effect
            </Button>
            <Button variant="warning" effect="glow-warm" ripple>
              Warm Glow
            </Button>
            <Button variant="success" effect="glow-success" ripple>
              Success Glow
            </Button>
            <Button variant="flight-action" effect="shimmer">
              Shimmer Effect
            </Button>
            <Button loading variant="premium">
              Loading State
            </Button>
            <Button disabled>Disabled State</Button>
          </div>
        </div>

        {/* Enhanced Shape Variants */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Enhanced Button Shapes
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button shape="default">Default</Button>
            <Button shape="rounded" variant="secondary">
              Rounded
            </Button>
            <Button shape="square" variant="outline">
              Square
            </Button>
            <Button shape="pill" variant="success">
              Pill Shape
            </Button>
            <Button shape="organic" variant="premium">
              Organic
            </Button>
          </div>
        </div>

        {/* New Material Design 3 Variants */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Material Design 3 Inspired
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="filled-tonal"
              leftIcon={<BookmarkIcon className="h-4 w-4" />}
            >
              Filled Tonal
            </Button>
            <Button variant="toggle" pressed={false}>
              Toggle Button
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Enhanced Features
          </h3>
          <div className="flex gap-3 flex-wrap items-center">
            <Button ripple>Ripple Effect</Button>
            <Button fullWidth variant="outline">
              Full Width Button
            </Button>
          </div>
        </div>

        {/* Button States */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Button States
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
            <Button
              variant="success"
              leftIcon={<BookmarkIcon className="h-4 w-4" />}
            >
              Interactive
            </Button>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Toggle Buttons
          </h3>
          <div className="flex gap-3 flex-wrap">
            <ToggleButton
              icon={<Heart className="h-4 w-4" />}
              label="Favorite"
            />
            <ToggleButton
              variant="outline"
              icon={<BookmarkIcon className="h-4 w-4" />}
            />
            <ToggleButton
              size="lg"
              icon={<Plane className="h-5 w-5" />}
              label="Track Flight"
              ripple
            />
            <ToggleButton size="icon" icon={<Share className="h-4 w-4" />} />
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Floating Action Buttons
          </h3>
          <div className="flex gap-4 flex-wrap items-center">
            <FloatingActionButton icon={<Plus className="h-6 w-6" />} />
            <FloatingActionButton
              size="mini"
              icon={<Heart className="h-4 w-4" />}
              variant="destructive"
            />
            <FloatingActionButton
              size="large"
              icon={<Plane className="h-7 w-7" />}
              variant="flight-action"
            />
            <FloatingActionButton
              size="extended"
              icon={<Search className="h-5 w-5" />}
              label="Search Flights"
              variant="sky-primary"
            />
            <FloatingActionButton
              icon={<Download className="h-6 w-6" />}
              variant="success"
              elevation="high"
            />
            <FloatingActionButton
              disabled
              icon={<Settings className="h-6 w-6" />}
              variant="secondary"
            />
          </div>
        </div>

        {/* Aviation Theme Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Aviation Theme Showcase
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium mb-2">Flight Search</h4>
              <Button
                variant="sky-primary"
                leftIcon={<Search className="h-4 w-4" />}
                fullWidth
                ripple
              >
                Search Flights
              </Button>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium mb-2">Book Now</h4>
              <Button
                variant="flight-action"
                leftIcon={<Plane className="h-4 w-4" />}
                fullWidth
                emphasis="high"
                ripple
              >
                Book Flight
              </Button>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium mb-2">Check Altitude</h4>
              <Button
                variant="altitude"
                leftIcon={<Settings className="h-4 w-4" />}
                fullWidth
                size="lg"
                ripple
              >
                Flight Details
              </Button>
            </div>
          </div>
        </div>

        {/* Real-world Enhanced Flight Booking Examples */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-card-foreground">
            Enhanced Flight Booking UI
          </h3>
          <div className="space-y-4">
            {/* Primary CTA with enhanced styling */}
            <div className="flex gap-3 flex-wrap">
              <Button
                size="premium"
                emphasis="high"
                variant="flight-action"
                leftIcon={<Plane className="h-5 w-5" />}
                effect="shimmer"
                ripple
              >
                Book This Flight - $599
              </Button>
              <Button
                size="lg"
                emphasis="medium"
                variant="glass"
                leftIcon={<Heart className="h-5 w-5" />}
                ripple
              >
                Save to Wishlist
              </Button>
            </div>

            {/* Secondary actions with enhanced effects */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="soft">
                Compare Prices
              </Button>
              <Button size="sm" variant="ghost" effect="glow">
                View Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                rightIcon={<Share className="h-3 w-3" />}
                ripple
              >
                Share
              </Button>
            </div>

            {/* Premium upgrade section */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Upgrade Your Experience</h4>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="premium" effect="glow">
                  Business Class
                </Button>
                <Button size="sm" variant="dawn">
                  Priority Boarding
                </Button>
                <Button size="sm" variant="sunset">
                  Extra Legroom
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
