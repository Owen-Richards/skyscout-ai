/**
 * Architecture Demo Page
 * Demonstrates the improved SOLID principles implementation
 */

'use client';

import { useState } from 'react';
import { Card, Button } from '@skyscout/ui';
import { Code, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface PrincipleDemo {
  name: string;
  description: string;
  example: string;
  beforeCode: string;
  afterCode: string;
  benefits: string[];
}

const solidPrinciples: PrincipleDemo[] = [
  {
    name: 'Single Responsibility Principle',
    description: 'Each component has one reason to change',
    example: 'LocationField component only handles location input',
    beforeCode: `// Before: Mixed responsibilities
function SearchForm() {
  // Location search logic
  // Date validation
  // Form submission
  // UI rendering
  // Error handling
  return <div>...</div>;
}`,
    afterCode: `// After: Single responsibility
function LocationField({ value, onChange }) {
  // Only handles location input
  return <input ... />;
}

function SearchForm() {
  // Only orchestrates form layout
  return (
    <form>
      <LocationField ... />
      <DateField ... />
    </form>
  );
}`,
    benefits: [
      'Easier to test',
      'Easier to maintain',
      'Easier to reuse',
      'Clearer purpose',
    ],
  },
  {
    name: 'Open/Closed Principle',
    description: 'Open for extension, closed for modification',
    example: 'Adding new search fields without changing existing code',
    beforeCode: `// Before: Must modify SearchForm for new fields
function SearchForm() {
  return (
    <div>
      <input type="text" placeholder="Origin" />
      <input type="text" placeholder="Destination" />
      // Need to add new field here and modify logic
    </div>
  );
}`,
    afterCode: `// After: Extend through configuration
const SEARCH_FIELDS = [
  { type: 'location', name: 'origin' },
  { type: 'location', name: 'destination' },
  { type: 'date', name: 'departure' },
  // New fields added here without code changes
];

function SearchForm({ fields = SEARCH_FIELDS }) {
  return (
    <div>
      {fields.map(field => 
        <FieldComponent key={field.name} {...field} />
      )}
    </div>
  );
}`,
    benefits: [
      'New features without breaking existing code',
      'Configurable components',
      'Reduced testing overhead',
      'Better stability',
    ],
  },
  {
    name: 'Liskov Substitution Principle',
    description: 'Subtypes must be substitutable for their base types',
    example: 'All search fields implement the same interface',
    beforeCode: `// Before: Inconsistent interfaces
function TextInput({ value, onChange, error }) { ... }
function DateInput({ date, setDate, isValid }) { ... }
function NumberInput({ num, updateNum, hasError }) { ... }`,
    afterCode: `// After: Consistent interface
interface FieldProps {
  value: T;
  onChange: (value: T) => void;
  error?: string;
}

function LocationField({ value, onChange, error }: FieldProps<string>) { ... }
function DateField({ value, onChange, error }: FieldProps<string>) { ... }
function PassengerField({ value, onChange, error }: FieldProps<number>) { ... }`,
    benefits: [
      'Interchangeable components',
      'Predictable behavior',
      'Easier refactoring',
      'Type safety',
    ],
  },
  {
    name: 'Interface Segregation Principle',
    description: "Clients should not depend on interfaces they don't use",
    example: 'Specific interfaces for specific needs',
    beforeCode: `// Before: Fat interface
interface ComponentProps {
  value: any;
  onChange: Function;
  onSearch: Function;
  onValidate: Function;
  suggestions: any[];
  loading: boolean;
  error: string;
  placeholder: string;
  // ... many more props not used by all components
}`,
    afterCode: `// After: Segregated interfaces
interface SearchFieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  error?: string;
}

interface LocationFieldProps extends SearchFieldProps<string> {
  suggestions?: SearchLocation[];
  onSearch?: (query: string) => void;
}

interface DateFieldProps extends SearchFieldProps<string> {
  min?: string;
  max?: string;
}`,
    benefits: [
      'Cleaner component APIs',
      'Easier to understand',
      'Reduced coupling',
      'Better type safety',
    ],
  },
  {
    name: 'Dependency Inversion Principle',
    description: 'Depend on abstractions, not concretions',
    example: 'Search service abstraction allows different implementations',
    beforeCode: `// Before: Direct dependency on implementation
function SearchForm() {
  const searchAPI = new FlightSearchAPI();
  
  const handleSearch = async () => {
    const results = await searchAPI.search(criteria);
    // Tightly coupled to specific API
  };
}`,
    afterCode: `// After: Dependency on abstraction
interface ISearchService {
  search(criteria: SearchCriteria): Promise<SearchResult>;
}

function useSearchForm(searchService: ISearchService) {
  const handleSearch = async () => {
    const results = await searchService.search(criteria);
    // Can use any implementation
  };
}

// Different implementations
const mockService = new MockSearchService();
const apiService = new FlightAPIService();
const cachedService = new CachedSearchService();`,
    benefits: [
      'Testable with mocks',
      'Swappable implementations',
      'Reduced coupling',
      'Better abstraction',
    ],
  },
];

export function ArchitectureDemo() {
  const [selectedPrinciple, setSelectedPrinciple] = useState(0);
  const currentPrinciple = solidPrinciples[selectedPrinciple];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          SOLID Principles Implementation
        </h1>
        <p className="text-muted-foreground">
          Demonstrating Clean Code practices in the SkyScout AI codebase
        </p>
      </div>

      {/* Principle Selector */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-8">
        {solidPrinciples.map((principle, index) => (
          <Button
            key={principle.name}
            variant={selectedPrinciple === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPrinciple(index)}
            className="text-xs"
          >
            {principle.name
              .split(' ')
              .map(word => word[0])
              .join('')}
          </Button>
        ))}
      </div>

      {/* Principle Details */}
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {currentPrinciple.name}
            </h2>
            <p className="text-muted-foreground mb-2">
              {currentPrinciple.description}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600 font-medium">
                Example: {currentPrinciple.example}
              </span>
            </div>
          </div>
        </div>

        {/* Code Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Before (Violation)
            </h3>
            <pre className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-red-800">
                {currentPrinciple.beforeCode}
              </code>
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              After (Following Principle)
            </h3>
            <pre className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-green-800">
                {currentPrinciple.afterCode}
              </code>
            </pre>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Benefits
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {currentPrinciple.benefits.map(benefit => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Implementation Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Implementation Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Components Refactored
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Search forms and fields</li>
              <li>• Hero section components</li>
              <li>• Deal display components</li>
              <li>• Navigation components</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Architecture Improvements
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Service layer abstraction</li>
              <li>• Custom hooks for logic</li>
              <li>• Type-safe interfaces</li>
              <li>• Configuration-driven components</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Benefits Achieved
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Better testability</li>
              <li>• Easier maintenance</li>
              <li>• Improved reusability</li>
              <li>• Enhanced type safety</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
