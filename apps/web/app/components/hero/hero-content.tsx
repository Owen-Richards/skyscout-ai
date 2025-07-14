/**
 * Hero Content Component
 * Following Single Responsibility Principle - handles only main hero text content
 */

import { Plane, ArrowRight } from 'lucide-react';
import { Button } from '@skyscout/ui';

interface HeroContentProps {
  readonly className?: string;
}

export function HeroContent({ className }: HeroContentProps) {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-float">
          <Plane className="w-16 h-16 text-white" />
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent animate-fade-in">
        SkyScout AI
      </h1>

      {/* Subheading */}
      <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-slide-in">
        Your intelligent flight discovery engine powered by AI—find the best
        deals, predict prices, and explore destinations like never before.
      </p>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
        >
          Start Exploring
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          Watch Demo
        </Button>
      </div>

      {/* Features highlight */}
      <div className="flex flex-wrap justify-center gap-8 mt-12">
        <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <span className="text-sm font-medium">
            AI-Powered Price Prediction
          </span>
        </div>
        <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <span className="text-sm font-medium">Real-time Alerts</span>
        </div>
        <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <span className="text-sm font-medium">Best Price Guarantee</span>
        </div>
      </div>
    </div>
  );
}
