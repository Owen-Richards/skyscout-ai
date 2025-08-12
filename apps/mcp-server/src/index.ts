import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';

interface RequestParams {
  name?: string;
  arguments?: Record<string, any>;
}

interface ReadResourceParams {
  uri: string;
}

/**
 * SkyScout AI MCP Server
 * Provides development tools and project context for AI agents
 */
class SkyScoutMCPServer {
  private server: Server;
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
    this.server = new Server(
      {
        name: 'skyscout-ai-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_project_structure',
            description:
              'Analyze current project structure and component relationships',
            inputSchema: {
              type: 'object',
              properties: {
                focus_area: {
                  type: 'string',
                  description:
                    'Area to focus analysis on (components, types, services, etc.)',
                  enum: [
                    'components',
                    'types',
                    'services',
                    'performance',
                    'tests',
                  ],
                },
              },
            },
          },
          {
            name: 'run_performance_analysis',
            description: 'Run performance monitoring and bundle analysis',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description: 'Type of analysis to run',
                  enum: ['lighthouse', 'bundle', 'monitor', 'all'],
                },
              },
            },
          },
          {
            name: 'generate_component',
            description:
              'Generate a new React component following project patterns',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Component name in PascalCase',
                },
                type: {
                  type: 'string',
                  description: 'Component type',
                  enum: ['ui', 'feature', 'page', 'layout'],
                },
                props: {
                  type: 'string',
                  description: 'TypeScript interface for component props',
                },
              },
              required: ['name', 'type'],
            },
          },
          {
            name: 'update_trip_management',
            description: 'Update or extend trip management features',
            inputSchema: {
              type: 'object',
              properties: {
                feature: {
                  type: 'string',
                  description: 'Feature to update or add',
                  enum: ['itinerary', 'budget', 'collaboration', 'expenses'],
                },
                action: {
                  type: 'string',
                  description: 'Action to perform',
                  enum: ['add', 'update', 'optimize', 'fix'],
                },
                details: {
                  type: 'string',
                  description: 'Specific details about the change',
                },
              },
              required: ['feature', 'action'],
            },
          },
          {
            name: 'run_tests',
            description: 'Run tests for specific components or areas',
            inputSchema: {
              type: 'object',
              properties: {
                scope: {
                  type: 'string',
                  description: 'Test scope',
                  enum: ['all', 'unit', 'integration', 'e2e', 'performance'],
                },
                component: {
                  type: 'string',
                  description: 'Specific component to test (optional)',
                },
              },
            },
          },
        ] as Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: { params: RequestParams }) => {
        const { name, arguments: args } = request.params;

        try {
          switch (name) {
            case 'analyze_project_structure':
              return await this.analyzeProjectStructure(
                args?.focus_area || 'components'
              );

            case 'run_performance_analysis':
              return await this.runPerformanceAnalysis(args?.type || 'all');

            case 'generate_component':
              return await this.generateComponent(
                args?.name,
                args?.type,
                args?.props
              );

            case 'update_trip_management':
              return await this.updateTripManagement(
                args?.feature,
                args?.action,
                args?.details
              );

            case 'run_tests':
              return await this.runTests(
                args?.scope || 'unit',
                args?.component
              );

            default:
              throw new Error(`Unknown tool: ${name}`);
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          return {
            content: [
              {
                type: 'text',
                text: `Error executing ${name}: ${errorMessage}`,
              },
            ],
          };
        }
      }
    );
  }

  private setupResourceHandlers() {
    // Project context resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'skyscout://architecture',
            name: 'SkyScout Architecture',
            description: 'Complete system architecture and patterns',
            mimeType: 'text/markdown',
          },
          {
            uri: 'skyscout://components',
            name: 'Component Library',
            description: 'UI component patterns and usage',
            mimeType: 'application/json',
          },
          {
            uri: 'skyscout://development-guide',
            name: 'Development Guidelines',
            description: 'Coding standards and best practices',
            mimeType: 'text/markdown',
          },
          {
            uri: 'skyscout://project-structure',
            name: 'Project Structure',
            description: 'Complete project file structure and organization',
            mimeType: 'application/json',
          },
          {
            uri: 'skyscout://coding-patterns',
            name: 'Coding Patterns',
            description: 'Established coding patterns and conventions',
            mimeType: 'text/markdown',
          },
        ],
      };
    });

    // Handle resource reading
    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request: { params: ReadResourceParams }) => {
        const { uri } = request.params;

        switch (uri) {
          case 'skyscout://architecture':
            return {
              contents: [
                {
                  type: 'text',
                  text: this.getArchitectureDoc(),
                },
              ],
            };
          case 'skyscout://components':
            return {
              contents: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    this.getComponentLibraryStructure(),
                    null,
                    2
                  ),
                },
              ],
            };
          case 'skyscout://development-guide':
            return {
              contents: [
                {
                  type: 'text',
                  text: this.getDevelopmentGuide(),
                },
              ],
            };
          case 'skyscout://project-structure':
            return {
              contents: [
                {
                  type: 'text',
                  text: JSON.stringify(this.getProjectStructure(), null, 2),
                },
              ],
            };
          case 'skyscout://coding-patterns':
            return {
              contents: [
                {
                  type: 'text',
                  text: this.getCodingPatterns(),
                },
              ],
            };
          default:
            throw new Error(`Unknown resource: ${uri}`);
        }
      }
    );
  }

  private async analyzeProjectStructure(focusArea: string) {
    const analysis = {
      components: this.getComponentStructure(),
      types: this.getTypeDefinitions(),
      performance: this.getPerformanceMetrics(),
      architecture: this.getArchitectureOverview(),
    };

    const focusAreaData =
      analysis[focusArea as keyof typeof analysis] || analysis;

    return {
      content: [
        {
          type: 'text',
          text: `# Project Structure Analysis - ${focusArea}

## Current Architecture
${JSON.stringify(focusAreaData, null, 2)}

## Recommendations
- Components follow SOLID principles
- Type safety is enforced with TypeScript strict mode
- Performance monitoring is integrated
- Trip management system is comprehensive

## Next Steps
1. Continue developing according to established patterns
2. Maintain test coverage above 90%
3. Use performance monitoring for optimization
4. Follow the clean architecture guide`,
        },
      ],
    };
  }

  private async runPerformanceAnalysis(type: string) {
    try {
      let command = '';
      switch (type) {
        case 'lighthouse':
          command = 'npm run perf:lighthouse';
          break;
        case 'bundle':
          command = 'npm run perf:bundle';
          break;
        case 'monitor':
          command = 'npm run perf:monitor';
          break;
        case 'all':
          command = 'npm run perf:monitor';
          break;
        default:
          command = 'npm run perf:monitor';
      }

      const output = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        timeout: 60000,
      });

      return {
        content: [
          {
            type: 'text',
            text: `# Performance Analysis Results

## Command: ${command}

## Output:
\`\`\`
${output}
\`\`\`

## Summary
Performance analysis completed. Check the generated reports for detailed metrics.
- Lighthouse report: ./lighthouse-report.report.html
- Bundle analysis: Available via npm run analyze in apps/web
- Performance monitoring: Real-time metrics tracked

## Key Performance Targets
- Lighthouse Performance: 90+
- Accessibility: 95+
- Bundle Size: Main < 250KB
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1`,
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Performance analysis failed: ${errorMessage}

## Troubleshooting
1. Ensure development server is running (npm run dev)
2. Check if all dependencies are installed
3. Verify build process works (npm run build)
4. Check script availability in package.json`,
          },
        ],
      };
    }
  }

  private async generateComponent(name: string, type: string, props?: string) {
    const componentTemplate = this.getComponentTemplate(name, type, props);
    const testTemplate = this.getTestTemplate(name, type);
    const storyTemplate = this.getStoryTemplate(name, type);

    return {
      content: [
        {
          type: 'text',
          text: `# Generated Component: ${name}

## Component File
\`\`\`typescript
${componentTemplate}
\`\`\`

## Test File
\`\`\`typescript
${testTemplate}
\`\`\`

## Storybook Story
\`\`\`typescript
${storyTemplate}
\`\`\`

## Next Steps
1. Create the component files in the appropriate directory
2. Add exports to index.ts
3. Run tests to ensure everything works
4. Update documentation`,
        },
      ],
    };
  }

  private async updateTripManagement(
    feature: string,
    action: string,
    details?: string
  ) {
    return {
      content: [
        {
          type: 'text',
          text: `# Trip Management Update: ${feature}

## Action: ${action}
## Details: ${details || 'No specific details provided'}

## Current Trip Management Components:
- Itinerary Planner: ✅ Implemented with Tokyo example
- Budget Tracker: ✅ Comprehensive expense management
- Collaborative Planning: ✅ Real-time collaboration features
- Expense Tracker: ✅ Receipt scanning and categorization

## Recommended Implementation:
Based on the existing patterns in your trip management system, follow the established architecture in:
- \`apps/web/app/components/trip-planning/\`
- \`apps/web/app/types/trip.ts\`

## Code Quality Requirements:
- Follow TypeScript strict mode
- Add comprehensive tests
- Include Storybook stories
- Ensure accessibility compliance
- Maintain performance standards`,
        },
      ],
    };
  }

  private async runTests(scope: string, component?: string) {
    try {
      let command = '';
      switch (scope) {
        case 'unit':
          command = component ? `npm test -- ${component}` : 'npm run test';
          break;
        case 'all':
          command = 'npm run test';
          break;
        case 'performance':
          command = 'npm run perf:monitor';
          break;
        default:
          command = 'npm run test';
      }

      const output = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        timeout: 120000,
      });

      return {
        content: [
          {
            type: 'text',
            text: `# Test Results - ${scope}

## Command: ${command}

## Output:
\`\`\`
${output}
\`\`\`

## Summary
Tests completed successfully. All quality checks passed.`,
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Test execution failed: ${errorMessage}

## Troubleshooting
1. Ensure all dependencies are installed
2. Check if test files exist
3. Verify build process works
4. Check Jest configuration`,
          },
        ],
      };
    }
  }

  // Helper methods for generating templates and analyzing structure
  private getComponentStructure() {
    try {
      const uiLibPath = join(
        this.projectRoot,
        'libs',
        'ui',
        'src',
        'components'
      );
      const webComponentsPath = join(
        this.projectRoot,
        'apps',
        'web',
        'app',
        'components'
      );

      const structure = {
        uiLibrary: this.scanDirectory(uiLibPath),
        webComponents: this.scanDirectory(webComponentsPath),
        patterns: {
          componentStructure: 'ComponentProps<element> pattern',
          styling: 'Tailwind CSS with cn() utility',
          testing: 'Jest + React Testing Library',
          storybook: 'Comprehensive stories for all components',
        },
      };

      return structure;
    } catch (error) {
      return {
        error: 'Failed to analyze component structure',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getTypeDefinitions() {
    try {
      const sharedTypesPath = join(this.projectRoot, 'libs', 'shared', 'src');
      const apiTypesPath = join(this.projectRoot, 'apps', 'api', 'src');

      return {
        sharedTypes: this.scanDirectory(sharedTypesPath),
        apiTypes: this.scanDirectory(apiTypesPath),
        strictMode: true,
        zod: 'Runtime validation with Zod schemas',
      };
    } catch (error) {
      return {
        error: 'Failed to analyze type definitions',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getPerformanceMetrics() {
    try {
      const performanceConfig = {
        lighthouse: {
          thresholds: {
            performance: 90,
            accessibility: 95,
            bestPractices: 90,
            seo: 95,
          },
          coreWebVitals: { lcp: 2.5, fid: 0.1, cls: 0.1 },
        },
        bundleSize: {
          maxMainBundle: 250,
          maxChunkSize: 200,
          totalSizeLimit: 1000,
        },
        monitoring: 'Real-time performance tracking',
      };

      return performanceConfig;
    } catch (error) {
      return {
        error: 'Failed to get performance metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getArchitectureOverview() {
    return {
      pattern: 'Clean Architecture with SOLID principles',
      frontend: 'Next.js 14 with App Router, React 18, TypeScript',
      styling: 'Tailwind CSS with custom design system',
      state: 'tRPC for type-safe APIs, React Query for caching',
      testing: 'Jest, React Testing Library, Playwright',
      monorepo: 'Nx workspace with shared libraries',
      deployment: 'Kubernetes on AWS (planned)',
      performance: 'Lighthouse monitoring, bundle analysis',
    };
  }

  private scanDirectory(dirPath: string): {
    path: string;
    items?: Array<{
      name: string;
      type: string;
      isComponent: boolean;
      size: number;
    }>;
    count?: number;
    exists?: boolean;
    error?: string;
    message?: string;
  } {
    try {
      if (!existsSync(dirPath)) return { path: dirPath, exists: false };

      const items = readdirSync(dirPath).map(item => {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);

        return {
          name: item,
          type: stats.isDirectory() ? 'directory' : 'file',
          isComponent:
            extname(item) === '.tsx' &&
            !item.includes('.test.') &&
            !item.includes('.stories.'),
          size: stats.size,
        };
      });

      return { path: dirPath, items, count: items.length };
    } catch (error) {
      return {
        error: 'Failed to scan directory',
        path: dirPath,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getComponentLibraryStructure() {
    return {
      established: [
        'Button - Production ready with comprehensive variants',
        'Card - Display containers with multiple layouts',
        'Form - react-hook-form integration',
        'Avatar - User profile display',
        'Badge - Status and category indicators',
        'Theme Provider - Dark/light theme support',
      ],
      patterns: {
        props: 'Extends ComponentProps<element> for HTML props',
        variants: 'Uses class-variance-authority for styling variants',
        accessibility: 'ARIA compliant with semantic HTML',
        exports: 'Barrel exports from index.ts',
      },
      location: 'libs/ui/src/components/',
      tests: 'Comprehensive test coverage with Jest',
      storybook: 'Interactive documentation and testing',
    };
  }

  private getArchitectureDoc() {
    return `# SkyScout AI Architecture

## Overview
Modern microservices architecture built with clean code principles and performance optimization.

## Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NestJS, Fastify, tRPC (type-safe APIs)
- **Database**: PostgreSQL, Redis, DynamoDB (planned)
- **Search**: OpenSearch, Rust-based search engine
- **ML/AI**: Python services, TensorFlow/PyTorch
- **Infrastructure**: Kubernetes, AWS, Terraform CDK

## Architecture Patterns
- Clean Architecture with SOLID principles
- Domain-driven design
- Event-driven microservices
- CQRS for read/write separation
- Performance-first development

## Current State
- ✅ Frontend UI library with comprehensive components
- ✅ Hero sections and navigation implemented
- ✅ tRPC setup for type-safe communication
- 🔄 Backend services in development
- 📋 Performance monitoring integrated

## Component Patterns
Follow established patterns in libs/ui/src/components/ for consistency.`;
  }

  private getDevelopmentGuide() {
    return `# SkyScout AI Development Guide

## Code Quality Standards
- TypeScript strict mode enforced
- 90%+ test coverage requirement
- ESLint + Prettier formatting
- Accessibility compliance (95+ score)

## Component Development
1. Use ComponentProps<element> pattern
2. Implement variants with class-variance-authority
3. Include comprehensive tests
4. Add Storybook stories
5. Export from index.ts

## Performance Requirements
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Bundle size: Main < 250KB, Chunks < 200KB
- Lighthouse scores: 90+ across all metrics

## Architecture Principles
- Single Responsibility Principle
- Open/Closed Principle
- Dependency Inversion
- Clean separation of concerns
- Performance-driven development`;
  }

  private getProjectStructure() {
    return {
      workspace: 'Nx monorepo with TypeScript',
      apps: {
        web: 'Next.js frontend application',
        api: 'Fastify + tRPC backend',
        'mcp-server': 'AI development assistant',
        'ml-service': 'Python ML/AI services',
        'search-engine': 'Rust-based search',
        'auth-service': 'Authentication microservice',
      },
      libs: {
        ui: 'Shared UI component library',
        shared: 'Common utilities and types',
        trpc: 'tRPC router definitions',
      },
      docs: 'Comprehensive documentation',
      scripts: 'Development and deployment automation',
      infra: 'Infrastructure as code',
    };
  }

  private getCodingPatterns() {
    return `# SkyScout AI Coding Patterns

## Component Pattern
\`\`\`typescript
interface ComponentNameProps extends ComponentProps<'div'> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ComponentName({
  variant = 'default',
  className,
  ...props
}: ComponentNameProps) {
  return (
    <div className={cn('base-styles', variantStyles[variant], className)} {...props} />
  );
}
\`\`\`

## API Pattern
\`\`\`typescript
export const featureRouter = router({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { data: [] };
    }),
});
\`\`\`

## File Organization
- libs/ui/src/components/ - Shared UI components
- apps/web/app/components/ - App-specific components
- Barrel exports from index.ts files
- Co-located tests and stories`;
  }

  private getComponentTemplate(name: string, type: string, props?: string) {
    return `/**
 * ${name} Component
 * Following SOLID principles and Clean Code practices
 */

'use client';

import { cn } from '@skyscout/ui';
import { ComponentProps } from 'react';

interface ${name}Props extends ComponentProps<'div'> {
  ${props || '// Add props here'}
}

export function ${name}({
  className,
  ...props
}: ${name}Props) {
  return (
    <div
      className={cn(
        'base-styles',
        className
      )}
      {...props}
    >
      {/* Component content */}
    </div>
  );
}`;
  }

  private getTestTemplate(name: string, _type: string) {
    return `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name.toLowerCase()}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });
});`;
  }

  private getStoryTemplate(name: string, _type: string) {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name.toLowerCase()}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};`;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SkyScout AI MCP Server running on stdio');
  }
}

// Start the server
const server = new SkyScoutMCPServer();
server.start().catch(console.error);
