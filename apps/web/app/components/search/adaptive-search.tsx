/**
 * Adaptive Search Interface
 * Progressive complexity based on user expertise and needs
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  cn,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@skyscout/ui';
import {
  Bus,
  Calendar,
  Car,
  ChevronDown,
  Clock,
  MapPin,
  Plane,
  Search,
  Settings,
  Train,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface AdaptiveSearchProps {
  readonly className?: string;
  readonly userLevel?: 'beginner' | 'intermediate' | 'expert';
  readonly showMultiModal?: boolean;
}

export function AdaptiveSearch({
  className,
  userLevel = 'beginner',
  showMultiModal = false,
}: AdaptiveSearchProps) {
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced'>('simple');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [transportMode, setTransportMode] = useState('flights');

  // Progressive complexity levels
  const getSearchFields = () => {
    const baseFields = (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <Input placeholder="Origin city or airport" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <Input placeholder="Destination city or airport" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Departure</label>
          <Input type="date" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Return</label>
          <Input type="date" placeholder="One-way?" />
        </div>
      </div>
    );

    const intermediateFields = (
      <div className="space-y-4">
        {baseFields}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Passengers</label>
            <select className="w-full p-2 border border-border rounded-md bg-background">
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4+ Adults</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <select className="w-full p-2 border border-border rounded-md bg-background">
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Range</label>
            <select className="w-full p-2 border border-border rounded-md bg-background">
              <option value="">Any budget</option>
              <option value="budget">Under $500</option>
              <option value="mid">$500 - $1,500</option>
              <option value="premium">$1,500+</option>
            </select>
          </div>
        </div>
      </div>
    );

    return searchMode === 'simple' ? baseFields : intermediateFields;
  };

  const transportModes = [
    { id: 'flights', label: 'Flights', icon: Plane, color: 'bg-blue-500' },
    { id: 'trains', label: 'Trains', icon: Train, color: 'bg-green-500' },
    { id: 'buses', label: 'Buses', icon: Bus, color: 'bg-orange-500' },
    { id: 'cars', label: 'Car Rental', icon: Car, color: 'bg-purple-500' },
  ];

  return (
    <Card className={cn('w-full glass-card', className)}>
      <CardContent className="p-6">
        {/* Transport Mode Selector (Multi-Modal) */}
        {showMultiModal && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold">Travel Mode</h3>
              <Badge variant="secondary">Multi-Modal</Badge>
            </div>
            <Tabs value={transportMode} onValueChange={setTransportMode}>
              <TabsList className="grid w-full grid-cols-4">
                {transportModes.map(mode => (
                  <TabsTrigger
                    key={mode.id}
                    value={mode.id}
                    className="flex items-center gap-2"
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Search Complexity Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              Find {transportMode === 'flights' ? 'Flights' : 'Transport'}
            </h2>
            {userLevel !== 'beginner' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSearchMode(searchMode === 'simple' ? 'advanced' : 'simple')
                }
              >
                <Settings className="w-4 h-4 mr-2" />
                {searchMode === 'simple' ? 'More Options' : 'Simplify'}
              </Button>
            )}
          </div>

          {/* Smart Features Hints */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary">
              <Zap className="w-4 h-4 mr-1" />
              Smart Features
            </Button>
          </div>
        </div>

        {/* Main Search Fields */}
        {getSearchFields()}

        {/* Advanced Filters (Collapsible) */}
        {searchMode === 'advanced' && (
          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Filters
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  showAdvancedFilters && 'rotate-180'
                )}
              />
            </Button>

            {showAdvancedFilters && (
              <div className="mt-4 space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Max Layover
                    </label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="">Any duration</option>
                      <option value="2h">2 hours</option>
                      <option value="4h">4 hours</option>
                      <option value="8h">8 hours</option>
                      <option value="direct">Direct only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Preferred Airlines
                    </label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="">Any airline</option>
                      <option value="major">Major carriers only</option>
                      <option value="lcc">Include budget airlines</option>
                      <option value="specific">Specific airlines</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Departure Time
                    </label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="">Any time</option>
                      <option value="morning">Morning (6AM-12PM)</option>
                      <option value="afternoon">Afternoon (12PM-6PM)</option>
                      <option value="evening">Evening (6PM-12AM)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trip Type</label>
                    <select className="w-full p-2 border border-border rounded-md bg-background">
                      <option value="leisure">Leisure</option>
                      <option value="business">Business</option>
                      <option value="group">Group Travel</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <Button size="lg" className="px-8">
              <Search className="w-4 h-4 mr-2" />
              Search {transportMode === 'flights' ? 'Flights' : 'Options'}
            </Button>

            {userLevel !== 'beginner' && (
              <Button variant="outline" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Group Trip
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Flexible Dates
            </Button>
            <Button variant="ghost" size="sm">
              <MapPin className="w-4 h-4 mr-1" />
              Explore
            </Button>
          </div>
        </div>

        {/* Smart Suggestions Bar */}
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium">Smart Tip:</span>
              <span className="text-muted-foreground">
                Book 2-8 weeks ahead for domestic flights to save up to 30%
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
