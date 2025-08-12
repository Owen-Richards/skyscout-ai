'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@skyscout/ui';
import { useEffect, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
}

interface Alert {
  id: string;
  type: string;
  metric: string;
  value: number;
  threshold: number;
  url: string;
  timestamp: number;
  severity: 'high' | 'critical';
  acknowledged: boolean;
}

interface PerformanceStats {
  totalReports: number;
  totalMetrics: number;
  timeRange: { start: number; end: number } | null;
  topMetrics: Array<{
    name: string;
    averageValue: number;
    poorPercentage: number;
    count: number;
  }>;
}

interface AlertStats {
  total: number;
  critical: number;
  high: number;
  acknowledged: number;
  recent: number;
  byMetric: Record<string, number>;
  byUrl: Record<string, number>;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch performance data
      const performanceResponse = await fetch('/api/performance');
      const performanceData = await performanceResponse.json();

      // Fetch alerts
      const alertsResponse = await fetch('/api/performance/alerts');
      const alertsData = await alertsResponse.json();

      setMetrics(
        performanceData.reports?.flatMap(
          (r: { metrics: PerformanceMetric[] }) => r.metrics
        ) || []
      );
      setStats(performanceData.stats);
      setAlerts(alertsData.alerts || []);
      setAlertStats(alertsData.stats);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`/api/performance/alerts?id=${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged: true }),
      });

      setAlerts(
        alerts.map(alert =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const getScorePercentage = (rating: string, count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Performance Dashboard
        </h1>
        <Button onClick={fetchData} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalReports || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Performance measurements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {(alertStats?.total || 0) - (alertStats?.acknowledged || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {alertStats?.critical || 0} critical, {alertStats?.high || 0}{' '}
                  high
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {alertStats?.recent || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  In the last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalMetrics || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total measurements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Problematic Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performance Issues</CardTitle>
              <CardDescription>
                Metrics with the highest percentage of poor ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topMetrics?.slice(0, 5).map((metric, index) => (
                  <div
                    key={metric.name}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 text-sm font-medium">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {metric.poorPercentage.toFixed(1)}% poor
                        </span>
                      </div>
                      <Progress value={metric.poorPercentage} className="h-2" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatValue(metric.name, metric.averageValue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.count} samples
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].map(metricName => {
              const metricData = metrics.filter(m => m.name === metricName);
              const total = metricData.length;
              const good = metricData.filter(m => m.rating === 'good').length;
              const needsImprovement = metricData.filter(
                m => m.rating === 'needs-improvement'
              ).length;
              const poor = metricData.filter(m => m.rating === 'poor').length;

              const averageValue =
                total > 0
                  ? metricData.reduce((sum, m) => sum + m.value, 0) / total
                  : 0;

              return (
                <Card key={metricName}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {metricName}
                      <Badge
                        variant={
                          poor > total * 0.25 ? 'destructive' : 'secondary'
                        }
                      >
                        {total} samples
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Average: {formatValue(metricName, averageValue)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Good</span>
                        <span>{getScorePercentage('good', good, total)}%</span>
                      </div>
                      <Progress
                        value={getScorePercentage('good', good, total)}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-600">
                          Needs Improvement
                        </span>
                        <span>
                          {getScorePercentage(
                            'needs-improvement',
                            needsImprovement,
                            total
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={getScorePercentage(
                          'needs-improvement',
                          needsImprovement,
                          total
                        )}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Poor</span>
                        <span>{getScorePercentage('poor', poor, total)}%</span>
                      </div>
                      <Progress
                        value={getScorePercentage('poor', poor, total)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>
                Critical performance issues that require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.slice(0, 10).map(alert => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="font-medium">{alert.metric}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatValue(alert.metric, alert.value)}
                          (threshold:{' '}
                          {formatValue(alert.metric, alert.threshold)})
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {alert.url} •{' '}
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No alerts found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Historical performance data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Trends visualization coming soon...
                <br />
                <small>Integrate with your preferred charting library</small>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
