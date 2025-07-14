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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full animate-float-delayed" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary/8 rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-primary/12 rounded-full animate-float" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </div>
  );
}
