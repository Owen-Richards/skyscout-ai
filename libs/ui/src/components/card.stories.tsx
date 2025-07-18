/**
 * Card Component Stories
 * AI-generated comprehensive examples for all variants
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FlightCard,
  DealCard,
} from './card';
import { Button } from './button';
import { Badge } from './badge';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Versatile card component optimized for flight results and general use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outlined',
        'elevated',
        'interactive',
        'flight',
        'deal',
        'premium',
        'glass',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'full'],
    },
    loading: {
      control: 'boolean',
    },
    selected: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// AI-generated basic variants
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content with some example text.</p>
        </CardContent>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    onSelect: () => alert('Card selected!'),
    ariaLabel: 'Interactive card example',
    children: (
      <>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Click or press Enter to interact</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card responds to user interactions.</p>
        </CardContent>
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    variant: 'default',
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    variant: 'interactive',
    children: (
      <>
        <CardHeader>
          <CardTitle>Selected Card</CardTitle>
          <CardDescription>This card is currently selected</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Selected state with ring indicator.</p>
        </CardContent>
      </>
    ),
  },
};

// AI-generated flight-specific examples
export const FlightResult: Story = {
  render: () => (
    <FlightCard
      flightData={{
        price: 589,
        currency: 'USD',
        savings: 127,
        confidence: 92,
        trending: true,
      }}
      onSelect={() => alert('Flight selected!')}
      ariaLabel="Flight from NYC to Paris, $589"
      className="w-96"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">NYC → PAR</CardTitle>
            <CardDescription>Direct flight • 7h 30m</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">$589</div>
            <div className="text-sm text-muted-foreground line-through">
              $716
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <span>Air France</span>
          <Badge variant="secondary">Nonstop</Badge>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Departure: 10:30 AM • Arrival: 11:00 PM
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button className="w-full">Select Flight</Button>
      </CardFooter>
    </FlightCard>
  ),
};

export const DealHighlight: Story = {
  render: () => (
    <DealCard className="w-80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Flash Sale</CardTitle>
          <Badge className="bg-red-500 text-white">Limited Time</Badge>
        </div>
        <CardDescription>
          Save up to 60% on international flights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Europe Routes</span>
            <span className="font-semibold text-green-600">From $299</span>
          </div>
          <div className="flex justify-between">
            <span>Asia Routes</span>
            <span className="font-semibold text-green-600">From $459</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-red-500 hover:bg-red-600">
          View Deals
        </Button>
      </CardFooter>
    </DealCard>
  ),
};

export const GlassMorphism: Story = {
  render: () => (
    <div className="relative p-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg">
      <Card variant="glass" className="w-80">
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription className="text-white/80">
            Beautiful glassmorphism effect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/90">
            This card uses backdrop blur and transparency for a modern glass
            effect.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

// AI-generated size variants
export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-4">
      {(['sm', 'default', 'lg', 'xl'] as const).map(size => (
        <Card key={size} size={size} className="w-64">
          <CardHeader>
            <CardTitle>Size: {size}</CardTitle>
            <CardDescription>Card with {size} padding</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content adapts to card size.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// AI-generated accessibility demonstration
export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Card
        variant="interactive"
        onSelect={() => alert('Accessible card activated!')}
        ariaLabel="Accessible flight card from New York to London, price $649, departing tomorrow"
        className="w-96"
      >
        <CardHeader>
          <CardTitle>Accessible Flight Card</CardTitle>
          <CardDescription>
            Screen reader friendly with proper ARIA labels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>Route: NYC → LHR</div>
            <div>Price: $649</div>
            <div>Departure: Tomorrow 2:30 PM</div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Press Enter or Space to select this flight
          </div>
        </CardFooter>
      </Card>

      <Card disabled className="w-96 opacity-50">
        <CardHeader>
          <CardTitle>Disabled Card</CardTitle>
          <CardDescription>
            This card is disabled and not interactive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Disabled cards are properly marked for screen readers.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      {(
        [
          'default',
          'outlined',
          'elevated',
          'interactive',
          'flight',
          'deal',
          'premium',
          'glass',
        ] as const
      ).map(variant => (
        <Card
          key={variant}
          variant={variant}
          className={
            variant === 'glass'
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
              : ''
          }
        >
          <CardHeader>
            <CardTitle className="capitalize">{variant}</CardTitle>
            <CardDescription>Example of {variant} variant</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This demonstrates the {variant} card style.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
