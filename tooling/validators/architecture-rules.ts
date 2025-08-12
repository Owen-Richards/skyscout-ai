/**
 * Architecture Rules Validator
 * Enforces clean architecture boundaries and SOLID principles
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface ArchitectureRule {
  name: string;
  description: string;
  validator: (projectPath: string) => Promise<ArchitectureViolation[]>;
}

interface ArchitectureViolation {
  rule: string;
  severity: 'error' | 'warning';
  file: string;
  message: string;
  line?: number;
  suggestion?: string;
}

interface LayerConfig {
  name: string;
  path: string;
  allowedDependencies: string[];
  forbiddenDependencies: string[];
}

export class ArchitectureValidator {
  private layers: LayerConfig[] = [
    {
      name: 'presentation',
      path: 'apps/web/app/components',
      allowedDependencies: [
        '@skyscout/ui',
        '@skyscout/shared',
        'react',
        'next',
      ],
      forbiddenDependencies: ['database', 'prisma', 'node_modules/fs'],
    },
    {
      name: 'application',
      path: 'apps/web/app/lib',
      allowedDependencies: ['@skyscout/shared', '@skyscout/trpc'],
      forbiddenDependencies: ['react', 'next/client'],
    },
    {
      name: 'domain',
      path: 'libs/shared/src',
      allowedDependencies: [],
      forbiddenDependencies: ['react', 'next', '@prisma/client'],
    },
    {
      name: 'infrastructure',
      path: 'apps/api/src',
      allowedDependencies: ['@skyscout/shared', '@prisma/client'],
      forbiddenDependencies: ['react', 'next'],
    },
  ];

  private rules: ArchitectureRule[] = [
    {
      name: 'dependency-direction',
      description: 'Ensure dependencies flow from outer to inner layers',
      validator: this.validateDependencyDirection.bind(this),
    },
    {
      name: 'circular-dependencies',
      description: 'Detect circular dependencies between modules',
      validator: this.validateCircularDependencies.bind(this),
    },
    {
      name: 'solid-principles',
      description: 'Validate SOLID principles compliance',
      validator: this.validateSOLIDPrinciples.bind(this),
    },
    {
      name: 'clean-imports',
      description: 'Ensure clean import organization',
      validator: this.validateImportOrganization.bind(this),
    },
    {
      name: 'naming-conventions',
      description: 'Validate consistent naming conventions',
      validator: this.validateNamingConventions.bind(this),
    },
  ];

  async validateProject(projectPath: string): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];

    console.log('🏗️ Validating architecture rules...');
    console.log(`📁 Project path: ${projectPath}`);
    console.log(`📁 Absolute path: ${join(projectPath)}\n`);

    for (const rule of this.rules) {
      try {
        console.log(`   Checking: ${rule.description}`);
        const ruleViolations = await rule.validator(projectPath);
        violations.push(...ruleViolations);

        if (ruleViolations.length === 0) {
          console.log(`   ✅ ${rule.name}: Passed`);
        } else {
          console.log(
            `   ❌ ${rule.name}: ${ruleViolations.length} violations`
          );
        }
      } catch (error) {
        console.log(
          `   💥 ${rule.name}: Rule validation failed - ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        violations.push({
          rule: rule.name,
          severity: 'error',
          file: 'unknown',
          message: `Rule validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    return violations;
  }

  private async validateDependencyDirection(
    projectPath: string
  ): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];

    console.log(`     Checking layers in project: ${projectPath}`);

    for (const layer of this.layers) {
      const layerPath = join(projectPath, layer.path);
      console.log(`     Layer '${layer.name}' at: ${layerPath}`);

      if (!this.pathExists(layerPath)) {
        console.log(`     ⚠️ Layer path does not exist: ${layerPath}`);
        continue;
      }

      console.log(`     ✅ Layer path exists, checking files...`);
      const files = this.getAllTSFiles(layerPath);
      console.log(`     Found ${files.length} TypeScript files`);

      for (const file of files) {
        const imports = this.extractImports(file);

        for (const importPath of imports) {
          // Check forbidden dependencies
          const hasForbiddenDep = layer.forbiddenDependencies.some(dep =>
            importPath.includes(dep)
          );

          if (hasForbiddenDep) {
            violations.push({
              rule: 'dependency-direction',
              severity: 'error',
              file: relative(projectPath, file),
              message: `Layer '${layer.name}' cannot depend on '${importPath}'`,
              suggestion: `Consider moving this dependency to an allowed layer or using dependency injection`,
            });
          }
        }
      }
    }

    return violations;
  }

  private async validateCircularDependencies(
    projectPath: string
  ): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];
    const dependencyGraph = new Map<string, Set<string>>();

    // Build dependency graph
    const allFiles = this.getAllTSFiles(projectPath);

    for (const file of allFiles) {
      const imports = this.extractImports(file);
      const relativePath = relative(projectPath, file);

      if (!dependencyGraph.has(relativePath)) {
        dependencyGraph.set(relativePath, new Set());
      }

      for (const importPath of imports) {
        if (importPath.startsWith('.')) {
          // Resolve relative imports
          const resolvedPath = this.resolveRelativeImport(
            file,
            importPath,
            projectPath
          );
          if (resolvedPath) {
            dependencyGraph.get(relativePath)?.add(resolvedPath);
          }
        }
      }
    }

    // Detect cycles using DFS
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (node: string, path: string[] = []): boolean => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart).concat(node);

        violations.push({
          rule: 'circular-dependencies',
          severity: 'error',
          file: node,
          message: `Circular dependency detected: ${cycle.join(' → ')}`,
          suggestion:
            'Consider extracting shared functionality to a separate module',
        });

        return true;
      }

      if (visited.has(node)) return false;

      visited.add(node);
      recursionStack.add(node);

      const dependencies = dependencyGraph.get(node) || new Set();
      for (const dep of dependencies) {
        if (hasCycle(dep, [...path, node])) {
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    };

    for (const node of dependencyGraph.keys()) {
      if (!visited.has(node)) {
        hasCycle(node);
      }
    }

    return violations;
  }

  private async validateSOLIDPrinciples(
    projectPath: string
  ): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];
    const componentFiles = this.getAllTSFiles(
      join(projectPath, 'apps/web/app/components')
    );

    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');

      // Single Responsibility Principle - check component complexity
      const componentMatch = content.match(
        /export\s+(?:function|const)\s+(\w+)/
      );
      if (componentMatch) {
        const componentName = componentMatch[1];
        const complexity = this.calculateCyclomaticComplexity(content);

        if (complexity > 10) {
          violations.push({
            rule: 'solid-principles',
            severity: 'warning',
            file: relative(projectPath, file),
            message: `Component '${componentName}' has high complexity (${complexity}). Consider breaking down.`,
            suggestion:
              'Extract complex logic into custom hooks or smaller components',
          });
        }
      }

      // Open/Closed Principle - check for direct modifications instead of extensions
      if (content.includes('// TODO: modify this component')) {
        violations.push({
          rule: 'solid-principles',
          severity: 'warning',
          file: relative(projectPath, file),
          message:
            'Component marked for modification. Consider extension instead.',
          suggestion: 'Use composition or configuration to extend behavior',
        });
      }

      // Interface Segregation - check for large prop interfaces
      const interfaceMatches = content.match(
        /interface\s+\w+Props\s*{([^}]+)}/g
      );
      if (interfaceMatches) {
        for (const match of interfaceMatches) {
          const propCount = (match.match(/\w+\??:/g) || []).length;
          if (propCount > 8) {
            violations.push({
              rule: 'solid-principles',
              severity: 'warning',
              file: relative(projectPath, file),
              message: `Props interface has ${propCount} properties. Consider splitting.`,
              suggestion:
                'Split large interfaces into focused, single-purpose interfaces',
            });
          }
        }
      }
    }

    return violations;
  }

  private async validateImportOrganization(
    projectPath: string
  ): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];
    const allFiles = this.getAllTSFiles(projectPath);

    for (const file of allFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      const importLines: string[] = [];
      let importStarted = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (
          line.startsWith('import ') ||
          (line.startsWith('export ') && line.includes('from'))
        ) {
          importLines.push(line);
          importStarted = true;
        } else if (
          importStarted &&
          line !== '' &&
          !line.startsWith('//') &&
          !line.startsWith('/*')
        ) {
          break; // End of import section
        }
      }

      // Check import organization
      const issues = this.analyzeImportOrganization(importLines);

      for (const issue of issues) {
        violations.push({
          rule: 'clean-imports',
          severity: 'warning',
          file: relative(projectPath, file),
          message: issue,
          suggestion:
            'Organize imports: libraries, internal modules, relative imports',
        });
      }
    }

    return violations;
  }

  private async validateNamingConventions(
    projectPath: string
  ): Promise<ArchitectureViolation[]> {
    const violations: ArchitectureViolation[] = [];
    const allFiles = this.getAllTSFiles(projectPath);

    for (const file of allFiles) {
      const fileName = file.split('/').pop() || '';
      const content = readFileSync(file, 'utf-8');

      // Component file naming
      if (file.includes('/components/') && fileName.endsWith('.tsx')) {
        if (!this.isKebabCase(fileName.replace('.tsx', ''))) {
          violations.push({
            rule: 'naming-conventions',
            severity: 'warning',
            file: relative(projectPath, file),
            message: `Component file should use kebab-case: ${fileName}`,
            suggestion:
              'Rename file to use kebab-case (e.g., my-component.tsx)',
          });
        }
      }

      // Hook naming
      const hookMatches = content.match(
        /export\s+(?:function|const)\s+(use\w+)/g
      );
      if (hookMatches) {
        for (const match of hookMatches) {
          const hookName = match.match(/use\w+/)?.[0];
          if (hookName && !this.isCamelCase(hookName)) {
            violations.push({
              rule: 'naming-conventions',
              severity: 'error',
              file: relative(projectPath, file),
              message: `Hook should use camelCase: ${hookName}`,
              suggestion: 'Use camelCase for hook names (e.g., useMyHook)',
            });
          }
        }
      }

      // Component naming
      const componentMatches = content.match(
        /export\s+(?:function|const)\s+([A-Z]\w+)/g
      );
      if (componentMatches) {
        for (const match of componentMatches) {
          const componentName = match.match(/[A-Z]\w+/)?.[0];
          if (componentName && !this.isPascalCase(componentName)) {
            violations.push({
              rule: 'naming-conventions',
              severity: 'error',
              file: relative(projectPath, file),
              message: `Component should use PascalCase: ${componentName}`,
              suggestion:
                'Use PascalCase for component names (e.g., MyComponent)',
            });
          }
        }
      }
    }

    return violations;
  }

  // Utility methods
  private pathExists(path: string): boolean {
    try {
      return statSync(path).isDirectory();
    } catch {
      return false;
    }
  }

  private getAllTSFiles(dir: string): string[] {
    const files: string[] = [];

    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const itemPath = join(dir, item);
        const stat = statSync(itemPath);

        if (
          stat.isDirectory() &&
          !item.startsWith('.') &&
          item !== 'node_modules'
        ) {
          files.push(...this.getAllTSFiles(itemPath));
        } else if (
          stat.isFile() &&
          (item.endsWith('.ts') || item.endsWith('.tsx'))
        ) {
          files.push(itemPath);
        }
      }
    } catch {
      // Directory doesn't exist or is inaccessible
    }

    return files;
  }

  private extractImports(filePath: string): string[] {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
      const imports: string[] = [];
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
      }

      return imports;
    } catch {
      return [];
    }
  }

  private resolveRelativeImport(
    fromFile: string,
    importPath: string,
    projectPath: string
  ): string | null {
    try {
      const fromDir = fromFile.substring(0, fromFile.lastIndexOf('/'));
      const resolved = join(fromDir, importPath);
      return relative(projectPath, resolved);
    } catch {
      return null;
    }
  }

  private calculateCyclomaticComplexity(code: string): number {
    // Simplified complexity calculation
    const complexityKeywords = [
      'if',
      'else',
      'while',
      'for',
      'switch',
      'case',
      'catch',
    ];

    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }

    // Special handling for logical operators
    const logicalMatches = code.match(/&&|\|\|/g);
    if (logicalMatches) {
      complexity += logicalMatches.length;
    }

    // Special handling for ternary operator
    const ternaryMatches = code.match(/\?/g);
    if (ternaryMatches) {
      complexity += ternaryMatches.length;
    }

    return complexity;
  }

  private analyzeImportOrganization(imports: string[]): string[] {
    const issues: string[] = [];

    // Check if imports are grouped properly
    let lastGroup = '';

    for (const importLine of imports) {
      let currentGroup = '';

      if (importLine.includes("from 'react")) {
        currentGroup = 'react';
      } else if (importLine.includes("from 'next")) {
        currentGroup = 'next';
      } else if (
        importLine.includes("from '@/") ||
        importLine.includes("from '../") ||
        importLine.includes("from './")
      ) {
        currentGroup = 'relative';
      } else if (importLine.includes("from '@skyscout/")) {
        currentGroup = 'internal';
      } else {
        currentGroup = 'external';
      }

      // Check order: react -> next -> external -> internal -> relative
      const expectedOrder = [
        'react',
        'next',
        'external',
        'internal',
        'relative',
      ];
      const lastGroupIndex = expectedOrder.indexOf(lastGroup);
      const currentGroupIndex = expectedOrder.indexOf(currentGroup);

      if (lastGroupIndex > currentGroupIndex && lastGroup !== '') {
        issues.push(
          `Imports not properly organized: ${currentGroup} should come before ${lastGroup}`
        );
      }

      lastGroup = currentGroup;
    }

    return issues;
  }

  private isKebabCase(str: string): boolean {
    return /^[a-z]+(-[a-z]+)*$/.test(str);
  }

  private isCamelCase(str: string): boolean {
    return /^[a-z][a-zA-Z0-9]*$/.test(str);
  }

  private isPascalCase(str: string): boolean {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }
}

// Export for use in development tooling
export const validateArchitecture = async (
  projectPath: string = process.cwd()
) => {
  const validator = new ArchitectureValidator();
  const violations = await validator.validateProject(projectPath);

  if (violations.length === 0) {
    console.log('\n✅ All architecture rules passed!');
  } else {
    console.log(`\n❌ Found ${violations.length} architecture violations:\n`);

    for (const violation of violations) {
      const icon = violation.severity === 'error' ? '🚨' : '⚠️';
      console.log(`${icon} [${violation.rule}] ${violation.file}`);
      console.log(`   ${violation.message}`);
      if (violation.suggestion) {
        console.log(`   💡 ${violation.suggestion}`);
      }
      console.log('');
    }
  }

  return violations;
};
