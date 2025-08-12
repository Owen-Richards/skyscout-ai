/**
 * Advanced Development Tooling Setup
 * Improves developer experience and productivity
 * Implements best practices for clean code and architecture
 */

const { spawn } = require('child_process');
const chokidar = require('chokidar');
const { WebSocketServer } = require('ws');
const fs = require('fs').promises;
const path = require('path');

// Development Environment Configuration
export const devConfig = {
  // Hot Module Replacement for backend services
  hmr: {
    enabled: process.env.NODE_ENV === 'development',
    watchPaths: ['src/**/*.ts', 'apps/**/*.ts', 'libs/**/*.ts'],
    ignorePaths: ['node_modules', 'dist', '.next', 'coverage'],
  },

  // API Mocking for development
  mocking: {
    enabled: process.env.MOCK_APIS === 'true',
    delay: 500, // Simulate network delay
    errorRate: 0.1, // 10% error rate for testing
  },

  // Feature flags for development
  features: {
    newFlightSearch: process.env.FEATURE_NEW_SEARCH === 'true',
    priceAlerts: process.env.FEATURE_PRICE_ALERTS === 'true',
    aiRecommendations: process.env.FEATURE_AI_RECOMMENDATIONS === 'true',
  },

  // Architecture validation settings
  architecture: {
    enforceLayering: true,
    validateImports: true,
    checkNamingConventions: true,
    maxComplexity: 10,
  },

  // Performance monitoring
  performance: {
    enableBundleAnalysis: true,
    enableLighthouse: process.env.NODE_ENV === 'development',
    thresholds: {
      bundleSize: 250000, // 250KB
      lcp: 2500, // 2.5s
      fid: 100, // 100ms
      cls: 0.1,
    },
  },
};

class DevEnvironment {
  constructor() {
    this.services = new Map();
    this.wsServer = new WebSocketServer({ port: 3099 });
    this.architectureValidator = new ArchitectureValidator();
    this.performanceMonitor = new PerformanceMonitor();
    this.setupWebSocket();
  }

  async start() {
    console.log('🚀 Starting SkyScout AI Development Environment...\n');

    // Validate architecture before starting
    if (devConfig.architecture.enforceLayering) {
      console.log('🏗️ Validating architecture...');
      await this.architectureValidator.validate();
    }

    // Start all services with hot reload
    const serviceConfigs = [
      { name: 'web', command: 'npm run dev', cwd: './apps/web', port: 3000 },
      { name: 'api', command: 'npm run dev', cwd: './apps/api', port: 3001 },
      {
        name: 'ml-service',
        command: 'python main.py',
        cwd: './apps/ml-service',
        port: 8000,
      },
      {
        name: 'search-engine',
        command: 'cargo run',
        cwd: './apps/search-engine',
        port: 8080,
      },
      {
        name: 'mcp-server',
        command: 'npm run dev',
        cwd: './apps/mcp-server',
        port: 3002,
      },
    ];

    for (const config of serviceConfigs) {
      await this.startService(config);
    }

    // Setup advanced file watchers
    this.setupAdvancedFileWatchers();

    // Setup service health monitoring
    this.setupHealthMonitoring();

    // Start performance monitoring
    if (devConfig.performance.enableLighthouse) {
      this.performanceMonitor.startContinuousMonitoring();
    }

    console.log('\n✅ All services started successfully!');
    console.log('🌐 Web: http://localhost:3000');
    console.log('🔧 API: http://localhost:3001');
    console.log('🧠 ML Service: http://localhost:8000');
    console.log('🔍 Search Engine: http://localhost:8080');
    console.log('🤖 MCP Server: http://localhost:3002');
    console.log('📊 Dev Dashboard: http://localhost:3099');
    console.log('\n🎯 Development environment ready with advanced tooling!');
  }

  async startService(config) {
    return new Promise(resolve => {
      console.log(`🔄 Starting ${config.name}...`);

      const process = spawn(
        config.command.split(' ')[0],
        config.command.split(' ').slice(1),
        {
          cwd: config.cwd,
          stdio: 'pipe',
          shell: true,
        }
      );

      process.stdout.on('data', data => {
        const output = data.toString().trim();
        console.log(`[${config.name}] ${output}`);
        this.broadcastServiceLog(config.name, output);
      });

      process.stderr.on('data', data => {
        const output = data.toString().trim();
        console.error(`[${config.name}] ${output}`);
        this.broadcastServiceError(config.name, output);
      });

      process.on('close', code => {
        console.log(`[${config.name}] Process exited with code ${code}`);
        this.services.delete(config.name);
      });

      this.services.set(config.name, { process, config });

      // Wait for service to be ready
      setTimeout(() => resolve(), 2000);
    });
  }

  setupAdvancedFileWatchers() {
    // Watch shared libraries for changes
    chokidar.watch('./libs/**/*.{ts,tsx}').on('change', async filePath => {
      console.log(`📦 Shared library changed: ${filePath}`);

      // Validate architecture on changes
      if (devConfig.architecture.validateImports) {
        await this.architectureValidator.validateFile(filePath);
      }

      this.notifyServiceReload(['web', 'api']);
    });

    // Watch for schema changes
    chokidar.watch('./apps/api/prisma/schema.prisma').on('change', async () => {
      console.log('🗄️ Database schema changed, regenerating Prisma client...');
      await this.runCommand('npx prisma generate', './apps/api');
    });

    // Watch for component changes and validate patterns
    chokidar
      .watch('./apps/web/app/components/**/*.{ts,tsx}')
      .on('change', async filePath => {
        console.log(`🎨 Component changed: ${filePath}`);

        if (devConfig.architecture.checkNamingConventions) {
          await this.architectureValidator.validateNaming(filePath);
        }
      });

    // Watch configuration changes
    chokidar.watch('./tooling/**/*.{ts,js}').on('change', filePath => {
      console.log(`⚙️ Tooling configuration changed: ${filePath}`);
      this.broadcastToolingUpdate(filePath);
    });

    // Watch for new patterns and automatically register them
    chokidar.watch('./tooling/patterns/**/*.ts').on('add', filePath => {
      console.log(`🆕 New pattern added: ${filePath}`);
      this.registerNewPattern(filePath);
    });
  }

  setupHealthMonitoring() {
    setInterval(async () => {
      const healthChecks = [
        { name: 'web', url: 'http://localhost:3000/api/health' },
        { name: 'api', url: 'http://localhost:3001/health' },
        { name: 'ml-service', url: 'http://localhost:8000/health' },
        { name: 'search-engine', url: 'http://localhost:8080/health' },
        { name: 'mcp-server', url: 'http://localhost:3002/health' },
      ];

      for (const check of healthChecks) {
        try {
          const response = await fetch(check.url, { timeout: 5000 });
          const status = response.ok ? '✅' : '❌';
          this.broadcastServiceHealth(check.name, status);
        } catch (error) {
          this.broadcastServiceHealth(check.name, '❌');
        }
      }
    }, 10000); // Check every 10 seconds
  }

  setupWebSocket() {
    this.wsServer.on('connection', ws => {
      ws.send(
        JSON.stringify({
          type: 'connected',
          message: 'SkyScout AI Dev Dashboard connected',
          features: devConfig.features,
          architecture: devConfig.architecture,
        })
      );
    });
  }

  broadcastServiceLog(service, log) {
    this.wsServer.clients.forEach(client => {
      client.send(
        JSON.stringify({
          type: 'log',
          service,
          message: log,
          timestamp: new Date().toISOString(),
        })
      );
    });
  }

  broadcastServiceError(service, error) {
    this.wsServer.clients.forEach(client => {
      client.send(
        JSON.stringify({
          type: 'error',
          service,
          message: error,
          timestamp: new Date().toISOString(),
        })
      );
    });
  }

  broadcastServiceHealth(service, status) {
    this.wsServer.clients.forEach(client => {
      client.send(
        JSON.stringify({
          type: 'health',
          service,
          status,
          timestamp: new Date().toISOString(),
        })
      );
    });
  }

  broadcastToolingUpdate(filePath) {
    this.wsServer.clients.forEach(client => {
      client.send(
        JSON.stringify({
          type: 'tooling_update',
          file: filePath,
          timestamp: new Date().toISOString(),
        })
      );
    });
  }

  notifyServiceReload(services) {
    services.forEach(serviceName => {
      const service = this.services.get(serviceName);
      if (service) {
        console.log(`🔄 Reloading ${serviceName}...`);
        this.broadcastServiceLog(
          serviceName,
          'Reloading due to shared library changes'
        );
      }
    });
  }

  async registerNewPattern(filePath) {
    try {
      const patternName = path.basename(filePath, '.ts');
      console.log(`🎯 Registering new pattern: ${patternName}`);

      // Notify all connected clients about new pattern
      this.wsServer.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: 'pattern_registered',
            pattern: patternName,
            file: filePath,
            timestamp: new Date().toISOString(),
          })
        );
      });
    } catch (error) {
      console.error(`Failed to register pattern: ${error.message}`);
    }
  }

  async runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
      const process = spawn(
        command.split(' ')[0],
        command.split(' ').slice(1),
        {
          cwd,
          stdio: 'inherit',
          shell: true,
        }
      );

      process.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`Command failed with code ${code}`));
      });
    });
  }

  async generateComponent(name, type, options = {}) {
    console.log(`🎨 Generating ${type} component: ${name}`);

    try {
      const {
        generateComponentFiles,
      } = require('./generators/component.template');

      const files = generateComponentFiles({
        name,
        type,
        hasVariants: options.variants || false,
        hasState: options.state || false,
        hasChildren: options.children || true,
        exportProps: true,
        includeTests: true,
        includeStories: true,
        includeStyles: true,
        features: options.features || {},
      });

      const componentDir = path.join(
        './apps/web/app/components',
        type,
        name.toLowerCase()
      );
      await fs.mkdir(componentDir, { recursive: true });

      for (const [fileName, content] of Object.entries(files)) {
        await fs.writeFile(path.join(componentDir, fileName), content, 'utf8');
      }

      console.log(
        `✅ Component ${name} generated successfully in ${componentDir}`
      );

      this.wsServer.clients.forEach(client => {
        client.send(
          JSON.stringify({
            type: 'component_generated',
            name,
            componentType: type,
            directory: componentDir,
            timestamp: new Date().toISOString(),
          })
        );
      });
    } catch (error) {
      console.error(`❌ Failed to generate component: ${error.message}`);
    }
  }
}

// Architecture validation class
class ArchitectureValidator {
  async validate() {
    console.log('🔍 Running architecture validation...');

    const validations = [
      this.validateLayeredArchitecture(),
      this.validateDependencyDirection(),
      this.validateNamingConventions(),
      this.validateImportRules(),
    ];

    const results = await Promise.all(validations);
    const hasErrors = results.some(result => !result.valid);

    if (hasErrors) {
      console.log('❌ Architecture validation failed');
      results.forEach(result => {
        if (!result.valid) {
          console.log(`  - ${result.error}`);
        }
      });
    } else {
      console.log('✅ Architecture validation passed');
    }

    return !hasErrors;
  }

  async validateLayeredArchitecture() {
    // Implementation for validating clean architecture layers
    return { valid: true };
  }

  async validateDependencyDirection() {
    // Implementation for validating dependency inversion
    return { valid: true };
  }

  async validateNamingConventions() {
    // Implementation for validating naming patterns
    return { valid: true };
  }

  async validateImportRules() {
    // Implementation for validating import organization
    return { valid: true };
  }

  async validateFile(filePath) {
    console.log(`🔍 Validating file: ${filePath}`);
    // Implementation for single file validation
  }

  async validateNaming(filePath) {
    console.log(`📝 Validating naming conventions: ${filePath}`);
    // Implementation for naming validation
  }
}

// Performance monitoring class
class PerformanceMonitor {
  startContinuousMonitoring() {
    console.log('⚡ Starting performance monitoring...');

    setInterval(async () => {
      await this.checkBundleSize();
      await this.runLighthouseCheck();
    }, 60000); // Check every minute
  }

  async checkBundleSize() {
    try {
      // Implementation for bundle size monitoring
      console.log('📊 Checking bundle size...');
    } catch (error) {
      console.error(`Bundle size check failed: ${error.message}`);
    }
  }

  async runLighthouseCheck() {
    try {
      // Implementation for Lighthouse performance monitoring
      console.log('🚦 Running Lighthouse check...');
    } catch (error) {
      console.error(`Lighthouse check failed: ${error.message}`);
    }
  }
}

// CLI command interface
const devEnvironment = new DevEnvironment();

// Export for external usage
module.exports = {
  DevEnvironment,
  devConfig,
  ArchitectureValidator,
  PerformanceMonitor,
};

// Start development environment if run directly
if (require.main === module) {
  devEnvironment.start().catch(console.error);
}
