/**
 * Flight Map Component
 * Interactive map view showing flight routes and prices
 */

'use client';

import { useState, useRef } from 'react';
import { Card, Button, Badge } from '@skyscout/ui';
import { MapPin, Plane, ZoomIn, ZoomOut, Star } from 'lucide-react';
import type { FlightOffer } from '@skyscout/shared';
import { cn } from '@skyscout/ui';

interface FlightMapProps {
  results: FlightOffer[];
  isLoading: boolean;
  onFlightSelect: (flight: FlightOffer) => void;
  className?: string;
}

// Mock airport coordinates (in real app, this would come from a database)
const airportCoordinates: Record<
  string,
  { lat: number; lng: number; name: string }
> = {
  NYC: { lat: 40.7128, lng: -74.006, name: 'New York' },
  LAX: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
  LHR: { lat: 51.5074, lng: -0.1278, name: 'London' },
  CDG: { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  NRT: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  DXB: { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  SIN: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  SYD: { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
};

export function FlightMap({
  results,
  isLoading,
  onFlightSelect,
  className,
}: FlightMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null
  );
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'satellite'>(
    'light'
  );
  const [zoom, setZoom] = useState(2);

  const handleFlightSelect = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    onFlightSelect(flight);
  };

  const getRouteColor = (price: number) => {
    // Color routes based on price (green = cheap, red = expensive)
    if (price < 400) return '#10b981'; // green
    if (price < 700) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getBestDeal = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) =>
      current.price < best.price ? current : best
    );
  };

  if (isLoading) {
    return (
      <Card className={cn('p-8 h-96', className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading flight routes...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Map controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Flight Map
            </h3>

            <div className="flex items-center gap-2">
              <Button
                variant={mapStyle === 'light' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMapStyle('light')}
              >
                Light
              </Button>
              <Button
                variant={mapStyle === 'satellite' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMapStyle('satellite')}
              >
                Satellite
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Plane className="h-3 w-3" />
              {results.length} routes
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(zoom + 1, 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(zoom - 1, 1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Map container */}
      <Card className="relative overflow-hidden h-96 lg:h-[500px]">
        {/* Mock map background */}
        <div
          ref={mapContainer}
          className={cn(
            'w-full h-full relative',
            mapStyle === 'light' &&
              'bg-gradient-to-br from-blue-50 via-sky-50 to-slate-100',
            mapStyle === 'satellite' &&
              'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600'
          )}
        >
          {/* Grid overlay for map-like appearance */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Flight routes */}
          {results.map((flight, index) => {
            const originCoord = airportCoordinates[flight.origin];
            const destCoord = airportCoordinates[flight.destination];

            if (!originCoord || !destCoord) return null;

            // Calculate position percentages for mock positioning
            const originX = ((originCoord.lng + 180) / 360) * 100;
            const originY = ((90 - originCoord.lat) / 180) * 100;
            const destX = ((destCoord.lng + 180) / 360) * 100;
            const destY = ((90 - destCoord.lat) / 180) * 100;

            return (
              <div key={flight.id}>
                {/* Route line */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <line
                    x1={`${originX}%`}
                    y1={`${originY}%`}
                    x2={`${destX}%`}
                    y2={`${destY}%`}
                    stroke={getRouteColor(flight.price)}
                    strokeWidth="3"
                    strokeDasharray={
                      selectedFlight?.id === flight.id ? '5,5' : 'none'
                    }
                    className="animate-pulse"
                  />
                </svg>

                {/* Origin marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${originX}%`,
                    top: `${originY}%`,
                    zIndex: 2,
                  }}
                  onClick={() => handleFlightSelect(flight)}
                >
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full border-2 border-white shadow-lg',
                      'bg-primary hover:scale-150 transition-transform'
                    )}
                  />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground bg-background/90 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {originCoord.name}
                  </div>
                </div>

                {/* Destination marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${destX}%`,
                    top: `${destY}%`,
                    zIndex: 2,
                  }}
                  onClick={() => handleFlightSelect(flight)}
                >
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full border-2 border-white shadow-lg',
                      'bg-secondary hover:scale-150 transition-transform'
                    )}
                  />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground bg-background/90 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {destCoord.name}
                  </div>
                </div>

                {/* Price label on route */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${(originX + destX) / 2}%`,
                    top: `${(originY + destY) / 2}%`,
                    zIndex: 3,
                  }}
                  onClick={() => handleFlightSelect(flight)}
                >
                  <Badge
                    variant="default"
                    className={cn(
                      'bg-white/90 text-foreground border shadow-lg hover:shadow-xl transition-shadow',
                      selectedFlight?.id === flight.id && 'ring-2 ring-primary',
                      index === 0 &&
                        'bg-green-100 border-green-300 text-green-800'
                    )}
                  >
                    {index === 0 && <Star className="h-3 w-3 mr-1" />}$
                    {flight.price}
                  </Badge>
                </div>
              </div>
            );
          })}

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-background/95 p-3 rounded-lg shadow-lg border">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span>Under $400</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-yellow-500"></div>
                <span>$400 - $700</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span>Over $700</span>
              </div>
            </div>
          </div>

          {/* Best deal highlight */}
          {getBestDeal() && (
            <div className="absolute top-4 right-4 bg-green-50 border border-green-200 p-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">Best Deal</span>
              </div>
              <div className="text-sm text-green-700 mt-1">
                ${getBestDeal()?.price} to {getBestDeal()?.destination}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Selected flight details */}
      {selectedFlight && (
        <Card className="p-4 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">
                {selectedFlight.origin} → {selectedFlight.destination}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedFlight.airline} • {selectedFlight.duration} •{' '}
                {selectedFlight.stops === 0
                  ? 'Non-stop'
                  : `${selectedFlight.stops} stops`}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${selectedFlight.price}
              </div>
              <Button size="sm" className="mt-2">
                View Details
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
