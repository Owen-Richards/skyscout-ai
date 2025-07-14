import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from './button';
import { cn } from '../lib/utils';

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
    const { theme, setTheme } = useTheme();

    const handleToggle = () => {
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
        // Simple toggle between light and dark
        setTheme(theme === 'light' ? 'dark' : 'light');
      }
    };

    const getIcon = () => {
      switch (theme) {
        case 'light':
          return <Sun className="h-4 w-4" />;
        case 'dark':
          return <Moon className="h-4 w-4" />;
        case 'system':
          return <Monitor className="h-4 w-4" />;
        default:
          return <Sun className="h-4 w-4" />;
      }
    };

    const getLabel = () => {
      switch (theme) {
        case 'light':
          return 'Light';
        case 'dark':
          return 'Dark';
        case 'system':
          return 'System';
        default:
          return 'Light';
      }
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={handleToggle}
        className={cn('transition-all', className)}
        aria-label={`Switch to ${
          showSystem
            ? theme === 'light'
              ? 'dark'
              : theme === 'dark'
                ? 'system'
                : 'light'
            : theme === 'light'
              ? 'dark'
              : 'light'
        } theme`}
        {...props}
      >
        {getIcon()}
        {showLabels && <span className="ml-2">{getLabel()}</span>}
      </Button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

/**
 * Theme selector with dropdown/segmented control
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
    }> = [
      { value: 'light', icon: Sun, label: 'Light' },
      { value: 'dark', icon: Moon, label: 'Dark' },
      ...(showSystem
        ? [{ value: 'system' as const, icon: Monitor, label: 'System' }]
        : []),
    ];

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
            onClick={() => setTheme(value)}
            className={cn(
              'transition-all',
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
