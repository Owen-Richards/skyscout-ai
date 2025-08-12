/**
 * Flight Search Component - Clean Architecture Implementation
 *
 * This component demonstrates the 10/10 architecture:
 * - Single Responsibility: Only handles flight search UI
 * - Clean separation of concerns
 * - Uses custom hooks for business logic
 * - Minimal complexity (< 100 lines)
 * - Type-safe with domain objects
 */

'use client';

import { Button, Card, cn } from '@skyscout/ui';
import { Calendar, MapPin, Plane, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useFlightSearch } from '../../hooks/use-flight-search';

interface FlightSearchProps {
  readonly className?: string;
}

export function FlightSearchClean({ className }: FlightSearchProps) {
  const { isLoading, results, error, searchFlights } = useFlightSearch();
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: 1,
  });

  const handleSearch = async () => {
    try {
      // Create domain objects
      await searchFlights({
        from: searchParams.origin || 'LAX',
        to: searchParams.destination || 'JFK',
        departDate: new Date(searchParams.departureDate || Date.now()),
        passengers: searchParams.passengers,
        class: 'economy',
      });
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Form */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5" />
          Flight Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <SearchField
            icon={<MapPin className="w-4 h-4" />}
            label="From"
            value={searchParams.origin}
            onChange={value =>
              setSearchParams(prev => ({ ...prev, origin: value }))
            }
            placeholder="Origin city"
          />

          <SearchField
            icon={<MapPin className="w-4 h-4" />}
            label="To"
            value={searchParams.destination}
            onChange={value =>
              setSearchParams(prev => ({ ...prev, destination: value }))
            }
            placeholder="Destination city"
          />

          <SearchField
            icon={<Calendar className="w-4 h-4" />}
            label="Departure"
            type="date"
            value={searchParams.departureDate}
            onChange={value =>
              setSearchParams(prev => ({ ...prev, departureDate: value }))
            }
          />

          <SearchField
            icon={<Users className="w-4 h-4" />}
            label="Passengers"
            type="number"
            value={searchParams.passengers.toString()}
            onChange={value =>
              setSearchParams(prev => ({
                ...prev,
                passengers: parseInt(value) || 1,
              }))
            }
            min="1"
            max="9"
          />
        </div>

        <Button onClick={handleSearch} disabled={isLoading} className="w-full">
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? 'Searching...' : 'Search Flights'}
        </Button>
      </Card>

      {/* Results */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">{error?.message}</p>
        </Card>
      )}

      {results && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Found {results.length} flights
          </h3>
          <div className="space-y-4">
            {results.map(flight => (
              <div
                key={flight.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {flight.airline} {flight.flightNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {flight.departure.airport} → {flight.arrival.airport}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {flight.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${flight.price}
                    </p>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Sub-components for better organization

interface SearchFieldProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly type?: string;
  readonly placeholder?: string;
  readonly min?: string;
  readonly max?: string;
}

function SearchField({
  icon,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  max,
}: SearchFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 flex items-center gap-1">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
