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
  Activity,
  ArrowDown,
  ArrowUp,
  Bot,
  Clock,
  DollarSign,
  MapPin,
  Plane,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useClientOnly, useIsHydrated } from '../../hooks/use-hydration';

/**
 * Interactive Demo Component
 * Real-time flight price monitoring and AI prediction simulation
 */
export function InteractiveDemo() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(589);
  const [priceHistory, setPriceHistory] = useState([589, 594, 578, 589]);
  const [aiConfidence, setAiConfidence] = useState(87);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const isHydrated = useIsHydrated();

  // Only display time after hydration to prevent mismatch
  const displayTime = useClientOnly(
    lastUpdate?.toLocaleTimeString() || new Date().toLocaleTimeString(),
    '--:--:--'
  );

  // Simulate real-time price updates (only after hydration)
  useEffect(() => {
    if (!isSimulating || !isHydrated) return;

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 20; // ±$10 change
        const newPrice = Math.max(500, Math.min(700, prev + change));
        setPriceHistory(history => [...history.slice(-6), newPrice]);
        return Math.round(newPrice);
      });

      setAiConfidence(prev =>
        Math.max(75, Math.min(95, prev + (Math.random() - 0.5) * 5))
      );
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, isHydrated]);

  // Simulate AI analysis progress (only after hydration)
  useEffect(() => {
    if (!isSimulating || !isHydrated) {
      setAnalysisProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) return 0; // Reset when complete
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(progressInterval);
  }, [isSimulating, isHydrated]);

  const priceChange =
    priceHistory.length > 1
      ? currentPrice - priceHistory[priceHistory.length - 2]
      : 0;

  const priceChangePercent =
    priceHistory.length > 1
      ? ((priceChange / priceHistory[priceHistory.length - 2]) * 100).toFixed(1)
      : '0.0';

  const destinations = [
    {
      city: 'Tokyo',
      country: 'Japan',
      price: currentPrice,
      status: 'analyzing',
    },
    { city: 'Paris', country: 'France', price: 456, status: 'complete' },
    { city: 'London', country: 'UK', price: 398, status: 'monitoring' },
    { city: 'Sydney', country: 'Australia', price: 789, status: 'complete' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <Activity className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Watch AI in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Real-Time Action
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience how our AI continuously monitors flight prices and
            predicts changes across thousands of routes in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Price Monitor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-indigo-600" />
                    NYC → Tokyo Flight Monitor
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        isSimulating
                          ? 'bg-green-500 animate-pulse'
                          : 'bg-gray-400'
                      )}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isSimulating ? 'Live' : 'Offline'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      ${currentPrice}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      {priceChange > 0 ? (
                        <ArrowUp className="w-4 h-4 text-red-500" />
                      ) : priceChange < 0 ? (
                        <ArrowDown className="w-4 h-4 text-green-500" />
                      ) : null}
                      <span
                        className={cn(
                          'text-sm font-medium',
                          priceChange > 0
                            ? 'text-red-500'
                            : priceChange < 0
                              ? 'text-green-500'
                              : 'text-muted-foreground'
                        )}
                      >
                        {priceChange > 0 ? '+' : ''}$
                        {Math.abs(priceChange).toFixed(0)} ({priceChangePercent}
                        %)
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {aiConfidence.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      AI Confidence
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-purple-600 mb-1"
                      suppressHydrationWarning={true}
                    >
                      {displayTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last Update
                    </div>
                  </div>
                </div>

                {/* AI Analysis Progress */}
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-foreground">
                        AI Analysis in Progress
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(analysisProgress)}%
                    </span>
                  </div>
                  <Progress value={analysisProgress} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {analysisProgress < 30 &&
                      'Collecting data from 247 sources...'}
                    {analysisProgress >= 30 &&
                      analysisProgress < 60 &&
                      'Analyzing market trends...'}
                    {analysisProgress >= 60 &&
                      analysisProgress < 90 &&
                      'Running prediction models...'}
                    {analysisProgress >= 90 && 'Generating recommendations...'}
                  </p>
                </div>

                {/* Price History Mini Chart */}
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Price Trend (Last 7 Updates)
                  </h4>
                  <div className="flex items-end gap-2 h-20">
                    {priceHistory.map((price, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm opacity-70 transition-all duration-300"
                        style={{
                          height: `${((price - 500) / 200) * 100}%`,
                          opacity:
                            index === priceHistory.length - 1
                              ? 1
                              : 0.7 - (priceHistory.length - index - 1) * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$500</span>
                    <span>$700</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={cn(
                      'w-full',
                      isSimulating
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    )}
                  >
                    {isSimulating ? (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Stop Simulation
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Live Demo
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Predictions Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Bot className="w-5 h-5" />
                  AI Predictions & Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-foreground">
                        Best Time to Book
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tuesday 3PM - Friday 9AM
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-foreground">
                        Price Volatility
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      High - Monitor closely
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-foreground">
                        7-Day Forecast
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      15% increase likely
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-foreground">
                        Booking Window
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      6-8 weeks optimal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Destination Monitor Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Global Monitor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {destinations.map((destination, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-foreground">
                        {destination.city}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {destination.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">
                        ${destination.price}
                      </div>
                      <Badge
                        variant={
                          destination.status === 'analyzing'
                            ? 'default'
                            : destination.status === 'monitoring'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs"
                      >
                        {destination.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">
                  Today's Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    $2,847
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    Saved by 156 users today
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Average savings: $18.25 per booking
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
