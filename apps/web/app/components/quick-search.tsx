'use client';

import * as React from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Plane,
  ArrowLeftRight,
  X,
} from 'lucide-react';
import { Button, Input } from '@skyscout/ui';
import { cn } from '@skyscout/ui';

interface QuickSearchProps {
  className?: string;
  onSearch?: (searchData: SearchData) => void;
}

interface SearchData {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
}

export function QuickSearch({ className, onSearch }: QuickSearchProps) {
  const [searchData, setSearchData] = React.useState<SearchData>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'round-trip',
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSearch = () => {
    onSearch?.(searchData);
  };

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsExpanded(true)}
        className={cn(
          'h-12 px-6 bg-white/90 backdrop-blur-sm border-border/50 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300',
          className
        )}
        leftIcon={<Search className="h-5 w-5" />}
      >
        <span className="text-muted-foreground">
          Search flights, hotels, cars...
        </span>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-border/20 p-6',
        className
      )}
    >
      {/* Trip Type Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={searchData.tripType === 'round-trip' ? 'default' : 'ghost'}
            size="sm"
            onClick={() =>
              setSearchData(prev => ({ ...prev, tripType: 'round-trip' }))
            }
          >
            Round Trip
          </Button>
          <Button
            variant={searchData.tripType === 'one-way' ? 'default' : 'ghost'}
            size="sm"
            onClick={() =>
              setSearchData(prev => ({ ...prev, tripType: 'one-way' }))
            }
          >
            One Way
          </Button>
          <Button
            variant={searchData.tripType === 'multi-city' ? 'default' : 'ghost'}
            size="sm"
            onClick={() =>
              setSearchData(prev => ({ ...prev, tripType: 'multi-city' }))
            }
          >
            Multi-city
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* From Location */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="relative">
            <Input
              value={searchData.from}
              onChange={e =>
                setSearchData(prev => ({ ...prev, from: e.target.value }))
              }
              placeholder="City or airport"
              startIcon={<MapPin className="h-4 w-4" />}
              className="h-12"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-1 flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapLocations}
            className="h-12 w-12 rounded-full border-2 hover:rotate-180 transition-transform duration-300"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* To Location */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <Input
            value={searchData.to}
            onChange={e =>
              setSearchData(prev => ({ ...prev, to: e.target.value }))
            }
            placeholder="City or airport"
            startIcon={<MapPin className="h-4 w-4" />}
            className="h-12"
          />
        </div>

        {/* Departure Date */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure
          </label>
          <Input
            type="date"
            value={searchData.departDate}
            onChange={e =>
              setSearchData(prev => ({ ...prev, departDate: e.target.value }))
            }
            startIcon={<Calendar className="h-4 w-4" />}
            className="h-12"
          />
        </div>

        {/* Return Date */}
        {searchData.tripType === 'round-trip' && (
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return
            </label>
            <Input
              type="date"
              value={searchData.returnDate}
              onChange={e =>
                setSearchData(prev => ({ ...prev, returnDate: e.target.value }))
              }
              startIcon={<Calendar className="h-4 w-4" />}
              className="h-12"
            />
          </div>
        )}

        {/* Passengers */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers
          </label>
          <Input
            type="number"
            min="1"
            max="9"
            value={searchData.passengers}
            onChange={e =>
              setSearchData(prev => ({
                ...prev,
                passengers: parseInt(e.target.value) || 1,
              }))
            }
            startIcon={<Users className="h-4 w-4" />}
            className="h-12"
          />
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <Button
            onClick={handleSearch}
            size="lg"
            variant="flight-action"
            effect="glow"
            className="h-12 w-full"
            leftIcon={<Plane className="h-4 w-4" />}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mt-6 pt-4 border-t border-border/20">
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Direct flights only</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Include nearby airports</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Flexible dates</span>
          </label>
        </div>
      </div>
    </div>
  );
}
