/**
 * Search-related type definitions
 * Following Interface Segregation Principle - specific interfaces for specific needs
 */

export interface SearchLocation {
  readonly code: string;
  readonly name: string;
  readonly city: string;
  readonly country: string;
}

export interface SearchFilters {
  readonly class: 'economy' | 'premium' | 'business' | 'first';
  readonly stops: 'any' | 'nonstop' | '1-stop';
  readonly airlines?: readonly string[];
  readonly timePreference?: 'morning' | 'afternoon' | 'evening' | 'red-eye';
}

export interface FlightSearchCriteria {
  readonly origin: SearchLocation | string;
  readonly destination: SearchLocation | string;
  readonly departureDate: string;
  readonly returnDate?: string;
  readonly passengers: number;
  readonly filters: SearchFilters;
  readonly tripType: 'round-trip' | 'one-way' | 'multi-city';
}

export interface SearchFieldProps<T = string> {
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly placeholder?: string;
  readonly label?: string;
  readonly error?: string;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly className?: string;
}

export interface SearchFormState {
  readonly isLoading: boolean;
  readonly errors: Record<string, string>;
  readonly hasBeenSubmitted: boolean;
}

export interface SearchFormActions {
  readonly onSubmit: (criteria: FlightSearchCriteria) => void | Promise<void>;
  readonly onReset: () => void;
  readonly onFieldChange: <K extends keyof FlightSearchCriteria>(
    field: K,
    value: FlightSearchCriteria[K]
  ) => void;
}
