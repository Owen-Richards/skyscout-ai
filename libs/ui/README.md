# Button Component

A versatile, accessible button component built with Radix UI primitives and styled with Tailwind CSS.

## Features

- ✅ **Multiple Variants**: Primary, secondary, outline, destructive, ghost, and link styles
- ✅ **Multiple Sizes**: Small, default, large, and icon sizes
- ✅ **Loading States**: Built-in loading spinner with automatic disabling
- ✅ **Icon Support**: Left and right icon slots with proper spacing
- ✅ **Accessibility**: Full keyboard navigation and screen reader support
- ✅ **Polymorphic**: Can render as different elements using `asChild`
- ✅ **TypeScript**: Fully typed with proper prop interfaces

## Installation

```bash
npm install @skyscout/ui
```

## Usage

### Basic Button

```tsx
import { Button } from '@skyscout/ui';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

### Button Variants

```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><SearchIcon /></Button>
```

### With Icons

```tsx
import { Search, Plus } from 'lucide-react';

<Button leftIcon={<Search />}>Search Flights</Button>
<Button rightIcon={<Plus />}>Add Item</Button>
```

### Loading State

```tsx
<Button loading>Processing...</Button>
```

### As Different Element

```tsx
<Button asChild>
  <a href="/flights">Browse Flights</a>
</Button>
```

## API Reference

### Props

| Prop        | Type                                                                          | Default     | Description                               |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `variant`   | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style variant                      |
| `size`      | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` | Size of the button                        |
| `loading`   | `boolean`                                                                     | `false`     | Shows loading spinner and disables button |
| `leftIcon`  | `ReactNode`                                                                   | -           | Icon to display on the left side          |
| `rightIcon` | `ReactNode`                                                                   | -           | Icon to display on the right side         |
| `asChild`   | `boolean`                                                                     | `false`     | Render as child component                 |
| `disabled`  | `boolean`                                                                     | `false`     | Disable the button                        |
| `className` | `string`                                                                      | -           | Additional CSS classes                    |

### Events

All standard HTML button events are supported:

- `onClick`
- `onFocus`
- `onBlur`
- `onMouseEnter`
- `onMouseLeave`
- etc.

## Examples

### Flight Search Interface

```tsx
function FlightSearchActions() {
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    // Perform search...
    setSearching(false);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleSearch} loading={searching} leftIcon={<Search />}>
        Search Flights
      </Button>

      <Button variant="outline" leftIcon={<Plus />}>
        Add Passenger
      </Button>

      <Button variant="ghost" size="icon">
        <MoreHorizontal />
      </Button>
    </div>
  );
}
```

### Form Actions

```tsx
function BookingForm() {
  return (
    <div className="flex justify-between">
      <Button variant="outline">Back</Button>

      <div className="flex gap-2">
        <Button variant="ghost">Save as Draft</Button>
        <Button type="submit">Continue to Payment</Button>
      </div>
    </div>
  );
}
```

## Accessibility

The Button component follows WAI-ARIA guidelines:

- **Keyboard Navigation**: Full support for Enter and Space key activation
- **Focus Management**: Proper focus indicators and focus management
- **Screen Readers**: Appropriate ARIA attributes and semantic HTML
- **High Contrast**: Works with high contrast themes
- **Loading States**: Proper `aria-disabled` attributes when loading

## Styling

The component uses Tailwind CSS with CSS Variables for theming. You can customize the appearance by:

1. **CSS Variables**: Override the design tokens in your CSS
2. **Tailwind Classes**: Pass additional classes via `className`
3. **Custom Variants**: Extend the component with new variants

### CSS Variables Used

```css
--primary
--primary-foreground
--secondary
--secondary-foreground
--destructive
--destructive-foreground
--accent
--accent-foreground
--background
--ring
```

## Testing

The component includes comprehensive tests:

- Unit tests for all variants and states
- Accessibility tests with jest-axe
- Interaction tests for keyboard navigation
- Visual regression tests via Storybook

## Performance

- **Tree-shakeable**: Only imports what you use
- **Minimal Bundle**: Small footprint with efficient CSS
- **Runtime Performance**: No performance overhead
- **SSR Compatible**: Works with server-side rendering
