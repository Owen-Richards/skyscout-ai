'use client';

import {
  Badge,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ThemeToggle,
} from '@skyscout/ui';
import {
  CheckCircle,
  Globe,
  MapPin,
  Plane,
  Settings,
  Star,
  Users,
} from 'lucide-react';

interface FeatureShowcaseProps {
  className?: string;
}

export function FeatureShowcase({ className }: FeatureShowcaseProps) {
  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Production-Ready UI Components
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All styling is properly applied across our comprehensive component
            system
          </p>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Buttons Showcase */}
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Buttons & Actions
            </h3>
            <div className="space-y-3">
              <Button variant="default" className="w-full">
                Primary Button
              </Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <Button variant="ghost" size="sm">
                Ghost Button
              </Button>
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Star className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="default">
                  <Plane className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Form Components */}
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Form Controls
            </h3>
            <div className="space-y-3">
              <Input placeholder="Search destinations..." className="w-full" />
              <div className="flex gap-2">
                <Input placeholder="From" className="flex-1" />
                <Input placeholder="To" className="flex-1" />
              </div>
              <Input type="date" className="w-full" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="2 passengers" className="flex-1" />
              </div>
            </div>
          </Card>

          {/* Badges & Status */}
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Badges & Status
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  ✓ Available
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  ⭐ Premium
                </Badge>
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                  🔥 Hot Deal
                </Badge>
              </div>
            </div>
          </Card>

          {/* Theme & Settings */}
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Theme Controls
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme Toggle</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Settings Menu</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Globe className="w-4 h-4 mr-2" />
                      Language
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>

          {/* Animation & Effects */}
          <Card className="p-6 glass-card hover-lift">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Animations & Effects
            </h3>
            <div className="space-y-3">
              <div className="animate-float p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm">Floating Animation</p>
              </div>
              <div className="shimmer p-3 rounded-lg border">
                <p className="text-sm">Shimmer Effect</p>
              </div>
              <div className="p-3 glass-morphism rounded-lg">
                <p className="text-sm">Glass Morphism</p>
              </div>
            </div>
          </Card>

          {/* Layout & Spacing */}
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Layout System
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-primary/10 rounded border border-primary/20"></div>
                <div className="aspect-square bg-secondary/10 rounded border border-secondary/20"></div>
                <div className="aspect-square bg-accent/10 rounded border border-accent/20"></div>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-xs">Responsive Grid</span>
                <Badge variant="outline" className="text-xs">
                  ✓
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-xs">Dark Mode</span>
                <Badge variant="outline" className="text-xs">
                  ✓
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Summary */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              All styling is properly applied and working!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
