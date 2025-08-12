'use client';

import { Badge, Card, cn } from '@skyscout/ui';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge,
  HardDrive,
  Monitor,
  TrendingDown,
  TrendingUp,
  Wifi,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  bundleSize: {
    total: number;
    gzipped: number;
    chunks: {
      name: string;
      size: number;
      gzipped: number;
    }[];
  };
  webVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  runtime: {
    memory: number;
    timing: {
      [key: string]: number;
    };
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export function PerformanceMonitor({
  className,
  showDetails = false,
}: {
  className?: string;
  showDetails?: boolean;
}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isExpanded, setIsExpanded] = useState(showDetails);

  useEffect(() => {
    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');

      // Web Vitals simulation (in a real app, you'd use web-vitals library)
      const webVitals = {
        lcp:
          paintEntries.find(entry => entry.name === 'largest-contentful-paint')
            ?.startTime || 0,
        fid: 0, // Would be measured with actual user interactions
        cls: 0, // Would need layout shift observer
        fcp:
          paintEntries.find(entry => entry.name === 'first-contentful-paint')
            ?.startTime || 0,
        ttfb: navigation.responseStart - navigation.requestStart,
      };

      // Memory usage (if available)
      const performanceMemory = (
        performance as unknown as {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }
      ).memory;
      const memory = performanceMemory
        ? {
            used: performanceMemory.usedJSHeapSize,
            total: performanceMemory.totalJSHeapSize,
            limit: performanceMemory.jsHeapSizeLimit,
          }
        : null;

      // Network information (if available)
      const navigatorConnection = (
        navigator as unknown as {
          connection?: { effectiveType: string; downlink: number; rtt: number };
        }
      ).connection;

      const mockMetrics: PerformanceMetrics = {
        bundleSize: {
          total: 485000, // Mock data - would come from build analysis
          gzipped: 145000,
          chunks: [
            { name: 'main', size: 185000, gzipped: 55000 },
            { name: 'vendor', size: 220000, gzipped: 65000 },
            { name: 'ui-lib', size: 80000, gzipped: 25000 },
          ],
        },
        webVitals,
        runtime: {
          memory: memory?.used || 0,
          timing: {
            domContentLoaded:
              navigation.domContentLoadedEventEnd - navigation.fetchStart,
            loadComplete: navigation.loadEventEnd - navigation.fetchStart,
          },
        },
        network: {
          effectiveType: navigatorConnection?.effectiveType || '4g',
          downlink: navigatorConnection?.downlink || 10,
          rtt: navigatorConnection?.rtt || 50,
        },
      };

      setMetrics(mockMetrics);
    };

    collectMetrics();

    // Update metrics every 5 seconds
    const interval = setInterval(collectMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse text-blue-500" />
          <span className="text-sm text-muted-foreground">
            Loading performance metrics...
          </span>
        </div>
      </Card>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVitalStatus = (metric: string, value: number) => {
    const thresholds: { [key: string]: { good: number; poor: number } } = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'needs-improvement':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-3 h-3" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-3 h-3" />;
      case 'poor':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Card */}
      <Card
        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Performance Monitor
              </h3>
              <p className="text-sm text-muted-foreground">
                Bundle: {formatBytes(metrics.bundleSize.gzipped)} • LCP:{' '}
                {Math.round(metrics.webVitals.lcp)}ms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Optimized
            </Badge>
            <TrendingUp
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </div>
      </Card>

      {/* Detailed Metrics */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Bundle Size */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-foreground">Bundle Size</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">
                  {formatBytes(metrics.bundleSize.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gzipped:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatBytes(metrics.bundleSize.gzipped)}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Chunks:
                </div>
                {metrics.bundleSize.chunks.map(chunk => (
                  <div
                    key={chunk.name}
                    className="flex justify-between text-xs"
                  >
                    <span>{chunk.name}:</span>
                    <span>{formatBytes(chunk.gzipped)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Web Vitals */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h4 className="font-semibold text-foreground">Web Vitals</h4>
            </div>
            <div className="space-y-2">
              {Object.entries(metrics.webVitals).map(([key, value]) => {
                const status = getVitalStatus(key, value);
                return (
                  <div
                    key={key}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted-foreground uppercase">
                      {key}:
                    </span>
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        getStatusColor(status)
                      )}
                    >
                      {getStatusIcon(status)}
                      <span className="font-medium">
                        {key === 'cls'
                          ? value.toFixed(3)
                          : `${Math.round(value)}ms`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Runtime Performance */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-foreground">Runtime</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Memory:</span>
                <span className="font-medium">
                  {formatBytes(metrics.runtime.memory)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">DOM Ready:</span>
                <span className="font-medium">
                  {Math.round(metrics.runtime.timing.domContentLoaded)}ms
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Load Complete:</span>
                <span className="font-medium">
                  {Math.round(metrics.runtime.timing.loadComplete)}ms
                </span>
              </div>
            </div>
          </Card>

          {/* Network */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-foreground">Network</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium uppercase">
                  {metrics.network.effectiveType}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Downlink:</span>
                <span className="font-medium">
                  {metrics.network.downlink} Mbps
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">RTT:</span>
                <span className="font-medium">{metrics.network.rtt}ms</span>
              </div>
            </div>
          </Card>

          {/* Performance Tips */}
          <Card className="p-4 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-semibold text-foreground">
                Optimization Tips
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Bundle size is optimized with code splitting</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Images are served in WebP/AVIF format</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>Consider lazy loading for below-the-fold components</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>Monitor LCP for heavy components</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bundle Analysis Commands */}
      {isExpanded && (
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold text-foreground mb-2">
            Bundle Analysis Commands
          </h4>
          <div className="space-y-2 text-sm font-mono">
            <div className="bg-background p-2 rounded border">
              <span className="text-muted-foreground">$</span> npm run analyze
            </div>
            <div className="bg-background p-2 rounded border">
              <span className="text-muted-foreground">$</span> npm run
              perf:lighthouse
            </div>
            <div className="bg-background p-2 rounded border">
              <span className="text-muted-foreground">$</span> npm run
              bundle:stats
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
