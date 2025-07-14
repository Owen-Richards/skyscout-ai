import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';
import { Star, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
        'ghost',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
    interactive: {
      control: { type: 'boolean' },
    },
    dot: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const WithDots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge dot variant="success">
        Online
      </Badge>
      <Badge dot variant="warning">
        Away
      </Badge>
      <Badge dot variant="destructive">
        Offline
      </Badge>
      <Badge dot variant="info">
        Busy
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge icon={<Star className="h-3 w-3" />} variant="warning">
        Featured
      </Badge>
      <Badge icon={<CheckCircle className="h-3 w-3" />} variant="success">
        Verified
      </Badge>
      <Badge icon={<AlertTriangle className="h-3 w-3" />} variant="destructive">
        Alert
      </Badge>
      <Badge icon={<Info className="h-3 w-3" />} variant="info">
        Info
      </Badge>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge
        interactive
        variant="default"
        onClick={() => alert('Default clicked')}
      >
        Clickable
      </Badge>
      <Badge
        interactive
        variant="outline"
        onClick={() => alert('Outline clicked')}
      >
        Button Badge
      </Badge>
      <Badge
        interactive
        variant="success"
        onClick={() => alert('Success clicked')}
      >
        Interactive
      </Badge>
    </div>
  ),
};

export const FlightStatuses: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Flight Status:</span>
        <Badge dot variant="success">
          On Time
        </Badge>
        <Badge dot variant="warning">
          Delayed
        </Badge>
        <Badge dot variant="destructive">
          Cancelled
        </Badge>
        <Badge dot variant="info">
          Boarding
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Cabin Class:</span>
        <Badge variant="outline">Economy</Badge>
        <Badge variant="secondary">Premium Economy</Badge>
        <Badge variant="default">Business</Badge>
        <Badge variant="warning">First Class</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Airlines:</span>
        <Badge variant="ghost">American Airlines</Badge>
        <Badge variant="ghost">Delta</Badge>
        <Badge variant="ghost">United</Badge>
        <Badge variant="ghost">Southwest</Badge>
      </div>
    </div>
  ),
};
