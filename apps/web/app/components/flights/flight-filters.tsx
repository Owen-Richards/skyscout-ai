/**
 * Flight Filters Component
 * Advanced filtering with smart presets and user-friendly controls
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@skyscout/ui';
import {
  Filter,
  X,
  Clock,
  DollarSign,
  Plane,
  Star,
  Zap,
  Calendar,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@skyscout/ui';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterValues {
  stops?: string[];
  airlines?: string[];
  departureTime?: string[];
  duration?: string[];
  priceRange?: [number, number];
  [key: string]: string[] | [number, number] | undefined;
}

interface FlightFiltersProps {
  onFiltersChange: (filters: FilterValues) => void;
  className?: string;
}

export function FlightFilters({
  onFiltersChange,
  className,
}: FlightFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'stops', 'airlines'])
  );

  // Filter options
  const stopOptions: FilterOption[] = [
    { id: 'nonstop', label: 'Non-stop', count: 12 },
    { id: '1-stop', label: '1 stop', count: 28 },
    { id: '2-stops', label: '2+ stops', count: 15 },
  ];

  const airlineOptions: FilterOption[] = [
    { id: 'delta', label: 'Delta Airlines', count: 8 },
    { id: 'american', label: 'American Airlines', count: 12 },
    { id: 'united', label: 'United Airlines', count: 6 },
    { id: 'southwest', label: 'Southwest Airlines', count: 9 },
    { id: 'jetblue', label: 'JetBlue Airways', count: 4 },
  ];

  const timeOptions: FilterOption[] = [
    { id: 'early-morning', label: 'Early morning (6AM - 12PM)', count: 18 },
    { id: 'afternoon', label: 'Afternoon (12PM - 6PM)', count: 22 },
    { id: 'evening', label: 'Evening (6PM - 12AM)', count: 15 },
  ];

  const durationOptions: FilterOption[] = [
    { id: 'short', label: 'Under 5 hours', count: 25 },
    { id: 'medium', label: '5-10 hours', count: 18 },
    { id: 'long', label: 'Over 10 hours', count: 12 },
  ];

  // Smart filter presets
  const presets = [
    {
      id: 'best-value',
      label: 'Best Value',
      icon: Star,
      filters: { stops: ['1-stop'], priceRange: [300, 800] },
    },
    {
      id: 'fastest',
      label: 'Fastest',
      icon: Zap,
      filters: { stops: ['nonstop'], duration: ['short'] },
    },
    {
      id: 'cheapest',
      label: 'Cheapest',
      icon: DollarSign,
      filters: { priceRange: [0, 500] },
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: Plane,
      filters: { airlines: ['delta', 'american'], stops: ['nonstop'] },
    },
  ];

  const updateFilter = (
    category: keyof FilterValues,
    value: string,
    isMultiSelect = true
  ) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (isMultiSelect) {
        if (!newFilters[category]) newFilters[category] = [];
        const currentValues = newFilters[category] as string[];

        if (currentValues.includes(value)) {
          newFilters[category] = currentValues.filter(
            (v: string) => v !== value
          );
          if ((newFilters[category] as string[]).length === 0) {
            delete newFilters[category];
          }
        } else {
          newFilters[category] = [...currentValues, value];
        }
      } else {
        if (newFilters[category] === value) {
          delete newFilters[category];
        } else {
          newFilters[category] = [value];
        }
      }

      return newFilters;
    });
  };

  const applyPreset = (preset: (typeof presets)[0]) => {
    setActiveFilters(preset.filters);
    if (preset.filters.priceRange) {
      setPriceRange(preset.filters.priceRange);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setPriceRange([0, 2000]);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(section)) {
        newExpanded.delete(section);
      } else {
        newExpanded.add(section);
      }
      return newExpanded;
    });
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange({ ...activeFilters, priceRange });
  }, [activeFilters, priceRange, onFiltersChange]);

  const FilterSection = ({
    id,
    title,
    icon: Icon,
    children,
  }: {
    id: string;
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.has(id);

    return (
      <div className="border-b border-border/50 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {activeFilters[id] && (
              <Badge variant="secondary" className="text-xs">
                {Array.isArray(activeFilters[id])
                  ? activeFilters[id].length
                  : 1}
              </Badge>
            )}
            <div
              className={cn(
                'transition-transform duration-200',
                isExpanded ? 'rotate-180' : ''
              )}
            >
              ▼
            </div>
          </div>
        </button>

        {isExpanded && <div className="px-4 pb-4">{children}</div>}
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary">{getActiveFilterCount()}</Badge>
          )}
        </div>

        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Smart presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Smart Presets
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => {
            const Icon = preset.icon;
            return (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.filters)}
                className="h-auto p-3 flex flex-col items-center gap-1 text-xs"
              >
                <Icon className="h-4 w-4" />
                <span>{preset.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Popular filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Popular This Week</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            ✈️ Nonstop only
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            💰 Under $500
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            📶 Free WiFi
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            🌅 Morning departure
          </Button>
        </div>
      </div>

      {/* Filter Sections */}
      <Card className="overflow-hidden">
        {/* Price Range */}
        <FilterSection id="price" title="Price Range" icon={DollarSign}>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[0]}
                onChange={e =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={e =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </FilterSection>

        {/* Stops */}
        <FilterSection id="stops" title="Stops" icon={MapPin}>
          <div className="space-y-2">
            {stopOptions.map(option => (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.stops?.includes(option.id) || false}
                  onChange={() => updateFilter('stops', option.id)}
                  className="rounded border-gray-300"
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-muted-foreground text-sm">
                  ({option.count})
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Airlines */}
        <FilterSection id="airlines" title="Airlines" icon={Plane}>
          <div className="space-y-2">
            {airlineOptions.map(option => (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.airlines?.includes(option.id) || false}
                  onChange={() => updateFilter('airlines', option.id)}
                  className="rounded border-gray-300"
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-muted-foreground text-sm">
                  ({option.count})
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Departure Time */}
        <FilterSection id="departure-time" title="Departure Time" icon={Clock}>
          <div className="space-y-2">
            {timeOptions.map(option => (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    activeFilters.departureTime?.includes(option.id) || false
                  }
                  onChange={() => updateFilter('departureTime', option.id)}
                  className="rounded border-gray-300"
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-muted-foreground text-sm">
                  ({option.count})
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Flight Duration */}
        <FilterSection id="duration" title="Flight Duration" icon={Calendar}>
          <div className="space-y-2">
            {durationOptions.map(option => (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.duration?.includes(option.id) || false}
                  onChange={() => updateFilter('duration', option.id)}
                  className="rounded border-gray-300"
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-muted-foreground text-sm">
                  ({option.count})
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </Card>

      {/* Apply Button */}
      {getActiveFilterCount() > 0 && (
        <Button className="w-full" size="lg">
          Apply {getActiveFilterCount()} Filter
          {getActiveFilterCount() !== 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );
}
