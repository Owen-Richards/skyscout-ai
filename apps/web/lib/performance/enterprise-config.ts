/**
 * SkyScout AI - Enterprise Performance Configuration
 * Replaces scattered configuration files with centralized, type-safe configuration
 */

import {
  PerformanceConfigFactory,
  type LighthouseConfig,
  type MonitoringConfig,
} from '@skyscout/shared';

/**
 * Enterprise Performance Configuration Manager
 * Centralized configuration following Single Responsibility and Factory patterns
 */
export class EnterprisePerformanceConfig {
  private static instance: EnterprisePerformanceConfig;
  private environment: 'development' | 'staging' | 'production';

  private constructor() {
    this.environment =
      (process.env.NODE_ENV as 'development' | 'staging' | 'production') ||
      'development';
  }

  static getInstance(): EnterprisePerformanceConfig {
    if (!EnterprisePerformanceConfig.instance) {
      EnterprisePerformanceConfig.instance = new EnterprisePerformanceConfig();
    }
    return EnterprisePerformanceConfig.instance;
  }

  /**
   * Get Lighthouse CI configuration (replaces lighthouserc.js)
   */
  getLighthouseConfig(): LighthouseConfig {
    return PerformanceConfigFactory.createLighthouseConfig(this.environment);
  }

  /**
   * Get monitoring configuration (replaces performance-budget.json)
   */
  getMonitoringConfig(): MonitoringConfig {
    return PerformanceConfigFactory.createMonitoringConfig(this.environment, {
      // Override with environment-specific settings
      alerts: {
        enabled: this.environment === 'production',
        thresholds: this.getEnvironmentThresholds(),
        webhooks: this.getWebhooks(),
        slackChannels: this.getSlackChannels(),
      },
      reporting: {
        interval: this.getReportingInterval(),
        storage: this.getStorageType(),
        endpoint: this.getReportingEndpoint(),
        batchSize: this.getBatchSize(),
      },
    });
  }

  /**
   * Get performance budget (replaces performance-budget.json)
   */
  getPerformanceBudget() {
    const config = this.getMonitoringConfig();
    return config.budgets;
  }

  /**
   * Get webpack performance configuration
   */
  getWebpackPerformanceConfig() {
    const budget = this.getPerformanceBudget();

    return {
      performance: {
        maxAssetSize: budget.resources.totalSize,
        maxEntrypointSize: budget.resources.totalSize,
        hints: this.environment === 'production' ? 'error' : 'warning',
        assetFilter: (assetFilename: string) => {
          // Only check JavaScript and CSS files
          return /\.(js|jsx|ts|tsx|css)$/.test(assetFilename);
        },
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 40,
              enforce: true,
            },
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](@skyscout\/ui)[\\/]/,
              chunks: 'all',
              priority: 30,
              enforce: true,
            },
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: 20,
              minSize: 20000,
              maxSize: budget.resources.scriptSize,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      },
    };
  }

  /**
   * Get Next.js configuration for performance
   */
  getNextJSPerformanceConfig() {
    const budget = this.getPerformanceBudget();

    return {
      // Performance optimization
      swcMinify: true,
      compress: true,

      // Use budget for optimization settings
      experimental: {
        optimizeCss: budget.resources.totalSize > 100000,
        optimizePackageImports: ['@skyscout/ui', '@skyscout/shared'],
        ppr: true, // Partial Pre-rendering
      },

      // Image optimization
      images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
      },

      // Bundle analyzer placeholder - handled in next.config.js
      ...(process.env.ANALYZE === 'true' &&
        {
          // Bundle analysis configuration moved to next.config.js
        }),

      // Performance headers
      async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-DNS-Prefetch-Control',
                value: 'on',
              },
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-Frame-Options',
                value: 'DENY',
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin',
              },
            ],
          },
        ];
      },
    };
  }

  private getEnvironmentThresholds() {
    const budget = this.getPerformanceBudget();
    return {
      lcp: budget.timings.lcp.needsImprovement,
      fid: budget.timings.fid.needsImprovement,
      cls: budget.timings.cls.needsImprovement,
      fcp: budget.timings.fcp.needsImprovement,
      ttfb: budget.timings.ttfb.needsImprovement,
      inp: budget.timings.inp.needsImprovement,
    };
  }

  private getWebhooks(): string[] {
    if (this.environment === 'production') {
      return [
        process.env.PERFORMANCE_WEBHOOK_URL,
        process.env.SLACK_WEBHOOK_URL,
      ].filter(Boolean) as string[];
    }
    return [];
  }

  private getSlackChannels(): string[] {
    return this.environment === 'production'
      ? ['#performance-alerts', '#engineering-alerts']
      : [];
  }

  private getReportingInterval(): number {
    switch (this.environment) {
      case 'production':
        return 60000; // 1 minute
      case 'staging':
        return 30000; // 30 seconds
      default:
        return 15000; // 15 seconds
    }
  }

  private getStorageType():
    | 'localStorage'
    | 'sessionStorage'
    | 'indexedDB'
    | 'remote' {
    return this.environment === 'production' ? 'remote' : 'localStorage';
  }

  private getReportingEndpoint(): string | undefined {
    return this.environment === 'production'
      ? process.env.PERFORMANCE_API_ENDPOINT
      : undefined;
  }

  private getBatchSize(): number {
    return this.environment === 'production' ? 10 : 5;
  }
}

// Export singleton instance
export const performanceConfig = EnterprisePerformanceConfig.getInstance();
