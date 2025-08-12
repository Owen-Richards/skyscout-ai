'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { useTheme } from './theme-provider';

interface ThemeToggleProps {
  /**
   * Show text labels alongside icons
   */
  showLabels?: boolean;
  /**
   * Show system theme option
   */
  showSystem?: boolean;
  /**
   * Button variant
   */
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'secondary';
  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Simple theme toggle button that cycles through light/dark modes
 * Optimized for instant switching with no lag
 */
export const ThemeToggle = React.forwardRef<
  HTMLButtonElement,
  ThemeToggleProps
>(
  (
    {
      showLabels = false,
      showSystem = false,
      variant = 'ghost',
      size = 'icon',
      className,
      ...props
    },
    ref
  ) => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const handleToggle = React.useCallback(() => {
      // Immediate theme switching with no delays
      if (showSystem) {
        // Cycle through light -> dark -> system
        if (theme === 'light') {
          setTheme('dark');
        } else if (theme === 'dark') {
          setTheme('system');
        } else {
          setTheme('light');
        }
      } else {
        // Instant toggle between light and dark
        const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
      }
    }, [theme, resolvedTheme, setTheme, showSystem]);

    // Use resolved theme for immediate visual feedback
    const getIcon = React.useMemo(() => {
      const iconSize = size === 'icon' ? 'h-5 w-5' : 'h-4 w-4';
      const currentTheme = theme === 'system' ? resolvedTheme : theme;

      switch (currentTheme) {
        case 'light':
          return <Sun className={iconSize} />;
        case 'dark':
          return <Moon className={iconSize} />;
        default:
          return theme === 'system' ? (
            <Monitor className={iconSize} />
          ) : (
            <Sun className={iconSize} />
          );
      }
    }, [theme, resolvedTheme, size]);

    const getLabel = React.useMemo(() => {
      if (theme === 'system') {
        return `System (${resolvedTheme})`;
      }
      switch (theme) {
        case 'light':
          return 'Light';
        case 'dark':
          return 'Dark';
        default:
          return 'Light';
      }
    }, [theme, resolvedTheme]);

    const getNextThemeLabel = React.useMemo(() => {
      if (showSystem) {
        return theme === 'light'
          ? 'dark'
          : theme === 'dark'
            ? 'system'
            : 'light';
      }
      return resolvedTheme === 'light' ? 'dark' : 'light';
    }, [theme, resolvedTheme, showSystem]);

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={handleToggle}
        className={cn('theme-instant', className)}
        aria-label={`Switch to ${getNextThemeLabel} theme`}
        {...props}
      >
        {getIcon}
        {showLabels && <span className="ml-2">{getLabel}</span>}
      </Button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

/**
 * Theme selector with dropdown/segmented control
 * Optimized for instant switching with no lag
 */
interface ThemeSelectProps {
  /**
   * Show labels
   */
  showLabels?: boolean;
  /**
   * Show system option
   */
  showSystem?: boolean;
  /**
   * Layout orientation
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Additional className
   */
  className?: string;
}

export const ThemeSelect = React.forwardRef<HTMLDivElement, ThemeSelectProps>(
  (
    {
      showLabels = true,
      showSystem = true,
      orientation = 'horizontal',
      className,
      ...props
    },
    ref
  ) => {
    const { theme, setTheme } = useTheme();

    const themes: Array<{
      value: 'light' | 'dark' | 'system';
      icon: React.ComponentType<{ className?: string }>;
      label: string;
    }> = React.useMemo(
      () => [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        ...(showSystem
          ? [{ value: 'system' as const, icon: Monitor, label: 'System' }]
          : []),
      ],
      [showSystem]
    );

    const handleThemeChange = React.useCallback(
      (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
      },
      [setTheme]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex rounded-md border border-border p-1',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          className
        )}
        role="radiogroup"
        aria-label="Theme selection"
        {...props}
      >
        {themes.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={theme === value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleThemeChange(value)}
            className={cn(
              'transition-all duration-200',
              orientation === 'vertical' ? 'justify-start' : 'justify-center'
            )}
            role="radio"
            aria-checked={theme === value}
            aria-label={`Switch to ${label.toLowerCase()} theme`}
          >
            <Icon className="h-4 w-4" />
            {showLabels && <span className="ml-2">{label}</span>}
          </Button>
        ))}
      </div>
    );
  }
);

ThemeSelect.displayName = 'ThemeSelect';
