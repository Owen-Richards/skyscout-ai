/**
 * Simplebutton Component Stories
 * Storybook documentation and testing
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Simplebutton } from './simplebutton';

const meta: Meta<typeof Simplebutton> = {
  title: 'Feature Components/Simplebutton',
  component: Simplebutton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Simplebutton component following clean architecture patterns.

### Features
- Multiple variants and sizes
- Loading states
- Icon support
- Full accessibility
- Keyboard navigation
- TypeScript support
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
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
    children: 'Simplebutton',
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
  render: args => {
    return (
      <div className="space-y-4">
        <div className="space-x-2">
          <Simplebutton {...args} variant="default">
            Default
          </Simplebutton>
          <Simplebutton {...args} variant="secondary">
            Secondary
          </Simplebutton>
          <Simplebutton {...args} variant="outline">
            Outline
          </Simplebutton>
        </div>
        <div className="space-x-2">
          <Simplebutton {...args} size="sm">
            Small
          </Simplebutton>
          <Simplebutton {...args}>Default</Simplebutton>
          <Simplebutton {...args} size="lg">
            Large
          </Simplebutton>
        </div>
        <div className="space-x-2">
          <Simplebutton {...args} loading>
            Loading
          </Simplebutton>
          <Simplebutton {...args} disabled>
            Disabled
          </Simplebutton>
        </div>
      </div>
    );
  },
};
