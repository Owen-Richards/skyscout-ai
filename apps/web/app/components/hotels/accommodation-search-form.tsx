'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  ArrowRight,
  Building,
  Calendar,
  Filter,
  Globe,
  Heart,
  Home,
  MapPin,
  Search,
  Sparkles,
  Star,
  Target,
  TreePine,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  accommodationType: 'all' | 'hotels' | 'apartments' | 'villas' | 'hostels';
  priceRange: {
    min: number;
    max: number;
  };
  filters: {
    aiOptimized: boolean;
    instantBook: boolean;
    freeCancellation: boolean;
    superhost: boolean;
  };
}

export function AccommodationSearchForm({ className }: { className?: string }) {
  const [searchData, setSearchData] = useState<SearchFormData>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: {
      adults: 2,
      children: 0,
      rooms: 1,
    },
    accommodationType: 'all',
    priceRange: {
      min: 0,
      max: 1000,
    },
    filters: {
      aiOptimized: true,
      instantBook: false,
      freeCancellation: false,
      superhost: false,
    },
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const accommodationTypes = [
    {
      id: 'all',
      name: 'All Properties',
      icon: Globe,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'hotels',
      name: 'Hotels',
      icon: Building,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'apartments',
      name: 'Apartments',
      icon: Home,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'villas',
      name: 'Villas',
      icon: TreePine,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      id: 'hostels',
      name: 'Hostels',
      icon: Users,
      color: 'text-pink-600 dark:text-pink-400',
    },
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSearching(false);

    console.log('Searching with:', searchData);
    // Here you would typically trigger the search
  };

  const updateGuests = (
    type: 'adults' | 'children' | 'rooms',
    increment: boolean
  ) => {
    setSearchData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(
          type === 'adults' ? 1 : 0,
          prev.guests[type] + (increment ? 1 : -1)
        ),
      },
    }));
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Search Form */}
      <Card className="bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🏠 Find Your Perfect Stay
              </h2>
              <p className="text-sm text-muted-foreground">
                Search Hotels, Airbnb, VRBO & more with AI-powered optimization
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1">
                Where to?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="City, country, or landmark"
                  value={searchData.destination}
                  onChange={e =>
                    setSearchData(prev => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                />
              </div>
            </div>

            {/* Check-in */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={e =>
                    setSearchData(prev => ({
                      ...prev,
                      checkIn: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                />
              </div>
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={e =>
                    setSearchData(prev => ({
                      ...prev,
                      checkOut: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Guests & Rooms
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <button className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-left focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500">
                  {searchData.guests.adults + searchData.guests.children} guest
                  {searchData.guests.adults + searchData.guests.children !== 1
                    ? 's'
                    : ''}
                  , {searchData.guests.rooms} room
                  {searchData.guests.rooms !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>

          {/* Accommodation Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              {accommodationTypes.map(type => {
                const IconComponent = type.icon;
                const isSelected = searchData.accommodationType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() =>
                      setSearchData(prev => ({
                        ...prev,
                        accommodationType:
                          type.id as SearchFormData['accommodationType'],
                      }))
                    }
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
                      isSelected
                        ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                        : 'bg-background border-border text-muted-foreground hover:border-border/80'
                    )}
                  >
                    <IconComponent
                      className={cn(
                        'w-4 h-4',
                        isSelected
                          ? 'text-green-600 dark:text-green-400'
                          : type.color
                      )}
                    />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Quick filters:
            </span>
            {Object.entries(searchData.filters).map(([key, value]) => (
              <button
                key={key}
                onClick={() =>
                  setSearchData(prev => ({
                    ...prev,
                    filters: { ...prev.filters, [key]: !value },
                  }))
                }
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all',
                  value
                    ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                    : 'bg-background border-border text-muted-foreground hover:border-border/80'
                )}
              >
                {key === 'aiOptimized' && <Sparkles className="w-3 h-3" />}
                {key === 'instantBook' && <Zap className="w-3 h-3" />}
                {key === 'freeCancellation' && <Heart className="w-3 h-3" />}
                {key === 'superhost' && <Star className="w-3 h-3" />}
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </button>
            ))}

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border border-border text-muted-foreground hover:border-border/80"
            >
              <Filter className="w-3 h-3" />
              More filters
            </button>
          </div>

          {/* Search Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchData.destination}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching AI deals...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Search All Platforms</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card className="border-border">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price Range (per night)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="25"
                    value={searchData.priceRange.min}
                    onChange={e =>
                      setSearchData(prev => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange,
                          min: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-green-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>${searchData.priceRange.min}</span>
                  <span>-</span>
                  <span>${searchData.priceRange.max}+</span>
                </div>
              </div>
            </div>

            {/* Guest Controls */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Adults
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGuests('adults', false)}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted text-foreground"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-foreground">
                    {searchData.guests.adults}
                  </span>
                  <button
                    onClick={() => updateGuests('adults', true)}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Children
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGuests('children', false)}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted text-foreground"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-foreground">
                    {searchData.guests.children}
                  </span>
                  <button
                    onClick={() => updateGuests('children', true)}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rooms
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGuests('rooms', false)}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted text-foreground"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-foreground">
                    {searchData.guests.rooms}
                  </span>
                  <button
                    onClick={() => updateGuests('rooms', true)}
                    className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Competitive Advantage Info */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                🤖 AI-Powered Search Advantage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">
                    Multi-Platform Search:
                  </strong>{' '}
                  We compare Hotels.com, Booking.com, Airbnb, VRBO, and direct
                  bookings simultaneously.
                </div>
                <div>
                  <strong className="text-foreground">
                    Real-Time Optimization:
                  </strong>{' '}
                  Our AI finds hidden discounts and package deals others miss.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
