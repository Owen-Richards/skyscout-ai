#!/usr/bin/env node

/**
 * Performance Monitoring Script for SkyScout AI
 *
 * This script provides comprehensive performance analysis including:
 * - Lighthouse audits for Core Web Vitals
 * - Bundle size analysis and monitoring
 * - Performance regression detection
 * - Automated reporting and alerts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  lighthouse: {
    url: 'http://localhost:3000',
    outputPath: './reports/lighthouse',
    thresholds: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 95,
      pwa: 80,
    },
    coreWebVitals: {
      lcp: 2.5, // Largest Contentful Paint (seconds)
      fid: 0.1, // First Input Delay (seconds)
      cls: 0.1, // Cumulative Layout Shift
    },
  },
  bundle: {
    maxMainBundleSize: 250, // KB
    maxChunkSize: 100, // KB
    maxTotalSize: 500, // KB
    alertThreshold: 0.1, // 10% increase triggers alert
  },
  reports: {
    outputDir: './reports',
    historyFile: './reports/performance-history.json',
  },
};

class PerformanceMonitor {
  constructor() {
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = [CONFIG.reports.outputDir, CONFIG.lighthouse.outputPath];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runLighthouseAudit() {
    console.log('🔍 Running Lighthouse audit...');

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(
        CONFIG.lighthouse.outputPath,
        `lighthouse-${timestamp}`
      );

      // Check if server is running
      await this.waitForServer(CONFIG.lighthouse.url);

      const command =
        `npx lighthouse ${CONFIG.lighthouse.url} ` +
        `--output=json --output=html ` +
        `--output-path="${reportPath}" ` +
        `--chrome-flags="--headless --no-sandbox" ` +
        `--only-categories=performance,accessibility,best-practices,seo,pwa ` +
        `--quiet`;

      console.log('Running command:', command);
      execSync(command, { stdio: 'inherit' });

      // Parse results
      const jsonReport = JSON.parse(
        fs.readFileSync(`${reportPath}.report.json`, 'utf8')
      );
      const scores = this.extractLighthouseScores(jsonReport);

      console.log('📊 Lighthouse Results:');
      this.logScores(scores);

      // Check thresholds
      this.checkLighthouseThresholds(scores);

      return scores;
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
      throw error;
    }
  }

  extractLighthouseScores(report) {
    const categories = report.lhr.categories;
    const audits = report.lhr.audits;

    return {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
      pwa: Math.round(categories.pwa.score * 100),
      coreWebVitals: {
        lcp: audits['largest-contentful-paint']?.numericValue / 1000 || 0,
        fid: audits['max-potential-fid']?.numericValue / 1000 || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
      },
      timestamp: new Date().toISOString(),
    };
  }

  logScores(scores) {
    console.log(
      `  Performance: ${scores.performance}% ${this.getScoreEmoji(scores.performance)}`
    );
    console.log(
      `  Accessibility: ${scores.accessibility}% ${this.getScoreEmoji(scores.accessibility)}`
    );
    console.log(
      `  Best Practices: ${scores.bestPractices}% ${this.getScoreEmoji(scores.bestPractices)}`
    );
    console.log(`  SEO: ${scores.seo}% ${this.getScoreEmoji(scores.seo)}`);
    console.log(`  PWA: ${scores.pwa}% ${this.getScoreEmoji(scores.pwa)}`);
    console.log('\n📈 Core Web Vitals:');
    console.log(
      `  LCP: ${scores.coreWebVitals.lcp.toFixed(2)}s ${scores.coreWebVitals.lcp <= CONFIG.lighthouse.coreWebVitals.lcp ? '✅' : '❌'}`
    );
    console.log(
      `  FID: ${scores.coreWebVitals.fid.toFixed(2)}s ${scores.coreWebVitals.fid <= CONFIG.lighthouse.coreWebVitals.fid ? '✅' : '❌'}`
    );
    console.log(
      `  CLS: ${scores.coreWebVitals.cls.toFixed(3)} ${scores.coreWebVitals.cls <= CONFIG.lighthouse.coreWebVitals.cls ? '✅' : '❌'}`
    );
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🟢';
    if (score >= 70) return '🟡';
    return '🔴';
  }

  checkLighthouseThresholds(scores) {
    const failures = [];

    Object.entries(CONFIG.lighthouse.thresholds).forEach(
      ([metric, threshold]) => {
        if (scores[metric] < threshold) {
          failures.push(
            `${metric}: ${scores[metric]}% (threshold: ${threshold}%)`
          );
        }
      }
    );

    // Check Core Web Vitals
    const cwv = scores.coreWebVitals;
    if (cwv.lcp > CONFIG.lighthouse.coreWebVitals.lcp) {
      failures.push(
        `LCP: ${cwv.lcp.toFixed(2)}s (threshold: ${CONFIG.lighthouse.coreWebVitals.lcp}s)`
      );
    }
    if (cwv.fid > CONFIG.lighthouse.coreWebVitals.fid) {
      failures.push(
        `FID: ${cwv.fid.toFixed(2)}s (threshold: ${CONFIG.lighthouse.coreWebVitals.fid}s)`
      );
    }
    if (cwv.cls > CONFIG.lighthouse.coreWebVitals.cls) {
      failures.push(
        `CLS: ${cwv.cls.toFixed(3)} (threshold: ${CONFIG.lighthouse.coreWebVitals.cls})`
      );
    }

    if (failures.length > 0) {
      console.log('\n⚠️  Performance thresholds not met:');
      failures.forEach(failure => console.log(`  - ${failure}`));
      process.exit(1);
    } else {
      console.log('\n✅ All performance thresholds met!');
    }
  }

  async analyzeBundleSize() {
    console.log('\n📦 Analyzing bundle size...');

    try {
      // Build the project first
      console.log('Building project...');
      execSync('npm run build', { cwd: './apps/web', stdio: 'inherit' });

      // Analyze bundle
      const buildDir = './apps/web/.next';
      const stats = this.getBundleStats(buildDir);

      console.log('📊 Bundle Analysis:');
      console.log(`  Main bundle: ${(stats.mainSize / 1024).toFixed(2)} KB`);
      console.log(`  Total chunks: ${stats.chunkCount}`);
      console.log(
        `  Largest chunk: ${(stats.largestChunk / 1024).toFixed(2)} KB`
      );
      console.log(`  Total size: ${(stats.totalSize / 1024).toFixed(2)} KB`);

      // Check thresholds
      this.checkBundleThresholds(stats);

      return stats;
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      throw error;
    }
  }

  getBundleStats(buildDir) {
    const staticDir = path.join(buildDir, 'static');
    let totalSize = 0;
    let mainSize = 0;
    let chunkCount = 0;
    let largestChunk = 0;

    const walkDir = dir => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.js')) {
          const size = stat.size;
          totalSize += size;
          chunkCount++;

          if (size > largestChunk) {
            largestChunk = size;
          }

          if (file.includes('main') || file.includes('index')) {
            mainSize = size;
          }
        }
      });
    };

    if (fs.existsSync(staticDir)) {
      walkDir(staticDir);
    }

    return {
      totalSize,
      mainSize,
      chunkCount,
      largestChunk,
      timestamp: new Date().toISOString(),
    };
  }

  checkBundleThresholds(stats) {
    const failures = [];

    if (stats.mainSize / 1024 > CONFIG.bundle.maxMainBundleSize) {
      failures.push(
        `Main bundle too large: ${(stats.mainSize / 1024).toFixed(2)} KB (max: ${CONFIG.bundle.maxMainBundleSize} KB)`
      );
    }

    if (stats.largestChunk / 1024 > CONFIG.bundle.maxChunkSize) {
      failures.push(
        `Largest chunk too big: ${(stats.largestChunk / 1024).toFixed(2)} KB (max: ${CONFIG.bundle.maxChunkSize} KB)`
      );
    }

    if (stats.totalSize / 1024 > CONFIG.bundle.maxTotalSize) {
      failures.push(
        `Total bundle too large: ${(stats.totalSize / 1024).toFixed(2)} KB (max: ${CONFIG.bundle.maxTotalSize} KB)`
      );
    }

    if (failures.length > 0) {
      console.log('\n⚠️  Bundle size thresholds exceeded:');
      failures.forEach(failure => console.log(`  - ${failure}`));
      console.log('\n💡 Consider:');
      console.log('  - Code splitting with dynamic imports');
      console.log('  - Tree shaking unused code');
      console.log('  - Optimizing dependencies');
      console.log('  - Using bundle analyzer: npm run analyze');
    } else {
      console.log('\n✅ All bundle size thresholds met!');
    }
  }

  async waitForServer(url, timeout = 30000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        await new Promise((resolve, reject) => {
          const http = require('http');
          const req = http.get(url, () => {
            resolve();
          });
          req.on('error', reject);
          req.setTimeout(5000, () => reject(new Error('Timeout')));
        });
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error(`Server not available at ${url} after ${timeout}ms`);
  }

  saveHistory(data) {
    const historyFile = CONFIG.reports.historyFile;
    let history = [];

    if (fs.existsSync(historyFile)) {
      try {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      } catch (error) {
        console.warn('Could not read history file, starting fresh');
      }
    }

    history.push(data);

    // Keep only last 50 entries
    if (history.length > 50) {
      history = history.slice(-50);
    }

    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  }

  async runFullAnalysis() {
    console.log('🚀 Starting comprehensive performance analysis...\n');

    try {
      // Run Lighthouse audit
      const lighthouseScores = await this.runLighthouseAudit();

      // Analyze bundle size
      const bundleStats = await this.analyzeBundleSize();

      // Save to history
      const report = {
        timestamp: new Date().toISOString(),
        lighthouse: lighthouseScores,
        bundle: bundleStats,
      };

      this.saveHistory(report);

      console.log('\n✅ Performance analysis completed successfully!');
      console.log(`📄 Reports saved to: ${CONFIG.reports.outputDir}`);

      return report;
    } catch (error) {
      console.error('\n❌ Performance analysis failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  const monitor = new PerformanceMonitor();

  switch (command) {
    case 'lighthouse':
      await monitor.runLighthouseAudit();
      break;
    case 'bundle':
      await monitor.analyzeBundleSize();
      break;
    case 'full':
    default:
      await monitor.runFullAnalysis();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PerformanceMonitor;
