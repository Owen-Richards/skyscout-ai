import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowRight,
  Download,
  Heart,
  Plane,
  Plus,
  Search,
  Settings,
  Share,
} from 'lucide-react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states. Built with accessibility in mind using Radix UI primitives.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'premium',
        'glass',
        'soft',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'success',
        'warning',
        'sky-primary',
        'flight-action',
        'altitude',
        'dawn',
        'sunset',
        'filled-tonal',
        'toggle',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: [
        'compact',
        'sm',
        'default',
        'lg',
        'xl',
        'premium',
        'hero',
        'icon',
        'icon-sm',
        'icon-lg',
        'icon-xl',
        'touch',
        'touch-lg',
      ],
      description: 'The size of the button',
    },
    effect: {
      control: { type: 'select' },
      options: [
        'none',
        'glow',
        'glow-warm',
        'glow-success',
        'glow-danger',
        'shimmer',
      ],
      description: 'Visual effect for enhanced interactivity',
    },
    shape: {
      control: { type: 'select' },
      options: ['default', 'rounded', 'square', 'pill', 'organic'],
      description: 'Button shape variant',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child component (useful for links)',
    },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Search className="h-4 w-4" />,
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Search className="h-4 w-4" />,
    children: 'Search Flights',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRight className="h-4 w-4" />,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <Download className="h-4 w-4" />,
    rightIcon: <Plus className="h-4 w-4" />,
    children: 'Download & Add',
  },
};

// Interactive examples
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="compact">Compact</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const AviationTheme: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Button variant="sky-primary" leftIcon={<Plane className="h-4 w-4" />}>
        Sky Scout
      </Button>
      <Button variant="flight-action" leftIcon={<Plane className="h-4 w-4" />}>
        Book Flight
      </Button>
      <Button variant="altitude" leftIcon={<Search className="h-4 w-4" />}>
        Search Routes
      </Button>
    </div>
  ),
};

export const EnhancedFeatures: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Button ripple leftIcon={<Heart className="h-4 w-4" />}>
        With Ripple Effect
      </Button>
      <Button loading variant="default">
        Loading State
      </Button>
      <Button disabled>Disabled State</Button>
      <Button fullWidth variant="outline" className="max-w-xs">
        Full Width Button
      </Button>
    </div>
  ),
};

export const TouchFriendly: Story = {
  render: () => (
    <div className="flex gap-3 items-center flex-wrap">
      <Button size="touch" leftIcon={<Search className="h-4 w-4" />}>
        Touch Size (44px)
      </Button>
      <Button size="touch-lg" leftIcon={<Plus className="h-4 w-4" />}>
        Large Touch (48px)
      </Button>
    </div>
  ),
};

export const ButtonShapes: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Button shape="default">Default</Button>
      <Button shape="rounded" variant="secondary">
        Rounded
      </Button>
      <Button shape="square" variant="outline">
        Square
      </Button>
      <Button shape="pill" variant="success">
        Pill Shape
      </Button>
    </div>
  ),
};

export const FlightSearchExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold">Flight Search Actions</h3>
      <div className="flex gap-2">
        <Button variant="default" leftIcon={<Search className="h-4 w-4" />}>
          Search Flights
        </Button>
        <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />}>
          Add Passenger
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ),
};

// New stories for enhanced variants and features
export const PremiumVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg">
      <Button
        variant="premium"
        size="premium"
        leftIcon={<Plus className="h-5 w-5" />}
      >
        Premium Action
      </Button>
      <Button
        variant="glass"
        size="lg"
        leftIcon={<Search className="h-5 w-5" />}
      >
        Glass Effect
      </Button>
      <Button
        variant="soft"
        size="lg"
        leftIcon={<Settings className="h-5 w-5" />}
      >
        Soft Neumorphism
      </Button>
    </div>
  ),
};

export const AviationGradients: Story = {
  render: () => (
    <div className="space-y-4 p-8 bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg">
      <div className="flex gap-4 flex-wrap">
        <Button
          variant="sky-primary"
          size="lg"
          leftIcon={<Plane className="h-5 w-5" />}
          effect="glow"
        >
          Sky Primary
        </Button>
        <Button
          variant="flight-action"
          size="lg"
          leftIcon={<ArrowRight className="h-5 w-5" />}
          effect="shimmer"
        >
          Flight Action
        </Button>
        <Button
          variant="altitude"
          size="lg"
          leftIcon={<Download className="h-5 w-5" />}
        >
          Altitude
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button
          variant="dawn"
          size="lg"
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Dawn Gradient
        </Button>
        <Button
          variant="sunset"
          size="lg"
          leftIcon={<Heart className="h-5 w-5" />}
        >
          Sunset Gradient
        </Button>
      </div>
    </div>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <div className="flex gap-4 items-center flex-wrap">
        <Button size="compact" variant="outline">
          Compact
        </Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
        <Button size="premium" variant="premium">
          Premium
        </Button>
        <Button size="hero" variant="sky-primary">
          Hero
        </Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button size="icon-sm" variant="outline">
          <Heart className="h-3 w-3" />
        </Button>
        <Button size="icon">
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon-lg" variant="success">
          <Download className="h-5 w-5" />
        </Button>
        <Button size="icon-xl" variant="premium">
          <Plane className="h-6 w-6" />
        </Button>
      </div>
    </div>
  ),
};

export const VisualEffects: Story = {
  render: () => (
    <div className="space-y-4 p-8 bg-slate-900 rounded-lg">
      <div className="flex gap-4 flex-wrap">
        <Button variant="default" effect="glow" ripple>
          Glow Effect
        </Button>
        <Button variant="warning" effect="glow-warm" ripple>
          Warm Glow
        </Button>
        <Button variant="success" effect="glow-success" ripple>
          Success Glow
        </Button>
        <Button variant="destructive" effect="glow-danger" ripple>
          Danger Glow
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button variant="flight-action" effect="shimmer" size="lg">
          Shimmer Effect
        </Button>
        <Button variant="premium" ripple size="lg">
          Premium Ripple
        </Button>
      </div>
    </div>
  ),
};

export const ShapeVariations: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center p-8">
      <Button shape="default" variant="outline">
        Default
      </Button>
      <Button shape="rounded" variant="secondary">
        Rounded
      </Button>
      <Button shape="square" variant="success">
        Square
      </Button>
      <Button shape="pill" variant="sky-primary">
        Pill Shape
      </Button>
      <Button shape="organic" variant="premium">
        Organic
      </Button>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center p-8">
      <Button loading size="sm">
        Small Loading
      </Button>
      <Button loading>Default Loading</Button>
      <Button loading size="lg" variant="premium">
        Large Loading
      </Button>
      <Button loading size="icon-lg" variant="success" />
    </div>
  ),
};

export const FlightBookingShowcase: Story = {
  render: () => (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Flight to Tokyo</h3>
      <div className="space-y-3">
        <Button
          variant="flight-action"
          size="lg"
          fullWidth
          leftIcon={<Plane className="h-5 w-5" />}
          effect="shimmer"
          ripple
        >
          Book Flight - $1,299
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="default"
            leftIcon={<Heart className="h-4 w-4" />}
            ripple
          >
            Save
          </Button>
          <Button
            variant="ghost"
            size="default"
            leftIcon={<Share className="h-4 w-4" />}
          >
            Share
          </Button>
          <Button
            variant="glass"
            size="default"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  ),
};
