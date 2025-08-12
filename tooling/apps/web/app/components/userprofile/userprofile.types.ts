/**
 * Userprofile Types
 * TypeScript definitions for Userprofile component
 */

import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

// Re-export component types
export type { user, loading, onEdit } from './userprofile';

// Additional domain-specific types can be added here
export interface UserprofileState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface UserprofileContext {
  state: UserprofileState;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}
