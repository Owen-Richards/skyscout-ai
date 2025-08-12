'use client';
import { FlightSearchSchema } from '@skyscout/shared';
import { Button, Card, CardContent, Input } from '@skyscout/ui';
import { Calendar, Plane, Users } from 'lucide-react';
import React from 'react';
import { z } from 'zod';

/**
 * Flight Quick Search - A simplified flight search component
 *
 * Features:
 * - Quick city-to-city search
 * - Date picker integration
 * - Passenger count selector
 * - Integration with main search form
 * - Uses @skyscout/ui components for consistency
 *
 * Uses FlightSearchSchema for validation and UI library components
 */

type FlightQuickSearchProps = {
  onSearch: (searchData: z.infer<typeof FlightSearchSchema>) => void;
  className?: string;
};

export function FlightQuickSearch({
  onSearch,
  className,
}: FlightQuickSearchProps) {
  // Context comment: Handle form state with React hooks and Zod validation
  const [formData, setFormData] = React.useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy' as const,
  });

  // Context comment: Form submission with validation using our shared schema
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Copilot understands FlightSearchSchema structure from imports
      const validatedData = FlightSearchSchema.parse(formData);
      onSearch(validatedData);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Origin City Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Plane className="h-4 w-4" />
                From
              </label>
              <Input
                type="text"
                placeholder="NYC"
                value={formData.origin}
                onChange={e =>
                  setFormData(prev => ({ ...prev, origin: e.target.value }))
                }
                maxLength={3}
              />
            </div>

            {/* Destination City Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Plane className="h-4 w-4 rotate-90" />
                To
              </label>
              <Input
                type="text"
                placeholder="LAX"
                value={formData.destination}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                maxLength={3}
              />
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Departure
              </label>
              <Input
                type="date"
                value={formData.departureDate}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    departureDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Passengers: {formData.passengers}
              </label>
              <Button
                type="submit"
                className="w-full"
                variant="default"
                size="default"
              >
                Search Flights
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
