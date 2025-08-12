/**
 * Pre-commit Hooks Automation
 * Ensures code quality before commits
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface PreCommitConfig {
  enabledChecks: {
    linting: boolean;
    formatting: boolean;
    typeChecking: boolean;
    testing: boolean;
    architectureValidation: boolean;
    performanceCheck: boolean;
  };
  failFast: boolean;
  autoFix: boolean;
}

export class PreCommitHooks {
  constructor(private config: PreCommitConfig) {}

  async runAllChecks(): Promise<boolean> {
    console.log('🔍 Running pre-commit checks...\n');

    const checks = [
      {
        name: 'Linting',
        enabled: this.config.enabledChecks.linting,
        fn: this.runLinting,
      },
      {
        name: 'Formatting',
        enabled: this.config.enabledChecks.formatting,
        fn: this.runFormatting,
      },
      {
        name: 'Type Checking',
        enabled: this.config.enabledChecks.typeChecking,
        fn: this.runTypeChecking,
      },
      {
        name: 'Testing',
        enabled: this.config.enabledChecks.testing,
        fn: this.runTests,
      },
      {
        name: 'Architecture Validation',
        enabled: this.config.enabledChecks.architectureValidation,
        fn: this.runArchitectureValidation,
      },
      {
        name: 'Performance Check',
        enabled: this.config.enabledChecks.performanceCheck,
        fn: this.runPerformanceCheck,
      },
    ];

    const results: Array<{ name: string; success: boolean; error?: string }> =
      [];

    for (const check of checks) {
      if (!check.enabled) continue;

      console.log(`Running ${check.name}...`);

      try {
        const success = await check.fn.call(this);
        results.push({ name: check.name, success });

        if (success) {
          console.log(`✅ ${check.name} passed`);
        } else {
          console.log(`❌ ${check.name} failed`);
          if (this.config.failFast) break;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        results.push({ name: check.name, success: false, error: errorMessage });
        console.log(`❌ ${check.name} failed: ${errorMessage}`);

        if (this.config.failFast) break;
      }
    }

    const allPassed = results.every(result => result.success);

    if (allPassed) {
      console.log('\n🎉 All pre-commit checks passed!');
    } else {
      console.log('\n💥 Some pre-commit checks failed:');
      results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`  - ${result.name}: ${result.error || 'Check failed'}`);
        });
    }

    return allPassed;
  }

  private async runLinting(): Promise<boolean> {
    try {
      execSync('npm run lint', { stdio: 'inherit' });
      return true;
    } catch (error) {
      if (this.config.autoFix) {
        try {
          execSync('npm run lint:fix', { stdio: 'inherit' });
          console.log('🔧 Auto-fixed linting issues');
          return true;
        } catch (fixError) {
          return false;
        }
      }
      return false;
    }
  }

  private async runFormatting(): Promise<boolean> {
    try {
      execSync('npm run format:check', { stdio: 'inherit' });
      return true;
    } catch (error) {
      if (this.config.autoFix) {
        try {
          execSync('npm run format', { stdio: 'inherit' });
          console.log('🔧 Auto-formatted code');
          return true;
        } catch (fixError) {
          return false;
        }
      }
      return false;
    }
  }

  private async runTypeChecking(): Promise<boolean> {
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  private async runTests(): Promise<boolean> {
    try {
      execSync('npm run test:staged', { stdio: 'inherit' });
      return true;
    } catch (error) {
      return false;
    }
  }

  private async runArchitectureValidation(): Promise<boolean> {
    try {
      // Use our enhanced tooling CLI for architecture validation
      execSync('npx tsx cli.ts validate', {
        stdio: 'inherit',
        cwd: join(process.cwd(), 'tooling'),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private async runPerformanceCheck(): Promise<boolean> {
    try {
      // Use our enhanced tooling CLI for performance analysis
      execSync('npx tsx cli.ts analyze', {
        stdio: 'inherit',
        cwd: join(process.cwd(), 'tooling'),
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Git hook installer
export class GitHookInstaller {
  static install(): void {
    const hookContent = `#!/bin/sh
# SkyScout AI Pre-commit Hook
# Auto-generated - do not edit manually

cd tooling
node -r tsx/cjs cli.ts hooks:test
`;

    // Find the git root directory
    const gitRoot = GitHookInstaller.findGitRoot();
    const hookPath = join(gitRoot, '.git/hooks/pre-commit');

    try {
      writeFileSync(hookPath, hookContent, { mode: 0o755 });
      console.log('✅ Pre-commit hook installed successfully');
      console.log(`   Hook location: ${hookPath}`);
    } catch (error) {
      console.error('❌ Failed to install pre-commit hook:', error);
    }
  }

  static uninstall(): void {
    const gitRoot = GitHookInstaller.findGitRoot();
    const hookPath = join(gitRoot, '.git/hooks/pre-commit');

    try {
      if (existsSync(hookPath)) {
        unlinkSync(hookPath);
        console.log('✅ Pre-commit hook uninstalled successfully');
      } else {
        console.log('ℹ️ No pre-commit hook found');
      }
    } catch (error) {
      console.error('❌ Failed to uninstall pre-commit hook:', error);
    }
  }

  private static findGitRoot(): string {
    let currentDir = process.cwd();

    // If we're in tooling directory, go up one level
    if (currentDir.endsWith('tooling')) {
      currentDir = join(currentDir, '..');
    }

    // Look for .git directory
    while (
      currentDir !== '/' &&
      currentDir !== '' &&
      !currentDir.match(/^[A-Z]:\\?$/)
    ) {
      if (existsSync(join(currentDir, '.git'))) {
        return currentDir;
      }
      currentDir = join(currentDir, '..');
    }

    return process.cwd(); // Fallback to current directory
  }
}

// Staged files analyzer
export class StagedFilesAnalyzer {
  static getStagedFiles(): string[] {
    try {
      const output = execSync('git diff --cached --name-only', {
        encoding: 'utf8',
      });
      return output.trim().split('\n').filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  static getStagedTypeScriptFiles(): string[] {
    return this.getStagedFiles().filter(
      file => file.endsWith('.ts') || file.endsWith('.tsx')
    );
  }

  static getStagedComponentFiles(): string[] {
    return this.getStagedFiles().filter(
      file =>
        file.includes('/components/') &&
        (file.endsWith('.tsx') || file.endsWith('.ts'))
    );
  }

  static hasArchitecturalChanges(): boolean {
    const stagedFiles = this.getStagedFiles();
    return stagedFiles.some(
      file =>
        file.includes('apps/') ||
        file.includes('libs/') ||
        file.includes('tooling/patterns/') ||
        file.includes('package.json') ||
        file.includes('tsconfig')
    );
  }
}

// Quality gates
export class QualityGates {
  static async validateCommitMessage(message: string): Promise<boolean> {
    // Conventional commit format: type(scope): description
    const conventionalCommitRegex =
      /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: .{1,72}$/;

    if (!conventionalCommitRegex.test(message)) {
      console.log(
        '❌ Commit message does not follow conventional commit format'
      );
      console.log('Expected format: type(scope): description');
      console.log(
        'Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build'
      );
      return false;
    }

    return true;
  }

  static async validateBranchName(branch: string): Promise<boolean> {
    // Branch naming: feature/description, fix/description, etc.
    const branchNameRegex = /^(feature|fix|hotfix|release|chore)\/[a-z0-9-]+$/;

    if (
      !branchNameRegex.test(branch) &&
      !['main', 'develop'].includes(branch)
    ) {
      console.log('❌ Branch name does not follow naming convention');
      console.log(
        'Expected format: type/description (e.g., feature/user-authentication)'
      );
      return false;
    }

    return true;
  }

  static async validateCodeCoverage(): Promise<boolean> {
    try {
      const coverageData = readFileSync(
        'coverage/coverage-summary.json',
        'utf8'
      );
      const coverage = JSON.parse(coverageData);

      const totalCoverage = coverage.total.lines.pct;
      const minimumCoverage = 80;

      if (totalCoverage < minimumCoverage) {
        console.log(
          `❌ Code coverage ${totalCoverage}% is below minimum ${minimumCoverage}%`
        );
        return false;
      }

      console.log(`✅ Code coverage: ${totalCoverage}%`);
      return true;
    } catch (error) {
      console.log('⚠️ Could not verify code coverage');
      return true; // Don't fail if coverage data is not available
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'install':
      GitHookInstaller.install();
      break;
    case 'uninstall':
      GitHookInstaller.uninstall();
      break;
    case 'run': {
      const hooks = new PreCommitHooks({
        enabledChecks: {
          linting: true,
          formatting: true,
          typeChecking: true,
          testing: true,
          architectureValidation: true,
          performanceCheck: false,
        },
        failFast: false,
        autoFix: true,
      });

      hooks
        .runAllChecks()
        .then(success => {
          process.exit(success ? 0 : 1);
        })
        .catch(error => {
          console.error('Pre-commit checks failed:', error);
          process.exit(1);
        });
      break;
    }
    default:
      console.log('Usage: node pre-commit-hooks.js [install|uninstall|run]');
  }
}
