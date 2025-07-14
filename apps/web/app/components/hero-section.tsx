'use client';

import { Globe, Plane, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 dark:from-primary/90 dark:via-primary/80 dark:to-primary/70">
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
      <div className="relative container mx-auto px-4 py-24 text-center text-primary-foreground">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Plane className="w-16 h-16" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-primary-foreground/80 bg-clip-text text-transparent">
          SkyScout AI
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
          Your intelligent flight discovery engine powered by AI—find the best
          deals, predict prices, and explore destinations like never before.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="flex items-center gap-3 text-primary-foreground/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Sparkles className="w-6 h-6" />
            <span className="text-lg">AI-Powered Predictions</span>
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Globe className="w-6 h-6" />
            <span className="text-lg">Global Coverage</span>
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Plane className="w-6 h-6" />
            <span className="text-lg">Real-time Deals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
