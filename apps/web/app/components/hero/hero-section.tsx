/**
 * Hero Section Container Component
 * Following Single Responsibility Principle - orchestrates hero section layout
 */

'use client';

import { Badge, Button } from '@skyscout/ui';
import { ArrowRight, Bell, Plane, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { HeroSectionProps } from '../../types/hero';
import { HeroBackground } from './hero-background';

// Inline HeroContent component - Optimized for 5-second attention rule
function HeroContent({ className }: { readonly className?: string }) {
  // Destination animation for increased engagement
  const [destination, setDestination] = useState('Paris');
  const destinations = ['Paris', 'Tokyo', 'Bali', 'New York', 'Rome', 'Sydney'];

  useEffect(() => {
    const interval = setInterval(() => {
      setDestination(prev => {
        const currentIndex = destinations.indexOf(prev);
        return destinations[(currentIndex + 1) % destinations.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Strategic Eye-Catching Value Prop - First thing users see */}
      <div className="mb-6">
        <div className="inline-block animate-fade-in">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-yellow-400/20 text-foreground border border-border/30 backdrop-blur-sm px-4 py-2 text-sm font-medium"
          >
            <TrendingDown className="w-4 h-4 inline mr-1 text-green-400" />
            <span className="font-bold">Save 70%</span> on flights to{' '}
            {destination}
          </Badge>
        </div>
      </div>

      {/* Icon - More purposeful placement */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 rounded-full blur-xl opacity-30"></div>
          <div className="relative p-5 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 shadow-lg">
            <Plane className="w-12 h-12 text-primary drop-shadow-lg hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Main Heading - Clear value proposition */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-3 leading-tight">
          Find Your Perfect{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI-powered flight search that predicts price drops before they happen
        </p>
      </div>

      {/* Social Proof - Positioned higher for immediate credibility */}
      <div className="mb-8 bg-background/30 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
        <div className="flex justify-center items-center gap-4 md:gap-8 text-muted-foreground text-sm md:text-base flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">4.8/5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">💰</span>
            <span className="font-medium">$2M+ saved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">👥</span>
            <span className="font-medium">50K+ travelers</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Optimized for conversion */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
        <Button
          size="xl"
          variant="sky-primary"
          className="relative overflow-hidden shadow-lg w-full sm:w-auto transition-all duration-200 group"
          onClick={() => {
            // Navigate to flights page
            window.location.href = '/flights';
          }}
        >
          <Plane className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          Search Flights
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <Button
          variant="glass"
          size="xl"
          className="relative overflow-hidden shadow-lg w-full sm:w-auto transition-all duration-200"
          onClick={() => {
            console.log('Setting up price alerts...');
          }}
        >
          <Bell className="mr-2 h-5 w-5" />
          Set Price Alerts
        </Button>
      </div>

      {/* Live Deal Ticker - Creates urgency */}
      <div className="text-sm text-muted-foreground mt-4 flex items-center justify-center">
        <span className="relative flex h-3 w-3 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span>347 deals ending in the next 24 hours</span>
      </div>
    </div>
  );
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={`relative min-h-[90vh] flex flex-col justify-center overflow-hidden ${className}`}
    >
      {/* Background Layer */}
      <HeroBackground />

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <div className="text-center">
          {/* Main Content - Streamlined and focused */}
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
