/**
 * SkyScout AI - Performance Monitoring Types
 * Enterprise-grade type definitions for performance monitoring
 */

// Core Web Vitals
export interface CoreWebVitals {
  /** Largest Contentful Paint - measures loading performance */
  lcp: number;
  /** First Input Delay - measures interactivity */
  fid: number;
  /** Cumulative Layout Shift - measures visual stability */
  cls: number;
  /** First Contentful Paint - measures loading start */
  fcp: number;
  /** Time to First Byte - measures server response */
  ttfb: number;
  /** Interaction to Next Paint - measures responsiveness */
  inp: number;
}

// Performance Thresholds
export interface PerformanceThresholds {
  good: number;
  needsImprovement: number;
  poor: number;
}

export interface PerformanceBudget {
  timings: {
    [K in keyof CoreWebVitals]: PerformanceThresholds;
  };
  resources: {
    totalSize: number;
    scriptSize: number;
    styleSize: number;
    imageSize: number;
    fontSize: number;
  };
  counts: {
    scripts: number;
    styles: number;
    images: number;
    fonts: number;
    requests: number;
  };
}

// Monitoring Configuration
export interface MonitoringConfig {
  environment: 'development' | 'staging' | 'production';
  endpoints: string[];
  budgets: PerformanceBudget;
  alerts: AlertConfig;
  reporting: ReportingConfig;
}

export interface AlertConfig {
  enabled: boolean;
  thresholds: {
    [K in keyof CoreWebVitals]: number;
  };
  webhooks: string[];
  slackChannels: string[];
}

export interface ReportingConfig {
  interval: number; // milliseconds
  storage: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'remote';
  endpoint?: string;
  batchSize: number;
}

// Metric Collection
export interface PerformanceMetric {
  name: keyof CoreWebVitals;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

export interface PerformanceReport {
  id: string;
  timestamp: number;
  url: string;
  metrics: PerformanceMetric[];
  budget: PerformanceBudget;
  violations: BudgetViolation[];
  score: PerformanceScore;
}

export interface BudgetViolation {
  metric: keyof CoreWebVitals;
  actual: number;
  budget: number;
  severity: 'warning' | 'error' | 'critical';
}

export interface PerformanceScore {
  overall: number;
  loading: number;
  interactivity: number;
  visualStability: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

// Strategy Pattern Types
export interface IPerformanceStrategy {
  name: string;
  collect(): Promise<PerformanceMetric[]>;
  validate(
    metrics: PerformanceMetric[],
    budget: PerformanceBudget
  ): BudgetViolation[];
}

export interface IPerformanceReporter {
  report(data: PerformanceReport): Promise<void>;
}

export interface IPerformanceStorage {
  store(data: PerformanceReport): Promise<void>;
  retrieve(filters?: PerformanceFilters): Promise<PerformanceReport[]>;
}

export interface PerformanceFilters {
  startDate?: Date;
  endDate?: Date;
  url?: string;
  metric?: keyof CoreWebVitals;
  minScore?: number;
  maxScore?: number;
}

// Observer Pattern Types
export type PerformanceEventType =
  | 'metric-collected'
  | 'budget-violated'
  | 'threshold-exceeded'
  | 'report-generated';

export interface PerformanceEvent {
  type: PerformanceEventType;
  data: Record<string, unknown>;
  timestamp: number;
}

export type PerformanceEventListener = (event: PerformanceEvent) => void;

// Lighthouse Integration Types
export interface LighthouseConfig {
  urls: string[];
  settings: {
    formFactor: 'mobile' | 'desktop';
    throttling: boolean;
    runs: number;
  };
  budgets: PerformanceBudget;
  ci: {
    assert: Record<string, [string, Record<string, unknown>]>;
    upload: {
      target: string;
    };
  };
}

// Bundle Analysis Types
export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: BundleChunk[];
  dependencies: BundleDependency[];
  warnings: string[];
  recommendations: string[];
}

export interface BundleChunk {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
}

export interface BundleDependency {
  name: string;
  size: number;
  gzippedSize: number;
  version: string;
  treeshakeable: boolean;
}
