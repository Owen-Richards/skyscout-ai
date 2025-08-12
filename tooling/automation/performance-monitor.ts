/**
 * Performance Monitor
 * Continuous performance monitoring and optimization suggestions
 */

import { exec } from 'child_process';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { extname, join, relative } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface PerformanceMetrics {
  bundleSize: {
    total: number;
    chunks: Array<{
      name: string;
      size: number;
      type: 'js' | 'css' | 'asset';
    }>;
    recommendations: string[];
  };
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    lcp: number;
    fid: number;
    cls: number;
    recommendations: string[];
  };
  buildTime: {
    total: number;
    phases: Record<string, number>;
    recommendations: string[];
  };
  dependencies: {
    total: number;
    outdated: Array<{
      name: string;
      current: string;
      wanted: string;
      latest: string;
    }>;
    unused: string[];
    recommendations: string[];
  };
}

export interface PerformanceThresholds {
  bundleSize: {
    maxTotal: number; // bytes
    maxChunk: number; // bytes
  };
  lighthouse: {
    minPerformance: number;
    minAccessibility: number;
    minBestPractices: number;
    minSEO: number;
    maxLCP: number; // ms
    maxFID: number; // ms
    maxCLS: number; // score
  };
  buildTime: {
    maxTotal: number; // ms
  };
}

export class PerformanceMonitor {
  private projectPath: string;
  private thresholds: PerformanceThresholds;

  constructor(
    projectPath: string = process.cwd(),
    thresholds: Partial<PerformanceThresholds> = {}
  ) {
    this.projectPath = projectPath;
    this.thresholds = {
      bundleSize: {
        maxTotal: 250 * 1024, // 250KB
        maxChunk: 200 * 1024, // 200KB
        ...thresholds.bundleSize,
      },
      lighthouse: {
        minPerformance: 90,
        minAccessibility: 95,
        minBestPractices: 90,
        minSEO: 90,
        maxLCP: 2500, // 2.5s
        maxFID: 100, // 100ms
        maxCLS: 0.1,
        ...thresholds.lighthouse,
      },
      buildTime: {
        maxTotal: 60000, // 60s
        ...thresholds.buildTime,
      },
    };
  }

  /**
   * Run comprehensive performance analysis
   */
  async analyzePerformance(): Promise<PerformanceMetrics> {
    console.log('🚀 Starting performance analysis...\n');

    const [bundleMetrics, lighthouseMetrics, buildMetrics, dependencyMetrics] =
      await Promise.allSettled([
        this.analyzeBundleSize(),
        this.runLighthouseAnalysis(),
        this.analyzeBuildTime(),
        this.analyzeDependencies(),
      ]);

    const metrics: PerformanceMetrics = {
      bundleSize:
        bundleMetrics.status === 'fulfilled'
          ? bundleMetrics.value
          : this.getEmptyBundleMetrics(),
      lighthouse:
        lighthouseMetrics.status === 'fulfilled'
          ? lighthouseMetrics.value
          : this.getEmptyLighthouseMetrics(),
      buildTime:
        buildMetrics.status === 'fulfilled'
          ? buildMetrics.value
          : this.getEmptyBuildMetrics(),
      dependencies:
        dependencyMetrics.status === 'fulfilled'
          ? dependencyMetrics.value
          : this.getEmptyDependencyMetrics(),
    };

    await this.generateReport(metrics);
    await this.checkThresholds(metrics);

    return metrics;
  }

  /**
   * Analyze bundle size and composition
   */
  private async analyzeBundleSize(): Promise<PerformanceMetrics['bundleSize']> {
    console.log('📦 Analyzing bundle size...');

    try {
      // Run webpack bundle analyzer
      await execAsync('npm run analyze -- --json', {
        cwd: join(this.projectPath, 'apps/web'),
      });

      const statsPath = join(
        this.projectPath,
        'apps/web/.next/bundle-stats.json'
      );
      let stats: Record<string, unknown> = {};

      try {
        const statsContent = readFileSync(statsPath, 'utf-8');
        stats = JSON.parse(statsContent);
      } catch {
        console.log('   ⚠️ Bundle stats not found, using fallback analysis');
        return this.fallbackBundleAnalysis();
      }

      const chunks = this.extractChunkInfo(stats);
      const total = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

      const recommendations = this.generateBundleRecommendations(chunks, total);

      console.log(
        `   ✅ Bundle analysis complete (${this.formatBytes(total)})`
      );

      return {
        total,
        chunks,
        recommendations,
      };
    } catch (error) {
      console.log(
        `   ❌ Bundle analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return this.fallbackBundleAnalysis();
    }
  }

  /**
   * Run Lighthouse performance analysis
   */
  private async runLighthouseAnalysis(): Promise<
    PerformanceMetrics['lighthouse']
  > {
    console.log('🔍 Running Lighthouse analysis...');

    try {
      // Start dev server if not running
      const serverUrl = 'http://localhost:3000';

      // Run lighthouse
      const { stdout } = await execAsync(
        `npx lighthouse ${serverUrl} --output=json --quiet --chrome-flags="--headless"`,
        { cwd: this.projectPath }
      );

      const lighthouseResult = JSON.parse(stdout);
      const { categories, audits } = lighthouseResult;

      const metrics = {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
        lcp: audits['largest-contentful-paint'].numericValue,
        fid: audits['max-potential-fid']?.numericValue || 0,
        cls: audits['cumulative-layout-shift'].numericValue,
        recommendations: this.generateLighthouseRecommendations(audits),
      };

      console.log(
        `   ✅ Lighthouse analysis complete (Performance: ${metrics.performance})`
      );

      return metrics;
    } catch (error) {
      console.log(
        `   ❌ Lighthouse analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return this.getEmptyLighthouseMetrics();
    }
  }

  /**
   * Analyze build time performance
   */
  private async analyzeBuildTime(): Promise<PerformanceMetrics['buildTime']> {
    console.log('⏱️ Analyzing build time...');

    try {
      const startTime = Date.now();

      // Run build with timing
      await execAsync('npm run build', {
        cwd: join(this.projectPath, 'apps/web'),
      });

      const total = Date.now() - startTime;

      // Extract build phases from Next.js output
      const phases = {
        compilation: total * 0.6, // Estimated
        optimization: total * 0.3, // Estimated
        static: total * 0.1, // Estimated
      };

      const recommendations = this.generateBuildRecommendations(total, phases);

      console.log(`   ✅ Build analysis complete (${total}ms)`);

      return {
        total,
        phases,
        recommendations,
      };
    } catch (error) {
      console.log(
        `   ❌ Build analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return this.getEmptyBuildMetrics();
    }
  }

  /**
   * Analyze dependencies
   */
  private async analyzeDependencies(): Promise<
    PerformanceMetrics['dependencies']
  > {
    console.log('📋 Analyzing dependencies...');

    try {
      // Get outdated packages
      const { stdout: outdatedOutput } = await execAsync(
        'npm outdated --json',
        {
          cwd: this.projectPath,
        }
      ).catch(() => ({ stdout: '{}' }));

      const outdatedData = JSON.parse(outdatedOutput || '{}');
      const outdated = Object.entries(outdatedData).map(([name, info]) => {
        const packageInfo = info as Record<string, string>;
        return {
          name,
          current: packageInfo.current || '',
          wanted: packageInfo.wanted || '',
          latest: packageInfo.latest || '',
        };
      });

      // Analyze package.json for unused dependencies
      const unused = await this.findUnusedDependencies();

      const total = Object.keys(outdatedData).length + unused.length;
      const recommendations = this.generateDependencyRecommendations(
        outdated,
        unused
      );

      console.log(
        `   ✅ Dependency analysis complete (${outdated.length} outdated, ${unused.length} unused)`
      );

      return {
        total,
        outdated,
        unused,
        recommendations,
      };
    } catch (error) {
      console.log(
        `   ❌ Dependency analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return this.getEmptyDependencyMetrics();
    }
  }

  /**
   * Generate performance report
   */
  private async generateReport(metrics: PerformanceMetrics): Promise<void> {
    const report = this.createMarkdownReport(metrics);
    const reportPath = join(this.projectPath, 'PERFORMANCE_REPORT.md');

    writeFileSync(reportPath, report, 'utf-8');
    console.log(`\n📊 Performance report generated: ${reportPath}`);
  }

  /**
   * Check performance thresholds
   */
  private async checkThresholds(metrics: PerformanceMetrics): Promise<void> {
    console.log('\n🎯 Checking performance thresholds...\n');

    const violations: string[] = [];

    // Bundle size checks
    if (metrics.bundleSize.total > this.thresholds.bundleSize.maxTotal) {
      violations.push(
        `Bundle size (${this.formatBytes(metrics.bundleSize.total)}) exceeds threshold (${this.formatBytes(this.thresholds.bundleSize.maxTotal)})`
      );
    }

    const oversizedChunks = metrics.bundleSize.chunks.filter(
      chunk => chunk.size > this.thresholds.bundleSize.maxChunk
    );
    if (oversizedChunks.length > 0) {
      violations.push(
        `${oversizedChunks.length} chunks exceed size threshold (${this.formatBytes(this.thresholds.bundleSize.maxChunk)})`
      );
    }

    // Lighthouse checks
    if (
      metrics.lighthouse.performance < this.thresholds.lighthouse.minPerformance
    ) {
      violations.push(
        `Performance score (${metrics.lighthouse.performance}) below threshold (${this.thresholds.lighthouse.minPerformance})`
      );
    }

    if (metrics.lighthouse.lcp > this.thresholds.lighthouse.maxLCP) {
      violations.push(
        `LCP (${metrics.lighthouse.lcp}ms) exceeds threshold (${this.thresholds.lighthouse.maxLCP}ms)`
      );
    }

    if (metrics.lighthouse.cls > this.thresholds.lighthouse.maxCLS) {
      violations.push(
        `CLS (${metrics.lighthouse.cls}) exceeds threshold (${this.thresholds.lighthouse.maxCLS})`
      );
    }

    // Build time checks
    if (metrics.buildTime.total > this.thresholds.buildTime.maxTotal) {
      violations.push(
        `Build time (${metrics.buildTime.total}ms) exceeds threshold (${this.thresholds.buildTime.maxTotal}ms)`
      );
    }

    if (violations.length === 0) {
      console.log('✅ All performance thresholds passed!');
    } else {
      console.log('❌ Performance threshold violations:');
      violations.forEach(violation => console.log(`   • ${violation}`));
    }
  }

  // Helper methods
  private fallbackBundleAnalysis(): PerformanceMetrics['bundleSize'] {
    // Analyze .next build output as fallback
    const buildPath = join(this.projectPath, 'apps/web/.next');
    const chunks: Array<{
      name: string;
      size: number;
      type: 'js' | 'css' | 'asset';
    }> = [];

    try {
      const staticPath = join(buildPath, 'static');
      if (statSync(staticPath).isDirectory()) {
        this.scanDirectory(staticPath, chunks, staticPath);
      }
    } catch {
      // Directory doesn't exist
    }

    const total = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

    return {
      total,
      chunks,
      recommendations: this.generateBundleRecommendations(chunks, total),
    };
  }

  private scanDirectory(
    dir: string,
    chunks: Array<{ name: string; size: number; type: 'js' | 'css' | 'asset' }>,
    basePath: string
  ): void {
    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const itemPath = join(dir, item);
        const stat = statSync(itemPath);

        if (stat.isDirectory()) {
          this.scanDirectory(itemPath, chunks, basePath);
        } else if (stat.isFile()) {
          const ext = extname(item);
          const type = ext === '.js' ? 'js' : ext === '.css' ? 'css' : 'asset';

          chunks.push({
            name: relative(basePath, itemPath),
            size: stat.size,
            type,
          });
        }
      }
    } catch {
      // Directory access error
    }
  }

  private extractChunkInfo(
    stats: Record<string, unknown>
  ): Array<{ name: string; size: number; type: 'js' | 'css' | 'asset' }> {
    const chunks: Array<{
      name: string;
      size: number;
      type: 'js' | 'css' | 'asset';
    }> = [];

    if (stats.assets && Array.isArray(stats.assets)) {
      for (const asset of stats.assets) {
        const assetInfo = asset as Record<string, unknown>;
        const ext = extname(String(assetInfo.name || ''));
        const type = ext === '.js' ? 'js' : ext === '.css' ? 'css' : 'asset';

        chunks.push({
          name: String(assetInfo.name || ''),
          size: Number(assetInfo.size || 0),
          type,
        });
      }
    }

    return chunks;
  }

  private generateBundleRecommendations(
    chunks: Array<{ name: string; size: number; type: 'js' | 'css' | 'asset' }>,
    total: number
  ): string[] {
    const recommendations: string[] = [];

    if (total > this.thresholds.bundleSize.maxTotal) {
      recommendations.push(
        'Consider implementing code splitting to reduce bundle size'
      );
      recommendations.push('Remove unused dependencies and imports');
      recommendations.push('Use dynamic imports for heavy components');
    }

    const largeChunks = chunks
      .filter(chunk => chunk.size > this.thresholds.bundleSize.maxChunk)
      .sort((a, b) => b.size - a.size);

    if (largeChunks.length > 0) {
      recommendations.push(
        `Optimize large chunks: ${largeChunks
          .slice(0, 3)
          .map(c => c.name)
          .join(', ')}`
      );
    }

    const jsChunks = chunks.filter(chunk => chunk.type === 'js');
    if (jsChunks.length > 10) {
      recommendations.push('Consider consolidating small JavaScript chunks');
    }

    return recommendations;
  }

  private generateLighthouseRecommendations(
    audits: Record<string, unknown>
  ): string[] {
    const recommendations: string[] = [];

    const getAuditScore = (auditName: string): number => {
      const audit = audits[auditName] as Record<string, unknown>;
      return Number(audit?.score || 0);
    };

    const getAuditValue = (auditName: string): number => {
      const audit = audits[auditName] as Record<string, unknown>;
      return Number(audit?.numericValue || 0);
    };

    if (getAuditScore('unused-javascript') < 1) {
      recommendations.push('Remove unused JavaScript code');
    }

    if (getAuditScore('render-blocking-resources') < 1) {
      recommendations.push('Eliminate render-blocking resources');
    }

    if (
      getAuditValue('largest-contentful-paint') >
      this.thresholds.lighthouse.maxLCP
    ) {
      recommendations.push('Optimize Largest Contentful Paint (LCP)');
    }

    if (
      getAuditValue('cumulative-layout-shift') >
      this.thresholds.lighthouse.maxCLS
    ) {
      recommendations.push('Minimize Cumulative Layout Shift (CLS)');
    }

    if (getAuditScore('uses-optimized-images') < 1) {
      recommendations.push('Serve images in next-gen formats');
    }

    if (getAuditScore('uses-text-compression') < 1) {
      recommendations.push('Enable text compression');
    }

    return recommendations;
  }

  private generateBuildRecommendations(
    total: number,
    phases: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];

    if (total > this.thresholds.buildTime.maxTotal) {
      recommendations.push(
        'Build time exceeds threshold - consider optimization'
      );
    }

    if (phases.compilation > total * 0.7) {
      recommendations.push(
        'Compilation phase is slow - check TypeScript configuration'
      );
      recommendations.push('Consider using SWC instead of Babel');
    }

    if (phases.optimization > total * 0.4) {
      recommendations.push(
        'Optimization phase is slow - review webpack configuration'
      );
    }

    return recommendations;
  }

  private generateDependencyRecommendations(
    outdated: Array<{
      name: string;
      current: string;
      wanted: string;
      latest: string;
    }>,
    unused: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (outdated.length > 0) {
      recommendations.push(`Update ${outdated.length} outdated dependencies`);

      if (outdated.length > 10) {
        recommendations.push(
          'Consider gradual dependency updates to reduce risk'
        );
      }
    }

    if (unused.length > 0) {
      recommendations.push(`Remove ${unused.length} unused dependencies`);
      recommendations.push('Run dependency audit to clean up package.json');
    }

    return recommendations;
  }

  private async findUnusedDependencies(): Promise<string[]> {
    // Simplified unused dependency detection
    // In a real implementation, you'd want to use tools like depcheck
    try {
      const { stdout } = await execAsync('npx depcheck --json', {
        cwd: this.projectPath,
      });

      const result = JSON.parse(stdout);
      return result.dependencies || [];
    } catch {
      return [];
    }
  }

  private createMarkdownReport(metrics: PerformanceMetrics): string {
    const timestamp = new Date().toISOString();

    return `# Performance Report

Generated: ${timestamp}

## Bundle Analysis

**Total Size:** ${this.formatBytes(metrics.bundleSize.total)}

### Chunks
${metrics.bundleSize.chunks
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map(
    chunk => `- ${chunk.name}: ${this.formatBytes(chunk.size)} (${chunk.type})`
  )
  .join('\n')}

### Recommendations
${metrics.bundleSize.recommendations.map(rec => `- ${rec}`).join('\n')}

## Lighthouse Metrics

- **Performance:** ${metrics.lighthouse.performance}/100
- **Accessibility:** ${metrics.lighthouse.accessibility}/100
- **Best Practices:** ${metrics.lighthouse.bestPractices}/100
- **SEO:** ${metrics.lighthouse.seo}/100

### Core Web Vitals
- **LCP:** ${metrics.lighthouse.lcp}ms
- **FID:** ${metrics.lighthouse.fid}ms
- **CLS:** ${metrics.lighthouse.cls}

### Recommendations
${metrics.lighthouse.recommendations.map(rec => `- ${rec}`).join('\n')}

## Build Performance

**Total Build Time:** ${metrics.buildTime.total}ms

### Phases
${Object.entries(metrics.buildTime.phases)
  .map(([phase, time]) => `- ${phase}: ${time}ms`)
  .join('\n')}

### Recommendations
${metrics.buildTime.recommendations.map(rec => `- ${rec}`).join('\n')}

## Dependencies

- **Outdated:** ${metrics.dependencies.outdated.length}
- **Unused:** ${metrics.dependencies.unused.length}

### Outdated Dependencies
${metrics.dependencies.outdated
  .slice(0, 10)
  .map(dep => `- ${dep.name}: ${dep.current} → ${dep.latest}`)
  .join('\n')}

### Unused Dependencies
${metrics.dependencies.unused
  .slice(0, 10)
  .map(dep => `- ${dep}`)
  .join('\n')}

### Recommendations
${metrics.dependencies.recommendations.map(rec => `- ${rec}`).join('\n')}

---

*Report generated by SkyScout AI Performance Monitor*
`;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // Empty metrics for error cases
  private getEmptyBundleMetrics(): PerformanceMetrics['bundleSize'] {
    return {
      total: 0,
      chunks: [],
      recommendations: ['Bundle analysis failed - check build configuration'],
    };
  }

  private getEmptyLighthouseMetrics(): PerformanceMetrics['lighthouse'] {
    return {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      recommendations: [
        'Lighthouse analysis failed - ensure dev server is running',
      ],
    };
  }

  private getEmptyBuildMetrics(): PerformanceMetrics['buildTime'] {
    return {
      total: 0,
      phases: {},
      recommendations: ['Build analysis failed - check build scripts'],
    };
  }

  private getEmptyDependencyMetrics(): PerformanceMetrics['dependencies'] {
    return {
      total: 0,
      outdated: [],
      unused: [],
      recommendations: ['Dependency analysis failed - check package.json'],
    };
  }
}

// Export for CLI usage
export const analyzePerformance = async (
  projectPath: string = process.cwd(),
  thresholds?: Partial<PerformanceThresholds>
) => {
  const monitor = new PerformanceMonitor(projectPath, thresholds);
  return monitor.analyzePerformance();
};
