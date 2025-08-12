/**
 * Filter Presets Component
 *
 * Smart filter presets for quick filtering
 */

'use client';

import { Button, cn } from '@skyscout/ui';
import type { FilterPreset } from '../../hooks/use-flight-filters';

interface FilterPresetsProps {
  presets: FilterPreset[];
  onPresetSelect: (preset: FilterPreset) => void;
  className?: string;
}

export function FilterPresets({
  presets,
  onPresetSelect,
  className,
}: FilterPresetsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-medium text-muted-foreground">
        Quick Filters
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map(preset => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            onClick={() => onPresetSelect(preset)}
            className="flex items-center gap-2 h-auto p-3"
          >
            <preset.icon className="h-4 w-4" />
            <span className="text-xs">{preset.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
