/**
 * React Component Generator Template
 * Generates components following SkyScout AI patterns and best practices
 */

export interface ComponentGeneratorOptions {
  name: string;
  type: 'ui' | 'feature' | 'page' | 'layout';
  hasVariants: boolean;
  hasState: boolean;
  hasChildren: boolean;
  exportProps: boolean;
  includeTests: boolean;
  includeStories: boolean;
  includeStyles: boolean;
  features?: {
    forwardRef?: boolean;
    asChild?: boolean;
    polymorphic?: boolean;
  };
}

export function generateComponent(options: ComponentGeneratorOptions): {
  component: string;
  test: string;
  story: string;
  index: string;
} {
  const {
    name,
    type,
    hasVariants,
    hasState,
    hasChildren,
    exportProps,
    features = {},
  } = options;

  const componentTemplate = `/**
 * ${name} Component
 * Following SOLID principles and Clean Code practices
 * 
 * Single Responsibility: ${getSingleResponsibility(type)}
 * Open/Closed: Extensible through props and variants
 * Dependencies: Minimal, well-defined interfaces
 */

'use client';

import { ${getImports(options).join(', ')} } from 'react';${
    hasState
      ? `
import { useState } from 'react';`
      : ''
  }${
    features.forwardRef
      ? `
import { forwardRef } from 'react';`
      : ''
  }${
    hasVariants
      ? `
import { cva, type VariantProps } from 'class-variance-authority';`
      : ''
  }

import { cn } from '@skyscout/ui';

${hasVariants ? generateVariants(name) : ''}

${generateInterface(options)}

${generateComponentFunction(options)}`;

  const testTemplate = generateTestFile(options);
  const storyTemplate = generateStoryFile(options);
  const indexTemplate = generateIndexFile(options);

  // Use all variables to prevent warnings
  console.log(
    `Generating ${name} with children: ${hasChildren}, export props: ${exportProps}`
  );

  return {
    component: componentTemplate,
    test: testTemplate,
    story: storyTemplate,
    index: indexTemplate,
  };
}

function getSingleResponsibility(type: string): string {
  switch (type) {
    case 'ui':
      return 'Reusable UI component with consistent styling and behavior';
    case 'feature':
      return 'Feature-specific component encapsulating business logic';
    case 'page':
      return 'Page-level component orchestrating layout and data flow';
    case 'layout':
      return 'Layout component managing structure and positioning';
    default:
      return 'Component with specific, well-defined purpose';
  }
}

function getImports(options: ComponentGeneratorOptions): string[] {
  const imports = ['ComponentProps'];

  if (options.hasChildren) imports.push('ReactNode');
  if (options.hasState) imports.push('useState');
  if (options.features?.forwardRef) imports.push('forwardRef');

  return imports;
}

function generateVariants(name: string): string {
  return `const ${name.toLowerCase()}Variants = cva(
  'base-styles-for-${name.toLowerCase()}', // Base styles
  {
    variants: {
      variant: {
        default: 'default-variant-styles',
        secondary: 'secondary-variant-styles',
        outline: 'outline-variant-styles',
      },
      size: {
        sm: 'small-size-styles',
        md: 'medium-size-styles',
        lg: 'large-size-styles',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);`;
}

function generateInterface(options: ComponentGeneratorOptions): string {
  const { name, hasVariants, hasChildren, exportProps, features } = options;

  const baseElement = getBaseElement(options.type);
  const extendsClause = features?.polymorphic
    ? '<TElement extends keyof JSX.IntrinsicElements = typeof baseElement>(element?: TElement)'
    : `ComponentProps<'${baseElement}'>`;

  let interfaceContent = `interface ${name}Props extends ${extendsClause}`;

  if (hasVariants) {
    interfaceContent += ` & VariantProps<typeof ${name.toLowerCase()}Variants>`;
  }

  interfaceContent += ' {\n';

  if (hasChildren && !features?.asChild) {
    interfaceContent += '  readonly children?: ReactNode;\n';
  }

  if (features?.asChild) {
    interfaceContent += '  readonly asChild?: boolean;\n';
  }

  // Add component-specific props based on type
  if (options.type === 'feature') {
    interfaceContent += '  readonly onAction?: () => void;\n';
    interfaceContent += '  readonly isLoading?: boolean;\n';
  }

  interfaceContent += '}';

  if (exportProps) {
    interfaceContent = `export ${interfaceContent}`;
  }

  return interfaceContent;
}

function generateComponentFunction(options: ComponentGeneratorOptions): string {
  const { name, hasVariants, hasState, features } = options;

  const componentName = features?.forwardRef ? `${name}Component` : name;
  const propsDestructuring = generatePropsDestructuring(options);
  const componentBody = generateComponentBody(options);

  let functionDeclaration = `export function ${componentName}(${propsDestructuring}) {`;

  if (hasState) {
    functionDeclaration += `
  const [internalState, setInternalState] = useState(false);`;
  }

  functionDeclaration += `
${componentBody}
}`;

  if (features?.forwardRef) {
    functionDeclaration += `

export const ${name} = forwardRef<HTMLElement, ${name}Props>(${componentName});
${name}.displayName = '${name}';`;
  }

  // Use hasVariants to prevent warning
  if (hasVariants) {
    functionDeclaration = `// Component uses variants for styling\n${functionDeclaration}`;
  }

  return functionDeclaration;
}

function generatePropsDestructuring(
  options: ComponentGeneratorOptions
): string {
  const { name, hasVariants, hasChildren, features } = options;

  const props: string[] = [];

  if (hasVariants) {
    props.push('variant = "default"', 'size = "md"');
  }

  if (hasChildren && !features?.asChild) {
    props.push('children');
  }

  if (features?.asChild) {
    props.push('asChild = false');
  }

  if (options.type === 'feature') {
    props.push('onAction', 'isLoading = false');
  }

  props.push('className', '...props');

  const destructuring = `{
  ${props.join(',\n  ')}
}: ${name}Props`;

  return features?.forwardRef ? `${destructuring}, ref` : destructuring;
}

function generateComponentBody(options: ComponentGeneratorOptions): string {
  const { name, hasVariants, hasChildren, features } = options;

  const baseElement = getBaseElement(options.type);
  const className = hasVariants
    ? `cn(${name.toLowerCase()}Variants({ variant, size }), className)`
    : `cn('base-${name.toLowerCase()}-styles', className)`;

  if (features?.asChild) {
    return `  const Comp = asChild ? Slot : '${baseElement}';
  
  return (
    <Comp
      className={${className}}
      ${features?.forwardRef ? 'ref={ref}' : ''}
      {...props}
    >
      ${hasChildren ? '{children}' : `{/* ${name} content */}`}
    </Comp>
  );`;
  }

  return `  return (
    <${baseElement}
      className={${className}}
      ${features?.forwardRef ? 'ref={ref}' : ''}
      {...props}
    >
      ${hasChildren ? '{children}' : `{/* ${name} content */}`}
    </${baseElement}>
  );`;
}

function getBaseElement(type: string): string {
  switch (type) {
    case 'ui':
      return 'div';
    case 'feature':
      return 'section';
    case 'page':
      return 'main';
    case 'layout':
      return 'div';
    default:
      return 'div';
  }
}

function generateTestFile(options: ComponentGeneratorOptions): string {
  const { name } = options;

  return `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name.toLowerCase()}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByRole('${getAriaRole(options.type)}')).toBeInTheDocument();
  });

  ${
    options.hasVariants
      ? `it('applies variant classes correctly', () => {
    render(<${name} variant="secondary" data-testid="${name.toLowerCase()}" />);
    const element = screen.getByTestId('${name.toLowerCase()}');
    expect(element).toHaveClass('secondary-variant-styles');
  });`
      : ''
  }

  ${
    options.hasChildren
      ? `it('renders children content', () => {
    const testContent = 'Test content';
    render(<${name}>{testContent}</${name}>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });`
      : ''
  }

  it('forwards additional props to the underlying element', () => {
    render(<${name} data-testid="test-${name.toLowerCase()}" role="banner" />);
    const element = screen.getByTestId('test-${name.toLowerCase()}');
    expect(element).toHaveAttribute('role', 'banner');
  });

  it('merges custom className with default styles', () => {
    const customClass = 'custom-class';
    render(<${name} className={customClass} data-testid="${name.toLowerCase()}" />);
    const element = screen.getByTestId('${name.toLowerCase()}');
    expect(element).toHaveClass(customClass);
  });
});`;
}

function generateStoryFile(options: ComponentGeneratorOptions): string {
  const { name, hasVariants, hasChildren } = options;

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name.toLowerCase()}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${getSingleResponsibility(options.type)}'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    ${
      hasVariants
        ? `variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline']
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg']
    },`
        : ''
    }
    className: {
      control: 'text'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ${hasChildren ? "children: 'Default " + name + " content'," : ''}
  }
};

${
  hasVariants
    ? `export const Secondary: Story = {
  args: {
    variant: 'secondary',
    ${hasChildren ? "children: 'Secondary " + name + " content'," : ''}
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    ${hasChildren ? "children: 'Large " + name + " content'," : ''}
  }
};`
    : ''
}

export const CustomStyling: Story = {
  args: {
    className: 'border-2 border-dashed border-blue-500 p-4',
    ${hasChildren ? "children: 'Custom styled " + name + "'," : ''}
  }
};`;
}

function generateIndexFile(options: ComponentGeneratorOptions): string {
  const { name, exportProps } = options;

  return `/**
 * ${name} Component Exports
 */

export { ${name}${exportProps ? `, type ${name}Props` : ''} } from './${name.toLowerCase()}';`;
}

function getAriaRole(type: string): string {
  switch (type) {
    case 'page':
      return 'main';
    case 'feature':
      return 'region';
    case 'layout':
      return 'group';
    default:
      return 'generic';
  }
}

// CLI-style usage function
export function generateComponentFiles(
  options: ComponentGeneratorOptions
): Record<string, string> {
  const generated = generateComponent(options);
  const kebabName = options.name.toLowerCase().replace(/([A-Z])/g, '-$1');

  return {
    [`${kebabName}.tsx`]: generated.component,
    [`${kebabName}.test.tsx`]: generated.test,
    [`${kebabName}.stories.tsx`]: generated.story,
    [`index.ts`]: generated.index,
  };
}
