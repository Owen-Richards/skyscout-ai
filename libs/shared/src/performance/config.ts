/**
 * SkyScout AI - Performance Configuration Factory
 * Enterprise configuration management with environment-specific settings
 */

import type {
  LighthouseConfig,
  MonitoringConfig,
  PerformanceBudget,
} from './types';

/**
 * Factory Pattern: Creates environment-specific performance configurations
 */
export class PerformanceConfigFactory {
  /**
   * Creates production-optimized performance budget
   */
  static createProductionBudget(): PerformanceBudget {
    return {
      timings: {
        lcp: { good: 2500, needsImprovement: 4000, poor: 5000 },
        fid: { good: 100, needsImprovement: 300, poor: 500 },
        cls: { good: 0.1, needsImprovement: 0.25, poor: 0.4 },
        fcp: { good: 1800, needsImprovement: 3000, poor: 4000 },
        ttfb: { good: 800, needsImprovement: 1800, poor: 3000 },
        inp: { good: 200, needsImprovement: 500, poor: 1000 },
      },
      resources: {
        totalSize: 1000000, // 1MB
        scriptSize: 500000, // 500KB
        styleSize: 100000, // 100KB
        imageSize: 300000, // 300KB
        fontSize: 100000, // 100KB
      },
      counts: {
        scripts: 15,
        styles: 5,
        images: 20,
        fonts: 4,
        requests: 50,
      },
    };
  }

  /**
   * Creates development-friendly performance budget (more lenient)
   */
  static createDevelopmentBudget(): PerformanceBudget {
    return {
      timings: {
        lcp: { good: 3000, needsImprovement: 5000, poor: 7000 },
        fid: { good: 200, needsImprovement: 500, poor: 1000 },
        cls: { good: 0.15, needsImprovement: 0.3, poor: 0.5 },
        fcp: { good: 2500, needsImprovement: 4000, poor: 5000 },
        ttfb: { good: 1200, needsImprovement: 2500, poor: 4000 },
        inp: { good: 300, needsImprovement: 700, poor: 1500 },
      },
      resources: {
        totalSize: 2000000, // 2MB (more lenient for dev)
        scriptSize: 1000000,
        styleSize: 200000,
        imageSize: 600000,
        fontSize: 200000,
      },
      counts: {
        scripts: 25,
        styles: 10,
        images: 30,
        fonts: 6,
        requests: 100,
      },
    };
  }

  /**
   * Creates monitoring configuration for specific environment
   */
  static createMonitoringConfig(
    environment: 'development' | 'staging' | 'production',
    overrides?: Partial<MonitoringConfig>
  ): MonitoringConfig {
    const baseConfig: MonitoringConfig = {
      environment,
      endpoints: this.getEndpointsForEnvironment(environment),
      budgets:
        environment === 'production'
          ? this.createProductionBudget()
          : this.createDevelopmentBudget(),
      alerts: {
        enabled: environment === 'production',
        thresholds: {
          lcp: environment === 'production' ? 3000 : 5000,
          fid: environment === 'production' ? 200 : 500,
          cls: environment === 'production' ? 0.2 : 0.3,
          fcp: environment === 'production' ? 2500 : 4000,
          ttfb: environment === 'production' ? 1500 : 3000,
          inp: environment === 'production' ? 400 : 800,
        },
        webhooks:
          environment === 'production'
            ? [process.env.PERFORMANCE_WEBHOOK_URL || '']
            : [],
        slackChannels:
          environment === 'production' ? ['#performance-alerts'] : [],
      },
      reporting: {
        interval: environment === 'production' ? 60000 : 30000, // 1min prod, 30s dev
        storage: environment === 'production' ? 'remote' : 'localStorage',
        endpoint:
          environment === 'production'
            ? process.env.PERFORMANCE_API_ENDPOINT
            : undefined,
        batchSize: environment === 'production' ? 10 : 5,
      },
    };

    return { ...baseConfig, ...overrides };
  }

  /**
   * Creates Lighthouse CI configuration
   */
  static createLighthouseConfig(
    environment: 'development' | 'staging' | 'production'
  ): LighthouseConfig {
    const budget =
      environment === 'production'
        ? this.createProductionBudget()
        : this.createDevelopmentBudget();

    return {
      urls: this.getEndpointsForEnvironment(environment),
      settings: {
        formFactor: 'desktop',
        throttling: environment === 'production',
        runs: environment === 'production' ? 5 : 3,
      },
      budgets: budget,
      ci: {
        assert: {
          'categories:performance': [
            'error',
            { minScore: environment === 'production' ? 0.9 : 0.7 },
          ],
          'categories:accessibility': ['error', { minScore: 0.95 }],
          'categories:best-practices': ['error', { minScore: 0.9 }],
          'categories:seo': ['error', { minScore: 0.9 }],
          'largest-contentful-paint': [
            'error',
            { maxNumericValue: budget.timings.lcp.good },
          ],
          'first-input-delay': [
            'error',
            { maxNumericValue: budget.timings.fid.good },
          ],
          'cumulative-layout-shift': [
            'error',
            { maxNumericValue: budget.timings.cls.good },
          ],
          'total-byte-weight': [
            'warn',
            { maxNumericValue: budget.resources.totalSize },
          ],
          'unused-javascript': [
            'warn',
            { maxNumericValue: budget.resources.scriptSize * 0.3 },
          ],
        },
        upload: {
          target:
            environment === 'production'
              ? 'lhci-server'
              : 'temporary-public-storage',
        },
      },
    };
  }

  /**
   * Gets endpoints for specific environment
   */
  private static getEndpointsForEnvironment(
    environment: 'development' | 'staging' | 'production'
  ): string[] {
    const baseUrls = {
      development: 'http://localhost:3000',
      staging: 'https://staging.skyscout.ai',
      production: 'https://skyscout.ai',
    };

    const baseUrl = baseUrls[environment];

    return [
      baseUrl,
      `${baseUrl}/search`,
      `${baseUrl}/deals`,
      `${baseUrl}/flights`,
      `${baseUrl}/hotels`,
      `${baseUrl}/trips`,
    ];
  }
}

/**
 * Configuration Constants
 */
export const PERFORMANCE_CONSTANTS = {
  // Measurement intervals
  MEASUREMENT_INTERVAL: 30000, // 30 seconds
  REPORT_INTERVAL: 300000, // 5 minutes

  // Storage keys
  STORAGE_KEYS: {
    METRICS: 'skyscout_performance_metrics',
    REPORTS: 'skyscout_performance_reports',
    CONFIG: 'skyscout_performance_config',
  } as const,

  // Event names
  EVENTS: {
    METRIC_COLLECTED: 'performance:metric-collected',
    BUDGET_VIOLATED: 'performance:budget-violated',
    THRESHOLD_EXCEEDED: 'performance:threshold-exceeded',
    REPORT_GENERATED: 'performance:report-generated',
  } as const,

  // Grades mapping
  PERFORMANCE_GRADES: {
    A: { min: 90, max: 100 },
    B: { min: 80, max: 89 },
    C: { min: 70, max: 79 },
    D: { min: 60, max: 69 },
    F: { min: 0, max: 59 },
  } as const,
} as const;
