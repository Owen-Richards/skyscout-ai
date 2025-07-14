/**
 * Hero Background Component
 * Following Single Responsibility Principle - handles only background visuals
 */

interface HeroBackgroundProps {
  readonly className?: string;
}

export function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-float" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-400/20 rounded-full animate-float-delayed" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-sky-400/20 rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-500/20 rounded-full animate-float" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </div>
  );
}
