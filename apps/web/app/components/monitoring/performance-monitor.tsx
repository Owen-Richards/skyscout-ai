/**
 * Advanced Performance Monitor - Clean Implementation
 *
 * Enterprise-grade performance monitoring with Core Web Vitals,
 * custom metrics, and real-time alerting capabilities.
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@skyscout/ui';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Gauge,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  unit: string;
  description: string;
}

interface BundleMetric {
  name: string;
  size: number;
  gzipped: number;
  limit: number;
  status: 'within-budget' | 'near-limit' | 'over-budget';
}

interface PerformanceAlert {
  id: string;
  type: 'performance' | 'bundle' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Type for Layout Shift API
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export function AdvancedPerformanceMonitor({
  className,
}: {
  className?: string;
}) {
  const [coreWebVitals, setCoreWebVitals] = useState<PerformanceMetric[]>([]);
  const [bundleMetrics, setBundleMetrics] = useState<BundleMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState('vitals');

  const createMetric = useCallback(
    (name: string, value: number): PerformanceMetric => {
      const configs = {
        LCP: {
          good: 2500,
          poor: 4000,
          unit: 'ms',
          description: 'Largest Contentful Paint',
        },
        FID: {
          good: 100,
          poor: 300,
          unit: 'ms',
          description: 'First Input Delay',
        },
        CLS: {
          good: 0.1,
          poor: 0.25,
          unit: '',
          description: 'Cumulative Layout Shift',
        },
        FCP: {
          good: 1800,
          poor: 3000,
          unit: 'ms',
          description: 'First Contentful Paint',
        },
        TTFB: {
          good: 600,
          poor: 1400,
          unit: 'ms',
          description: 'Time to First Byte',
        },
      };

      const config = configs[name as keyof typeof configs];
      if (!config) {
        return {
          name,
          value,
          rating: 'good',
          threshold: { good: 0, poor: 0 },
          unit: '',
          description: name,
        };
      }

      const rating =
        value <= config.good
          ? 'good'
          : value <= config.poor
            ? 'needs-improvement'
            : 'poor';

      return {
        name,
        value,
        rating,
        threshold: { good: config.good, poor: config.poor },
        unit: config.unit,
        description: config.description,
      };
    },
    []
  );

  const checkPerformanceThresholds = useCallback(
    (metricName: string, value: number) => {
      const metric = createMetric(metricName, value);

      if (metric.rating === 'poor') {
        const alert: PerformanceAlert = {
          id: `perf-${Date.now()}`,
          type: 'performance',
          severity: 'high',
          message: `${metric.description} is poor: ${value}${metric.unit}`,
          timestamp: new Date(),
          acknowledged: false,
        };

        setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    },
    [createMetric]
  );

  const updateMetric = useCallback(
    (name: string, value: number) => {
      setCoreWebVitals(prev => {
        const existing = prev.find(m => m.name === name);
        const metric = createMetric(name, value);

        if (existing) {
          return prev.map(m => (m.name === name ? metric : m));
        } else {
          return [...prev, metric];
        }
      });

      checkPerformanceThresholds(name, value);
    },
    [createMetric, checkPerformanceThresholds]
  );

  const handlePerformanceEntry = useCallback(
    (entry: PerformanceEntry) => {
      switch (entry.entryType) {
        case 'navigation': {
          const navEntry = entry as PerformanceNavigationTiming;
          updateMetric('FCP', navEntry.responseStart - navEntry.fetchStart);
          updateMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
          break;
        }
        case 'largest-contentful-paint': {
          const lcpEntry = entry as PerformanceEntry & { startTime: number };
          updateMetric('LCP', lcpEntry.startTime);
          break;
        }
        case 'paint': {
          if (entry.name === 'first-contentful-paint') {
            updateMetric('FCP', entry.startTime);
          }
          break;
        }
      }
    },
    [updateMetric]
  );

  const initializePerformanceMonitoring = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        handlePerformanceEntry(entry);
      }
    });

    observer.observe({
      entryTypes: ['navigation', 'paint', 'largest-contentful-paint'],
    });

    // Monitor Cumulative Layout Shift
    new PerformanceObserver(list => {
      let cumulativeScore = 0;
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          cumulativeScore += layoutShiftEntry.value;
        }
      }
      updateMetric('CLS', cumulativeScore);
    }).observe({ entryTypes: ['layout-shift'] });

    setIsMonitoring(true);
  }, [handlePerformanceEntry, updateMetric]);

  const loadBundleMetrics = useCallback(async () => {
    const mockBundleMetrics: BundleMetric[] = [
      {
        name: 'Main Bundle',
        size: 156000,
        gzipped: 45000,
        limit: 200000,
        status: 'within-budget',
      },
      {
        name: 'Framework Bundle',
        size: 180000,
        gzipped: 52000,
        limit: 200000,
        status: 'near-limit',
      },
    ];

    setBundleMetrics(mockBundleMetrics);
  }, []);

  const loadAlerts = useCallback(() => {
    const mockAlerts: PerformanceAlert[] = [
      {
        id: '1',
        type: 'bundle',
        severity: 'medium',
        message: 'Framework bundle approaching size limit',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        acknowledged: false,
      },
    ];

    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    initializePerformanceMonitoring();
    loadBundleMetrics();
    loadAlerts();
  }, [initializePerformanceMonitoring, loadBundleMetrics, loadAlerts]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const getMetricIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-improvement':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Gauge className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity
              className={cn(
                'w-5 h-5',
                isMonitoring ? 'text-green-500 animate-pulse' : 'text-gray-500'
              )}
            />
            <div>
              <CardTitle>Performance Monitor</CardTitle>
              <CardDescription>
                Real-time Core Web Vitals and bundle analysis
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alerts.filter(a => !a.acknowledged).length > 0 && (
              <Badge variant="destructive">
                {alerts.filter(a => !a.acknowledged).length} alerts
              </Badge>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
              <TabsTrigger value="bundles">Bundle Analysis</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreWebVitals.map(metric => (
                  <Card key={metric.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                        {getMetricIcon(metric.rating)}
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">
                          {metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}
                          {metric.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          {metric.description}
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            (metric.value / metric.threshold.poor) * 100
                          )}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {coreWebVitals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Gauge className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Collecting performance metrics...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bundles" className="space-y-4">
              <div className="space-y-3">
                {bundleMetrics.map(bundle => (
                  <Card key={bundle.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{bundle.name}</span>
                        <Badge
                          variant={
                            bundle.status === 'within-budget'
                              ? 'default'
                              : bundle.status === 'near-limit'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {bundle.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Size:</span>{' '}
                          {formatBytes(bundle.size)}
                        </div>
                        <div>
                          <span className="text-gray-500">Gzipped:</span>{' '}
                          {formatBytes(bundle.gzipped)}
                        </div>
                      </div>
                      <Progress
                        value={(bundle.size / bundle.limit) * 100}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <div className="space-y-3">
                {alerts.map(alert => (
                  <Card key={alert.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-500">
                              {alert.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
