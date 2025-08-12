import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface CriticalAlert {
  type: 'critical-performance';
  metric: string;
  value: number;
  threshold: number;
  url: string;
  timestamp: number;
  userAgent: string;
}

interface AlertWithMetadata extends CriticalAlert {
  serverTimestamp: number;
  clientIP: string;
  severity: 'high' | 'critical';
  acknowledged: boolean;
  id: string;
}

// In production, use a proper database or Redis
const alertStorage: AlertWithMetadata[] = [];
const ALERT_THRESHOLDS = {
  LCP: { critical: 6000, high: 4000 },
  FID: { critical: 500, high: 300 },
  CLS: { critical: 0.5, high: 0.25 },
  TTFB: { critical: 1000, high: 600 },
  INP: { critical: 800, high: 500 },
};

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const ip =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown';

    const alert = (await request.json()) as CriticalAlert;

    // Validate alert data
    if (!alert.type || !alert.metric || typeof alert.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid alert data structure' },
        { status: 400 }
      );
    }

    // Determine severity
    const thresholds =
      ALERT_THRESHOLDS[alert.metric as keyof typeof ALERT_THRESHOLDS];
    let severity: 'high' | 'critical' = 'high';

    if (thresholds && alert.value >= thresholds.critical) {
      severity = 'critical';
    }

    // Create enriched alert
    const enrichedAlert: AlertWithMetadata = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      serverTimestamp: Date.now(),
      clientIP: ip,
      severity,
      acknowledged: false,
    };

    // Store alert
    alertStorage.push(enrichedAlert);

    // Check for alert frequency (rate limiting)
    const recentAlerts = alertStorage.filter(
      a =>
        a.metric === alert.metric &&
        a.url === alert.url &&
        a.serverTimestamp > Date.now() - 5 * 60 * 1000 // Last 5 minutes
    );

    // If too many alerts for the same metric/URL, aggregate them
    if (recentAlerts.length > 5) {
      console.warn(
        `High frequency of ${alert.metric} alerts for ${alert.url}:`,
        recentAlerts.length
      );

      // In production, you might want to:
      // 1. Rate limit alerts
      // 2. Send aggregated notifications
      // 3. Auto-acknowledge similar alerts
    }

    // Send immediate notifications for critical alerts
    if (severity === 'critical') {
      await sendCriticalNotification(enrichedAlert);
    }

    // Log alert for monitoring
    console.log(`Performance alert [${severity.toUpperCase()}]:`, {
      metric: alert.metric,
      value: alert.value,
      threshold: alert.threshold,
      url: alert.url,
      userAgent: alert.userAgent.substring(0, 100), // Truncate long user agents
    });

    return NextResponse.json({
      success: true,
      alertId: enrichedAlert.id,
      severity,
      recentAlertsCount: recentAlerts.length,
    });
  } catch (error) {
    console.error('Error processing performance alert:', error);
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity') as 'high' | 'critical' | null;
    const acknowledged = searchParams.get('acknowledged') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const since = searchParams.get('since')
      ? parseInt(searchParams.get('since')!)
      : 0;

    // Filter alerts
    let filteredAlerts = alertStorage;

    if (severity) {
      filteredAlerts = filteredAlerts.filter(
        alert => alert.severity === severity
      );
    }

    if (acknowledged !== null) {
      filteredAlerts = filteredAlerts.filter(
        alert => alert.acknowledged === acknowledged
      );
    }

    if (since > 0) {
      filteredAlerts = filteredAlerts.filter(
        alert => alert.serverTimestamp >= since
      );
    }

    // Sort by timestamp (newest first) and limit
    filteredAlerts = filteredAlerts
      .sort((a, b) => b.serverTimestamp - a.serverTimestamp)
      .slice(0, limit);

    // Calculate alert statistics
    const stats = calculateAlertStats(alertStorage);

    return NextResponse.json({
      alerts: filteredAlerts,
      count: filteredAlerts.length,
      total: alertStorage.length,
      stats,
    });
  } catch (error) {
    console.error('Error retrieving alerts:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve alerts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    const { acknowledged } = await request.json();

    // Find and update alert
    const alertIndex = alertStorage.findIndex(alert => alert.id === alertId);

    if (alertIndex === -1) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    alertStorage[alertIndex].acknowledged = acknowledged;

    return NextResponse.json({
      success: true,
      alert: alertStorage[alertIndex],
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

async function sendCriticalNotification(alert: AlertWithMetadata) {
  // In production, integrate with your notification services:
  // - Slack webhook
  // - PagerDuty
  // - Email service
  // - SMS service
  // - Microsoft Teams

  const message = `🚨 CRITICAL Performance Alert
  
Metric: ${alert.metric}
Value: ${alert.value}${getMetricUnit(alert.metric)}
Threshold: ${alert.threshold}${getMetricUnit(alert.metric)}
URL: ${alert.url}
Time: ${new Date(alert.timestamp).toISOString()}
User Agent: ${alert.userAgent.substring(0, 100)}...

Severity: ${alert.severity.toUpperCase()}`;

  // Example: Send to console (replace with actual notification service)
  console.error('CRITICAL PERFORMANCE ALERT:', message);

  // Example webhook call (uncomment and configure for production):
  /*
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        username: 'Performance Monitor',
        icon_emoji: ':warning:'
      })
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
  */

  // Example email notification (configure with your email service):
  /*
  try {
    await sendEmail({
      to: process.env.ALERT_EMAIL!,
      subject: `Critical Performance Alert - ${alert.metric}`,
      text: message
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
  */
}

function getMetricUnit(metric: string): string {
  switch (metric) {
    case 'LCP':
    case 'FID':
    case 'TTFB':
    case 'INP':
      return 'ms';
    case 'CLS':
      return '';
    default:
      return '';
  }
}

function calculateAlertStats(alerts: AlertWithMetadata[]) {
  if (alerts.length === 0) {
    return {
      total: 0,
      critical: 0,
      high: 0,
      acknowledged: 0,
      recent: 0,
      byMetric: {},
      byUrl: {},
    };
  }

  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    acknowledged: alerts.filter(a => a.acknowledged).length,
    recent: alerts.filter(a => a.serverTimestamp > oneHourAgo).length,
    byMetric: {} as Record<string, number>,
    byUrl: {} as Record<string, number>,
  };

  // Count by metric
  alerts.forEach(alert => {
    stats.byMetric[alert.metric] = (stats.byMetric[alert.metric] || 0) + 1;
  });

  // Count by URL (top 10)
  const urlCounts = alerts.reduce(
    (acc, alert) => {
      acc[alert.url] = (acc[alert.url] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  stats.byUrl = Object.fromEntries(
    Object.entries(urlCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  );

  return stats;
}
