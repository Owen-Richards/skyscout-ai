/**
 * Enhanced Development Tooling Setup
 * Comprehensive development environment with architecture enforcement
 */

import { ChildProcess, execSync, spawn } from 'child_process';
import chokidar from 'chokidar';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { WebSocket, WebSocketServer } from 'ws';

import { PerformanceMonitor } from './automation/performance-monitor';
import { codeGenerator } from './generators/advanced-templates';
import { ArchitectureValidator } from './validators/architecture-rules';

interface DevToolingConfig {
  projectPath: string;
  enableArchitectureValidation: boolean;
  enablePerformanceMonitoring: boolean;
  enableHotReload: boolean;
  enableCodeGeneration: boolean;
  monitoringInterval: number;
  validationOnSave: boolean;
  performanceThresholds: {
    bundleSize: number;
    buildTime: number;
    lighthouseScore: number;
  };
}

interface ServiceConfig {
  name: string;
  command: string;
  cwd: string;
  port: number;
  healthCheck?: string;
  dependencies?: string[];
}

interface ServiceInstance {
  process: ChildProcess;
  config: ServiceConfig;
}

interface DashboardMessage {
  type: string;
  name?: string;
  componentType?: string;
  options?: Record<string, unknown>;
}

interface GeneratorOptions {
  [key: string]: unknown;
}

export class EnhancedDevTooling {
  private config: DevToolingConfig;
  private services = new Map<string, ServiceInstance>();
  private wsServer: WebSocketServer;
  private architectureValidator: ArchitectureValidator;
  private performanceMonitor: PerformanceMonitor;
  private isMonitoring = false;

  constructor(config: Partial<DevToolingConfig> = {}) {
    this.config = {
      projectPath: process.cwd(),
      enableArchitectureValidation: true,
      enablePerformanceMonitoring: true,
      enableHotReload: true,
      enableCodeGeneration: true,
      monitoringInterval: 10000, // 10 seconds
      validationOnSave: true,
      performanceThresholds: {
        bundleSize: 250 * 1024, // 250KB
        buildTime: 60000, // 60 seconds
        lighthouseScore: 90,
      },
      ...config,
    };

    this.wsServer = new WebSocketServer({ port: 3099 });
    this.architectureValidator = new ArchitectureValidator();
    this.performanceMonitor = new PerformanceMonitor(this.config.projectPath);

    this.setupWebSocket();
  }

  /**
   * Start the enhanced development environment
   */
  async start(): Promise<void> {
    console.log(
      '🚀 Starting SkyScout AI Enhanced Development Environment...\n'
    );

    // Validate project structure first
    await this.validateProjectStructure();

    // Run initial architecture validation
    if (this.config.enableArchitectureValidation) {
      console.log('🏗️ Running architecture validation...');
      await this.runArchitectureValidation();
    }

    // Setup file watchers
    if (this.config.enableHotReload) {
      this.setupAdvancedFileWatchers();
    }

    // Start all services
    await this.startAllServices();

    // Start performance monitoring
    if (this.config.enablePerformanceMonitoring) {
      this.startPerformanceMonitoring();
    }

    // Setup development dashboard
    this.setupDevelopmentDashboard();

    console.log('\\n✅ Enhanced development environment ready!');
    this.printServiceStatus();
  }

  /**
   * Stop all services and cleanup
   */
  async stop(): Promise<void> {
    console.log('\\n🛑 Stopping development environment...');

    // Stop monitoring
    this.isMonitoring = false;

    // Stop all services
    for (const [name, service] of this.services) {
      console.log(`   Stopping ${name}...`);
      if (service.process.pid) {
        process.kill(service.process.pid, 'SIGTERM');
      }
    }

    // Close WebSocket server
    this.wsServer.close();

    console.log('✅ Development environment stopped');
  }

  /**
   * Generate new component with all files
   */
  async generateComponent(
    name: string,
    type: 'ui' | 'feature' | 'page' | 'layout',
    options: GeneratorOptions = {}
  ): Promise<void> {
    if (!this.config.enableCodeGeneration) {
      throw new Error('Code generation is disabled');
    }

    console.log(`🎨 Generating ${type} component: ${name}`);

    const result = codeGenerator.generateComponent({
      name,
      type,
      ...options,
    });

    const basePath = this.getComponentPath(type);
    const componentDir = join(basePath, name.toLowerCase());

    // Create component files
    const files = [
      { name: `${name.toLowerCase()}.tsx`, content: result.component },
      { name: `${name.toLowerCase()}.test.tsx`, content: result.test },
      { name: `${name.toLowerCase()}.stories.tsx`, content: result.story },
      { name: `${name.toLowerCase()}.types.ts`, content: result.types },
      { name: 'index.ts', content: result.index },
    ];

    for (const file of files) {
      const filePath = join(componentDir, file.name);
      this.ensureDirectoryExists(componentDir);
      writeFileSync(filePath, file.content, 'utf-8');
      console.log(`   Created: ${filePath}`);
    }

    // Update barrel exports
    await this.updateBarrelExports(basePath, name);

    // Run validation on generated code
    if (this.config.enableArchitectureValidation) {
      await this.validateFile(join(componentDir, `${name.toLowerCase()}.tsx`));
    }

    console.log(`✅ Component ${name} generated successfully`);

    // Broadcast to dashboard
    this.broadcastMessage({
      type: 'component-generated',
      component: name,
      path: componentDir,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Generate service with full implementation
   */
  async generateService(
    name: string,
    domain?: string,
    options: GeneratorOptions = {}
  ): Promise<void> {
    if (!this.config.enableCodeGeneration) {
      throw new Error('Code generation is disabled');
    }

    console.log(
      `⚙️ Generating service: ${name}${domain ? ` (${domain} domain)` : ''}`
    );

    const result = codeGenerator.generateService({
      name,
      type: 'service',
      domain,
      ...options,
    });

    const servicePath = domain
      ? join(this.config.projectPath, 'libs/shared/src/services', domain)
      : join(this.config.projectPath, 'libs/shared/src/services');

    const files = [
      { name: `${name.toLowerCase()}.service.ts`, content: result.service },
      { name: `${name.toLowerCase()}.interface.ts`, content: result.interface },
      { name: `${name.toLowerCase()}.test.ts`, content: result.test },
      { name: 'index.ts', content: result.index },
    ];

    this.ensureDirectoryExists(servicePath);

    for (const file of files) {
      const filePath = join(servicePath, file.name);
      writeFileSync(filePath, file.content, 'utf-8');
      console.log(`   Created: ${filePath}`);
    }

    console.log(`✅ Service ${name} generated successfully`);
  }

  /**
   * Run comprehensive project analysis
   */
  async analyzeProject(): Promise<void> {
    console.log('🔍 Running comprehensive project analysis..\\n');

    const results = await Promise.allSettled([
      this.runArchitectureValidation(),
      this.runPerformanceAnalysis(),
      this.analyzeDependencies(),
      this.analyzeCodeQuality(),
    ]);

    const summary = {
      architecture: results[0].status === 'fulfilled' ? 'Passed' : 'Failed',
      performance: results[1].status === 'fulfilled' ? 'Analyzed' : 'Failed',
      dependencies: results[2].status === 'fulfilled' ? 'Checked' : 'Failed',
      codeQuality: results[3].status === 'fulfilled' ? 'Analyzed' : 'Failed',
    };

    console.log('\\n📊 Analysis Summary:');
    Object.entries(summary).forEach(([area, status]) => {
      const icon = status.includes('Failed') ? '❌' : '✅';
      console.log(`   ${icon} ${area}: ${status}`);
    });

    // Broadcast results to dashboard
    this.broadcastMessage({
      type: 'analysis-complete',
      summary,
      timestamp: new Date().toISOString(),
    });
  }

  // Private methods
  private async validateProjectStructure(): Promise<void> {
    const requiredDirectories = [
      'apps/web',
      'apps/api',
      'libs/shared',
      'libs/ui',
      'tooling',
    ];

    console.log('📁 Validating project structure...');

    for (const dir of requiredDirectories) {
      const fullPath = join(this.config.projectPath, dir);
      if (!existsSync(fullPath)) {
        throw new Error(`Required directory missing: ${dir}`);
      }
    }

    console.log('   ✅ Project structure validated');
  }

  private async runArchitectureValidation(): Promise<void> {
    const violations = await this.architectureValidator.validateProject(
      this.config.projectPath
    );

    if (violations.length > 0) {
      console.log(`   ⚠️ Found ${violations.length} architecture violations`);

      // Broadcast violations to dashboard
      this.broadcastMessage({
        type: 'architecture-violations',
        violations,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('   ✅ Architecture validation passed');
    }
  }

  private async runPerformanceAnalysis(): Promise<void> {
    const metrics = await this.performanceMonitor.analyzePerformance();

    console.log(`   📊 Performance analysis complete`);
    console.log(
      `      Bundle size: ${this.formatBytes(metrics.bundleSize.total)}`
    );
    console.log(`      Build time: ${metrics.buildTime.total}ms`);

    // Broadcast metrics to dashboard
    this.broadcastMessage({
      type: 'performance-metrics',
      metrics,
      timestamp: new Date().toISOString(),
    });
  }

  private async analyzeDependencies(): Promise<void> {
    try {
      // Run npm audit
      const auditResult = execSync('npm audit --json', {
        cwd: this.config.projectPath,
        encoding: 'utf-8',
      });

      const audit = JSON.parse(auditResult);
      const vulnerabilities =
        (audit.metadata?.vulnerabilities?.total as number) || 0;
      console.log(`   🔒 Security audit: ${vulnerabilities} vulnerabilities`);

      // Check for outdated packages
      try {
        const outdatedResult = execSync('npm outdated --json', {
          cwd: this.config.projectPath,
          encoding: 'utf-8',
        });

        const outdated = Object.keys(JSON.parse(outdatedResult)).length;
        console.log(`   📦 Outdated packages: ${outdated}`);
      } catch {
        console.log('   📦 Outdated packages: 0');
      }
    } catch (error) {
      console.log('   ⚠️ Dependency analysis failed');
    }
  }

  private async analyzeCodeQuality(): Promise<void> {
    try {
      // Run ESLint
      execSync('npx eslint . --format json --output-file eslint-report.json', {
        cwd: this.config.projectPath,
      });

      const eslintReport = JSON.parse(
        readFileSync(
          join(this.config.projectPath, 'eslint-report.json'),
          'utf-8'
        )
      );

      interface ESLintResult {
        errorCount: number;
        warningCount: number;
      }

      const totalIssues = eslintReport.reduce(
        (sum: number, file: ESLintResult) =>
          sum + file.errorCount + file.warningCount,
        0
      );

      console.log(`   🔍 ESLint: ${totalIssues} issues found`);
    } catch (error) {
      console.log('   ⚠️ Code quality analysis failed');
    }
  }

  private setupAdvancedFileWatchers(): void {
    console.log('👀 Setting up file watchers...');

    // Watch for TypeScript/TSX changes
    chokidar
      .watch('**/*.{ts,tsx}', {
        cwd: this.config.projectPath,
        ignored: ['node_modules/**', '.next/**', 'dist/**'],
      })
      .on('change', async filePath => {
        console.log(`📝 File changed: ${filePath}`);

        if (this.config.validationOnSave) {
          await this.validateFile(join(this.config.projectPath, filePath));
        }

        // Broadcast file change
        this.broadcastMessage({
          type: 'file-changed',
          file: filePath,
          timestamp: new Date().toISOString(),
        });
      });

    // Watch for configuration changes
    chokidar
      .watch(['package.json', 'tsconfig.json', 'next.config.js'], {
        cwd: this.config.projectPath,
      })
      .on('change', filePath => {
        console.log(`⚙️ Configuration changed: ${filePath}`);

        this.broadcastMessage({
          type: 'config-changed',
          file: filePath,
          timestamp: new Date().toISOString(),
        });
      });

    console.log('   ✅ File watchers active');
  }

  private async startAllServices(): Promise<void> {
    const serviceConfigs: ServiceConfig[] = [
      {
        name: 'web',
        command: 'npm run dev',
        cwd: 'apps/web',
        port: 3000,
        healthCheck: 'http://localhost:3000/api/health',
      },
      {
        name: 'api',
        command: 'npm run dev',
        cwd: 'apps/api',
        port: 3001,
        healthCheck: 'http://localhost:3001/health',
      },
      {
        name: 'mcp-server',
        command: 'npm run dev',
        cwd: 'apps/mcp-server',
        port: 3002,
        dependencies: ['api'],
      },
    ];

    console.log('🔄 Starting services...');

    for (const config of serviceConfigs) {
      await this.startService(config);
    }

    // Start health monitoring
    this.startHealthMonitoring(serviceConfigs);
  }

  private async startService(config: ServiceConfig): Promise<void> {
    return new Promise(resolve => {
      console.log(`   Starting ${config.name}...`);

      const fullCwd = join(this.config.projectPath, config.cwd);
      const [command, ...args] = config.command.split(' ');

      const process = spawn(command, args, {
        cwd: fullCwd,
        stdio: 'pipe',
        shell: true,
      });

      process.stdout?.on('data', data => {
        const output = data.toString().trim();
        console.log(`[${config.name}] ${output}`);

        this.broadcastMessage({
          type: 'service-log',
          service: config.name,
          message: output,
          level: 'info',
          timestamp: new Date().toISOString(),
        });
      });

      process.stderr?.on('data', data => {
        const output = data.toString().trim();
        console.error(`[${config.name}] ${output}`);

        this.broadcastMessage({
          type: 'service-log',
          service: config.name,
          message: output,
          level: 'error',
          timestamp: new Date().toISOString(),
        });
      });

      process.on('close', code => {
        console.log(`[${config.name}] Process exited with code ${code}`);
        this.services.delete(config.name);
      });

      this.services.set(config.name, { process, config });

      // Wait for service to start
      setTimeout(() => resolve(), 3000);
    });
  }

  private startPerformanceMonitoring(): void {
    console.log('📊 Starting performance monitoring...');

    this.isMonitoring = true;

    const monitor = async () => {
      if (!this.isMonitoring) return;

      try {
        const metrics = await this.performanceMonitor.analyzePerformance();

        // Check thresholds
        const violations: string[] = [];

        if (
          metrics.bundleSize.total >
          this.config.performanceThresholds.bundleSize
        ) {
          violations.push('Bundle size exceeds threshold');
        }

        if (
          metrics.buildTime.total > this.config.performanceThresholds.buildTime
        ) {
          violations.push('Build time exceeds threshold');
        }

        if (violations.length > 0) {
          this.broadcastMessage({
            type: 'performance-alert',
            violations,
            metrics,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.log('Performance monitoring error:', error);
      }

      // Schedule next check
      setTimeout(monitor, this.config.monitoringInterval);
    };

    monitor();
    console.log('   ✅ Performance monitoring active');
  }

  private startHealthMonitoring(configs: ServiceConfig[]): void {
    setInterval(async () => {
      for (const config of configs) {
        if (config.healthCheck) {
          try {
            const response = await fetch(config.healthCheck, {
              signal: AbortSignal.timeout(5000),
            });
            const isHealthy = response.ok;

            this.broadcastMessage({
              type: 'service-health',
              service: config.name,
              healthy: isHealthy,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            this.broadcastMessage({
              type: 'service-health',
              service: config.name,
              healthy: false,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    }, 30000); // Every 30 seconds
  }

  private setupWebSocket(): void {
    this.wsServer.on('connection', ws => {
      console.log('📡 Dashboard connected');

      // Send initial status
      ws.send(
        JSON.stringify({
          type: 'connected',
          message: 'SkyScout AI Enhanced Development Dashboard',
          config: this.config,
          timestamp: new Date().toISOString(),
        })
      );

      ws.on('message', data => {
        try {
          const message = JSON.parse(data.toString());
          this.handleDashboardMessage(message, ws);
        } catch (error) {
          console.log('WebSocket message error:', error);
        }
      });
    });
  }

  private setupDevelopmentDashboard(): void {
    console.log(
      '\\n🎛️ Development Dashboard available at: http://localhost:3099'
    );
    console.log('   Features:');
    console.log('   • Live service monitoring');
    console.log('   • Performance metrics');
    console.log('   • Architecture validation');
    console.log('   • Code generation tools');
    console.log('   • File change tracking');
  }

  private async handleDashboardMessage(
    message: DashboardMessage,
    ws: WebSocket
  ): Promise<void> {
    switch (message.type) {
      case 'generate-component':
        if (message.name && message.componentType) {
          await this.generateComponent(
            message.name,
            message.componentType as 'ui' | 'feature' | 'page' | 'layout',
            message.options || {}
          );
        }
        break;

      case 'run-analysis':
        await this.analyzeProject();
        break;

      case 'validate-architecture':
        await this.runArchitectureValidation();
        break;

      case 'get-service-status':
        this.sendServiceStatus(ws);
        break;
    }
  }

  private async validateFile(filePath: string): Promise<void> {
    try {
      const violations = await this.architectureValidator.validateProject(
        this.config.projectPath
      );
      const fileViolations = violations.filter(v => v.file.includes(filePath));

      if (fileViolations.length > 0) {
        this.broadcastMessage({
          type: 'file-validation',
          file: filePath,
          violations: fileViolations,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.log(`Validation error for ${filePath}:`, error);
    }
  }

  private broadcastMessage(message: Record<string, unknown>): void {
    this.wsServer.clients?.forEach(client => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify(message));
      }
    });
  }

  private sendServiceStatus(ws: WebSocket): void {
    const status = Array.from(this.services.entries()).map(
      ([name, service]) => ({
        name,
        port: service.config.port,
        status: 'running',
        pid: service.process.pid,
      })
    );

    ws.send(
      JSON.stringify({
        type: 'service-status',
        services: status,
        timestamp: new Date().toISOString(),
      })
    );
  }

  private printServiceStatus(): void {
    console.log('\\n🌐 Services Status:');
    for (const [name, service] of this.services) {
      console.log(`   • ${name}: http://localhost:${service.config.port}`);
    }
    console.log('   • Dashboard: http://localhost:3099');
  }

  private getComponentPath(type: string): string {
    const paths = {
      ui: join(this.config.projectPath, 'libs/ui/src/components'),
      feature: join(this.config.projectPath, 'apps/web/app/components'),
      page: join(this.config.projectPath, 'apps/web/app'),
      layout: join(this.config.projectPath, 'apps/web/app/components/layout'),
    };

    return paths[type as keyof typeof paths] || paths.feature;
  }

  private ensureDirectoryExists(dir: string): void {
    mkdirSync(dir, { recursive: true });
  }

  private async updateBarrelExports(
    basePath: string,
    componentName: string
  ): Promise<void> {
    const indexPath = join(basePath, 'index.ts');
    const exportLine = `export { ${componentName} } from './${componentName.toLowerCase()}';\\n`;

    try {
      let content = '';
      if (existsSync(indexPath)) {
        content = readFileSync(indexPath, 'utf-8');
      }

      if (!content.includes(exportLine.trim())) {
        writeFileSync(indexPath, content + exportLine, 'utf-8');
      }
    } catch (error) {
      console.log('Failed to update barrel exports:', error);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

// Export for CLI usage
export const startEnhancedDev = (config?: Partial<DevToolingConfig>) => {
  const devTooling = new EnhancedDevTooling(config);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await devTooling.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await devTooling.stop();
    process.exit(0);
  });

  return devTooling.start();
};
