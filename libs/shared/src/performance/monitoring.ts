/**
 * SkyScout AI - Performance Monitoring System
 * Enterprise-grade performance monitoring with Observer Pattern
 */

import { PERFORMANCE_CONSTANTS } from './config';
import type {
  BudgetViolation,
  IPerformanceReporter,
  IPerformanceStorage,
  IPerformanceStrategy,
  MonitoringConfig,
  PerformanceEvent,
  PerformanceEventListener,
  PerformanceEventType,
  PerformanceMetric,
  PerformanceReport,
  PerformanceScore,
} from './types';

/**
 * Observer Pattern: Performance Event Bus
 */
export class PerformanceEventBus {
  private listeners = new Map<
    PerformanceEventType,
    PerformanceEventListener[]
  >();

  subscribe(
    eventType: PerformanceEventType,
    listener: PerformanceEventListener
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType)!.push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  emit(event: PerformanceEvent): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in performance event listener:`, error);
        }
      });
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

/**
 * Facade Pattern: Main Performance Monitoring System
 */
export class PerformanceMonitor {
  private eventBus: PerformanceEventBus;
  private strategy: IPerformanceStrategy;
  private reporters: IPerformanceReporter[];
  private storage: IPerformanceStorage;
  private config: MonitoringConfig;
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;

  constructor(
    strategy: IPerformanceStrategy,
    config: MonitoringConfig,
    storage: IPerformanceStorage
  ) {
    this.eventBus = new PerformanceEventBus();
    this.strategy = strategy;
    this.config = config;
    this.storage = storage;
    this.reporters = [];
  }

  /**
   * Start performance monitoring
   */
  start(): void {
    if (this.isMonitoring) {
      console.warn('Performance monitoring is already running');
      return;
    }

    this.isMonitoring = true;
    this.scheduleMonitoring();

    this.eventBus.emit({
      type: 'metric-collected',
      data: { status: 'started', strategy: this.strategy.name },
      timestamp: Date.now(),
    });
  }

  /**
   * Stop performance monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    this.eventBus.emit({
      type: 'metric-collected',
      data: { status: 'stopped' },
      timestamp: Date.now(),
    });
  }

  /**
   * Add performance reporter
   */
  addReporter(reporter: IPerformanceReporter): void {
    this.reporters.push(reporter);
  }

  /**
   * Subscribe to performance events
   */
  subscribe(
    eventType: PerformanceEventType,
    listener: PerformanceEventListener
  ): () => void {
    return this.eventBus.subscribe(eventType, listener);
  }

  /**
   * Manually collect performance metrics
   */
  async collectMetrics(): Promise<PerformanceReport> {
    try {
      const metrics = await this.strategy.collect();
      const violations = this.strategy.validate(metrics, this.config.budgets);
      const score = this.calculateScore(metrics, violations);

      const report: PerformanceReport = {
        id: this.generateReportId(),
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        metrics,
        budget: this.config.budgets,
        violations,
        score,
      };

      // Store report
      await this.storage.store(report);

      // Emit events
      this.eventBus.emit({
        type: 'metric-collected',
        data: { metrics, reportId: report.id },
        timestamp: Date.now(),
      });

      if (violations.length > 0) {
        this.eventBus.emit({
          type: 'budget-violated',
          data: { violations, reportId: report.id },
          timestamp: Date.now(),
        });
      }

      // Check for threshold violations
      this.checkThresholds(metrics, report.id);

      // Report to external systems
      await this.reportToSystems(report);

      this.eventBus.emit({
        type: 'report-generated',
        data: { report },
        timestamp: Date.now(),
      });

      return report;
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get recent performance reports
   */
  async getReports(limit = 10): Promise<PerformanceReport[]> {
    const allReports = await this.storage.retrieve({ maxScore: 100 });
    return allReports.slice(0, limit);
  }

  /**
   * Update monitoring configuration
   */
  updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Change performance strategy
   */
  setStrategy(strategy: IPerformanceStrategy): void {
    this.strategy = strategy;
  }

  private scheduleMonitoring(): void {
    if (!this.isMonitoring) return;

    this.monitoringInterval = setInterval(async () => {
      if (this.isMonitoring) {
        try {
          await this.collectMetrics();
        } catch (error) {
          console.error('Scheduled performance collection failed:', error);
        }
      }
    }, this.config.reporting.interval);
  }

  private calculateScore(
    metrics: PerformanceMetric[],
    violations: BudgetViolation[]
  ): PerformanceScore {
    let totalScore = 100;
    let loadingScore = 100;
    let interactivityScore = 100;
    let visualStabilityScore = 100;

    // Deduct points for violations
    for (const violation of violations) {
      const deduction =
        violation.severity === 'critical'
          ? 20
          : violation.severity === 'error'
            ? 10
            : 5;

      totalScore -= deduction;

      // Category-specific deductions
      if (['lcp', 'fcp', 'ttfb'].includes(violation.metric)) {
        loadingScore -= deduction;
      } else if (['fid', 'inp'].includes(violation.metric)) {
        interactivityScore -= deduction;
      } else if (violation.metric === 'cls') {
        visualStabilityScore -= deduction;
      }
    }

    // Ensure scores don't go below 0
    totalScore = Math.max(0, totalScore);
    loadingScore = Math.max(0, loadingScore);
    interactivityScore = Math.max(0, interactivityScore);
    visualStabilityScore = Math.max(0, visualStabilityScore);

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    for (const [gradeKey, range] of Object.entries(
      PERFORMANCE_CONSTANTS.PERFORMANCE_GRADES
    )) {
      if (totalScore >= range.min && totalScore <= range.max) {
        grade = gradeKey as 'A' | 'B' | 'C' | 'D' | 'F';
        break;
      }
    }

    return {
      overall: totalScore,
      loading: loadingScore,
      interactivity: interactivityScore,
      visualStability: visualStabilityScore,
      grade,
    };
  }

  private checkThresholds(
    metrics: PerformanceMetric[],
    reportId: string
  ): void {
    if (!this.config.alerts.enabled) return;

    for (const metric of metrics) {
      const threshold = this.config.alerts.thresholds[metric.name];
      if (threshold && metric.value > threshold) {
        this.eventBus.emit({
          type: 'threshold-exceeded',
          data: {
            metric: metric.name,
            value: metric.value,
            threshold,
            reportId,
          },
          timestamp: Date.now(),
        });
      }
    }
  }

  private async reportToSystems(report: PerformanceReport): Promise<void> {
    const reportPromises = this.reporters.map(reporter =>
      reporter
        .report(report)
        .catch(error => console.error(`Reporter failed:`, error))
    );

    await Promise.allSettled(reportPromises);
  }

  private generateReportId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Default Performance Storage Implementation
 */
export class LocalStoragePerformanceStorage implements IPerformanceStorage {
  private readonly storageKey = PERFORMANCE_CONSTANTS.STORAGE_KEYS.REPORTS;

  async store(data: PerformanceReport): Promise<void> {
    try {
      const existing = await this.retrieve();
      const updated = [data, ...existing].slice(0, 100); // Keep last 100 reports

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to store performance report:', error);
    }
  }

  async retrieve(
    _filters?: Record<string, unknown>
  ): Promise<PerformanceReport[]> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const reports: PerformanceReport[] = JSON.parse(stored);
          return reports;
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to retrieve performance reports:', error);
      return [];
    }
  }
}

/**
 * Console Performance Reporter
 */
export class ConsolePerformanceReporter implements IPerformanceReporter {
  async report(data: PerformanceReport): Promise<void> {
    console.group(
      `🎯 Performance Report - Score: ${data.score.overall}% (${data.score.grade})`
    );

    console.log('📊 Core Web Vitals:');
    data.metrics.forEach(metric => {
      const violation = data.violations.find(v => v.metric === metric.name);
      const icon = violation ? '❌' : '✅';
      console.log(`  ${icon} ${metric.name.toUpperCase()}: ${metric.value}ms`);
    });

    if (data.violations.length > 0) {
      console.log('⚠️ Budget Violations:');
      data.violations.forEach(violation => {
        console.log(
          `  ${violation.severity.toUpperCase()}: ${violation.metric} (${violation.actual} > ${violation.budget})`
        );
      });
    }

    console.groupEnd();
  }
}
