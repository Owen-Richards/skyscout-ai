/**
 * SkyScout AI - Enterprise Performance Dashboard
 * Real-time performance monitoring with enterprise patterns
 */

'use client';

import type {
  BudgetViolation,
  CoreWebVitals,
  PerformanceMetric,
  PerformanceReport,
} from '@skyscout/shared';
import {
  ConsolePerformanceReporter,
  LocalStoragePerformanceStorage,
  PerformanceConfigFactory,
  PerformanceMetrics,
  PerformanceMonitor,
  WebAPIPerformanceStrategy,
} from '@skyscout/shared';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@skyscout/ui';
import { useCallback, useEffect, useState } from 'react';

interface PerformanceDashboardProps {
  environment?: 'development' | 'staging' | 'production';
  className?: string;
}

export function PerformanceDashboard({
  environment = 'development',
  className,
}: PerformanceDashboardProps) {
  const [monitor, setMonitor] = useState<PerformanceMonitor | null>(null);
  const [currentReport, setCurrentReport] = useState<PerformanceReport | null>(
    null
  );
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [activeTab, setActiveTab] = useState('current');

  // Initialize performance monitor
  useEffect(() => {
    const strategy = new WebAPIPerformanceStrategy();
    const config = PerformanceConfigFactory.createMonitoringConfig(environment);
    const storage = new LocalStoragePerformanceStorage();

    const performanceMonitor = new PerformanceMonitor(
      strategy,
      config,
      storage
    );
    performanceMonitor.addReporter(new ConsolePerformanceReporter());

    // Subscribe to performance events
    const unsubscribeMetricCollected = performanceMonitor.subscribe(
      'metric-collected',
      event => {
        console.log('Performance metrics collected:', event.data);
      }
    );

    const unsubscribeBudgetViolated = performanceMonitor.subscribe(
      'budget-violated',
      event => {
        console.warn('Performance budget violated:', event.data);
      }
    );

    const unsubscribeReportGenerated = performanceMonitor.subscribe(
      'report-generated',
      event => {
        const report = event.data as { report: PerformanceReport };
        setCurrentReport(report.report);
        setReports(prev => [report.report, ...prev.slice(0, 9)]); // Keep last 10 reports
      }
    );

    setMonitor(performanceMonitor);

    // Cleanup
    return () => {
      performanceMonitor.stop();
      unsubscribeMetricCollected();
      unsubscribeBudgetViolated();
      unsubscribeReportGenerated();
    };
  }, [environment]);

  const handleStartMonitoring = useCallback(() => {
    if (monitor && !isMonitoring) {
      monitor.start();
      setIsMonitoring(true);
    }
  }, [monitor, isMonitoring]);

  const handleStopMonitoring = useCallback(() => {
    if (monitor && isMonitoring) {
      monitor.stop();
      setIsMonitoring(false);
    }
  }, [monitor, isMonitoring]);

  const handleCollectMetrics = useCallback(async () => {
    if (monitor) {
      try {
        const report = await monitor.collectMetrics();
        setCurrentReport(report);
      } catch (error) {
        console.error('Failed to collect metrics:', error);
      }
    }
  }, [monitor]);

  const formatMetricValue = (
    name: keyof CoreWebVitals,
    value: number
  ): string => {
    return PerformanceMetrics.formatMetric(name, value);
  };

  const getMetricStatus = (
    metric: PerformanceMetric,
    violations: BudgetViolation[]
  ): 'good' | 'warning' | 'error' => {
    const violation = violations.find(v => v.metric === metric.name);
    if (!violation) return 'good';
    return violation.severity === 'critical' ? 'error' : 'warning';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Enterprise Performance Monitor
          <div className="flex gap-2">
            <Badge variant={isMonitoring ? 'default' : 'secondary'}>
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </Badge>
            <Badge variant="outline">{environment}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleStartMonitoring}
            disabled={isMonitoring}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Start Monitoring
          </button>
          <button
            onClick={handleStopMonitoring}
            disabled={!isMonitoring}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Stop Monitoring
          </button>
          <button
            onClick={handleCollectMetrics}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Collect Now
          </button>
        </div>

        <Tabs
          defaultValue="current"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="current">Current Metrics</TabsTrigger>
            <TabsTrigger value="score">Performance Score</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {currentReport ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentReport.metrics.map((metric, index) => {
                  const status = getMetricStatus(
                    metric,
                    currentReport.violations
                  );
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            {metric.name.toUpperCase()}
                          </span>
                          <Badge
                            variant={
                              status === 'good'
                                ? 'default'
                                : status === 'warning'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {formatMetricValue(metric.name, metric.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {metric.deviceType} •{' '}
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No metrics collected yet. Click "Collect Now" to start.
              </div>
            )}
          </TabsContent>

          <TabsContent value="score" className="space-y-4">
            {currentReport?.score ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div
                      className={`text-3xl font-bold ${getScoreColor(currentReport.score.overall)}`}
                    >
                      {currentReport.score.overall}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                    <div
                      className={`text-xl font-semibold ${getScoreColor(currentReport.score.overall)}`}
                    >
                      Grade {currentReport.score.grade}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(currentReport.score.loading)}`}
                    >
                      {currentReport.score.loading}
                    </div>
                    <div className="text-sm text-gray-600">Loading</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(currentReport.score.interactivity)}`}
                    >
                      {currentReport.score.interactivity}
                    </div>
                    <div className="text-sm text-gray-600">Interactivity</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(currentReport.score.visualStability)}`}
                    >
                      {currentReport.score.visualStability}
                    </div>
                    <div className="text-sm text-gray-600">
                      Visual Stability
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No performance score available yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="violations" className="space-y-4">
            {currentReport?.violations &&
            currentReport.violations.length > 0 ? (
              <div className="space-y-2">
                {currentReport.violations.map((violation, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded border-l-4 ${
                      violation.severity === 'critical'
                        ? 'border-red-500 bg-red-50'
                        : violation.severity === 'error'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {violation.metric.toUpperCase()}
                      </span>
                      <Badge
                        variant={
                          violation.severity === 'critical'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {violation.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Actual:{' '}
                      {formatMetricValue(violation.metric, violation.actual)} |
                      Budget:{' '}
                      {formatMetricValue(violation.metric, violation.budget)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-green-600">
                ✅ No budget violations detected!
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {reports.length > 0 ? (
              <div className="space-y-2">
                {reports.map((report, index) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Report #{index + 1}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(report.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${getScoreColor(report.score.overall)}`}
                          >
                            {report.score.overall} ({report.score.grade})
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.violations.length} violations
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No historical data available yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
