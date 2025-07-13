import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile input component with multiple variants, sizes, and states for building forms.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size variant of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner and disable input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    required: {
      control: 'boolean',
      description: 'Mark the field as required',
    },
    success: {
      control: 'boolean',
      description: 'Show success state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters long',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const Success: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    success: true,
    value: 'user@example.com',
  },
};

export const Loading: Story = {
  args: {
    label: 'Search',
    placeholder: 'Searching...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search flights...',
    startIcon: <span>🔍</span>,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    endIcon: <span>🌐</span>,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" placeholder="Small input" label="Small" />
      <Input size="default" placeholder="Default input" label="Default" />
      <Input size="lg" placeholder="Large input" label="Large" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input variant="default" placeholder="Default variant" label="Default" />
      <Input
        variant="error"
        placeholder="Error variant"
        label="Error"
        error="This field has an error"
      />
      <Input
        variant="success"
        placeholder="Success variant"
        label="Success"
        success
      />
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input type="text" placeholder="Text input" label="Text" />
      <Input type="email" placeholder="Email input" label="Email" />
      <Input type="password" placeholder="Password input" label="Password" />
      <Input type="number" placeholder="Number input" label="Number" />
      <Input type="search" placeholder="Search input" label="Search" />
      <Input type="tel" placeholder="Phone input" label="Phone" />
      <Input type="url" placeholder="URL input" label="URL" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-6 w-96 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Contact Form</h3>

      <Input label="First Name" placeholder="Enter your first name" required />

      <Input label="Last Name" placeholder="Enter your last name" required />

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required
        helperText="We'll never share your email with anyone"
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 123-4567"
        startIcon={<span>📞</span>}
      />

      <Input
        label="Website"
        type="url"
        placeholder="https://yourwebsite.com"
        endIcon={<span>🌐</span>}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </form>
  ),
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>

      <Input
        label="Required Field"
        placeholder="This field is required"
        required
        helperText="All required fields must be filled out"
      />

      <Input
        label="Field with Error"
        placeholder="This field has validation errors"
        error="This field is required and must be at least 3 characters"
        value="ab"
      />

      <Input
        label="Loading Field"
        placeholder="Processing..."
        loading
        helperText="Please wait while we validate your input"
      />

      <Input
        label="Success Field"
        placeholder="Validation passed"
        success
        value="Valid input!"
        helperText="This field has been successfully validated"
      />
    </div>
  ),
};
