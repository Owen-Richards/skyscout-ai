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
            ? 'bg-white/20 border-white/30 scale-105'
            : 'bg-white/10 border-white/20 hover:bg-white/15'
        }
        ${className}
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-semibold text-white">{feature.title}</h3>
      </div>
      <p className="text-white/80 text-sm">{feature.description}</p>
    </div>
  );
}
