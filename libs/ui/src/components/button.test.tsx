import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './button';
import { Search, Plus } from 'lucide-react';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10');
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('button', { name: /loading/i })
    ).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders left icon correctly', () => {
    render(
      <Button leftIcon={<Search data-testid="search-icon" />}>Search</Button>
    );

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders right icon correctly', () => {
    render(
      <Button rightIcon={<Plus data-testid="plus-icon" />}>Add Item</Button>
    );

    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add item/i })
    ).toBeInTheDocument();
  });

  it('hides icons when loading', () => {
    render(
      <Button
        loading
        leftIcon={<Search data-testid="search-icon" />}
        rightIcon={<Plus data-testid="plus-icon" />}
      >
        Loading
      </Button>
    );

    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#test');
  });

  it('prevents click when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('prevents click when loading', () => {
    const handleClick = jest.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when loading', async () => {
      const { container } = render(<Button loading>Loading Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', () => {
      const handleKeyDown = jest.fn();
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} onKeyDown={handleKeyDown}>
          Keyboard test
        </Button>
      );

      const button = screen.getByRole('button');
      button.focus();

      // Test that keyboard events are properly handled
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Enter' })
      );

      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: ' ' })
      );

      // Test that button can be clicked
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
