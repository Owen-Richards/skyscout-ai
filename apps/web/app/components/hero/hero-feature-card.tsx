/**
 * Hero Feature Card Component
 * Following Single Responsibility Principle - displays a single feature
 */

import type { HeroFeature } from '../../types/hero';

interface HeroFeatureCardProps {
  readonly feature: HeroFeature;
  readonly index: number;
  readonly isActive?: boolean;
  readonly className?: string;
}

export function HeroFeatureCard({
  feature,
  index,
  isActive = false,
  className,
}: HeroFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      className={`
        p-6 rounded-xl backdrop-blur-sm border transition-all duration-500
        ${
          isActive
            ? 'bg-card/20 border-primary/30 scale-105'
            : 'bg-card/10 border-border/20 hover:bg-card/15'
        }
        ${className}
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">{feature.title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{feature.description}</p>
    </div>
  );
}
