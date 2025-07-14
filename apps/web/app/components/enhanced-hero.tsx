'use client';

import * as React from 'react';
import {
  Plane,
  TrendingUp,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@skyscout/ui';
import { QuickSearch } from './quick-search';
import { cn } from '@skyscout/ui';

interface HeroSectionProps {
  className?: string;
}

const features = [
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'AI-powered price prediction and alerts',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Live flight status and gate changes',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Protected transactions and data privacy',
  },
  {
    icon: Sparkles,
    title: 'Smart Recommendations',
    description: 'Personalized travel suggestions',
  },
];

const stats = [
  { value: '10M+', label: 'Happy Travelers' },
  { value: '500+', label: 'Airlines' },
  { value: '95%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'Support' },
];

export function HeroSection({ className }: HeroSectionProps) {
  const [currentFeature, setCurrentFeature] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={cn(
        'relative min-h-screen flex flex-col justify-center overflow-hidden',
        className
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950">
        {/* Animated Planes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 animate-float">
            <Plane className="h-8 w-8 text-blue-300/30 transform rotate-45" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <Plane className="h-6 w-6 text-indigo-300/20 transform rotate-12" />
          </div>
          <div className="absolute bottom-40 left-1/4 animate-float-slow">
            <Plane className="h-10 w-10 text-sky-300/25 transform -rotate-12" />
          </div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center space-y-8 mb-12">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent">
                Next Adventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered flight search that finds you the perfect trip at the
              perfect price. Compare millions of flights in seconds.
            </p>
          </div>

          {/* Feature Highlight */}
          <div className="flex items-center justify-center space-x-2 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-border/20 max-w-md mx-auto">
            {React.createElement(features[currentFeature].icon, {
              className: 'h-5 w-5 text-primary',
            })}
            <span className="font-medium text-sm">
              {features[currentFeature].title}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {features[currentFeature].description}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="hero"
              variant="flight-action"
              effect="glow"
              rightIcon={<ArrowRight className="h-6 w-6" />}
              className="min-w-[200px]"
            >
              Start Your Journey
            </Button>
            <Button
              size="hero"
              variant="outline"
              className="min-w-[200px] bg-white/80 backdrop-blur-sm"
            >
              Explore Deals
            </Button>
          </div>
        </div>

        {/* Search Component */}
        <div className="mb-16">
          <QuickSearch />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-border/20"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  'p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-border/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                  currentFeature === index &&
                    'ring-2 ring-primary/50 shadow-lg scale-105'
                )}
              >
                <IconComponent className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 fill-background"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(45deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-15px) rotate(12deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(-25px) rotate(-12deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            #d1d5db 1px,
            transparent 1px
          );
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  );
}
