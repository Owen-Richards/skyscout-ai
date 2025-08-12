/**
 * Simplebutton Types
 * TypeScript definitions for Simplebutton component
 */

import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

// Re-export component types
export type { SimplebuttonProps } from './simplebutton';

// Additional domain-specific types can be added here
export interface SimplebuttonState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface SimplebuttonContext {
  state: SimplebuttonState;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}
