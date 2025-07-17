interface MetricData {
  [key: string]: number;
}

class MetricsCollector {
  private metrics: Map<string, number> = new Map();
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  increment(name: string, value = 1, tags?: Record<string, string>) {
    const key = this.buildKey(name, tags);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  gauge(name: string, value: number, tags?: Record<string, string>) {
    const key = this.buildKey(name, tags);
    this.metrics.set(key, value);
  }

  histogram(name: string, value: number, tags?: Record<string, string>) {
    const key = this.buildKey(name, tags);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    this.histograms.get(key)!.push(value);
  }

  timer(name: string, tags?: Record<string, string>) {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.histogram(name, duration, tags);
    };
  }

  getAll(): MetricData {
    const result: MetricData = {};

    // Add counters
    for (const [key, value] of this.counters) {
      result[key] = value;
    }

    // Add gauges
    for (const [key, value] of this.metrics) {
      result[key] = value;
    }

    // Add histogram statistics
    for (const [key, values] of this.histograms) {
      if (values.length > 0) {
        result[`${key}.count`] = values.length;
        result[`${key}.avg`] =
          values.reduce((a, b) => a + b, 0) / values.length;
        result[`${key}.min`] = Math.min(...values);
        result[`${key}.max`] = Math.max(...values);
        result[`${key}.p95`] = this.percentile(values, 0.95);
        result[`${key}.p99`] = this.percentile(values, 0.99);
      }
    }

    return result;
  }

  reset() {
    this.metrics.clear();
    this.counters.clear();
    this.histograms.clear();
  }

  private buildKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }

    const tagString = Object.entries(tags)
      .map(([k, v]) => `${k}:${v}`)
      .join(',');

    return `${name}{${tagString}}`;
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index] || 0;
  }
}

export const metrics = new MetricsCollector();
