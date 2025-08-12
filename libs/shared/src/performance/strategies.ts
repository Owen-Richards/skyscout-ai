/**
 * SkyScout AI - Performance Strategies
 * Strategy Pattern implementation for different performance monitoring approaches
 */

import type {
  BudgetViolation,
  CoreWebVitals,
  IPerformanceStrategy,
  PerformanceBudget,
  PerformanceMetric,
} from './types';

/**
 * Strategy Pattern: Web API Performance Strategy
 * Uses browser Web APIs for performance measurement
 */
export class WebAPIPerformanceStrategy implements IPerformanceStrategy {
  readonly name = 'web-api';

  async collect(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    const now = Date.now();
    const url = window.location.href;
    const userAgent = navigator.userAgent;

    // Get Core Web Vitals using Web APIs
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    if (navigation) {
      // First Contentful Paint
      const fcpEntry = paint.find(
        entry => entry.name === 'first-contentful-paint'
      );
      if (fcpEntry) {
        metrics.push({
          name: 'fcp',
          value: fcpEntry.startTime,
          timestamp: now,
          url,
          userAgent,
          deviceType: this.getDeviceType(),
        });
      }

      // Time to First Byte
      metrics.push({
        name: 'ttfb',
        value: navigation.responseStart - navigation.requestStart,
        timestamp: now,
        url,
        userAgent,
        deviceType: this.getDeviceType(),
      });
    }

    // Use Performance Observer for modern metrics if available
    if ('PerformanceObserver' in window) {
      await this.collectWithObserver(metrics, now, url, userAgent);
    }

    return metrics;
  }

  validate(
    metrics: PerformanceMetric[],
    budget: PerformanceBudget
  ): BudgetViolation[] {
    const violations: BudgetViolation[] = [];

    for (const metric of metrics) {
      const threshold = budget.timings[metric.name];
      if (!threshold) continue;

      let severity: 'warning' | 'error' | 'critical' = 'warning';

      if (metric.value > threshold.poor) {
        severity = 'critical';
      } else if (metric.value > threshold.needsImprovement) {
        severity = 'error';
      } else if (metric.value > threshold.good) {
        severity = 'warning';
      } else {
        continue; // No violation
      }

      violations.push({
        metric: metric.name,
        actual: metric.value,
        budget: threshold.good,
        severity,
      });
    }

    return violations;
  }

  private async collectWithObserver(
    metrics: PerformanceMetric[],
    timestamp: number,
    url: string,
    userAgent: string
  ): Promise<void> {
    return new Promise(resolve => {
      let collectedCount = 0;
      const expectedMetrics = [
        'largest-contentful-paint',
        'first-input',
        'layout-shift',
      ];

      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          let metricName: keyof CoreWebVitals | null = null;
          let value = 0;

          switch (entry.entryType) {
            case 'largest-contentful-paint':
              metricName = 'lcp';
              value = entry.startTime;
              break;
            case 'first-input':
              metricName = 'fid';
              value =
                (entry as PerformanceEventTiming).processingStart -
                entry.startTime;
              break;
            case 'layout-shift': {
              const layoutEntry = entry as PerformanceEntry & {
                hadRecentInput?: boolean;
                value?: number;
              };
              if (!layoutEntry.hadRecentInput) {
                metricName = 'cls';
                value = layoutEntry.value || 0;
              }
              break;
            }
          }

          if (metricName) {
            metrics.push({
              name: metricName,
              value,
              timestamp,
              url,
              userAgent,
              deviceType: this.getDeviceType(),
            });

            collectedCount++;
            if (collectedCount >= expectedMetrics.length) {
              observer.disconnect();
              resolve();
            }
          }
        }
      });

      // Observe different entry types
      try {
        observer.observe({
          entryTypes: [
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
          ],
        });
        // Timeout after 10 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 10000);
      } catch (error) {
        console.warn('PerformanceObserver not fully supported:', error);
        resolve();
      }
    });
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
}

/**
 * Strategy Pattern: Lighthouse Performance Strategy
 * Uses Lighthouse API for comprehensive performance analysis
 */
export class LighthousePerformanceStrategy implements IPerformanceStrategy {
  readonly name = 'lighthouse';
  private lighthouseUrl =
    'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  async collect(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    const url = window.location.href;
    const userAgent = navigator.userAgent;
    const timestamp = Date.now();

    try {
      const response = await fetch(
        `${this.lighthouseUrl}?url=${encodeURIComponent(url)}&strategy=desktop`
      );

      if (!response.ok) {
        throw new Error(`Lighthouse API error: ${response.status}`);
      }

      const data = await response.json();
      const audits = data.lighthouseResult?.audits;

      if (audits) {
        // Extract Core Web Vitals from Lighthouse
        const metricMappings: Record<string, keyof CoreWebVitals> = {
          'largest-contentful-paint': 'lcp',
          'first-input-delay': 'fid',
          'cumulative-layout-shift': 'cls',
          'first-contentful-paint': 'fcp',
          'server-response-time': 'ttfb',
        };

        for (const [auditKey, metricName] of Object.entries(metricMappings)) {
          const audit = audits[auditKey];
          if (audit && typeof audit.numericValue === 'number') {
            metrics.push({
              name: metricName,
              value: audit.numericValue,
              timestamp,
              url,
              userAgent,
              deviceType: 'desktop', // Lighthouse desktop strategy
            });
          }
        }
      }
    } catch (error) {
      console.error('Lighthouse strategy failed:', error);
      // Fallback to Web API strategy
      const fallback = new WebAPIPerformanceStrategy();
      return fallback.collect();
    }

    return metrics;
  }

  validate(
    metrics: PerformanceMetric[],
    budget: PerformanceBudget
  ): BudgetViolation[] {
    // Reuse the same validation logic as WebAPI strategy
    const webApiStrategy = new WebAPIPerformanceStrategy();
    return webApiStrategy.validate(metrics, budget);
  }
}

/**
 * Strategy Pattern: Real User Monitoring (RUM) Strategy
 * Collects real user performance data for production analysis
 */
export class RUMPerformanceStrategy implements IPerformanceStrategy {
  readonly name = 'rum';
  private sampleRate: number;

  constructor(sampleRate = 0.1) {
    // 10% sampling by default
    this.sampleRate = sampleRate;
  }

  async collect(): Promise<PerformanceMetric[]> {
    // Only collect for sampled users
    if (Math.random() > this.sampleRate) {
      return [];
    }

    const metrics: PerformanceMetric[] = [];
    const webApiStrategy = new WebAPIPerformanceStrategy();
    const baseMetrics = await webApiStrategy.collect();

    // Enhance with RUM-specific data
    for (const metric of baseMetrics) {
      metrics.push({
        ...metric,
        connectionType: this.getConnectionType(),
        deviceType: this.getDeviceType(),
      });
    }

    // Add custom RUM metrics
    metrics.push(...this.collectCustomMetrics());

    return metrics;
  }

  validate(
    metrics: PerformanceMetric[],
    budget: PerformanceBudget
  ): BudgetViolation[] {
    const webApiStrategy = new WebAPIPerformanceStrategy();
    return webApiStrategy.validate(metrics, budget);
  }

  private collectCustomMetrics(): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = [];
    const timestamp = Date.now();
    const url = window.location.href;
    const userAgent = navigator.userAgent;

    // Custom metrics specific to SkyScout AI
    const searchStartTime = performance.getEntriesByName('search-start')[0];
    const searchEndTime = performance.getEntriesByName('search-end')[0];

    if (searchStartTime && searchEndTime) {
      metrics.push({
        name: 'fcp', // Reuse FCP for custom search metric
        value: searchEndTime.startTime - searchStartTime.startTime,
        timestamp,
        url,
        userAgent,
        deviceType: this.getDeviceType(),
      });
    }

    return metrics;
  }

  private getConnectionType(): string {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
    };
    return nav.connection?.effectiveType || 'unknown';
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
}

/**
 * Strategy Context: Manages performance strategies
 */
export class PerformanceStrategyContext {
  private strategy: IPerformanceStrategy;

  constructor(strategy: IPerformanceStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IPerformanceStrategy): void {
    this.strategy = strategy;
  }

  async collectMetrics(): Promise<PerformanceMetric[]> {
    return this.strategy.collect();
  }

  validateBudget(
    metrics: PerformanceMetric[],
    budget: PerformanceBudget
  ): BudgetViolation[] {
    return this.strategy.validate(metrics, budget);
  }

  getStrategyName(): string {
    return this.strategy.name;
  }
}
