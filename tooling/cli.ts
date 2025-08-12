#!/usr/bin/env node

import { program } from 'commander';
import { mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fixImportsInProject } from './automation/import-fixer';
import {

  PerformanceMetrics,
  PerformanceMonitor,
} from './automation/performance-monitor';
import {
  GitHookInstaller,
  PreCommitHooks,
} from './automation/pre-commit-hooks';
import { codeGenerator } from './generators/advanced-templates';
import { startEnhancedDev } from './setup-enhanced-tooling';
import { ArchitectureValidator } from './validators/architecture-rules';

// Determine project root - go up one level from tooling directory
const PROJECT_ROOT = resolve(__dirname, '../');

// CLI Commands for SkyScout AI Development Tooling
program
  .name('skyscout-tooling')
  .description('SkyScout AI Enhanced Development Tooling CLI')
  .version('1.0.0');

// Start enhanced development environment
program
  .command('start')
  .description('Start the enhanced development environment with all services')
  .option('-p, --project-path <path>', 'Project root path', process.cwd())
  .option('--no-validation', 'Disable architecture validation')
  .option('--no-performance', 'Disable performance monitoring')
  .option('--no-hot-reload', 'Disable hot reload')
  .option('--no-code-gen', 'Disable code generation')
  .action(async options => {
    try {
      const config = {
        projectPath: options.projectPath,
        enableArchitectureValidation: options.validation,
        enablePerformanceMonitoring: options.performance,
        enableHotReload: options.hotReload,
        enableCodeGeneration: options.codeGen,
      };

      console.log(
        '🚀 Starting SkyScout AI Enhanced Development Environment...\n'
      );
      await startEnhancedDev(config);
    } catch (error) {
      console.error('❌ Failed to start development environment:', error);
      process.exit(1);
    }
  });

// Architecture validation command
program
  .command('validate')
  .description('Run architecture validation on the project')
  .option('-p, --project-path <path>', 'Project root path', PROJECT_ROOT)
  .option('-f, --fix', 'Attempt to auto-fix violations where possible')
  .action(async options => {
    try {
      console.log('🏗️ Running architecture validation...\n');
      console.log(`📁 Project root: ${options.projectPath}\n`);

      const validator = new ArchitectureValidator();
      const violations = await validator.validateProject(options.projectPath);

      if (violations.length === 0) {
        console.log('✅ Architecture validation passed - no violations found!');
        return;
      }

      console.log(`⚠️ Found ${violations.length} architecture violations:\n`);

      violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.rule}`);
        console.log(`   File: ${violation.file}`);
        console.log(`   Issue: ${violation.message}`);
        if (violation.suggestion) {
          console.log(`   💡 Suggestion: ${violation.suggestion}`);
        }
        console.log('');
      });

      // Group violations by severity
      const errors = violations.filter(v => v.severity === 'error');
      const warnings = violations.filter(v => v.severity === 'warning');

      console.log('📊 Summary:');
      console.log(`   ❌ Errors: ${errors.length}`);
      console.log(`   ⚠️ Warnings: ${warnings.length}`);

      if (errors.length > 0) {
        console.log('\n❌ Architecture validation failed due to errors');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  });

// Performance analysis command
program
  .command('analyze')
  .description('Run comprehensive performance analysis')
  .option('-p, --project-path <path>', 'Project root path', process.cwd())
  .option('-o, --output <file>', 'Output results to file')
  .action(async options => {
    try {
      console.log('📊 Running performance analysis...\n');

      const monitor = new PerformanceMonitor(options.projectPath);
      const metrics = await monitor.analyzePerformance();

      console.log('🎯 Performance Metrics:');
      console.log(`   Bundle Size: ${formatBytes(metrics.bundleSize.total)}`);
      console.log(`   Build Time: ${metrics.buildTime.total}ms`);
      console.log(`   Dependencies: ${metrics.dependencies.total}`);

      if (metrics.lighthouse) {
        console.log('   Lighthouse Scores:');
        console.log(`     Performance: ${metrics.lighthouse.performance}`);
        console.log(`     Accessibility: ${metrics.lighthouse.accessibility}`);
        console.log(`     Best Practices: ${metrics.lighthouse.bestPractices}`);
        console.log(`     SEO: ${metrics.lighthouse.seo}`);
      }

      // Bundle size breakdown
      if (metrics.bundleSize.chunks.length > 0) {
        console.log('\n📦 Largest Chunks:');
        metrics.bundleSize.chunks
          .sort((a, b) => b.size - a.size)
          .slice(0, 5)
          .forEach(chunk => {
            console.log(`   ${chunk.name}: ${formatBytes(chunk.size)}`);
          });
      }

      // Optimization suggestions
      const suggestions = generateOptimizationSuggestions(metrics);
      if (suggestions.length > 0) {
        console.log('\n💡 Optimization Suggestions:');
        suggestions.forEach(suggestion => {
          console.log(`   • ${suggestion}`);
        });
      }

      // Save to file if requested
      if (options.output) {
        writeFileSync(options.output, JSON.stringify(metrics, null, 2));
        console.log(`\n💾 Results saved to ${options.output}`);
      }

      console.log('\n✅ Performance analysis complete');
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    }
  });

// Code generation commands
const generateCmd = program
  .command('generate')
  .alias('g')
  .description('Generate code using templates');

generateCmd
  .command('component <name>')
  .description('Generate a new component')
  .option(
    '-t, --type <type>',
    'Component type (ui|feature|page|layout)',
    'feature'
  )
  .option('-d, --directory <dir>', 'Output directory')
  .option('--props <props>', 'Component props (comma-separated)')
  .option('--story', 'Generate Storybook story')
  .option('--test', 'Generate test file')
  .action(async (name, options) => {
    try {
      console.log(`🎨 Generating ${options.type} component: ${name}`);

      const props = options.props
        ? options.props.split(',').map((p: string) => p.trim())
        : [];

      const result = codeGenerator.generateComponent({
        name,
        type: options.type as 'ui' | 'feature' | 'page' | 'layout',
        props: props.join(','),
      });

      // Write files
      const basePath =
        options.directory || getDefaultComponentPath(options.type);
      const componentDir = join(basePath, name.toLowerCase());

      const files = [
        { name: `${name.toLowerCase()}.tsx`, content: result.component },
        { name: `${name.toLowerCase()}.types.ts`, content: result.types },
        { name: 'index.ts', content: result.index },
      ];

      if (result.test) {
        files.push({
          name: `${name.toLowerCase()}.test.tsx`,
          content: result.test,
        });
      }

      if (result.story) {
        files.push({
          name: `${name.toLowerCase()}.stories.tsx`,
          content: result.story,
        });
      }

      // Create files
      mkdirSync(componentDir, { recursive: true });

      for (const file of files) {
        const filePath = join(componentDir, file.name);
        writeFileSync(filePath, file.content, 'utf-8');
        console.log(`   Created: ${filePath}`);
      }

      console.log(`✅ Component ${name} generated successfully`);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  });

generateCmd
  .command('service <name>')
  .description('Generate a new service')
  .option('-d, --domain <domain>', 'Domain/module name')
  .option('--interface', 'Generate interface file')
  .option('--test', 'Generate test file')
  .action(async (name, options) => {
    try {
      console.log(
        `⚙️ Generating service: ${name}${options.domain ? ` (${options.domain} domain)` : ''}`
      );

      const result = codeGenerator.generateService({
        name,
        type: 'service',
        domain: options.domain,
      });

      // Write files
      const servicePath = options.domain
        ? join(process.cwd(), 'libs/shared/src/services', options.domain)
        : join(process.cwd(), 'libs/shared/src/services');

      const files = [
        { name: `${name.toLowerCase()}.service.ts`, content: result.service },
        { name: 'index.ts', content: result.index },
      ];

      if (result.interface) {
        files.push({
          name: `${name.toLowerCase()}.interface.ts`,
          content: result.interface,
        });
      }

      if (result.test) {
        files.push({
          name: `${name.toLowerCase()}.test.ts`,
          content: result.test,
        });
      }

      // Create files
      mkdirSync(servicePath, { recursive: true });

      for (const file of files) {
        const filePath = join(servicePath, file.name);
        writeFileSync(filePath, file.content, 'utf-8');
        console.log(`   Created: ${filePath}`);
      }

      console.log(`✅ Service ${name} generated successfully`);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  });

generateCmd
  .command('hook <name>')
  .description('Generate a new custom hook')
  .option('-d, --directory <dir>', 'Output directory')
  .option('--test', 'Generate test file')
  .action(async (name, options) => {
    try {
      console.log(`🪝 Generating hook: ${name}`);

      const result = codeGenerator.generateHook({
        name,
        type: 'hook',
      });

      // Write files
      const hookPath =
        options.directory || join(process.cwd(), 'libs/shared/src/hooks');

      const files = [
        { name: `${name.toLowerCase()}.ts`, content: result.hook },
        { name: 'index.ts', content: result.index },
      ];

      if (result.test) {
        files.push({
          name: `${name.toLowerCase()}.test.ts`,
          content: result.test,
        });
      }

      // Create files
      mkdirSync(hookPath, { recursive: true });

      for (const file of files) {
        const filePath = join(hookPath, file.name);
        writeFileSync(filePath, file.content, 'utf-8');
        console.log(`   Created: ${filePath}`);
      }

      console.log(`✅ Hook ${name} generated successfully`);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  });

// Pre-commit hooks management
program
  .command('hooks')
  .description('Manage pre-commit hooks')
  .action(() => {
    program.outputHelp();
  });

program
  .command('hooks:install')
  .description('Install pre-commit hooks')
  .action(() => {
    try {
      console.log('🔧 Installing pre-commit hooks...');
      GitHookInstaller.install();
      console.log('✅ Pre-commit hooks installed successfully!');
      console.log('   Run "git commit" to test the hooks');
    } catch (error) {
      console.error('❌ Failed to install pre-commit hooks:', error);
      process.exit(1);
    }
  });

program
  .command('hooks:uninstall')
  .description('Uninstall pre-commit hooks')
  .action(() => {
    try {
      console.log('🔧 Uninstalling pre-commit hooks...');
      GitHookInstaller.uninstall();
      console.log('✅ Pre-commit hooks uninstalled successfully!');
    } catch (error) {
      console.error('❌ Failed to uninstall pre-commit hooks:', error);
      process.exit(1);
    }
  });

program
  .command('hooks:test')
  .description('Test pre-commit hooks without committing')
  .action(async () => {
    try {
      console.log('🧪 Testing pre-commit hooks...');
      const hooks = new PreCommitHooks({
        enabledChecks: {
          linting: true,
          formatting: true,
          typeChecking: true,
          testing: false, // Skip tests for faster feedback
          architectureValidation: true,
          performanceCheck: false,
        },
        failFast: false,
        autoFix: true,
      });

      const success = await hooks.runAllChecks();

      if (success) {
        console.log('🎉 All pre-commit checks passed!');
      } else {
        console.log('💥 Some pre-commit checks failed');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Pre-commit test failed:', error);
      process.exit(1);
    }
  });

// Utility functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function generateOptimizationSuggestions(
  metrics: PerformanceMetrics
): string[] {
  const suggestions: string[] = [];

  if (metrics.bundleSize.total > 250 * 1024) {
    suggestions.push('Consider code splitting to reduce bundle size');
  }

  if (metrics.buildTime.total > 60000) {
    suggestions.push(
      'Build time is high - consider optimizing webpack configuration'
    );
  }

  if (metrics.dependencies.outdated.length > 0) {
    suggestions.push(
      `Update ${metrics.dependencies.outdated.length} outdated dependencies`
    );
  }

  if (metrics.lighthouse && metrics.lighthouse.performance < 90) {
    suggestions.push(
      'Improve performance score with image optimization and lazy loading'
    );
  }

  return suggestions;
}

function getDefaultComponentPath(type: string): string {
  const paths = {
    ui: join(process.cwd(), 'libs/ui/src/components'),
    feature: join(process.cwd(), 'apps/web/app/components'),
    page: join(process.cwd(), 'apps/web/app'),
    layout: join(process.cwd(), 'apps/web/app/components/layout'),
  };

  return paths[type as keyof typeof paths] || paths.feature;
}

// Automation Commands for Quality Fixes
program
  .command('fix-imports')
  .description(
    'Automatically fix import organization issues across the project'
  )
  .option('-p, --path <path>', 'Project path', PROJECT_ROOT)
  .action(async options => {
    const { fixImportsInProject } = await import(
      './automation/import-fixer.js'
    );
    console.log('🔧 Starting import organization fixes...\n');
    await fixImportsInProject(options.path);
  });

program
  .command('analyze-complexity')
  .description(
    'Analyze component complexity and suggest refactoring strategies'
  )
  .action(async () => {
    const { analyzeComplexComponents } = await import(
      './automation/complexity-analyzer.js'
    );
    console.log('🔍 Analyzing component complexity...\n');
    await analyzeComplexComponents();
  });

program
  .command('auto-fix')
  .description('Run automated fixes for common code quality issues')
  .action(async () => {
    console.log('🔧 Running comprehensive auto-fix...\n');

    console.log('1. Fixing import organization...');
    await fixImportsInProject(process.cwd());

    console.log('\n2. Re-running architecture validation...');
    const validator = new ArchitectureValidator();
    const violations = await validator.validateProject(process.cwd());

    console.log(
      `\n📊 Validation Results: ${violations.length} violations found`
    );
    if (violations.length === 0) {
      console.log('✅ All quality checks passed!');
    } else {
      console.log(
        '🔄 Some issues remain - consider manual refactoring for complex violations'
      );

      // Show breakdown of remaining issues
      const solidViolations = violations.filter(v => v.rule.includes('SOLID'));
      const importViolations = violations.filter(v =>
        v.rule.includes('Import')
      );
      const namingViolations = violations.filter(v =>
        v.rule.includes('Naming')
      );

      console.log(`\n📈 Remaining Issues:`);
      console.log(`  • SOLID Principles: ${solidViolations.length} violations`);
      console.log(
        `  • Import Organization: ${importViolations.length} violations`
      );
      console.log(
        `  • Naming Conventions: ${namingViolations.length} violations`
      );
    }
  });

// Parse command line arguments
program.parse();
