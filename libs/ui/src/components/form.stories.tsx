import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { Button } from './button';
import { Form, FormError, FormField, FormInput, FormSubmit } from './form';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive form system built on react-hook-form with validation, accessibility, and TypeScript support.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock action for Storybook
const mockSubmit = (data: Record<string, unknown>) => {
  console.log('Form submitted:', data);
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
      alert(`Form submitted with data: ${JSON.stringify(data, null, 2)}`);
    }, 1000);
  });
};

export const Basic: Story = {
  render: () => (
    <Form onSubmit={mockSubmit} className="w-96 space-y-4">
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />
      <FormSubmit>Sign In</FormSubmit>
    </Form>
  ),
};

export const WithDefaultValues: Story = {
  render: () => (
    <Form
      onSubmit={mockSubmit}
      defaultValues={{
        email: 'user@example.com',
        name: 'John Doe',
      }}
      className="w-96 space-y-4"
    >
      <FormInput
        name="name"
        label="Full Name"
        placeholder="Enter your name"
        required
      />
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required
      />
      <FormSubmit>Update Profile</FormSubmit>
    </Form>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <Form onSubmit={mockSubmit} className="w-96 space-y-4">
      <FormInput
        name="username"
        label="Username"
        placeholder="Choose a username"
        description="Must be 3-20 characters long, letters and numbers only"
        required
      />
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        description="We'll use this to send you important updates"
        required
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Create a password"
        description="Must be at least 8 characters with uppercase, lowercase, and numbers"
        required
      />
      <FormSubmit>Create Account</FormSubmit>
    </Form>
  ),
};

export const ContactForm: Story = {
  render: () => (
    <Form
      onSubmit={mockSubmit}
      className="w-96 space-y-4 p-6 border rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Contact Us</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="firstName"
          label="First Name"
          placeholder="John"
          required
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
        />
      </div>

      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        required
      />

      <FormInput
        name="phone"
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 123-4567"
        startIcon={<span>📞</span>}
      />

      <FormInput
        name="company"
        label="Company"
        placeholder="Your company name"
      />

      <FormInput
        name="website"
        label="Website"
        type="url"
        placeholder="https://yoursite.com"
        endIcon={<span>🌐</span>}
      />

      <FormSubmit loadingText="Sending message...">Send Message</FormSubmit>
    </Form>
  ),
};

export const WithCustomButtons: Story = {
  render: () => (
    <Form onSubmit={mockSubmit} className="w-96 space-y-4">
      <FormInput
        name="title"
        label="Document Title"
        placeholder="Enter document title"
        required
      />
      <FormInput
        name="content"
        label="Content"
        placeholder="Enter content"
        required
      />

      <div className="flex gap-2">
        <FormSubmit className="flex-1">Save</FormSubmit>
        <Button variant="outline" type="button" className="flex-1">
          Cancel
        </Button>
      </div>
    </Form>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-lg font-semibold mb-4">Normal State</h3>
        <Form onSubmit={mockSubmit} className="space-y-4">
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter email"
            required
          />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Loading State</h3>
        <Form onSubmit={mockSubmit} className="space-y-4">
          <FormInput
            name="email"
            label="Email"
            placeholder="Processing..."
            loading
          />
          <FormSubmit loadingText="Processing...">Submit</FormSubmit>
        </Form>
      </div>
    </div>
  ),
};

export const FormValidationExample: Story = {
  render: () => {
    const validationSchema = z
      .object({
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
      })
      .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
      });

    return (
      <Form
        schema={validationSchema}
        onSubmit={mockSubmit}
        className="w-96 space-y-4"
      >
        <FormInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          required
        />
        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
        />
        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
        />
        <FormSubmit>Create Account</FormSubmit>
      </Form>
    );
  },
};

export const CustomFormField: Story = {
  render: () => (
    <Form onSubmit={mockSubmit} className="w-96 space-y-4">
      <FormField
        name="customField"
        description="This is a custom form field with render prop"
        render={field => (
          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Field: {field.name}
            </label>
            <select
              name={field.name}
              value={(field.value as string) || ''}
              onChange={e =>
                field.onChange(
                  e as unknown as React.ChangeEvent<HTMLInputElement>
                )
              }
              onBlur={e =>
                field.onBlur(e as unknown as React.FocusEvent<HTMLInputElement>)
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        )}
      />

      <FormInput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email"
        required
      />

      <FormSubmit>Submit</FormSubmit>
    </Form>
  ),
};

export const ErrorHandling: Story = {
  render: () => (
    <Form onSubmit={mockSubmit} className="w-96 space-y-4">
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required
      />

      <FormError message="This is a custom error message" />

      <FormInput
        name="username"
        label="Username"
        placeholder="Enter username"
        required
      />

      <FormSubmit>Submit</FormSubmit>
    </Form>
  ),
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div className="w-96 space-y-6">
      <h2 className="text-xl font-semibold">Accessibility Features</h2>

      <Form onSubmit={mockSubmit} className="space-y-4">
        <FormInput
          name="screenReaderTest"
          label="Screen Reader Test"
          placeholder="This field has proper ARIA labels"
          description="This description is properly associated with the input"
          required
        />

        <div>
          <FormInput
            name="errorTest"
            label="Error State Test"
            placeholder="This will show error state"
            description="Try submitting the form to see validation"
          />
          <FormError message="This field has a validation error" />
        </div>

        <FormInput
          name="loadingTest"
          label="Loading State Test"
          placeholder="Loading..."
          loading
          description="This field is in loading state"
        />

        <FormSubmit>Submit Form</FormSubmit>
      </Form>
    </div>
  ),
};
