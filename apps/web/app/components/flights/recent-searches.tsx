/**
 * Recent Searches Component
 * Shows user's recent flight searches for quick re-searching
 */

'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@skyscout/ui';
import { Clock, Search, X, Plane, TrendingUp } from 'lucide-react';
import { cn } from '@skyscout/ui';

interface RecentSearch {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  searchedAt: string;
  lastPrice?: number;
}

export function RecentSearches({ className }: { className?: string }) {
  const [recentSearches] = useState<RecentSearch[]>([
    {
      id: '1',
      origin: 'NYC',
      destination: 'LAX',
      departureDate: '2024-03-15',
      returnDate: '2024-03-22',
      passengers: 2,
      searchedAt: '2024-01-15T10:30:00Z',
      lastPrice: 456,
    },
    {
      id: '2',
      origin: 'LHR',
      destination: 'CDG',
      departureDate: '2024-04-10',
      passengers: 1,
      searchedAt: '2024-01-14T15:20:00Z',
      lastPrice: 123,
    },
    {
      id: '3',
      origin: 'NRT',
      destination: 'SIN',
      departureDate: '2024-05-01',
      returnDate: '2024-05-08',
      passengers: 3,
      searchedAt: '2024-01-13T09:15:00Z',
      lastPrice: 789,
    },
  ]);

  const handleReSearch = (search: RecentSearch) => {
    console.log('Re-searching:', search);
    // Implement re-search functionality
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  if (recentSearches.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Recent Searches
        </h2>
        <Button variant="ghost" size="sm">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentSearches.map(search => (
          <Card
            key={search.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleReSearch(search)}
          >
            <div className="space-y-3">
              {/* Route */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary" />
                  <span className="font-semibold">
                    {search.origin} → {search.destination}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => {
                    e.stopPropagation();
                    // Remove search
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Departure: {formatDate(search.departureDate)}</span>
                  {search.returnDate && (
                    <span>Return: {formatDate(search.returnDate)}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    {search.passengers} passenger
                    {search.passengers > 1 ? 's' : ''}
                  </span>
                  <span>{getTimeAgo(search.searchedAt)}</span>
                </div>
              </div>

              {/* Last price */}
              {search.lastPrice && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Last seen price:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      ${search.lastPrice}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Check now
                    </Badge>
                  </div>
                </div>
              )}

              {/* Search button */}
              <Button
                size="sm"
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={e => {
                  e.stopPropagation();
                  handleReSearch(search);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Again
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
