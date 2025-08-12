import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton } from './toggle-button';
import {

  Heart,
  Bookmark,
  Star,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle button component built with Radix UI Toggle primitive. Perfect for binary states like favorites, bookmarks, or formatting options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
      description: 'The visual style variant of the toggle button',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      description: 'The size of the toggle button',
    },
    pressed: {
      control: 'boolean',
      description: 'The pressed state of the toggle button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the toggle button',
    },
    ripple: {
      control: 'boolean',
      description: 'Enable ripple effect on click',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Heart className="h-4 w-4" />,
    label: 'Like',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ToggleButton
        variant="default"
        icon={<Heart className="h-4 w-4" />}
        label="Default"
      />
      <ToggleButton
        variant="outline"
        icon={<Bookmark className="h-4 w-4" />}
        label="Outline"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ToggleButton
        size="sm"
        icon={<Star className="h-3 w-3" />}
        label="Small"
      />
      <ToggleButton
        size="default"
        icon={<Heart className="h-4 w-4" />}
        label="Default"
      />
      <ToggleButton
        size="lg"
        icon={<Bookmark className="h-5 w-5" />}
        label="Large"
      />
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ToggleButton size="icon-sm" icon={<Heart className="h-3 w-3" />} />
      <ToggleButton size="icon" icon={<Bookmark className="h-4 w-4" />} />
      <ToggleButton size="icon-lg" icon={<Star className="h-5 w-5" />} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ToggleButton icon={<Heart className="h-4 w-4" />} label="Normal" />
      <ToggleButton
        pressed
        icon={<Heart className="h-4 w-4" />}
        label="Pressed"
      />
      <ToggleButton
        disabled
        icon={<Heart className="h-4 w-4" />}
        label="Disabled"
      />
      <ToggleButton
        disabled
        pressed
        icon={<Heart className="h-4 w-4" />}
        label="Disabled Pressed"
      />
    </div>
  ),
};

export const WithRipple: Story = {
  args: {
    icon: <Heart className="h-4 w-4" />,
    label: 'Like with Ripple',
    ripple: true,
  },
};

export const MediaControls: Story = {
  render: () => (
    <div className="flex gap-2 items-center p-4 bg-card rounded-lg border">
      <h4 className="text-sm font-medium mr-4">Media Controls</h4>
      <ToggleButton size="icon" icon={<Play className="h-4 w-4" />} />
      <ToggleButton size="icon" icon={<Pause className="h-4 w-4" />} />
      <ToggleButton size="icon" icon={<Volume2 className="h-4 w-4" />} />
      <ToggleButton size="icon" icon={<VolumeX className="h-4 w-4" />} />
    </div>
  ),
};

export const TextFormatting: Story = {
  render: () => (
    <div className="flex gap-1 items-center p-4 bg-card rounded-lg border">
      <h4 className="text-sm font-medium mr-4">Text Formatting</h4>
      <ToggleButton
        variant="outline"
        size="icon"
        icon={<Bold className="h-4 w-4" />}
      />
      <ToggleButton
        variant="outline"
        size="icon"
        icon={<Italic className="h-4 w-4" />}
      />
      <ToggleButton
        variant="outline"
        size="icon"
        icon={<Underline className="h-4 w-4" />}
      />
    </div>
  ),
};

export const FlightBookingExample: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-card rounded-lg border max-w-md">
      <h4 className="font-medium">Flight Preferences</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Save to favorites</span>
          <ToggleButton
            size="icon"
            icon={<Heart className="h-4 w-4" />}
            ripple
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Add to watchlist</span>
          <ToggleButton
            size="icon"
            icon={<Bookmark className="h-4 w-4" />}
            ripple
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Priority booking</span>
          <ToggleButton
            size="icon"
            icon={<Star className="h-4 w-4" />}
            ripple
          />
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    icon: <Heart className="h-4 w-4" />,
    label: 'Click to toggle',
    ripple: true,
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click the toggle button to see the state change and ripple effect.',
      },
    },
  },
};
