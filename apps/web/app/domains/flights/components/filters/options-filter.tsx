/**
 * Options Filter Component
 *
 * Reusable component for checkbox-based filters (stops, airlines, etc.)
 */

'use client';

import { Badge, Card, cn } from '@skyscout/ui';
import type { LucideIcon } from 'lucide-react';
import type { FilterOption } from '../../hooks/use-flight-filters';

interface OptionsFilterProps {
  title: string;
  icon: LucideIcon;
  options: FilterOption[];
  selectedValues: string[];
  onOptionToggle: (optionId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function OptionsFilter({
  title,
  icon: Icon,
  options,
  selectedValues,
  onOptionToggle,
  isExpanded,
  onToggle,
}: OptionsFilterProps) {
  const selectedCount = selectedValues.length;

  return (
    <Card className="p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{title}</span>
        </div>
        {selectedCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedCount}
          </Badge>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          {options.map(option => {
            const isSelected = selectedValues.includes(option.id);

            return (
              <label
                key={option.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onOptionToggle(option.id)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span
                    className={cn('text-sm', isSelected ? 'font-medium' : '')}
                  >
                    {option.label}
                  </span>
                </div>
                {option.count && (
                  <span className="text-xs text-muted-foreground">
                    {option.count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </Card>
  );
}
