import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  entries: any[];
}

interface PerformanceData {
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  navigation?: {
    type: string;
    redirectCount: number;
    [key: string]: any;
  };
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface PerformanceReport {
  performance: PerformanceData;
  metrics: PerformanceMetric[];
}

// In a real application, you would store this in a database
const performanceStorage: PerformanceReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const ip =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown';

    const body = (await request.json()) as PerformanceReport;

    // Validate the incoming data
    if (!body.performance || !body.metrics || !Array.isArray(body.metrics)) {
      return NextResponse.json(
        { error: 'Invalid performance data structure' },
        { status: 400 }
      );
    }

    // Add server-side metadata
    const enrichedReport: PerformanceReport & {
      serverTimestamp: number;
      clientIP: string;
      serverUserAgent: string;
    } = {
      ...body,
      serverTimestamp: Date.now(),
      clientIP: ip,
      serverUserAgent: userAgent,
    };

    // Store the performance data (in production, use a proper database)
    performanceStorage.push(enrichedReport);

    // Analyze metrics for immediate alerts
    const criticalMetrics = body.metrics.filter(
      metric =>
        metric.rating === 'poor' &&
        ['LCP', 'FID', 'CLS', 'TTFB', 'INP'].includes(metric.name)
    );

    if (criticalMetrics.length > 0) {
      // In production, trigger alerts here (Slack, email, monitoring service)
      console.warn('Critical performance metrics detected:', criticalMetrics);
    }

    // Aggregate metrics for trending analysis
    const aggregatedMetrics = aggregateMetrics(body.metrics);

    // Log for analytics (in production, send to your analytics service)
    console.log('Performance metrics received:', {
      url: body.performance.url,
      timestamp: body.performance.timestamp,
      metricsCount: body.metrics.length,
      criticalCount: criticalMetrics.length,
      aggregated: aggregatedMetrics,
    });

    return NextResponse.json({
      success: true,
      received: body.metrics.length,
      critical: criticalMetrics.length,
      aggregated: aggregatedMetrics,
    });
  } catch (error) {
    console.error('Error processing performance data:', error);
    return NextResponse.json(
      { error: 'Failed to process performance data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const limit = parseInt(searchParams.get('limit') || '100');
    const since = searchParams.get('since')
      ? parseInt(searchParams.get('since')!)
      : 0;

    // Filter performance data based on query parameters
    let filteredData = performanceStorage;

    if (url) {
      filteredData = filteredData.filter(report =>
        report.performance.url.includes(url)
      );
    }

    if (since > 0) {
      filteredData = filteredData.filter(
        report => report.performance.timestamp >= since
      );
    }

    // Limit results
    filteredData = filteredData.slice(-limit);

    // Calculate aggregated statistics
    const stats = calculatePerformanceStats(filteredData);

    return NextResponse.json({
      reports: filteredData,
      count: filteredData.length,
      total: performanceStorage.length,
      stats,
    });
  } catch (error) {
    console.error('Error retrieving performance data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve performance data' },
      { status: 500 }
    );
  }
}

function aggregateMetrics(metrics: PerformanceMetric[]) {
  const aggregated: Record<
    string,
    {
      count: number;
      average: number;
      min: number;
      max: number;
      ratings: Record<string, number>;
    }
  > = {};

  metrics.forEach(metric => {
    if (!aggregated[metric.name]) {
      aggregated[metric.name] = {
        count: 0,
        average: 0,
        min: Infinity,
        max: -Infinity,
        ratings: { good: 0, 'needs-improvement': 0, poor: 0 },
      };
    }

    const agg = aggregated[metric.name];
    agg.count++;
    agg.average = (agg.average * (agg.count - 1) + metric.value) / agg.count;
    agg.min = Math.min(agg.min, metric.value);
    agg.max = Math.max(agg.max, metric.value);
    agg.ratings[metric.rating]++;
  });

  return aggregated;
}

function calculatePerformanceStats(reports: PerformanceReport[]) {
  if (reports.length === 0) {
    return { totalReports: 0, timeRange: null, topMetrics: [] };
  }

  const allMetrics = reports.flatMap(report => report.metrics);
  const aggregated = aggregateMetrics(allMetrics);

  const timeRange = {
    start: Math.min(...reports.map(r => r.performance.timestamp)),
    end: Math.max(...reports.map(r => r.performance.timestamp)),
  };

  // Top problematic metrics
  const topMetrics = Object.entries(aggregated)
    .map(([name, data]) => ({
      name,
      averageValue: data.average,
      poorPercentage: (data.ratings.poor / data.count) * 100,
      count: data.count,
    }))
    .sort((a, b) => b.poorPercentage - a.poorPercentage)
    .slice(0, 10);

  return {
    totalReports: reports.length,
    totalMetrics: allMetrics.length,
    timeRange,
    topMetrics,
    aggregated,
  };
}
