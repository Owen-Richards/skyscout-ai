'use client';

import { Button } from '@skyscout/ui';
import { Search, Plus } from 'lucide-react';

export function ButtonDemo() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">UI Component Demo</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Button Variants</h3>
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Button Sizes</h3>
          <div className="flex gap-2 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">With Icons</h3>
          <div className="flex gap-2">
            <Button leftIcon={<Search className="h-4 w-4" />}>
              Search Flights
            </Button>
            <Button variant="outline" rightIcon={<Plus className="h-4 w-4" />}>
              Add Passenger
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">States</h3>
          <div className="flex gap-2">
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
