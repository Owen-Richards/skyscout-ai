/**
 * Hero Section Container Component
 * Following Single Responsibility Principle - orchestrates hero section layout
 */

'use client';

import { Plane, ArrowRight } from 'lucide-react';
import { Button } from '@skyscout/ui';
import { HeroBackground } from './hero-background';
import { HeroFeatureCard } from './hero-feature-card';
import { HeroStats } from './hero-stats';
import { useFeatureCycling } from '../../hooks/use-hero-animations';
import { HERO_FEATURES, HERO_STATS } from '../../constants/hero';
import type { HeroSectionProps } from '../../types/hero';

// Inline HeroContent component to avoid import issues
function HeroContent({ className }: { readonly className?: string }) {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 animate-float">
          <Plane className="w-16 h-16 text-primary" />
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-fade-in">
        SkyScout AI
      </h1>

      {/* Subheading */}
      <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto animate-slide-in">
        Your intelligent flight discovery engine powered by AI—find the best
        deals, predict prices, and explore destinations like never before.
      </p>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
        <Button
          size="lg"
          variant="default"
          className="transition-all duration-300 transform hover:scale-105"
        >
          Start Exploring
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="transition-all duration-300 transform hover:scale-105"
        >
          Watch Demo
        </Button>
      </div>

      {/* Features highlight */}
      <div className="flex flex-wrap justify-center gap-8 mt-12">
        <div className="flex items-center gap-3 text-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
          <span className="text-sm font-medium">
            AI-Powered Price Prediction
          </span>
        </div>
        <div className="flex items-center gap-3 text-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
          <span className="text-sm font-medium">Real-time Alerts</span>
        </div>
        <div className="flex items-center gap-3 text-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
          <span className="text-sm font-medium">Best Price Guarantee</span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ className }: HeroSectionProps) {
  const { currentIndex } = useFeatureCycling(HERO_FEATURES, 3000);

  return (
    <section
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden ${className}`}
    >
      {/* Background Layer */}
      <HeroBackground />

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center">
          {/* Main Content */}
          <HeroContent />

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-16">
            {HERO_FEATURES.map((feature, index) => (
              <HeroFeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                isActive={index === currentIndex}
                className="animate-fade-in"
              />
            ))}
          </div>

          {/* Statistics */}
          <HeroStats stats={HERO_STATS} className="mt-16" />
        </div>
      </div>
    </section>
  );
}
