/**
 * Component Complexity Refactoring Tool
 * Helps address SOLID principle violations by analyzing complex components
 * and suggesting/implementing refactoring strategies
 */

import { readFileSync } from 'fs';

interface ComponentAnalysis {
  name: string;
  path: string;
  complexity: number;
  issueTypes: string[];
  suggestions: RefactoringSuggestion[];
}

interface RefactoringSuggestion {
  type:
    | 'extract-hook'
    | 'split-component'
    | 'extract-utility'
    | 'state-management';
  description: string;
  codeBlock?: string;
  targetFile?: string;
}

export class ComponentComplexityAnalyzer {
  async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    const content = readFileSync(filePath, 'utf-8');
    const componentName = this.extractComponentName(filePath);

    const analysis: ComponentAnalysis = {
      name: componentName,
      path: filePath,
      complexity: this.calculateComplexity(content),
      issueTypes: this.identifyIssues(content),
      suggestions: this.generateSuggestions(content, componentName),
    };

    return analysis;
  }

  private extractComponentName(filePath: string): string {
    const fileName = filePath.split('/').pop() || '';
    return fileName.replace('.tsx', '').replace('.ts', '');
  }

  private calculateComplexity(content: string): number {
    let complexity = 1; // Base complexity

    // Count decision points
    const patterns = [
      /if\s*\(/g,
      /else\s+if/g,
      /switch\s*\(/g,
      /case\s+/g,
      /\?\s*.*:/g, // Ternary operators
      /&&/g,
      /\|\|/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /catch\s*\(/g,
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  private identifyIssues(content: string): string[] {
    const issues: string[] = [];

    // Single Responsibility violations
    if (this.hasMultipleResponsibilities(content)) {
      issues.push('Multiple Responsibilities');
    }

    // Open/Closed violations
    if (this.hasHardcodedBehavior(content)) {
      issues.push('Hardcoded Behavior');
    }

    // Large component
    if (content.split('\n').length > 100) {
      issues.push('Large Component');
    }

    // Too many props
    const propsCount = this.countProps(content);
    if (propsCount > 7) {
      issues.push(`Too Many Props (${propsCount})`);
    }

    // Inline styles/logic
    if (content.includes('style={{') || content.includes('className={`')) {
      issues.push('Inline Styling Logic');
    }

    return issues;
  }

  private hasMultipleResponsibilities(content: string): boolean {
    const responsibilities = [
      /useState|useReducer/g, // State management
      /useEffect/g, // Side effects
      /fetch|axios|api/g, // Data fetching
      /validate|schema/g, // Validation
      /navigate|router/g, // Routing
      /localStorage|sessionStorage/g, // Storage
    ];

    let responsibilityCount = 0;
    responsibilities.forEach(pattern => {
      if (pattern.test(content)) {
        responsibilityCount++;
      }
    });

    return responsibilityCount > 2;
  }

  private hasHardcodedBehavior(content: string): boolean {
    return /if\s*\(\s*\w+\s*===\s*['"`]/.test(content);
  }

  private countProps(content: string): number {
    const interfaceMatch = content.match(/interface\s+\w+Props\s*\{([^}]+)\}/);
    if (!interfaceMatch) return 0;

    const propsString = interfaceMatch[1];
    const props = propsString
      .split(/[;\n]/)
      .filter(
        line =>
          line.trim() &&
          !line.trim().startsWith('//') &&
          !line.trim().startsWith('*')
      );

    return props.length;
  }

  private generateSuggestions(
    content: string,
    componentName: string
  ): RefactoringSuggestion[] {
    const suggestions: RefactoringSuggestion[] = [];

    // Suggest custom hook extraction
    if (content.includes('useState') && content.includes('useEffect')) {
      suggestions.push({
        type: 'extract-hook',
        description: `Extract state logic into custom hook`,
        codeBlock: this.generateCustomHook(componentName),
        targetFile: `hooks/use-${componentName.toLowerCase()}.ts`,
      });
    }

    // Suggest component splitting
    if (content.split('\n').length > 100) {
      suggestions.push({
        type: 'split-component',
        description: 'Split into smaller, focused components',
        codeBlock: this.generateComponentSplit(componentName),
      });
    }

    // Suggest utility extraction
    if (content.includes('const ') && /= \(.*\) =>/.test(content)) {
      suggestions.push({
        type: 'extract-utility',
        description: 'Extract utility functions to separate file',
        targetFile: `utils/${componentName.toLowerCase()}-utils.ts`,
      });
    }

    return suggestions;
  }

  private generateCustomHook(componentName: string): string {
    return `/**
 * Custom hook for ${componentName} component logic
 * Extracted to follow Single Responsibility Principle
 */
import { useState, useEffect } from 'react';

export function use${componentName}() {
  // TODO: Move relevant state and effects here
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // TODO: Move useEffect logic here
  useEffect(() => {
    // Implement data fetching or side effects
  }, []);
  
  return {
    data,
    loading,
    error,
    // Add other state and handlers
  };
}`;
  }

  private generateComponentSplit(componentName: string): string {
    return `// Split ${componentName} into focused sub-components:

// 1. ${componentName}Header.tsx - Header content
// 2. ${componentName}Content.tsx - Main content
// 3. ${componentName}Actions.tsx - Action buttons/controls
// 4. ${componentName}.tsx - Main orchestrating component

// Example structure:
export function ${componentName}() {
  return (
    <div>
      <${componentName}Header />
      <${componentName}Content />
      <${componentName}Actions />
    </div>
  );
}`;
  }

  async generateRefactoringReport(): Promise<void> {
    const complexComponents = [
      'apps/web/app/components/flights/flight-filters.tsx',
      'apps/web/app/components/hotels/accommodation-deals.tsx',
      'apps/web/app/components/flights/trending-destinations.tsx',
      'apps/web/app/components/performance/performance-monitor.tsx',
      'apps/web/app/components/trip-planning/budget-tracker-clean.tsx',
      'apps/web/app/components/auth/auth-modal.tsx',
      'apps/web/app/components/itinerary/trip-itinerary-planner.tsx',
      'apps/web/app/components/flights/flight-deals.tsx',
      'apps/web/app/components/trip-planning/trip-dashboard.tsx',
      'apps/web/app/components/flights/price-alerts.tsx',
    ];

    console.log('🔍 Analyzing complex components...\n');

    for (const componentPath of complexComponents) {
      try {
        const analysis = await this.analyzeComponent(componentPath);
        this.printComponentAnalysis(analysis);
      } catch (error) {
        console.log(
          `❌ Could not analyze ${componentPath}: Component may not exist yet`
        );
      }
    }
  }

  private printComponentAnalysis(analysis: ComponentAnalysis): void {
    console.log(`📋 Component: ${analysis.name}`);
    console.log(`📍 Path: ${analysis.path}`);
    console.log(`🎯 Complexity: ${analysis.complexity}`);
    console.log(
      `⚠️  Issues: ${analysis.issueTypes.join(', ') || 'None detected'}`
    );

    if (analysis.suggestions.length > 0) {
      console.log('💡 Refactoring Suggestions:');
      analysis.suggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion.description}`);
        if (suggestion.targetFile) {
          console.log(`      → Create: ${suggestion.targetFile}`);
        }
      });
    }

    console.log('─'.repeat(80));
  }
}

// Export for CLI usage
export async function analyzeComplexComponents(): Promise<void> {
  const analyzer = new ComponentComplexityAnalyzer();
  await analyzer.generateRefactoringReport();

  console.log('\n🎯 Next Steps:');
  console.log('1. Focus on components with complexity > 25');
  console.log('2. Extract custom hooks for state management logic');
  console.log('3. Split large components into focused sub-components');
  console.log('4. Move utility functions to separate files');
  console.log('5. Re-run architecture validation to track progress');
}
