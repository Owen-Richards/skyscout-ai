/**
 * Import Organization Auto-Fixer
 * Automatically fixes import organization issues detected by architecture validator
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ImportGroup {
  react: string[];
  next: string[];
  external: string[];
  internal: string[];
  relative: string[];
}

export class ImportFixer {
  private readonly importOrder = [
    'react',
    'next',
    'external',
    'internal',
    'relative',
  ] as const;

  async fixImportsInFile(filePath: string): Promise<boolean> {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const fixedContent = this.organizeImports(content);

      if (content !== fixedContent) {
        writeFileSync(filePath, fixedContent, 'utf-8');
        console.log(`✅ Fixed imports in: ${filePath}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Failed to fix imports in ${filePath}:`, error);
      return false;
    }
  }

  private organizeImports(content: string): string {
    const lines = content.split('\n');
    const imports: ImportGroup = {
      react: [],
      next: [],
      external: [],
      internal: [],
      relative: [],
    };

    let nonImportStartIndex = -1;
    let shebangLine = '';
    let firstNonImportLine = 0;

    // Handle shebang lines
    if (lines[0]?.startsWith('#!')) {
      shebangLine = lines[0];
      firstNonImportLine = 1;
    }

    // Extract imports and find where non-import content starts
    for (let i = firstNonImportLine; i < lines.length; i++) {
      const line = lines[i].trim();

      if (this.isImportLine(line)) {
        this.categorizeImport(line, imports);
      } else if (
        line !== '' &&
        !line.startsWith('//') &&
        !line.startsWith('/*') &&
        !line.startsWith('*')
      ) {
        nonImportStartIndex = i;
        break;
      }
    }

    // If no non-import content found, everything after imports
    if (nonImportStartIndex === -1) {
      nonImportStartIndex = lines.length;
    }

    // Build the organized content
    const organizedLines: string[] = [];

    // Add shebang if present
    if (shebangLine) {
      organizedLines.push(shebangLine);
      organizedLines.push('');
    }

    // Add organized imports
    let hasImports = false;
    for (const group of this.importOrder) {
      if (imports[group].length > 0) {
        if (hasImports) {
          organizedLines.push(''); // Blank line between groups
        }
        organizedLines.push(...imports[group]);
        hasImports = true;
      }
    }

    // Add blank line after imports if there are any and non-import content follows
    if (hasImports && nonImportStartIndex < lines.length) {
      organizedLines.push('');
    }

    // Add the rest of the content
    organizedLines.push(...lines.slice(nonImportStartIndex));

    return organizedLines.join('\n');
  }

  private isImportLine(line: string): boolean {
    return (
      line.startsWith('import ') ||
      (line.startsWith('export ') && line.includes('from'))
    );
  }

  private categorizeImport(line: string, imports: ImportGroup): void {
    if (line.includes("from 'react")) {
      imports.react.push(line);
    } else if (line.includes("from 'next")) {
      imports.next.push(line);
    } else if (
      line.includes("from '@/") ||
      line.includes("from '../") ||
      line.includes("from './'")
    ) {
      imports.relative.push(line);
    } else if (line.includes("from '@skyscout/")) {
      imports.internal.push(line);
    } else {
      imports.external.push(line);
    }
  }
}

// CLI interface
export async function fixImportsInProject(
  projectPath: string = process.cwd()
): Promise<void> {
  const fixer = new ImportFixer();

  // Get all TypeScript files with import violations from the validation output
  const filesToFix = [
    // API files
    'apps/api/src/routers/auth.ts',
    'apps/api/src/routers/flight.ts',

    // Web app files with violations
    'apps/web/app/components/auth/auth-modal.tsx',
    'apps/web/app/components/budget/trip-budget-tracker.tsx',
    'apps/web/app/components/flight-quick-search.tsx',
    'apps/web/app/components/flights/flight-deals.tsx',
    'apps/web/app/components/flights/flight-filters.tsx',
    'apps/web/app/components/flights/flight-map.tsx',
    'apps/web/app/components/flights/flight-results.tsx',
    'apps/web/app/components/flights/flight-search-form.tsx',
    'apps/web/app/components/flights/flight-wishlist.tsx',
    'apps/web/app/components/flights/price-alerts.tsx',
    'apps/web/app/components/flights/recent-searches.tsx',
    'apps/web/app/components/flights/trending-destinations.tsx',
    'apps/web/app/components/hero/hero-section.tsx',
    'apps/web/app/components/hotels/accommodation-deals.tsx',
    'apps/web/app/components/hotels/accommodation-search-form.tsx',
    'apps/web/app/components/hotels/hotel-trending-destinations.tsx',
    'apps/web/app/components/hotels/provider-comparison.tsx',
    'apps/web/app/components/itinerary/trip-itinerary-planner.tsx',
    'apps/web/app/components/layout/mobile-menu-toggle.tsx',
    'apps/web/app/components/layout/navigation-logo.tsx',
    'apps/web/app/components/navigation/settings-menu.tsx',
    'apps/web/app/components/performance/performance-monitor.tsx',
    'apps/web/app/components/providers/trpc-provider.tsx',
    'apps/web/app/components/trip-planning/budget-tracker-clean.tsx',
    'apps/web/app/components/trip-planning/trip-dashboard.tsx',
    'apps/web/app/hooks/use-translation.ts',
    'apps/web/app/layout.tsx',
    'apps/web/lib/error-boundary.tsx',
    'apps/web/lib/trpc.ts',

    // UI Library files
    'libs/ui/src/components/badge.stories.tsx',
    'libs/ui/src/components/button.test.tsx',
    'libs/ui/src/components/button.tsx',
    'libs/ui/src/components/card.tsx',
    'libs/ui/src/components/deprecated/floating-action-button.stories.tsx',
    'libs/ui/src/components/input.tsx',
    'libs/ui/src/components/toggle-button.stories.tsx',
    'libs/trpc/src/router.ts',

    // Include tooling files as well
    'tooling/cli.ts',
  ];

  console.log('🔧 Starting import organization fixes...\n');

  let fixedCount = 0;
  let skippedCount = 0;

  for (const file of filesToFix) {
    const fullPath = join(projectPath, file);

    // Check if file exists before trying to fix
    try {
      const wasFixed = await fixer.fixImportsInFile(fullPath);
      if (wasFixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.log(`⚠️ Skipped: ${file} (file not found or inaccessible)`);
      skippedCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`✅ Fixed imports in ${fixedCount} files`);
  console.log(`⚠️ Skipped ${skippedCount} files`);
  console.log('🚀 Run architecture validation again to see improvements!');
}
