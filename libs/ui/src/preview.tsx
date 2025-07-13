import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/button';
import { Input } from './components/input';
import { Form, FormInput, FormSubmit } from './components/form';
import './globals.css';

const ComponentPreview = () => {
  const handleSubmit = (data: Record<string, unknown>) => {
    console.log('Form data:', data);
    alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SkyScout UI Components
          </h1>
          <p className="text-gray-600">Component library preview</p>
        </header>

        {/* Button Examples */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Button Component</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Input Examples */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Input Component</h2>
          <div className="space-y-4 max-w-md">
            <Input label="Default Input" placeholder="Enter text..." />
            <Input
              label="Email Input"
              type="email"
              placeholder="Enter email..."
              helperText="We'll never share your email"
            />
            <Input
              label="Password Input"
              type="password"
              placeholder="Enter password..."
              required
            />
            <Input
              label="Input with Error"
              placeholder="This has an error..."
              error="This field is required"
            />
            <Input
              label="Success Input"
              placeholder="This is valid..."
              success
              value="Valid input!"
            />
            <Input label="Loading Input" placeholder="Loading..." loading />
            <Input
              label="Input with Icons"
              placeholder="Search..."
              startIcon={<span>🔍</span>}
              endIcon={<span>✨</span>}
            />
          </div>
        </section>

        {/* Form Examples */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Form Component</h2>
          <div className="max-w-md">
            <Form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                required
              />
              <FormInput
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                required
              />
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                description="We'll use this to contact you"
                required
              />
              <FormInput
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                startIcon={<span>📞</span>}
              />
              <FormSubmit>Submit Form</FormSubmit>
            </Form>
          </div>
        </section>

        {/* Size and Variant Grid */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Input Variants & Sizes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Small Size</h3>
              <div className="space-y-3">
                <Input size="sm" placeholder="Small default" />
                <Input
                  size="sm"
                  placeholder="Small error"
                  error="Error message"
                />
                <Input size="sm" placeholder="Small success" success />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Default Size</h3>
              <div className="space-y-3">
                <Input placeholder="Default size" />
                <Input placeholder="Default error" error="Error message" />
                <Input placeholder="Default success" success />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Large Size</h3>
              <div className="space-y-3">
                <Input size="lg" placeholder="Large size" />
                <Input
                  size="lg"
                  placeholder="Large error"
                  error="Error message"
                />
                <Input size="lg" placeholder="Large success" success />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Mount the preview
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<ComponentPreview />);
}
