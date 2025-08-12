/**
 * Price Range Filter Component
 *
 * Single responsibility: Handle price range filtering
 */

'use client';

import { Card } from '@skyscout/ui';
import { DollarSign } from 'lucide-react';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PriceRangeFilter({
  priceRange,
  onPriceRangeChange,
  isExpanded,
  onToggle,
}: PriceRangeFilterProps) {
  return (
    <Card className="p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">Price Range</span>
        </div>
        <span className="text-sm text-muted-foreground">
          ${priceRange[0]} - ${priceRange[1]}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[0]}
              onChange={e =>
                onPriceRangeChange([parseInt(e.target.value), priceRange[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={e =>
                onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
