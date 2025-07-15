# SkyScout AI Cool Styling Guide 🚀✈️

## SkyScout AI Brand Components

### Consistent Brand Typography

SkyScout AI features beautiful, gradient-styled brand typography components that ensure consistent, cool styling throughout the application.

#### `SkyScoutBrand` Component 🎨

```tsx
import { SkyScoutBrand } from '@/components/ui/skyscout-brand';

// Basic usage
<SkyScoutBrand size="lg" />

// With animations
<SkyScoutBrand size="xl" animated />

// Custom styling
<SkyScoutBrand size="md" className="custom-class" />
```

**Available Sizes:**

- `sm` - Small text (text-sm)
- `md` - Medium text (text-lg)
- `lg` - Large text (text-xl) - Default
- `xl` - Extra large (text-2xl)
- `hero` - Hero size (text-5xl md:text-7xl)

#### `SkyScoutHeroBrand` Component 🌟

```tsx
import { SkyScoutHeroBrand } from '@/components/ui/skyscout-brand';

<SkyScoutHeroBrand className="mb-6" />;
```

- Optimized for hero sections
- Enhanced animations and effects
- Responsive text sizing

#### `SkyScoutNavBrand` Component 🧭

```tsx
import { SkyScoutNavBrand } from '@/components/ui/skyscout-brand';

<SkyScoutNavBrand />;
```

- Optimized for navigation headers
- Consistent nav bar sizing
- Subtle styling for headers

### Brand Color Gradients

Each part of "SkyScout AI" uses aviation and travel-inspired gradients:

**"Sky"** ☁️ (Open skies and endless horizons)

- Light: `from-sky-500 via-sky-600 to-blue-500`
- Dark: `from-sky-300 via-sky-400 to-blue-400`
- _Evokes: Clear blue skies, open airways, freedom of flight_

**"Scout"** 🧭 (Navigation and discovery)

- Light: `from-blue-500 via-indigo-600 to-cyan-500`
- Dark: `from-blue-400 via-indigo-500 to-cyan-400`
- _Evokes: Deep ocean blues, navigation instruments, exploration_

**"AI"** 🌊 (Intelligent flow and innovation)

- Light: `from-cyan-500 via-teal-500 to-emerald-500`
- Dark: `from-cyan-400 via-teal-400 to-emerald-400`
- _Evokes: Crystal clear waters, tropical destinations, smart technology_

### Travel & Flight Color Psychology

The new color scheme creates a journey from sky to sea:

- **Sky tones** represent departure and dreams
- **Navigation blues** symbolize the journey and guidance
- **Ocean teals** suggest arrival at paradise destinations
- **Smooth transitions** mirror the seamless travel experience

## Aviation-Themed Button Variants

SkyScout AI features beautiful, aviation-inspired button variants that provide an immersive flight booking experience. All variants include smooth animations, hover effects, and proper theme support for both light and dark modes.

### Primary Aviation Variants

#### `sky-primary` 🌤️

```tsx
<Button variant="sky-primary">Take Flight</Button>
```

- **Colors**: Sky blue gradient with cyan accents
- **Effect**: Shimmer overlay on hover with scale and translate animation
- **Theme Support**: Darker blues in dark mode
- **Use Case**: Primary actions, main CTAs

#### `flight-action` 🚀

```tsx
<Button variant="flight-action">Search Flights</Button>
```

- **Colors**: Deep blue to purple gradient
- **Effect**: Sliding shine animation across button
- **Theme Support**: Enhanced contrast in dark mode
- **Use Case**: Flight search, booking actions

#### `altitude` 🏔️

```tsx
<Button variant="altitude">High Altitude</Button>
```

- **Colors**: Slate to indigo gradient
- **Effect**: Elevation effect with shadow and scale
- **Theme Support**: Deeper tones for dark mode
- **Use Case**: Secondary actions, navigation

### Time-of-Day Variants

#### `dawn` 🌅

```tsx
<Button variant="dawn">Early Departure</Button>
```

- **Colors**: Orange to purple morning gradient
- **Effect**: Warm glow with lift animation
- **Use Case**: Morning flights, early bird deals

#### `sunset` 🌇

```tsx
<Button variant="sunset">Evening Flight</Button>
```

- **Colors**: Yellow to red sunset gradient
- **Effect**: Golden hour warmth with smooth transitions
- **Use Case**: Evening flights, special offers

### Enhanced Experience Variants

#### `premium` ⭐

```tsx
<Button variant="premium">First Class</Button>
```

- **Colors**: Primary gradient with enhanced opacity
- **Effect**: Luxury feel with smooth scaling
- **Use Case**: Premium services, upgrades

#### `glass` 💎

```tsx
<Button variant="glass">Crystal Clear</Button>
```

- **Colors**: Transparent with backdrop blur
- **Effect**: Glassmorphism with subtle borders
- **Use Case**: Overlay actions, modal buttons

#### `filled-tonal` 🎨

```tsx
<Button variant="filled-tonal">Smooth Operation</Button>
```

- **Colors**: Secondary color with reduced opacity
- **Effect**: Material Design 3 inspired tonal fill
- **Use Case**: Complementary actions, form buttons

## Animation Effects

All SkyScout AI buttons include:

- **Hover Scale**: `hover:scale-[1.02]` - Subtle lift effect
- **Hover Translate**: `hover:-translate-y-1` - Floating sensation
- **Active Scale**: `active:scale-[0.98]` - Press feedback
- **Shadow Enhancement**: Dynamic shadows that grow on hover
- **Smooth Transitions**: 200-700ms duration for different effects

## Theme Integration

### Light Mode Features

- Bright, vibrant gradients
- High contrast for accessibility
- Clean, modern appearance

### Dark Mode Features

- Deeper, richer colors
- Enhanced gradients
- Proper contrast ratios maintained

## Usage Examples

### Hero Section

```tsx
<Button variant="sky-primary" size="lg" className="relative overflow-hidden">
  Start Your Journey ✈️
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>
```

### Search Form

```tsx
<Button
  variant="flight-action"
  type="submit"
  className="gap-2 min-w-32 relative overflow-hidden"
>
  <Search className="h-4 w-4" />
  Search Flights
</Button>
```

### Deal Cards

```tsx
<Button
  variant="sky-primary"
  size="sm"
  className="flex-1 relative overflow-hidden"
>
  Book Now
</Button>
```

### Navigation

```tsx
<Button variant="sky-primary" className="relative overflow-hidden">
  Get Started
</Button>
```

## Best Practices

### 1. Always use `relative overflow-hidden`

This ensures proper animation clipping for gradient effects:

```tsx
<Button variant="flight-action" className="relative overflow-hidden">
  Action Button
</Button>
```

### 2. Size Pairing

- `sky-primary` + `lg` for hero CTAs
- `flight-action` + `default` for search actions
- `filled-tonal` + `sm` for secondary actions

### 3. Icon Integration

Add aviation-themed icons for enhanced storytelling:

```tsx
<Button variant="sky-primary">
  Take Off ✈️
  <Plane className="ml-2 h-4 w-4" />
</Button>
```

### 4. Loading States

Use the built-in loading prop with aviation variants:

```tsx
<Button variant="flight-action" loading={isSearching}>
  {isSearching ? 'Searching...' : 'Search Flights'}
</Button>
```

## Accessibility

All variants maintain:

- WCAG 2.1 AA contrast ratios
- Focus visible states
- Screen reader compatibility
- Motion preference respect (`motion-reduce:transition-none`)

## Performance

- CSS-only animations for optimal performance
- Hardware acceleration with `transform` properties
- Efficient gradient rendering
- Minimal reflows and repaints

---

_Built with love for aviation enthusiasts_ ✈️🌤️🚀
