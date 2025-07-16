/**
 * Hero Content Component
 * Following Single Responsibility Principle - handles only main hero text content
 * Optimized for 5-second attention capture and trust building
 */

import { Plane, ArrowRight, TrendingDown, Shield, Zap } from 'lucide-react';
import { Button, Badge } from '@skyscout/ui';

interface HeroContentProps {
  readonly className?: string;
}

export function HeroContent({ className }: HeroContentProps) {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Trust Badge - Fun and engaging */}
      <div className="flex justify-center mb-6">
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-yellow-400/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium"
        >
          🏆 #1 Flight Discovery Platform
        </Badge>
      </div>

      {/* Icon with fun appeal */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 rounded-full blur-xl opacity-30"></div>
          <div className="relative p-6 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-full border border-white/30 shadow-2xl transition-all duration-200 hover:scale-105">
            <Plane className="w-16 h-16 text-white drop-shadow-lg hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Main Heading - Fun and Engaging */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Find Your Perfect{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Adventure
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Smart flight search with AI that saves you money
        </p>
      </div>

      {/* Simple Value Proposition */}
      <div className="mb-8">
        <p className="text-xl md:text-2xl font-semibold text-white mb-6 leading-tight">
          Save up to{' '}
          <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold">
            70%
          </span>{' '}
          on your next trip
        </p>
      </div>

      {/* Action Buttons - Fun and Engaging */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <Button
          size="xl"
          variant="sky-primary"
          className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 group"
          onClick={() => {
            const searchForm = document.querySelector('#search-form');
            if (searchForm) {
              searchForm.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Plane className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          Start Exploring
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <Button
          variant="glass"
          size="xl"
          className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => {
            console.log('Setting up price alerts...');
          }}
        >
          <span className="mr-2">🔔</span>
          Get Deal Alerts
        </Button>
      </div>

      {/* Minimal Trust Indicators */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span>4.8/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">💰</span>
            <span>$2M+ saved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">👥</span>
            <span>50K+ travelers</span>
          </div>
        </div>
      </div>

      {/* Simple Features - Just the essentials */}
      <div className="flex justify-center items-center gap-8 text-white/70 text-sm mb-8">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-400" />
          <span>Smart Pricing</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Instant Search</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Secure Booking</span>
        </div>
      </div>
    </div>
  );
}
