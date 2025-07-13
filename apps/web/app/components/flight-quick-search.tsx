import React from 'react';
import { Button } from '@skyscout/ui';
import { Plane, Calendar, Users } from 'lucide-react';
import { FlightSearchSchema } from '@skyscout/shared';
import { z } from 'zod';

/**
 * Flight Quick Search - A simplified flight search component
 *
 * Features:
 * - Quick city-to-city search
 * - Date picker integration
 * - Passenger count selector
 * - Integration with main search form
 *
 * Uses FlightSearchSchema for validation and Button component for consistency
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
    <form onSubmit={handleSubmit} className={className}>
      {/* Context comment: Use consistent styling patterns from the app */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-md">
        {/* Origin City Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Plane className="h-4 w-4" />
            From
          </label>
          {/* Copilot suggests appropriate input based on schema */}
          <input
            type="text"
            placeholder="NYC"
            value={formData.origin}
            onChange={e =>
              setFormData(prev => ({ ...prev, origin: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={3}
          />
        </div>

        {/* Destination City Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Plane className="h-4 w-4 rotate-90" />
            To
          </label>
          <input
            type="text"
            placeholder="LAX"
            value={formData.destination}
            onChange={e =>
              setFormData(prev => ({ ...prev, destination: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={3}
          />
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Departure
          </label>
          <input
            type="date"
            value={formData.departureDate}
            onChange={e =>
              setFormData(prev => ({ ...prev, departureDate: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Button - Uses your UI library Button component */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Passengers: {formData.passengers}
          </label>
          {/* Context: Button component with consistent styling and loading states */}
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
  );
}
