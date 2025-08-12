/**
 * Progressive Results Display
 * Smart disclosure of flight details and advanced features
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  cn,
} from '@skyscout/ui';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Briefcase,
  Calculator,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  Eye,
  EyeOff,
  Plane,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface FlightOption {
  id: string;
  airline: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  priceChange: 'up' | 'down' | 'stable';
  confidence: number;
  basicFare: number;
  totalWithFees: number;
  comfort: {
    legroom: number;
    wifi: boolean;
    meals: boolean;
    power: boolean;
  };
  sustainability: {
    emissions: number;
    efficiency: 'high' | 'medium' | 'low';
  };
}

interface ResultsDisplayProps {
  readonly className?: string;
  readonly userLevel?: 'beginner' | 'intermediate' | 'expert';
  readonly results: FlightOption[];
}

export function ResultsDisplay({
  className,
  userLevel = 'beginner',
  results,
}: ResultsDisplayProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const toggleComparison = (id: string) => {
    setSelectedComparison(
      prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id].slice(0, 3) // Max 3 comparisons
    );
  };

  const getPriceAdvice = (option: FlightOption) => {
    if (option.confidence >= 80) {
      return { action: 'book', color: 'text-green-600', icon: CheckCircle };
    } else if (option.confidence >= 60) {
      return { action: 'consider', color: 'text-yellow-600', icon: Clock };
    } else {
      return { action: 'wait', color: 'text-orange-600', icon: AlertCircle };
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top-3 Matchmaking Results */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Top 3 Recommendations
            </CardTitle>
            <Badge variant="secondary">AI Ranked</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your preferences: price, comfort, and convenience
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {results.slice(0, 3).map((option, index) => {
              const advice = getPriceAdvice(option);
              const isExpanded = expandedCards.has(option.id);

              return (
                <Card
                  key={option.id}
                  className={cn(
                    'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
                    index === 0 && 'ring-2 ring-primary/30',
                    selectedComparison.includes(option.id) &&
                      'ring-2 ring-secondary'
                  )}
                >
                  {/* Best Deal Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Best Deal
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-4">
                    {/* Basic Flight Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-primary" />
                          <span className="font-semibold">
                            {option.airline}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ${option.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            per person
                          </div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span>{option.departure}</span>
                          <span className="text-muted-foreground">
                            {option.route}
                          </span>
                          <span>{option.arrival}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{option.duration}</span>
                          <span>
                            {option.stops === 0
                              ? 'Direct'
                              : `${option.stops} stop${option.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                      </div>

                      {/* Price Confidence & Advice */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <advice.icon className={cn('w-4 h-4', advice.color)} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {option.confidence}% confident
                            <span className="text-muted-foreground ml-1">
                              •{' '}
                              {advice.action === 'book'
                                ? 'Book now'
                                : advice.action === 'consider'
                                  ? 'Consider booking'
                                  : 'Wait for better prices'}
                            </span>
                          </div>
                          <Progress
                            value={option.confidence}
                            className="h-1 mt-1"
                          />
                        </div>
                      </div>

                      {/* Progressive Disclosure Toggle */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpanded(option.id)}
                          className="flex-1"
                        >
                          {isExpanded ? (
                            <EyeOff className="w-4 h-4 mr-1" />
                          ) : (
                            <Eye className="w-4 h-4 mr-1" />
                          )}
                          {isExpanded ? 'Less Details' : 'More Details'}
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3 ml-1" />
                          ) : (
                            <ChevronDown className="w-3 h-3 ml-1" />
                          )}
                        </Button>

                        {userLevel !== 'beginner' && (
                          <Button
                            variant={
                              selectedComparison.includes(option.id)
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() => toggleComparison(option.id)}
                          >
                            Compare
                          </Button>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="space-y-3 pt-3 border-t animate-in slide-in-from-top-1">
                          {/* True Total Cost */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Calculator className="w-4 h-4" />
                              True Total Cost
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Base fare</span>
                                <span>${option.basicFare}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Taxes & fees</span>
                                <span>
                                  ${option.totalWithFees - option.basicFare}
                                </span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>Total</span>
                                <span>${option.totalWithFees}</span>
                              </div>
                            </div>
                          </div>

                          {/* Comfort & Amenities */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Coffee className="w-4 h-4" />
                              Comfort & Amenities
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                <span>{option.comfort.legroom}"</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Wifi
                                  className={cn(
                                    'w-3 h-3',
                                    option.comfort.wifi
                                      ? 'text-green-500'
                                      : 'text-muted-foreground'
                                  )}
                                />
                                <span>
                                  {option.comfort.wifi ? 'WiFi' : 'No WiFi'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Coffee
                                  className={cn(
                                    'w-3 h-3',
                                    option.comfort.meals
                                      ? 'text-green-500'
                                      : 'text-muted-foreground'
                                  )}
                                />
                                <span>
                                  {option.comfort.meals ? 'Meals' : 'No meals'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Sustainability (Advanced Users) */}
                          {userLevel === 'expert' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Shield className="w-4 h-4 text-green-600" />
                                Environmental Impact
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {option.sustainability.emissions} kg CO₂ •
                                <span
                                  className={cn(
                                    'ml-1 font-medium',
                                    option.sustainability.efficiency === 'high'
                                      ? 'text-green-600'
                                      : option.sustainability.efficiency ===
                                          'medium'
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                  )}
                                >
                                  {option.sustainability.efficiency} efficiency
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1">
                              Book Now
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Bell className="w-4 h-4" />
                              Track Price
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users className="w-4 h-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Results (Simplified) */}
      {results.length > 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>More Options</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllDetails(!showAllDetails)}
              >
                {showAllDetails ? (
                  <EyeOff className="w-4 h-4 mr-1" />
                ) : (
                  <Eye className="w-4 h-4 mr-1" />
                )}
                {showAllDetails ? 'Simplify' : 'Show Details'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.slice(3).map(option => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{option.airline}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.departure} - {option.arrival} •{' '}
                        {option.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold">${option.price}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.confidence}% confident
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Panel (Advanced Users) */}
      {selectedComparison.length > 0 && userLevel !== 'beginner' && (
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Comparison ({selectedComparison.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {selectedComparison.map(id => {
                const option = results.find(r => r.id === id);
                if (!option) return null;

                return (
                  <div key={id} className="p-3 border border-border rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      {option.airline}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Price</span>
                        <span className="font-medium">${option.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span>{option.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stops</span>
                        <span>
                          {option.stops === 0
                            ? 'Direct'
                            : `${option.stops} stop${option.stops > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence</span>
                        <span>{option.confidence}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={() => setSelectedComparison([])}>
                Clear Comparison
              </Button>
              <Button>
                Compare Details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Mock data for development
export const mockFlightResults: FlightOption[] = [
  {
    id: '1',
    airline: 'Delta Air Lines',
    route: 'JFK → LAX',
    departure: '8:30 AM',
    arrival: '11:45 AM',
    duration: '6h 15m',
    stops: 0,
    price: 289,
    priceChange: 'down',
    confidence: 85,
    basicFare: 249,
    totalWithFees: 312,
    comfort: { legroom: 31, wifi: true, meals: true, power: true },
    sustainability: { emissions: 180, efficiency: 'high' },
  },
  {
    id: '2',
    airline: 'American Airlines',
    route: 'JFK → LAX',
    departure: '2:15 PM',
    arrival: '5:30 PM',
    duration: '6h 15m',
    stops: 0,
    price: 315,
    priceChange: 'stable',
    confidence: 78,
    basicFare: 275,
    totalWithFees: 338,
    comfort: { legroom: 30, wifi: true, meals: false, power: true },
    sustainability: { emissions: 185, efficiency: 'medium' },
  },
  {
    id: '3',
    airline: 'JetBlue Airways',
    route: 'JFK → LAX',
    departure: '6:45 PM',
    arrival: '10:00 PM',
    duration: '6h 15m',
    stops: 0,
    price: 267,
    priceChange: 'up',
    confidence: 72,
    basicFare: 229,
    totalWithFees: 289,
    comfort: { legroom: 32, wifi: true, meals: false, power: true },
    sustainability: { emissions: 175, efficiency: 'high' },
  },
];
