/**
 * Code Generation Templates
 * Advanced templates following clean architecture patterns
 */

export interface GeneratorOptions {
  name: string;
  type: 'ui' | 'feature' | 'page' | 'layout' | 'service' | 'hook' | 'type';
  domain?: string;
  props?: string;
  features?: string[];
  testType?: 'unit' | 'integration' | 'e2e';
}

export class CodeGenerator {
  /**
   * Generate a React component following clean architecture patterns
   */
  generateComponent(options: GeneratorOptions): {
    component: string;
    test: string;
    story: string;
    types: string;
    index: string;
  } {
    const { name, type, props } = options;
    const componentName = this.toPascalCase(name);

    return {
      component: this.generateComponentFile(componentName, type, props),
      test: this.generateTestFile(componentName, type),
      story: this.generateStoryFile(componentName, type),
      types: this.generateTypeFile(componentName, props),
      index: this.generateIndexFile(componentName),
    };
  }

  /**
   * Generate a service following dependency injection patterns
   */
  generateService(options: GeneratorOptions): {
    service: string;
    interface: string;
    test: string;
    index: string;
  } {
    const { name, domain } = options;
    const serviceName = this.toPascalCase(name);
    const interfaceName = `I${serviceName}`;

    return {
      service: this.generateServiceFile(serviceName, interfaceName, domain),
      interface: this.generateServiceInterface(interfaceName, serviceName),
      test: this.generateServiceTest(serviceName, interfaceName),
      index: this.generateServiceIndex(serviceName, interfaceName),
    };
  }

  /**
   * Generate a custom hook with proper patterns
   */
  generateHook(options: GeneratorOptions): {
    hook: string;
    test: string;
    types: string;
    index: string;
  } {
    const { name, features = [] } = options;
    const hookName = name.startsWith('use')
      ? name
      : `use${this.toPascalCase(name)}`;

    return {
      hook: this.generateHookFile(hookName, features),
      test: this.generateHookTest(hookName),
      types: this.generateHookTypes(hookName),
      index: this.generateHookIndex(hookName),
    };
  }

  private generateComponentFile(
    name: string,
    type: string,
    propsInterface?: string
  ): string {
    const baseProps = propsInterface || `${name}Props`;

    return `/**
 * ${name} Component
 * ${this.getComponentDescription(type)}
 */

import { ComponentProps, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@skyscout/ui';

// Component variants using class-variance-authority
const ${name.toLowerCase()}Variants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Component props interface
export interface ${baseProps} 
  extends ComponentProps<'${this.getBaseElement(type)}'>,
    VariantProps<typeof ${name.toLowerCase()}Variants> {
  /**
   * Additional custom props for ${name}
   */
  loading?: boolean;
  /**
   * Icon to display (optional)
   */
  icon?: React.ReactNode;
  /**
   * Callback when action is performed
   */
  onAction?: () => void;
}

// Component implementation with forwardRef for proper ref handling
export const ${name} = forwardRef<
  HTMLElementTagNameMap['${this.getBaseElement(type)}'],
  ${baseProps}
>(({ 
  className, 
  variant, 
  size, 
  loading = false,
  icon,
  onAction,
  children,
  disabled,
  ...props 
}, ref) => {
  const handleClick = () => {
    if (!disabled && !loading && onAction) {
      onAction();
    }
  };

  return (
    <${this.getBaseElement(type)}
      ref={ref}
      className={cn(${name.toLowerCase()}Variants({ variant, size }), className)}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </${this.getBaseElement(type)}>
  );
});

${name}.displayName = '${name}';

// Export variants for external use
export { ${name.toLowerCase()}Variants };
export type { ${baseProps} };
`;
  }

  private generateTestFile(name: string, type: string): string {
    return `/**
 * ${name} Component Tests
 * Comprehensive testing following testing best practices
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { ${name}, type ${name}Props } from './${this.toKebabCase(name)}';

// Test utilities
const renderComponent = (props: Partial<${name}Props> = {}) => {
  const defaultProps: ${name}Props = {
    children: 'Test ${name}',
    ...props,
  };

  return {
    user: userEvent.setup(),
    ...render(<${name} {...defaultProps} />),
  };
};

describe('${name}', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      renderComponent();
      
      expect(screen.getByRole('${this.getAriaRole(type)}')).toBeInTheDocument();
      expect(screen.getByText('Test ${name}')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderComponent({ className: 'custom-class' });
      
      expect(screen.getByRole('${this.getAriaRole(type)}')).toHaveClass('custom-class');
    });

    it('renders loading state correctly', () => {
      renderComponent({ loading: true });
      
      expect(screen.getByRole('${this.getAriaRole(type)}')).toBeDisabled();
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      const icon = <span data-testid="test-icon">🎯</span>;
      renderComponent({ icon });
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onAction when clicked', async () => {
      const onAction = vi.fn();
      const { user } = renderComponent({ onAction });
      
      await user.click(screen.getByRole('${this.getAriaRole(type)}'));
      
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('does not call onAction when disabled', async () => {
      const onAction = vi.fn();
      const { user } = renderComponent({ onAction, disabled: true });
      
      await user.click(screen.getByRole('${this.getAriaRole(type)}'));
      
      expect(onAction).not.toHaveBeenCalled();
    });

    it('does not call onAction when loading', async () => {
      const onAction = vi.fn();
      const { user } = renderComponent({ onAction, loading: true });
      
      await user.click(screen.getByRole('${this.getAriaRole(type)}'));
      
      expect(onAction).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('applies variant classes correctly', () => {
      renderComponent({ variant: 'secondary' });
      
      expect(screen.getByRole('${this.getAriaRole(type)}')).toHaveClass('bg-secondary');
    });

    it('applies size classes correctly', () => {
      renderComponent({ size: 'lg' });
      
      expect(screen.getByRole('${this.getAriaRole(type)}')).toHaveClass('h-11');
    });
  });

  describe('Accessibility', () => {
    it('is accessible via keyboard', async () => {
      const onAction = vi.fn();
      renderComponent({ onAction });
      
      const element = screen.getByRole('${this.getAriaRole(type)}');
      element.focus();
      
      expect(element).toHaveFocus();
      
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('has proper ARIA attributes', () => {
      renderComponent({ disabled: true });
      
      expect(screen.getByRole('${this.getAriaRole(type)}')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Error Handling', () => {
    it('handles undefined onAction gracefully', async () => {
      const { user } = renderComponent({ onAction: undefined });
      
      await expect(
        user.click(screen.getByRole('${this.getAriaRole(type)}'))
      ).resolves.not.toThrow();
    });
  });
});
`;
  }

  private generateStoryFile(name: string, type: string): string {
    return `/**
 * ${name} Component Stories
 * Storybook documentation and testing
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ${name} } from './${this.toKebabCase(name)}';

const meta: Meta<typeof ${name}> = {
  title: '${this.getStoryCategory(type)}/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: \`
${name} component following clean architecture patterns.

### Features
- Multiple variants and sizes
- Loading states
- Icon support
- Full accessibility
- Keyboard navigation
- TypeScript support
        \`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the component',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the component',
    },
    onAction: {
      action: 'clicked',
      description: 'Callback when action is performed',
    },
  },
  args: {
    children: '${name}',
    onAction: action('onAction'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {};

// Variant stories
export const Primary: Story = {
  args: {
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
  },
};

// Size stories
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🎯',
  },
};

// State stories
export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// With Icon
export const WithIcon: Story = {
  args: {
    icon: <span>🚀</span>,
    children: 'Launch',
  },
};

// Interactive example
export const Interactive: Story = {
  render: (args) => {
    return (
      <div className="space-y-4">
        <div className="space-x-2">
          <${name} {...args} variant="default">Default</${name}>
          <${name} {...args} variant="secondary">Secondary</${name}>
          <${name} {...args} variant="outline">Outline</${name}>
        </div>
        <div className="space-x-2">
          <${name} {...args} size="sm">Small</${name}>
          <${name} {...args}>Default</${name}>
          <${name} {...args} size="lg">Large</${name}>
        </div>
        <div className="space-x-2">
          <${name} {...args} loading>Loading</${name}>
          <${name} {...args} disabled>Disabled</${name}>
        </div>
      </div>
    );
  },
};
`;
  }

  private generateServiceFile(
    serviceName: string,
    interfaceName: string,
    domain?: string
  ): string {
    return `/**
 * ${serviceName}
 * ${domain ? `Domain service for ${domain}` : 'Application service'} following clean architecture
 */

import { injectable, inject } from 'inversify';
import type { ${interfaceName} } from './${this.toKebabCase(serviceName)}.interface';

// Dependencies (injected via DI container)
interface Dependencies {
  logger: ILogger;
  cache: ICacheService;
  ${domain ? `${domain}Repository: I${this.toPascalCase(domain)}Repository;` : ''}
}

@injectable()
export class ${serviceName} implements ${interfaceName} {
  constructor(
    @inject('logger') private logger: ILogger,
    @inject('cache') private cache: ICacheService,
    ${domain ? `@inject('${domain}Repository') private ${domain}Repository: I${this.toPascalCase(domain)}Repository,` : ''}
  ) {}

  /**
   * Primary service method
   * Implements business logic with proper error handling
   */
  async performAction(input: ActionInput): Promise<ActionResult> {
    try {
      this.logger.info('${serviceName}.performAction started', { input });
      
      // Validate input
      this.validateInput(input);
      
      // Check cache first
      const cacheKey = this.generateCacheKey(input);
      const cached = await this.cache.get<ActionResult>(cacheKey);
      
      if (cached) {
        this.logger.info('${serviceName}.performAction cache hit', { cacheKey });
        return cached;
      }
      
      // Perform business logic
      const result = await this.executeBusinessLogic(input);
      
      // Cache result
      await this.cache.set(cacheKey, result, { ttl: 300 }); // 5 minutes
      
      this.logger.info('${serviceName}.performAction completed', { result });
      return result;
      
    } catch (error) {
      this.logger.error('${serviceName}.performAction failed', { error, input });
      
      if (error instanceof ValidationError) {
        throw error; // Re-throw validation errors
      }
      
      throw new ServiceError(
        \`${serviceName} action failed: \${error instanceof Error ? error.message : 'Unknown error'}\`,
        'SERVICE_ERROR',
        { originalError: error, input }
      );
    }
  }

  /**
   * Secondary service methods
   */
  async getById(id: string): Promise<ActionResult | null> {
    try {
      this.logger.info('${serviceName}.getById started', { id });
      
      if (!id || typeof id !== 'string') {
        throw new ValidationError('Invalid ID provided');
      }
      
      ${
        domain
          ? `
      const result = await this.${domain}Repository.findById(id);
      `
          : `
      // Implementation depends on your domain
      const result = await this.fetchById(id);
      `
      }
      
      this.logger.info('${serviceName}.getById completed', { id, found: !!result });
      return result;
      
    } catch (error) {
      this.logger.error('${serviceName}.getById failed', { error, id });
      throw error;
    }
  }

  async search(criteria: SearchCriteria): Promise<ActionResult[]> {
    try {
      this.logger.info('${serviceName}.search started', { criteria });
      
      this.validateSearchCriteria(criteria);
      
      ${
        domain
          ? `
      const results = await this.${domain}Repository.search(criteria);
      `
          : `
      // Implementation depends on your domain
      const results = await this.performSearch(criteria);
      `
      }
      
      this.logger.info('${serviceName}.search completed', { 
        criteria, 
        resultCount: results.length 
      });
      
      return results;
      
    } catch (error) {
      this.logger.error('${serviceName}.search failed', { error, criteria });
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private validateInput(input: ActionInput): void {
    if (!input) {
      throw new ValidationError('Input is required');
    }
    
    // Add specific validation logic here
    if (!input.requiredField) {
      throw new ValidationError('Required field is missing');
    }
  }

  private validateSearchCriteria(criteria: SearchCriteria): void {
    if (!criteria) {
      throw new ValidationError('Search criteria is required');
    }
    
    // Add specific validation logic
  }

  private generateCacheKey(input: ActionInput): string {
    return \`\${${serviceName}.name}:action:\${JSON.stringify(input)}\`;
  }

  private async executeBusinessLogic(input: ActionInput): Promise<ActionResult> {
    // Implement your specific business logic here
    
    ${
      domain
        ? `
    // Domain-specific implementation
    const domainEntity = await this.${domain}Repository.create(input);
    
    return {
      id: domainEntity.id,
      success: true,
      data: domainEntity,
      timestamp: new Date(),
    };
    `
        : `
    // Generic implementation - customize for your needs
    return {
      id: this.generateId(),
      success: true,
      data: input,
      timestamp: new Date(),
    };
    `
    }
  }

  ${
    domain
      ? ''
      : `
  private async fetchById(id: string): Promise<ActionResult | null> {
    // Implement data fetching logic
    throw new Error('Method not implemented');
  }

  private async performSearch(criteria: SearchCriteria): Promise<ActionResult[]> {
    // Implement search logic
    throw new Error('Method not implemented');
  }

  private generateId(): string {
    return \`\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }
  `
  }
}

// Types for this service
export interface ActionInput {
  requiredField: string;
  optionalField?: string;
  metadata?: Record<string, unknown>;
}

export interface ActionResult {
  id: string;
  success: boolean;
  data: unknown;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SearchCriteria {
  query?: string;
  filters?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// Custom error classes
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
`;
  }

  private generateServiceInterface(
    interfaceName: string,
    serviceName: string
  ): string {
    return `/**
 * ${interfaceName}
 * Service interface defining contract for ${serviceName}
 */

import type { 
  ActionInput, 
  ActionResult, 
  SearchCriteria 
} from './${this.toKebabCase(serviceName.replace('Service', ''))}';

/**
 * Interface defining the contract for ${serviceName}
 * Following Interface Segregation Principle
 */
export interface ${interfaceName} {
  /**
   * Perform primary action
   * @param input - Action input parameters
   * @returns Promise resolving to action result
   * @throws ValidationError for invalid input
   * @throws ServiceError for service failures
   */
  performAction(input: ActionInput): Promise<ActionResult>;

  /**
   * Get entity by ID
   * @param id - Unique identifier
   * @returns Promise resolving to entity or null if not found
   * @throws ValidationError for invalid ID
   */
  getById(id: string): Promise<ActionResult | null>;

  /**
   * Search entities by criteria
   * @param criteria - Search parameters
   * @returns Promise resolving to array of matching entities
   * @throws ValidationError for invalid criteria
   */
  search(criteria: SearchCriteria): Promise<ActionResult[]>;
}

/**
 * Extended interface for services that need additional capabilities
 */
export interface ${interfaceName}Extended extends ${interfaceName} {
  /**
   * Create new entity
   */
  create(input: ActionInput): Promise<ActionResult>;

  /**
   * Update existing entity
   */
  update(id: string, input: Partial<ActionInput>): Promise<ActionResult>;

  /**
   * Delete entity
   */
  delete(id: string): Promise<boolean>;

  /**
   * Bulk operations
   */
  bulkCreate(inputs: ActionInput[]): Promise<ActionResult[]>;
  bulkUpdate(updates: Array<{ id: string; input: Partial<ActionInput> }>): Promise<ActionResult[]>;
  bulkDelete(ids: string[]): Promise<boolean>;
}

/**
 * Service health and monitoring interface
 */
export interface ${interfaceName}Health {
  /**
   * Check service health
   */
  checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: Date;
    details?: Record<string, unknown>;
  }>;

  /**
   * Get service metrics
   */
  getMetrics(): Promise<{
    operationsCount: number;
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
  }>;
}
`;
  }

  private generateServiceTest(
    serviceName: string,
    interfaceName: string
  ): string {
    return `/**
 * ${serviceName} Tests
 * Comprehensive service testing with mocks and integration tests
 */

import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { Container } from 'inversify';

import { ${serviceName} } from './${this.toKebabCase(serviceName)}';
import type { ${interfaceName} } from './${this.toKebabCase(serviceName)}.interface';
import type { ActionInput, ActionResult, SearchCriteria } from './${this.toKebabCase(serviceName)}';

// Mock dependencies
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

const mockCache = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
};

const mockRepository = {
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  search: vi.fn(),
};

describe('${serviceName}', () => {
  let service: ${interfaceName};
  let container: Container;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup DI container
    container = new Container();
    container.bind('logger').toConstantValue(mockLogger);
    container.bind('cache').toConstantValue(mockCache);
    container.bind('repository').toConstantValue(mockRepository);
    
    // Create service instance
    service = new ${serviceName}(mockLogger, mockCache, mockRepository);
  });

  describe('performAction', () => {
    const validInput: ActionInput = {
      requiredField: 'test-value',
      optionalField: 'optional-test',
    };

    it('should successfully perform action with valid input', async () => {
      // Arrange
      const expectedResult: ActionResult = {
        id: 'test-id',
        success: true,
        data: validInput,
        timestamp: new Date(),
      };
      
      mockCache.get.mockResolvedValue(null); // No cache hit
      mockRepository.create.mockResolvedValue({ id: 'test-id', ...validInput });

      // Act
      const result = await service.performAction(validInput);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        success: true,
        data: expect.any(Object),
        id: expect.any(String),
        timestamp: expect.any(Date),
      }));
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        '${serviceName}.performAction started',
        { input: validInput }
      );
      
      expect(mockCache.set).toHaveBeenCalled();
    });

    it('should return cached result when available', async () => {
      // Arrange
      const cachedResult: ActionResult = {
        id: 'cached-id',
        success: true,
        data: validInput,
        timestamp: new Date(),
      };
      
      mockCache.get.mockResolvedValue(cachedResult);

      // Act
      const result = await service.performAction(validInput);

      // Assert
      expect(result).toBe(cachedResult);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        '${serviceName}.performAction cache hit',
        { cacheKey: expect.any(String) }
      );
    });

    it('should throw ValidationError for invalid input', async () => {
      // Arrange
      const invalidInput = { requiredField: '' } as ActionInput;

      // Act & Assert
      await expect(service.performAction(invalidInput)).rejects.toThrow('Required field is missing');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should throw ValidationError for null input', async () => {
      // Act & Assert
      await expect(service.performAction(null as unknown as ActionInput)).rejects.toThrow('Input is required');
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockCache.get.mockResolvedValue(null);
      mockRepository.create.mockRejectedValue(new Error('Repository error'));

      // Act & Assert
      await expect(service.performAction(validInput)).rejects.toThrow('${serviceName} action failed');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should retrieve entity by valid ID', async () => {
      // Arrange
      const id = 'test-id';
      const expectedResult: ActionResult = {
        id,
        success: true,
        data: { test: 'data' },
        timestamp: new Date(),
      };
      
      mockRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.getById(id);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockLogger.info).toHaveBeenCalledWith(
        '${serviceName}.getById started',
        { id }
      );
    });

    it('should return null for non-existent ID', async () => {
      // Arrange
      const id = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.getById(id);

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
    });

    it('should throw ValidationError for invalid ID', async () => {
      // Act & Assert
      await expect(service.getById('')).rejects.toThrow('Invalid ID provided');
      await expect(service.getById(null as unknown as string)).rejects.toThrow('Invalid ID provided');
    });
  });

  describe('search', () => {
    const validCriteria: SearchCriteria = {
      query: 'test query',
      filters: { active: true },
      pagination: { page: 1, limit: 10 },
    };

    it('should search with valid criteria', async () => {
      // Arrange
      const expectedResults: ActionResult[] = [
        {
          id: 'result-1',
          success: true,
          data: { name: 'Test 1' },
          timestamp: new Date(),
        },
        {
          id: 'result-2',
          success: true,
          data: { name: 'Test 2' },
          timestamp: new Date(),
        },
      ];
      
      mockRepository.search.mockResolvedValue(expectedResults);

      // Act
      const results = await service.search(validCriteria);

      // Assert
      expect(results).toBe(expectedResults);
      expect(mockRepository.search).toHaveBeenCalledWith(validCriteria);
      expect(mockLogger.info).toHaveBeenCalledWith(
        '${serviceName}.search completed',
        { criteria: validCriteria, resultCount: expectedResults.length }
      );
    });

    it('should throw ValidationError for null criteria', async () => {
      // Act & Assert
      await expect(service.search(null as unknown as SearchCriteria)).rejects.toThrow('Search criteria is required');
    });

    it('should handle empty search results', async () => {
      // Arrange
      mockRepository.search.mockResolvedValue([]);

      // Act
      const results = await service.search(validCriteria);

      // Assert
      expect(results).toEqual([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should log errors appropriately', async () => {
      // Arrange
      const invalidInput = null as unknown as ActionInput;

      // Act
      try {
        await service.performAction(invalidInput);
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        '${serviceName}.performAction failed',
        expect.objectContaining({
          error: expect.any(Error),
          input: invalidInput,
        })
      );
    });

    it('should preserve original error context', async () => {
      // Arrange
      const originalError = new Error('Original error message');
      mockCache.get.mockResolvedValue(null);
      mockRepository.create.mockRejectedValue(originalError);

      // Act & Assert
      try {
        await service.performAction({ requiredField: 'test' });
      } catch (error) {
        expect(error).toHaveProperty('message', expect.stringContaining('${serviceName} action failed'));
        expect(error).toHaveProperty('context');
      }
    });
  });

  describe('Integration Tests', () => {
    it('should work end-to-end with real dependencies', async () => {
      // This would use real dependencies instead of mocks
      // Useful for integration testing
    });
  });
});
`;
  }

  // Utility methods
  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  private getComponentDescription(type: string): string {
    const descriptions = {
      ui: 'Reusable UI component following design system patterns',
      feature: 'Feature-specific component with business logic',
      page: 'Page-level component handling routing and layout',
      layout: 'Layout component for consistent page structure',
    };
    return (
      descriptions[type as keyof typeof descriptions] ||
      'Component with clean architecture patterns'
    );
  }

  private getBaseElement(type: string): string {
    const elements = {
      ui: 'button',
      feature: 'div',
      page: 'main',
      layout: 'div',
    };
    return elements[type as keyof typeof elements] || 'div';
  }

  private getAriaRole(type: string): string {
    const roles = {
      ui: 'button',
      feature: 'button',
      page: 'main',
      layout: 'region',
    };
    return roles[type as keyof typeof roles] || 'button';
  }

  private getStoryCategory(type: string): string {
    const categories = {
      ui: 'UI Components',
      feature: 'Feature Components',
      page: 'Pages',
      layout: 'Layout',
    };
    return categories[type as keyof typeof categories] || 'Components';
  }

  private generateTypeFile(name: string, propsInterface?: string): string {
    return `/**
 * ${name} Types
 * TypeScript definitions for ${name} component
 */

import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

// Re-export component types
export type { ${propsInterface || `${name}Props`} } from './${this.toKebabCase(name)}';

// Additional domain-specific types can be added here
export interface ${name}State {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface ${name}Context {
  state: ${name}State;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}
`;
  }

  private generateIndexFile(name: string): string {
    return `/**
 * ${name} Module Exports
 * Barrel export for clean imports
 */

export { ${name}, ${name.toLowerCase()}Variants } from './${this.toKebabCase(name)}';
export type { ${name}Props } from './${this.toKebabCase(name)}';
export type { ${name}State, ${name}Context } from './${this.toKebabCase(name)}.types';
`;
  }

  private generateHookFile(hookName: string, _features: string[]): string {
    return `/**
 * ${hookName} Hook
 * Custom hook following React patterns and clean architecture
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ${hookName.replace('use', '')}Options {
  // Configuration options
  enabled?: boolean;
  refetchInterval?: number;
  retryCount?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface ${hookName.replace('use', '')}State {
  data: unknown | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export interface ${hookName.replace('use', '')}Actions {
  refetch: () => void;
  reset: () => void;
  mutate: (data: unknown) => Promise<void>;
}

export type ${hookName.replace('use', '')}Return = ${hookName.replace('use', '')}State & ${hookName.replace('use', '')}Actions;

/**
 * ${hookName} - Custom hook for managing state and side effects
 */
export function ${hookName}(
  options: ${hookName.replace('use', '')}Options = {}
): ${hookName.replace('use', '')}Return {
  const {
    enabled = true,
    refetchInterval,
    retryCount = 3,
    onSuccess,
    onError,
  } = options;

  const queryClient = useQueryClient();

  // Query for data fetching
  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['${hookName.replace('use', '').toLowerCase()}'],
    queryFn: async () => {
      // Implement your data fetching logic here
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(\`Failed to fetch: \${response.statusText}\`);
      }
      return response.json();
    },
    enabled,
    refetchInterval,
    retry: retryCount,
    onSuccess,
    onError,
  });

  // Mutation for data updates
  const mutation = useMutation({
    mutationFn: async (newData: unknown) => {
      // Implement your mutation logic here
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      
      if (!response.ok) {
        throw new Error(\`Failed to update: \${response.statusText}\`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['${hookName.replace('use', '').toLowerCase()}'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Memoized actions
  const actions = useMemo(() => ({
    refetch: () => {
      queryRefetch();
    },
    reset: () => {
      queryClient.resetQueries({ queryKey: ['${hookName.replace('use', '').toLowerCase()}'] });
    },
    mutate: async (newData: unknown) => {
      return mutation.mutateAsync(newData);
    },
  }), [queryRefetch, queryClient, mutation]);

  // Return hook interface
  return {
    data,
    isLoading: isLoading || mutation.isPending,
    isError: isError || mutation.isError,
    error: error || mutation.error,
    isSuccess,
    ...actions,
  };
}

// Export hook variations for different use cases
export function ${hookName}WithLocalState(
  initialData: unknown = null,
  options: ${hookName.replace('use', '')}Options = {}
): ${hookName.replace('use', '')}Return {
  const [localData, setLocalData] = useState(initialData);
  const hookResult = ${hookName}(options);

  // Override data with local state if available
  return {
    ...hookResult,
    data: localData || hookResult.data,
    mutate: async (newData: unknown) => {
      setLocalData(newData);
      return hookResult.mutate(newData);
    },
  };
}

// Hook for optimistic updates
export function ${hookName}Optimistic(
  options: ${hookName.replace('use', '')}Options = {}
): ${hookName.replace('use', '')}Return {
  const hookResult = ${hookName}(options);
  const [optimisticData, setOptimisticData] = useState<unknown | null>(null);

  const optimisticMutate = useCallback(async (newData: unknown) => {
    // Set optimistic data immediately
    setOptimisticData(newData);
    
    try {
      await hookResult.mutate(newData);
      setOptimisticData(null); // Clear optimistic data on success
    } catch (error) {
      setOptimisticData(null); // Clear optimistic data on error
      throw error;
    }
  }, [hookResult]);

  return {
    ...hookResult,
    data: optimisticData || hookResult.data,
    mutate: optimisticMutate,
  };
}
`;
  }

  private generateHookTest(hookName: string): string {
    return `/**
 * ${hookName} Hook Tests
 * Comprehensive testing for custom hooks
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { ${hookName}, ${hookName}WithLocalState, ${hookName}Optimistic } from './${this.toKebabCase(hookName)}';

// Mock fetch
global.fetch = vi.fn();

// Test wrapper with React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('${hookName}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should fetch data successfully', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // Act
      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle fetch errors', async () => {
      // Arrange
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      // Act
      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain('Failed to fetch');
      expect(result.current.isLoading).toBe(false);
    });

    it('should be disabled when enabled is false', () => {
      // Act
      const { result } = renderHook(
        () => ${hookName}({ enabled: false }),
        { wrapper: createWrapper() }
      );

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('Actions', () => {
    it('should refetch data when refetch is called', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Act
      result.current.refetch();

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should mutate data successfully', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      const newData = { id: 1, name: 'Updated' };
      
      (fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => newData,
        });

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Act
      await result.current.mutate(newData);

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    });

    it('should handle mutation errors', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      
      (fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Bad Request',
        });

      const { result } = renderHook(() => ${hookName}(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Act & Assert
      await expect(result.current.mutate({ invalid: 'data' })).rejects.toThrow('Failed to update');
    });
  });

  describe('Callback options', () => {
    it('should call onSuccess when data is fetched', async () => {
      // Arrange
      const onSuccess = vi.fn();
      const mockData = { id: 1, name: 'Test' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // Act
      renderHook(() => ${hookName}({ onSuccess }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockData);
      });
    });

    it('should call onError when fetch fails', async () => {
      // Arrange
      const onError = vi.fn();
      
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error',
      });

      // Act
      renderHook(() => ${hookName}({ onError }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('${hookName}WithLocalState', () => {
    it('should use local state when provided', () => {
      // Arrange
      const initialData = { id: 1, name: 'Local' };

      // Act
      const { result } = renderHook(
        () => ${hookName}WithLocalState(initialData),
        { wrapper: createWrapper() }
      );

      // Assert
      expect(result.current.data).toEqual(initialData);
    });
  });

  describe('${hookName}Optimistic', () => {
    it('should show optimistic updates immediately', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      const newData = { id: 1, name: 'Optimistic' };
      
      (fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => newData,
        });

      const { result } = renderHook(() => ${hookName}Optimistic(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Act
      const mutatePromise = result.current.mutate(newData);

      // Assert - should show optimistic data immediately
      expect(result.current.data).toEqual(newData);

      await mutatePromise;
    });
  });
});
`;
  }

  private generateHookTypes(hookName: string): string {
    return `/**
 * ${hookName} Types
 * TypeScript definitions for ${hookName} hook
 */

// Re-export hook types
export type {
  ${hookName.replace('use', '')}Options,
  ${hookName.replace('use', '')}State,
  ${hookName.replace('use', '')}Actions,
  ${hookName.replace('use', '')}Return,
} from './${this.toKebabCase(hookName)}';

// Additional utility types
export type ${hookName.replace('use', '')}Status = 'idle' | 'loading' | 'success' | 'error';

export interface ${hookName.replace('use', '')}Config {
  cacheTime?: number;
  staleTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

export interface ${hookName.replace('use', '')}Error {
  code: string;
  message: string;
  context?: Record<string, unknown>;
}
`;
  }

  private generateHookIndex(hookName: string): string {
    return `/**
 * ${hookName} Module Exports
 * Barrel export for clean imports
 */

export {
  ${hookName},
  ${hookName}WithLocalState,
  ${hookName}Optimistic,
} from './${this.toKebabCase(hookName)}';

export type {
  ${hookName.replace('use', '')}Options,
  ${hookName.replace('use', '')}State,
  ${hookName.replace('use', '')}Actions,
  ${hookName.replace('use', '')}Return,
  ${hookName.replace('use', '')}Status,
  ${hookName.replace('use', '')}Config,
  ${hookName.replace('use', '')}Error,
} from './${this.toKebabCase(hookName)}.types';
`;
  }

  private generateServiceIndex(
    serviceName: string,
    interfaceName: string
  ): string {
    return `/**
 * ${serviceName} Module Exports
 * Barrel export for service and interface
 */

export { ${serviceName} } from './${this.toKebabCase(serviceName)}';
export type { ${interfaceName}, ${interfaceName}Extended, ${interfaceName}Health } from './${this.toKebabCase(serviceName)}.interface';
export type {
  ActionInput,
  ActionResult,
  SearchCriteria,
  ServiceError,
  ValidationError,
} from './${this.toKebabCase(serviceName)}';
`;
  }
}

// Export the generator
export const codeGenerator = new CodeGenerator();
