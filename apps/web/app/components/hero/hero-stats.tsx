/**
 * Hero Stats Display Component
 * Following Single Responsibility Principle - displays statistics only
 */

import type { HeroStat } from '../../types/hero';

interface HeroStatsProps {
  readonly stats: readonly HeroStat[];
  readonly className?: string;
}

export function HeroStats({ stats, className }: HeroStatsProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="text-center animate-fade-in"
          style={{ animationDelay: `${index * 0.1 + 0.8}s` }}
        >
          <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {stat.value}
          </div>
          <div className="text-white/70 text-sm lg:text-base">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
