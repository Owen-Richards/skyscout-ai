import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Form, FormField, FormInput, FormSubmit, FormError } from './form';

expect.extend(toHaveNoViolations);

describe('Form', () => {
  it('renders correctly', () => {
    render(
      <Form>
        <div>Form content</div>
      </Form>
    );
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <Form onSubmit={handleSubmit}>
        <FormInput name="email" placeholder="Email" />
        <FormSubmit>Submit</FormSubmit>
      </Form>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  it('applies default values correctly', () => {
    render(
      <Form defaultValues={{ email: 'default@example.com' }}>
        <FormInput name="email" placeholder="Email" />
      </Form>
    );

    expect(screen.getByPlaceholderText('Email')).toHaveValue(
      'default@example.com'
    );
  });

  it('applies custom className', () => {
    render(
      <Form className="custom-form" data-testid="form">
        <div>Content</div>
      </Form>
    );

    expect(screen.getByTestId('form')).toHaveClass('custom-form');
  });
});

describe('FormInput', () => {
  it('renders input within form context', () => {
    render(
      <Form>
        <FormInput name="email" placeholder="Email" label="Email Address" />
      </Form>
    );

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('displays description text', () => {
    render(
      <Form>
        <FormInput
          name="email"
          placeholder="Email"
          description="Please enter a valid email address"
        />
      </Form>
    );

    expect(
      screen.getByText('Please enter a valid email address')
    ).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(
      <Form>
        <FormInput ref={ref} name="email" placeholder="Email" />
      </Form>
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles input changes correctly', async () => {
    const user = userEvent.setup();

    render(
      <Form>
        <FormInput name="email" placeholder="Email" />
      </Form>
    );

    const input = screen.getByPlaceholderText('Email');
    await user.type(input, 'test@example.com');

    expect(input).toHaveValue('test@example.com');
  });
});

describe('FormSubmit', () => {
  it('renders submit button correctly', () => {
    render(
      <Form>
        <FormSubmit>Submit Form</FormSubmit>
      </Form>
    );

    const button = screen.getByRole('button', { name: 'Submit Form' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('shows loading state when form is submitting', async () => {
    const handleSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise<void>(resolve => setTimeout(resolve, 100))
      );
    const user = userEvent.setup();

    render(
      <Form onSubmit={handleSubmit}>
        <FormInput name="email" />
        <FormSubmit loadingText="Sending...">Submit</FormSubmit>
      </Form>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Form>
        <FormSubmit className="custom-submit" data-testid="submit">
          Submit
        </FormSubmit>
      </Form>
    );

    expect(screen.getByTestId('submit')).toHaveClass('custom-submit');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(
      <Form>
        <FormSubmit ref={ref}>Submit</FormSubmit>
      </Form>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('FormError', () => {
  it('does not render when no error is present', () => {
    render(
      <Form>
        <FormError name="email" />
      </Form>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(
      <Form>
        <FormError message="Custom error message" />
      </Form>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Form>
        <FormError message="Error" className="custom-error" />
      </Form>
    );

    expect(screen.getByText('Error')).toHaveClass('custom-error');
  });
});

describe('FormField', () => {
  it('renders children correctly', () => {
    render(
      <Form>
        <FormField name="test">
          <div>Field content</div>
        </FormField>
      </Form>
    );

    expect(screen.getByText('Field content')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Form>
        <FormField name="test" description="Field description">
          <input />
        </FormField>
      </Form>
    );

    expect(screen.getByText('Field description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Form>
        <FormField name="test" className="custom-field" data-testid="field">
          <input />
        </FormField>
      </Form>
    );

    expect(screen.getByTestId('field')).toHaveClass('custom-field');
  });

  it('uses render prop when provided', () => {
    render(
      <Form>
        <FormField
          name="test"
          render={field => (
            <div data-testid="render-prop">Field: {field.name}</div>
          )}
        />
      </Form>
    );

    expect(screen.getByTestId('render-prop')).toHaveTextContent('Field: test');
  });
});

describe('Form Integration', () => {
  it('should have no accessibility violations with complete form', async () => {
    const { container } = render(
      <Form>
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          required
          description="Please enter a valid email address"
        />
        <FormInput name="password" label="Password" type="password" required />
        <FormSubmit>Submit</FormSubmit>
      </Form>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles form submission with multiple inputs', async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(
      <Form onSubmit={handleSubmit}>
        <FormInput name="email" placeholder="Email" />
        <FormInput name="password" placeholder="Password" type="password" />
        <FormSubmit>Submit</FormSubmit>
      </Form>
    );

    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
