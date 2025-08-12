import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

interface SimpleMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
}

class SimplePerformanceMonitor {
  private metrics: SimpleMetric[] = [];
  private endpoint: string;

  constructor(endpoint = '/api/performance') {
    this.endpoint = endpoint;
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Core Web Vitals with proper exports
    onCLS(this.handleCLS.bind(this));
    onFID(this.handleFID.bind(this));
    onFCP(this.handleFCP.bind(this));
    onLCP(this.handleLCP.bind(this));
    onTTFB(this.handleTTFB.bind(this));
  }

  private handleCLS(metric: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    this.recordMetric('CLS', metric.value, metric.rating);
  }

  private handleFID(metric: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    this.recordMetric('FID', metric.value, metric.rating);
  }

  private handleFCP(metric: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    this.recordMetric('FCP', metric.value, metric.rating);
  }

  private handleLCP(metric: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    this.recordMetric('LCP', metric.value, metric.rating);
  }

  private handleTTFB(metric: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    this.recordMetric('TTFB', metric.value, metric.rating);
  }

  private recordMetric(
    name: string,
    value: number,
    rating: 'good' | 'needs-improvement' | 'poor'
  ): void {
    const metric: SimpleMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
    };

    this.metrics.push(metric);

    // Send critical metrics immediately
    if (rating === 'poor') {
      this.sendCriticalAlert(metric);
    }

    // Batch send metrics
    if (this.metrics.length >= 5) {
      this.sendMetrics();
    }
  }

  private sendCriticalAlert(metric: SimpleMetric): void {
    const alertData = {
      type: 'critical-performance',
      metric: metric.name,
      value: metric.value,
      threshold: this.getThreshold(metric.name),
      url: metric.url,
      timestamp: metric.timestamp,
      userAgent: navigator.userAgent,
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${this.endpoint}/alerts`,
        JSON.stringify(alertData)
      );
    }
  }

  private sendMetrics(): void {
    if (this.metrics.length === 0) return;

    const data = {
      performance: {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      metrics: [...this.metrics],
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.endpoint, JSON.stringify(data));
    } else {
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {
        // Silent fail for analytics
      });
    }

    this.metrics = [];
  }

  private getThreshold(metric: string): number {
    const thresholds: Record<string, number> = {
      LCP: 4000,
      FID: 300,
      CLS: 0.25,
      TTFB: 600,
      FCP: 3000,
    };
    return thresholds[metric] || 1000;
  }

  public getMetrics(): SimpleMetric[] {
    return [...this.metrics];
  }

  public flush(): void {
    this.sendMetrics();
  }
}

// Singleton instance
let monitor: SimplePerformanceMonitor | null = null;

export function initPerformanceMonitoring(
  endpoint?: string
): SimplePerformanceMonitor {
  if (!monitor && typeof window !== 'undefined') {
    monitor = new SimplePerformanceMonitor(endpoint);

    // Auto-flush on page unload
    window.addEventListener('beforeunload', () => {
      monitor?.flush();
    });
  }
  return monitor!;
}

export function getPerformanceMonitor(): SimplePerformanceMonitor | null {
  return monitor;
}

export default SimplePerformanceMonitor;
