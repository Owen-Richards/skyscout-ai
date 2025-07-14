import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle, ThemeSelect } from './theme-toggle';
import { ThemeProvider } from './theme-provider';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle button to switch between light and dark themes. Can optionally include system theme preference.',
      },
    },
  },
  decorators: [
    Story => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    showLabels: {
      control: 'boolean',
      description: 'Show text labels alongside icons',
    },
    showSystem: {
      control: 'boolean',
      description: 'Include system theme option',
    },
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'ghost',
        'link',
        'destructive',
        'secondary',
      ],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default theme toggle button with icon only
 */
export const Default: Story = {
  args: {
    showLabels: false,
    showSystem: false,
    variant: 'ghost',
    size: 'icon',
  },
};

/**
 * Theme toggle with text labels
 */
export const WithLabels: Story = {
  args: {
    showLabels: true,
    showSystem: false,
    variant: 'outline',
    size: 'default',
  },
};

/**
 * Theme toggle including system preference option
 */
export const WithSystem: Story = {
  args: {
    showLabels: true,
    showSystem: true,
    variant: 'outline',
    size: 'default',
  },
};

/**
 * Different button variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center flex-wrap">
      <ThemeToggle variant="default" size="icon" />
      <ThemeToggle variant="outline" size="icon" />
      <ThemeToggle variant="ghost" size="icon" />
      <ThemeToggle variant="secondary" size="icon" />
    </div>
  ),
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ThemeToggle size="sm" />
      <ThemeToggle size="default" />
      <ThemeToggle size="lg" />
      <ThemeToggle size="icon" />
    </div>
  ),
};

// Theme Select Stories
const selectMeta: Meta<typeof ThemeSelect> = {
  title: 'Components/Theme/ThemeSelect',
  component: ThemeSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A segmented control for selecting between light, dark, and system themes.',
      },
    },
  },
  decorators: [
    Story => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme-select">
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    showLabels: {
      control: 'boolean',
      description: 'Show text labels',
    },
    showSystem: {
      control: 'boolean',
      description: 'Include system theme option',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
  },
  tags: ['autodocs'],
};

type SelectStory = StoryObj<typeof selectMeta>;

/**
 * Default theme selector
 */
export const SelectDefault: SelectStory = {
  args: {
    showLabels: true,
    showSystem: true,
    orientation: 'horizontal',
  },
};

/**
 * Compact theme selector without labels
 */
export const SelectCompact: SelectStory = {
  args: {
    showLabels: false,
    showSystem: true,
    orientation: 'horizontal',
  },
};

/**
 * Vertical theme selector
 */
export const SelectVertical: SelectStory = {
  args: {
    showLabels: true,
    showSystem: true,
    orientation: 'vertical',
  },
};

/**
 * Theme selector without system option
 */
export const SelectNoSystem: SelectStory = {
  args: {
    showLabels: true,
    showSystem: false,
    orientation: 'horizontal',
  },
};

// Export the select meta as well
export { selectMeta };
