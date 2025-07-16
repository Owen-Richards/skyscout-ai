/**
 * Card Component Tests
 * AI-generated comprehensive test suite with accessibility testing
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
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

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Card Component', () => {
  // AI-generated basic rendering tests
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Card>Test content</Card>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies default classes correctly', () => {
      render(<Card data-testid="card">Test</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'text-card-foreground',
        'shadow-sm'
      );
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Card ref={ref}>Test</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // AI-generated variant tests
  describe('Variants', () => {
    const variants = [
      'default',
      'outlined',
      'elevated',
      'interactive',
      'flight',
      'deal',
      'premium',
      'glass',
    ] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <Card variant={variant} data-testid="card">
            Test
          </Card>
        );
        const card = screen.getByTestId('card');
        expect(card).toBeInTheDocument();
      });
    });

    it('applies interactive styles for interactive variant', () => {
      render(
        <Card variant="interactive" data-testid="card">
          Test
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('applies elevated styles for elevated variant', () => {
      render(
        <Card variant="elevated" data-testid="card">
          Test
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-lg');
    });
  });

  // AI-generated size tests
  describe('Sizes', () => {
    const sizes = ['sm', 'default', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <Card size={size} data-testid="card">
            Test
          </Card>
        );
        const card = screen.getByTestId('card');
        expect(card).toBeInTheDocument();
      });
    });
  });

  // AI-generated state tests
  describe('States', () => {
    it('renders loading state with skeleton', () => {
      render(
        <Card loading data-testid="card">
          Test
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('animate-pulse');
      // Should show skeleton instead of content
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('renders selected state with ring', () => {
      render(
        <Card selected data-testid="card">
          Test
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('ring-2', 'ring-primary', 'ring-offset-2');
    });

    it('renders disabled state correctly', () => {
      render(
        <Card disabled data-testid="card">
          Test
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  // AI-generated interaction tests
  describe('Interactions', () => {
    it('handles click events when onSelect is provided', async () => {
      const handleSelect = jest.fn();
      render(
        <Card onSelect={handleSelect} data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      await userEvent.click(card);

      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events (Enter key)', async () => {
      const handleSelect = jest.fn();
      render(
        <Card onSelect={handleSelect} data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      card.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events (Space key)', async () => {
      const handleSelect = jest.fn();
      render(
        <Card onSelect={handleSelect} data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      card.focus();
      await userEvent.keyboard(' ');

      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('does not handle interactions when disabled', async () => {
      const handleSelect = jest.fn();
      render(
        <Card onSelect={handleSelect} disabled data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      await userEvent.click(card);

      expect(handleSelect).not.toHaveBeenCalled();
    });

    it('prevents default behavior on keyboard events', async () => {
      const handleSelect = jest.fn();
      render(
        <Card onSelect={handleSelect} data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      card.focus();

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      const preventDefaultSpy = jest.spyOn(enterEvent, 'preventDefault');

      fireEvent(card, enterEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // AI-generated accessibility tests
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Card onSelect={() => {}} ariaLabel="Test card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sets correct ARIA attributes for interactive cards', () => {
      render(
        <Card
          onSelect={() => {}}
          ariaLabel="Interactive card"
          selected={true}
          data-testid="card"
        >
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('aria-label', 'Interactive card');
      expect(card).toHaveAttribute('aria-selected', 'true');
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('sets correct ARIA attributes for disabled cards', () => {
      render(
        <Card onSelect={() => {}} disabled data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-disabled', 'true');
      expect(card).not.toHaveAttribute('tabindex');
    });

    it('sets aria-busy for loading cards', () => {
      render(
        <Card loading data-testid="card">
          Test
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-busy', 'true');
    });
  });

  // AI-generated flight data tests
  describe('Flight Data Features', () => {
    it('displays flight data overlays correctly', () => {
      const flightData = {
        price: 589,
        currency: 'USD',
        savings: 127,
        confidence: 92,
        trending: true,
      };

      render(
        <Card flightData={flightData} data-testid="card">
          Test Content
        </Card>
      );

      expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
      expect(screen.getByText('Save $127')).toBeInTheDocument();
      expect(screen.getByText('92% Confident')).toBeInTheDocument();
    });

    it('only shows relevant flight data badges', () => {
      const flightData = {
        price: 589,
        currency: 'USD',
        confidence: 85, // Below 90 threshold
      };

      render(
        <Card flightData={flightData} data-testid="card">
          Test Content
        </Card>
      );

      expect(screen.queryByText(/Trending/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Save/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Confident/)).not.toBeInTheDocument();
    });
  });

  // AI-generated sub-component tests
  describe('Sub-components', () => {
    it('renders CardHeader with correct styling', () => {
      render(
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      );

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
    });

    it('renders CardTitle with correct styling', () => {
      render(<CardTitle data-testid="title">Test Title</CardTitle>);
      const title = screen.getByTestId('title');
      expect(title).toHaveClass('text-2xl', 'font-semibold');
      expect(title.tagName).toBe('H3');
    });

    it('renders CardDescription with correct styling', () => {
      render(
        <CardDescription data-testid="description">
          Test Description
        </CardDescription>
      );
      const description = screen.getByTestId('description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('renders CardContent with correct spacing', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('renders CardFooter with correct layout', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });
  });

  // AI-generated specialized card tests
  describe('Specialized Cards', () => {
    it('renders FlightCard with flight variant', () => {
      const flightData = {
        price: 589,
        savings: 100,
        trending: true,
      };

      render(
        <FlightCard flightData={flightData} data-testid="flight-card">
          Flight Content
        </FlightCard>
      );

      const card = screen.getByTestId('flight-card');
      expect(card).toHaveClass('relative', 'overflow-hidden');
      expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
    });

    it('renders DealCard with deal styling', () => {
      render(<DealCard data-testid="deal-card">Deal Content</DealCard>);

      const card = screen.getByTestId('deal-card');
      expect(card).toHaveClass('relative', 'overflow-hidden');
    });
  });

  // AI-generated custom class tests
  describe('Custom Styling', () => {
    it('merges custom className with default classes', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class', 'rounded-lg', 'border');
    });

    it('allows style overrides', () => {
      render(
        <Card
          className="border-red-500"
          data-testid="card"
          style={{ backgroundColor: 'red' }}
        >
          Test
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-red-500');
      expect(card).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  // AI-generated error boundary test
  describe('Error Handling', () => {
    it('handles missing flight data gracefully', () => {
      render(
        <Card flightData={undefined} data-testid="card">
          Test Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('handles incomplete flight data', () => {
      const incompleteData = { price: 589 }; // Missing other properties

      render(
        <Card flightData={incompleteData} data-testid="card">
          Test Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      // Should not crash and should not show undefined badges
      expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    });
  });
});

// AI-generated integration tests
describe('Card Integration', () => {
  it('works within a complex layout', () => {
    render(
      <div className="grid grid-cols-2 gap-4">
        <Card variant="interactive" onSelect={() => {}}>
          <CardHeader>
            <CardTitle>Flight 1</CardTitle>
            <CardDescription>NYC to LAX</CardDescription>
          </CardHeader>
          <CardContent>$589</CardContent>
        </Card>
        <Card variant="interactive" onSelect={() => {}}>
          <CardHeader>
            <CardTitle>Flight 2</CardTitle>
            <CardDescription>NYC to SFO</CardDescription>
          </CardHeader>
          <CardContent>$629</CardContent>
        </Card>
      </div>
    );

    expect(screen.getByText('Flight 1')).toBeInTheDocument();
    expect(screen.getByText('Flight 2')).toBeInTheDocument();
    expect(screen.getByText('NYC to LAX')).toBeInTheDocument();
    expect(screen.getByText('NYC to SFO')).toBeInTheDocument();
  });

  it('maintains focus management across multiple cards', async () => {
    render(
      <div>
        <Card onSelect={() => {}} data-testid="card1">
          Card 1
        </Card>
        <Card onSelect={() => {}} data-testid="card2">
          Card 2
        </Card>
      </div>
    );

    const card1 = screen.getByTestId('card1');
    const card2 = screen.getByTestId('card2');

    card1.focus();
    expect(document.activeElement).toBe(card1);

    await userEvent.tab();
    expect(document.activeElement).toBe(card2);
  });
});
