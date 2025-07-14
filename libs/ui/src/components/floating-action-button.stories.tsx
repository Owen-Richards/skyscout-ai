import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingActionButton } from './floating-action-button';
import {
  Plus,
  Heart,
  Plane,
  Search,
  Download,
  Settings,
  Share,
  Edit,
  MessageCircle,
} from 'lucide-react';

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating action button (FAB) component following Material Design principles. FABs represent the primary action of a screen and should be used sparingly.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'secondary',
        'destructive',
        'success',
        'warning',
        'destructive',
        'sky-primary',
        'flight-action',
        'altitude',
        'surface',
        'surface-variant',
      ],
      description: 'The visual style variant of the FAB',
    },
    size: {
      control: { type: 'select' },
      options: ['mini', 'default', 'large', 'extended'],
      description: 'The size of the FAB',
    },
    elevation: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high'],
      description: 'The shadow elevation level',
    },
    position: {
      control: { type: 'select' },
      options: [
        'static',
        'bottom-right',
        'bottom-left',
        'bottom-center',
        'top-right',
        'top-left',
      ],
      description: 'The position of the FAB on screen',
    },
    ripple: {
      control: 'boolean',
      description: 'Enable ripple effect on click',
    },
    visible: {
      control: 'boolean',
      description: 'Show/hide the FAB with animation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the FAB',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Plus className="h-6 w-6" />,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center">
      <FloatingActionButton
        variant="default"
        icon={<Plus className="h-6 w-6" />}
      />
      <FloatingActionButton
        variant="secondary"
        icon={<Settings className="h-6 w-6" />}
      />
      <FloatingActionButton
        variant="destructive"
        icon={<Heart className="h-6 w-6" />}
      />
      <FloatingActionButton
        variant="success"
        icon={<Download className="h-6 w-6" />}
      />
      <FloatingActionButton
        variant="warning"
        icon={<Edit className="h-6 w-6" />}
      />
      <FloatingActionButton
        variant="success"
        icon={<MessageCircle className="h-6 w-6" />}
      />
    </div>
  ),
};

export const AviationTheme: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center">
      <FloatingActionButton
        variant="flight-action"
        icon={<Plane className="h-6 w-6" />}
        label="Book Flight"
      />
      <FloatingActionButton
        variant="sky-primary"
        icon={<Search className="h-6 w-6" />}
        label="Search Flights"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <FloatingActionButton size="mini" icon={<Heart className="h-4 w-4" />} />
      <FloatingActionButton
        size="default"
        icon={<Plus className="h-6 w-6" />}
      />
      <FloatingActionButton size="large" icon={<Plane className="h-7 w-7" />} />
    </div>
  ),
};

export const Extended: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <FloatingActionButton
        size="extended"
        icon={<Plus className="h-5 w-5" />}
        label="Create New"
      />
      <FloatingActionButton
        size="extended"
        icon={<Search className="h-5 w-5" />}
        label="Search Flights"
        variant="flight-action"
      />
      <FloatingActionButton
        size="extended"
        icon={<Download className="h-5 w-5" />}
        label="Download Report"
        variant="success"
      />
    </div>
  ),
};

export const Elevations: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <FloatingActionButton
        elevation="low"
        icon={<Plus className="h-6 w-6" />}
        label="Low Elevation"
      />
      <FloatingActionButton
        elevation="medium"
        icon={<Plus className="h-6 w-6" />}
        label="Medium Elevation"
      />
      <FloatingActionButton
        elevation="high"
        icon={<Plus className="h-6 w-6" />}
        label="High Elevation"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <FloatingActionButton icon={<Plus className="h-6 w-6" />} />
      <FloatingActionButton
        disabled
        icon={<Settings className="h-6 w-6" />}
        variant="secondary"
      />
      <FloatingActionButton
        disabled
        icon={<Heart className="h-6 w-6" />}
        variant="destructive"
      />
    </div>
  ),
};

export const WithRipple: Story = {
  args: {
    icon: <Heart className="h-6 w-6" />,
    ripple: true,
    variant: 'destructive',
  },
};

export const FlightBookingExample: Story = {
  render: () => (
    <div className="relative h-64 w-96 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Flight Search Interface</h3>
      <p className="text-gray-600 mb-4">Primary action for booking flights</p>

      {/* Mini FAB for secondary action */}
      <FloatingActionButton
        size="mini"
        position="top-right"
        icon={<Heart className="h-4 w-4" />}
        variant="destructive"
        label="Save to favorites"
      />

      {/* Main FAB for primary action */}
      <FloatingActionButton
        position="bottom-right"
        size="extended"
        icon={<Plane className="h-5 w-5" />}
        label="Book Flight"
        variant="flight-action"
        ripple
      />
    </div>
  ),
};

export const Positioned: Story = {
  render: () => (
    <div className="relative h-80 w-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div className="absolute inset-4 bg-white rounded shadow-sm flex items-center justify-center text-gray-500">
        App Content Area
      </div>

      <FloatingActionButton
        position="bottom-right"
        icon={<Plus className="h-6 w-6" />}
        variant="default"
      />

      <FloatingActionButton
        position="bottom-left"
        size="mini"
        icon={<Settings className="h-4 w-4" />}
        variant="secondary"
      />

      <FloatingActionButton
        position="top-right"
        size="mini"
        icon={<Share className="h-4 w-4" />}
        variant="surface"
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    icon: <Plus className="h-6 w-6" />,
    ripple: true,
    variant: 'flight-action',
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the FAB to see the ripple effect in action.',
      },
    },
  },
};
