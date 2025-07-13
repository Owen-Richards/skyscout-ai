import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from './input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('applies the correct variant classes', () => {
    const { rerender } = render(
      <Input data-testid="input" variant="default" />
    );
    expect(screen.getByTestId('input')).toHaveClass('border-input');

    rerender(<Input data-testid="input" variant="error" />);
    expect(screen.getByTestId('input')).toHaveClass('border-destructive');

    rerender(<Input data-testid="input" variant="success" />);
    expect(screen.getByTestId('input')).toHaveClass('border-green-500');
  });

  it('applies the correct size classes', () => {
    const { rerender } = render(<Input data-testid="input" size="default" />);
    expect(screen.getByTestId('input')).toHaveClass('h-10');

    rerender(<Input data-testid="input" size="sm" />);
    expect(screen.getByTestId('input')).toHaveClass('h-9');

    rerender(<Input data-testid="input" size="lg" />);
    expect(screen.getByTestId('input')).toHaveClass('h-11');
  });

  it('renders with label when provided', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders with required indicator when required', () => {
    render(<Input label="Test Label" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays helper text when provided', () => {
    render(<Input helperText="This is helper text" />);
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('does not display helper text when error is present', () => {
    render(<Input helperText="Helper text" error="Error message" />);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders start icon when provided', () => {
    render(<Input startIcon={<span data-testid="start-icon">🔍</span>} />);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders end icon when provided', () => {
    render(<Input endIcon={<span data-testid="end-icon">✓</span>} />);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    render(<Input loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('is disabled when loading is true', () => {
    render(<Input loading placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeDisabled();
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input onChange={handleChange} placeholder="Test input" />);

    const input = screen.getByPlaceholderText('Test input');
    await user.type(input, 'Hello World');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Hello World');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Error message" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-required when required', () => {
    render(<Input required data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('associates error message with input using aria-describedby', () => {
    render(<Input error="Error message" data-testid="input" />);
    const input = screen.getByTestId('input');
    const errorMessage = screen.getByText('Error message');

    expect(input).toHaveAttribute('aria-describedby');
    expect(errorMessage).toHaveAttribute('id');
    expect(input.getAttribute('aria-describedby')).toContain(
      errorMessage.getAttribute('id')
    );
  });

  it('associates helper text with input using aria-describedby', () => {
    render(<Input helperText="Helper text" data-testid="input" />);
    const input = screen.getByTestId('input');
    const helperText = screen.getByText('Helper text');

    expect(input).toHaveAttribute('aria-describedby');
    expect(helperText).toHaveAttribute('id');
    expect(input.getAttribute('aria-describedby')).toContain(
      helperText.getAttribute('id')
    );
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('custom-class');
  });

  it('determines variant from state props', () => {
    const { rerender } = render(<Input success data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('border-green-500');

    rerender(<Input error="Error" success data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('border-destructive');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Input
        label="Email Address"
        type="email"
        required
        helperText="Please enter a valid email"
        placeholder="Enter your email"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error state', async () => {
    const { container } = render(
      <Input
        label="Email Address"
        type="email"
        required
        error="Please enter a valid email address"
        placeholder="Enter your email"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
