/**
 * Hero Section Container Component
 * Following Single Responsibility Principle - orchestrates hero section layout
 */

'use client';

import {
  Plane,
  ArrowRight,
  Users,
  TrendingDown,
  Shield,
  Zap,
} from 'lucide-react';
import { Button, Badge } from '@skyscout/ui';
import { HeroBackground } from './hero-background';
import { HeroFeatureCard } from './hero-feature-card';
import { HeroStats } from './hero-stats';
import { SkyScoutHeroBrand } from '../ui/skyscout-brand';
import { useAppTranslation } from '../../contexts/translation-context';
import { useFeatureCycling } from '../../hooks/use-hero-animations';
import { HERO_FEATURES, HERO_STATS } from '../../constants/hero';
import type { HeroSectionProps } from '../../types/hero';

// Inline HeroContent component to avoid import issues - Enhanced for 5-second attention capture
function HeroContent({ className }: { readonly className?: string }) {
  const { tHero } = useAppTranslation();

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Trust Badge - Immediate credibility */}
      <div className="flex justify-center mb-4">
        <Badge
          variant="secondary"
          className="bg-card/20 text-foreground border-border/30 backdrop-blur-sm px-4 py-2 text-sm font-medium animate-pulse"
        >
          🏆 {tHero('trust_badge')}
        </Badge>
      </div>

      {/* Icon with enhanced visual appeal */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative p-6 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 shadow-2xl hover:scale-110 transition-transform duration-500">
            <Plane className="w-16 h-16 text-primary drop-shadow-lg animate-bounce" />
          </div>
        </div>
      </div>

      {/* Main Heading */}
      <SkyScoutHeroBrand />

      {/* Compelling Value Proposition */}
      <p className="text-xl md:text-2xl mb-6 text-foreground max-w-3xl mx-auto animate-slide-in font-medium leading-relaxed">
        {tHero('savings')}
      </p>

      {/* Social Proof - Build immediate trust */}
      <div className="flex justify-center items-center gap-6 mb-8 text-muted-foreground">
        <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{tHero('users_count')}</span>
        </div>
        <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
          <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium">
            {tHero('average_savings')}
          </span>
        </div>
      </div>

      {/* Call to Action with urgency */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in mb-6">
        <Button
          size="xl"
          variant="sky-primary"
          className="relative overflow-hidden shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 group"
        >
          <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
          {tHero('cta')}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <Button
          variant="glass"
          size="xl"
          className="relative overflow-hidden shadow-xl group"
        >
          <span className="mr-2">▶️</span>
          {tHero('secondary_cta')}
        </Button>
      </div>

      {/* Urgency indicator */}
      <p className="text-sm text-muted-foreground mb-8 animate-pulse">
        ⚡ {tHero('live_deals')}
      </p>

      {/* Enhanced Features highlight with trust indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <div className="flex items-center gap-3 text-foreground bg-card/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">
              {tHero('ai_prediction')}
            </div>
            <div className="text-xs text-muted-foreground">
              {tHero('ai_accuracy')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-foreground bg-card/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">
              {tHero('instant_alerts')}
            </div>
            <div className="text-xs text-muted-foreground">
              {tHero('real_time')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-foreground bg-card/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">
              {tHero('price_guarantee')}
            </div>
            <div className="text-xs text-muted-foreground">
              {tHero('money_back')}
            </div>
          </div>
        </div>
      </div>

      {/* Final trust indicator */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span>🔒 {tHero('security')}</span>
          <span>•</span>
          <span>⭐ {tHero('rating')}</span>
          <span>•</span>
          <span>🏅 {tHero('support')}</span>
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
