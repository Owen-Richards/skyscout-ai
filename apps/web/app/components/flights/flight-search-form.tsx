'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Input } from '@skyscout/ui';
import {
  Search,
  ArrowRightLeft,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { FlightSearchSchema, type FlightSearch } from '@skyscout/shared';
import { cn } from '@skyscout/ui';

interface FlightSearchFormProps {
  onSearch: (searchData: FlightSearch) => void;
  isLoading?: boolean;
  className?: string;
}

export function FlightSearchForm({
  onSearch,
  isLoading = false,
  className,
}: FlightSearchFormProps) {
  const [formData, setFormData] = useState<Partial<FlightSearch>>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy',
  });

  const [tripType, setTripType] = useState<
    'round-trip' | 'one-way' | 'multi-city'
  >('round-trip');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular destinations for suggestions
  const popularDestinations = [
    'New York (NYC)',
    'Los Angeles (LAX)',
    'London (LHR)',
    'Paris (CDG)',
    'Tokyo (NRT)',
    'Dubai (DXB)',
    'Singapore (SIN)',
    'Amsterdam (AMS)',
    'Barcelona (BCN)',
    'Rome (FCO)',
    'Sydney (SYD)',
    'Toronto (YYZ)',
  ];

  // Auto-suggest smart defaults
  useEffect(() => {
    // Set default departure date to tomorrow
    if (!formData.departureDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        departureDate: tomorrow.toISOString().split('T')[0],
      }));
    }
  }, []);

  const handleInputChange = (
    field: keyof FlightSearch,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Show suggestions for origin/destination
    if (
      (field === 'origin' || field === 'destination') &&
      typeof value === 'string' &&
      value.length > 0
    ) {
      const filtered = popularDestinations.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const swapLocations = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = FlightSearchSchema.parse(formData);
      onSearch(validatedData);
      setErrors({});
    } catch (error) {
      if (error instanceof Error) {
        console.error('Validation error:', error);
        // Handle validation errors
        setErrors({ general: 'Please fill in all required fields correctly' });
      }
    }
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* Engaging header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Where to next?
            </h2>
            <p className="text-muted-foreground">
              Find the best deals with our AI-powered search
            </p>
          </div>

          {/* Trip type selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {(['round-trip', 'one-way', 'multi-city'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setTripType(type)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  tripType === type
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Location inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* From */}
          <div className="md:col-span-5 relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where from?"
                value={formData.origin}
                onChange={e => handleInputChange('origin', e.target.value)}
                className="pl-10 h-12 text-lg"
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        handleInputChange('origin', suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap button */}
          <div className="md:col-span-2 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={swapLocations}
              className="h-12 w-12 rounded-full border hover:bg-primary/10 hover:border-primary/20 transition-all"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* To */}
          <div className="md:col-span-5 relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where to?"
                value={formData.destination}
                onChange={e => handleInputChange('destination', e.target.value)}
                className="pl-10 h-12 text-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Date and passenger inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Departure date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Departure
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                value={formData.departureDate}
                onChange={e =>
                  handleInputChange('departureDate', e.target.value)
                }
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          {/* Return date */}
          {tripType === 'round-trip' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Return
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="date"
                  value={formData.returnDate || ''}
                  onChange={e =>
                    handleInputChange('returnDate', e.target.value)
                  }
                  className="pl-10 h-12"
                />
              </div>
            </div>
          )}

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <select
                value={formData.passengers}
                onChange={e =>
                  handleInputChange('passengers', parseInt(e.target.value))
                }
                className="w-full pl-10 pr-4 py-3 h-12 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Class
            </label>
            <select
              value={formData.class}
              onChange={e => handleInputChange('class', e.target.value)}
              className="w-full px-4 py-3 h-12 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* AI-powered features */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm">
            <Zap className="h-4 w-4" />
            Smart price alerts
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm">
            <TrendingUp className="h-4 w-4" />
            Best time to book
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Clock className="h-4 w-4" />
            Flexible dates
          </div>
        </div>

        {/* Error display */}
        {errors.general && (
          <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Search button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              Searching flights...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Flights
            </div>
          )}
        </Button>
      </form>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
    </Card>
  );
}
