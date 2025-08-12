/**
 * Simplebutton Component Tests
 * Comprehensive testing following testing best practices
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { Simplebutton, type SimplebuttonProps } from './simplebutton';

// Test utilities
const renderComponent = (props: Partial<SimplebuttonProps> = {}) => {
  const defaultProps: SimplebuttonProps = {
    children: 'Test Simplebutton',
    ...props,
  };

  return {
    user: userEvent.setup(),
    ...render(<Simplebutton {...defaultProps} />),
  };
};

describe('Simplebutton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      renderComponent();

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Test Simplebutton')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderComponent({ className: 'custom-class' });

      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('renders loading state correctly', () => {
      renderComponent({ loading: true });

      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
      const icon = <span data-testid="test-icon">🎯</span>;
      renderComponent({ icon });

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onAction when clicked', async () => {
      const onAction = vi.fn();
      const { user } = renderComponent({ onAction });

      await user.click(screen.getByRole('button'));

      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('does not call onAction when disabled', async () => {
      const onAction = vi.fn();
      const { user } = renderComponent({ onAction, disabled: true });

      await user.click(screen.getByRole('button'));

      expect(onAction).not.toHaveBeenCalled();
    });

    it('does not call onAction when loading', async () => {
      const onAction = vi.fn();
      const { user } = renderComponent({ onAction, loading: true });

      await user.click(screen.getByRole('button'));

      expect(onAction).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('applies variant classes correctly', () => {
      renderComponent({ variant: 'secondary' });

      expect(screen.getByRole('button')).toHaveClass('bg-secondary');
    });

    it('applies size classes correctly', () => {
      renderComponent({ size: 'lg' });

      expect(screen.getByRole('button')).toHaveClass('h-11');
    });
  });

  describe('Accessibility', () => {
    it('is accessible via keyboard', async () => {
      const onAction = vi.fn();
      renderComponent({ onAction });

      const element = screen.getByRole('button');
      element.focus();

      expect(element).toHaveFocus();

      fireEvent.keyDown(element, { key: 'Enter' });
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('has proper ARIA attributes', () => {
      renderComponent({ disabled: true });

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });
  });

  describe('Error Handling', () => {
    it('handles undefined onAction gracefully', async () => {
      const { user } = renderComponent({ onAction: undefined });

      await expect(
        user.click(screen.getByRole('button'))
      ).resolves.not.toThrow();
    });
  });
});
