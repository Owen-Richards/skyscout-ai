/**
 * SkyScout AI - Performance Metrics Utilities
 * Helper functions for performance metric calculation and analysis
 */

import type {
  BudgetViolation,
  CoreWebVitals,
  PerformanceMetric,
  PerformanceScore,
} from './types';

/**
 * Utility functions for Core Web Vitals calculations
 */
export class PerformanceMetrics {
  /**
   * Calculate performance score based on Google's Core Web Vitals
   */
  static calculateCoreWebVitalsScore(
    metrics: PerformanceMetric[]
  ): PerformanceScore {
    const metricMap = metrics.reduce((acc, metric) => {
      acc[metric.name] = metric.value;
      return acc;
    }, {} as Partial<CoreWebVitals>);

    // Scoring weights based on Google's recommendations
    const weights = {
      lcp: 0.25, // 25% - Loading
      fid: 0.25, // 25% - Interactivity
      cls: 0.25, // 25% - Visual Stability
      fcp: 0.15, // 15% - Loading Support
      ttfb: 0.05, // 5% - Server Performance
      inp: 0.05, // 5% - Interactivity Support
    };

    let totalScore = 0;
    let loadingScore = 0;
    let interactivityScore = 0;
    let visualStabilityScore = 0;

    // Calculate individual metric scores
    for (const [metricName, weight] of Object.entries(weights)) {
      const value = metricMap[metricName as keyof CoreWebVitals];
      if (value !== undefined) {
        const score = this.getMetricScore(
          metricName as keyof CoreWebVitals,
          value
        );
        totalScore += score * weight;

        // Category scores
        if (['lcp', 'fcp', 'ttfb'].includes(metricName)) {
          loadingScore += score * (weight / 0.45); // Normalize to loading metrics only
        } else if (['fid', 'inp'].includes(metricName)) {
          interactivityScore += score * (weight / 0.3); // Normalize to interactivity metrics only
        } else if (metricName === 'cls') {
          visualStabilityScore = score;
        }
      }
    }

    // Normalize scores to 0-100 range
    totalScore = Math.round(totalScore * 100);
    loadingScore = Math.round(Math.min(loadingScore * 100, 100));
    interactivityScore = Math.round(Math.min(interactivityScore * 100, 100));
    visualStabilityScore = Math.round(visualStabilityScore * 100);

    return {
      overall: Math.max(0, Math.min(100, totalScore)),
      loading: Math.max(0, Math.min(100, loadingScore)),
      interactivity: Math.max(0, Math.min(100, interactivityScore)),
      visualStability: Math.max(0, Math.min(100, visualStabilityScore)),
      grade: this.getPerformanceGrade(totalScore),
    };
  }

  /**
   * Get individual metric score (0-1 scale)
   */
  private static getMetricScore(
    metric: keyof CoreWebVitals,
    value: number
  ): number {
    const thresholds = this.getMetricThresholds(metric);

    if (value <= thresholds.good) {
      return 1.0; // Perfect score
    } else if (value <= thresholds.needsImprovement) {
      // Linear interpolation between good and needs improvement
      return (
        0.5 +
        (0.5 * (thresholds.needsImprovement - value)) /
          (thresholds.needsImprovement - thresholds.good)
      );
    } else if (value <= thresholds.poor) {
      // Linear interpolation between needs improvement and poor
      return (
        (0.5 * (thresholds.poor - value)) /
        (thresholds.poor - thresholds.needsImprovement)
      );
    } else {
      return 0.0; // Worst score
    }
  }

  /**
   * Get standard thresholds for Core Web Vitals
   */
  private static getMetricThresholds(metric: keyof CoreWebVitals) {
    const thresholds = {
      lcp: { good: 2500, needsImprovement: 4000, poor: 6000 },
      fid: { good: 100, needsImprovement: 300, poor: 500 },
      cls: { good: 0.1, needsImprovement: 0.25, poor: 0.4 },
      fcp: { good: 1800, needsImprovement: 3000, poor: 4500 },
      ttfb: { good: 800, needsImprovement: 1800, poor: 3000 },
      inp: { good: 200, needsImprovement: 500, poor: 1000 },
    };

    return thresholds[metric];
  }

  /**
   * Convert numeric score to letter grade
   */
  private static getPerformanceGrade(
    score: number
  ): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Calculate performance trends over time
   */
  static calculateTrends(
    currentMetrics: PerformanceMetric[],
    previousMetrics: PerformanceMetric[]
  ): Record<
    keyof CoreWebVitals,
    { change: number; trend: 'improving' | 'degrading' | 'stable' }
  > {
    const trends = {} as Record<
      keyof CoreWebVitals,
      { change: number; trend: 'improving' | 'degrading' | 'stable' }
    >;

    for (const metric of currentMetrics) {
      const previousMetric = previousMetrics.find(m => m.name === metric.name);

      if (previousMetric) {
        const change =
          ((metric.value - previousMetric.value) / previousMetric.value) * 100;
        let trend: 'improving' | 'degrading' | 'stable' = 'stable';

        // For performance metrics, lower is usually better
        if (Math.abs(change) < 5) {
          trend = 'stable';
        } else if (change < 0) {
          trend = 'improving'; // Decrease in time/value is improvement
        } else {
          trend = 'degrading'; // Increase in time/value is degradation
        }

        // Exception for CLS where any change is significant
        if (metric.name === 'cls' && Math.abs(change) > 10) {
          trend = change < 0 ? 'improving' : 'degrading';
        }

        trends[metric.name] = { change: Math.round(change * 10) / 10, trend };
      }
    }

    return trends;
  }

  /**
   * Detect performance anomalies
   */
  static detectAnomalies(
    metrics: PerformanceMetric[],
    historicalMetrics: PerformanceMetric[]
  ): {
    metric: keyof CoreWebVitals;
    anomalyType: 'spike' | 'regression' | 'outlier';
  }[] {
    const anomalies: {
      metric: keyof CoreWebVitals;
      anomalyType: 'spike' | 'regression' | 'outlier';
    }[] = [];

    for (const metric of metrics) {
      const historical = historicalMetrics.filter(m => m.name === metric.name);

      if (historical.length < 5) continue; // Need enough data points

      const values = historical.map(m => m.value);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
          values.length
      );

      // Detect outliers (more than 2 standard deviations from mean)
      if (Math.abs(metric.value - mean) > 2 * stdDev) {
        anomalies.push({
          metric: metric.name,
          anomalyType: 'outlier',
        });
      }

      // Detect spikes (sudden increase > 50%)
      const recent = historical.slice(-3).map(m => m.value);
      const recentMean =
        recent.reduce((sum, val) => sum + val, 0) / recent.length;

      if (metric.value > recentMean * 1.5) {
        anomalies.push({
          metric: metric.name,
          anomalyType: 'spike',
        });
      }

      // Detect regressions (consistent increase over last 5 measurements)
      if (historical.length >= 5) {
        const last5 = historical.slice(-5).map(m => m.value);
        const isRegression = last5.every(
          (value, index) => index === 0 || value >= last5[index - 1]
        );

        if (isRegression && metric.value > last5[0] * 1.2) {
          anomalies.push({
            metric: metric.name,
            anomalyType: 'regression',
          });
        }
      }
    }

    return anomalies;
  }

  /**
   * Generate performance insights and recommendations
   */
  static generateInsights(
    metrics: PerformanceMetric[],
    violations: BudgetViolation[]
  ): { insights: string[]; recommendations: string[] } {
    const insights: string[] = [];
    const recommendations: string[] = [];

    for (const violation of violations) {
      switch (violation.metric) {
        case 'lcp':
          insights.push(
            `Largest Contentful Paint is ${violation.actual}ms (${Math.round(((violation.actual - violation.budget) / violation.budget) * 100)}% over budget)`
          );
          recommendations.push(
            'Optimize images, preload critical resources, improve server response time'
          );
          break;

        case 'fid':
          insights.push(
            `First Input Delay is ${violation.actual}ms (${Math.round(((violation.actual - violation.budget) / violation.budget) * 100)}% over budget)`
          );
          recommendations.push(
            'Reduce JavaScript execution time, code splitting, defer non-critical scripts'
          );
          break;

        case 'cls':
          insights.push(
            `Cumulative Layout Shift is ${violation.actual} (${Math.round(((violation.actual - violation.budget) / violation.budget) * 100)}% over budget)`
          );
          recommendations.push(
            'Set dimensions for images/videos, avoid inserting content above existing content'
          );
          break;

        case 'fcp':
          insights.push(
            `First Contentful Paint is ${violation.actual}ms (${Math.round(((violation.actual - violation.budget) / violation.budget) * 100)}% over budget)`
          );
          recommendations.push(
            'Optimize critical rendering path, inline critical CSS, preload fonts'
          );
          break;

        case 'ttfb':
          insights.push(
            `Time to First Byte is ${violation.actual}ms (${Math.round(((violation.actual - violation.budget) / violation.budget) * 100)}% over budget)`
          );
          recommendations.push(
            'Optimize server performance, use CDN, enable compression'
          );
          break;
      }
    }

    // General recommendations based on performance score
    const score = this.calculateCoreWebVitalsScore(metrics);

    if (score.overall < 70) {
      recommendations.push(
        'Consider implementing performance monitoring alerts'
      );
      recommendations.push('Review and optimize critical user journeys');
    }

    if (score.loading < 80) {
      recommendations.push('Implement lazy loading for images and components');
      recommendations.push('Optimize bundle size and enable tree shaking');
    }

    if (score.interactivity < 80) {
      recommendations.push('Reduce main thread blocking time');
      recommendations.push('Implement virtual scrolling for large lists');
    }

    return { insights, recommendations };
  }

  /**
   * Format metrics for display
   */
  static formatMetric(name: keyof CoreWebVitals, value: number): string {
    switch (name) {
      case 'cls':
        return value.toFixed(3);
      case 'lcp':
      case 'fid':
      case 'fcp':
      case 'ttfb':
      case 'inp':
        return `${Math.round(value)}ms`;
      default:
        return value.toString();
    }
  }
}
