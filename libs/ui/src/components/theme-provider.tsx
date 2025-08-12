'use client';

import * as React from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  systemTheme: 'light',
  resolvedTheme: 'light',
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

// Pre-load theme from localStorage to prevent flashing
const getInitialTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  if (typeof window === 'undefined') return defaultTheme;

  try {
    const stored = localStorage.getItem(storageKey);
    return (stored as Theme) || defaultTheme;
  } catch {
    return defaultTheme;
  }
};

// Get system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'skyscout-theme',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getInitialTheme(storageKey, defaultTheme)
  );

  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() =>
    getSystemTheme()
  );

  // Resolve the actual theme to apply
  const resolvedTheme = React.useMemo(() => {
    if (theme === 'system' && enableSystem) {
      return systemTheme;
    }
    return theme === 'system' ? 'light' : theme;
  }, [theme, systemTheme, enableSystem]);

  // Apply theme to DOM with maximum performance optimization
  const applyTheme = React.useCallback(
    (newTheme: 'light' | 'dark') => {
      const root = document.documentElement;

      // Add global class to disable ALL transitions and animations
      root.classList.add('theme-switching');

      // Immediate theme application without any delays
      if (disableTransitionOnChange) {
        // Force immediate update with no transitions
        root.style.setProperty('transition', 'none', 'important');
        document.body.style.setProperty('transition', 'none', 'important');
      }

      // Batch DOM updates for maximum performance
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);

      // Immediate color-scheme update for browser optimization
      root.style.setProperty('color-scheme', newTheme);

      // Update meta theme-color immediately
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          newTheme === 'dark' ? '#0f172a' : '#ffffff'
        );
      }

      // Remove theme switching class immediately
      setTimeout(() => {
        root.classList.remove('theme-switching');
        if (disableTransitionOnChange) {
          root.style.removeProperty('transition');
          document.body.style.removeProperty('transition');
        }
      }, 1);
    },
    [disableTransitionOnChange]
  );

  // Listen to system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  // Apply theme changes immediately
  React.useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  // Optimized setTheme function
  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Handle localStorage errors gracefully
      }
      setThemeState(newTheme);
    },
    [storageKey]
  );

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      systemTheme,
      resolvedTheme,
    }),
    [theme, setTheme, systemTheme, resolvedTheme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
