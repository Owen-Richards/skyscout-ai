/**
 * Feature Discovery Overlay
 * Contextual introduction of advanced features based on user behavior
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@skyscout/ui';
import {
  ArrowRight,
  Bell,
  Calculator,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeatureDiscoveryProps {
  readonly className?: string;
  readonly trigger:
    | 'first-search'
    | 'repeat-user'
    | 'price-check'
    | 'group-hint';
  readonly onDismiss?: () => void;
  readonly onTakeAction?: (feature: string) => void;
}

interface DiscoveryFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  action: string;
  benefits: string[];
  timing: 'immediate' | 'after-search' | 'contextual';
}

const discoveryFeatures: Record<string, DiscoveryFeature[]> = {
  'first-search': [
    {
      id: 'price-advisor',
      title: 'Smart Price Advisor',
      description: 'Get AI-powered advice on when to book for the best deals',
      icon: TrendingUp,
      badge: 'AI-Powered',
      action: 'Enable Price Advisor',
      benefits: [
        'Save up to 40% on flights',
        'Confidence scoring',
        'Optimal booking timing',
      ],
      timing: 'after-search',
    },
  ],
  'repeat-user': [
    {
      id: 'group-planning',
      title: 'Group Planning Workspace',
      description:
        'Plan trips with friends, vote on options, and split costs seamlessly',
      icon: Users,
      badge: 'Beta',
      action: 'Start Group Trip',
      benefits: [
        'Collaborative planning',
        'Democratic voting',
        'Automatic cost splitting',
      ],
      timing: 'contextual',
    },
    {
      id: 'price-tracking',
      title: 'Smart Price Alerts',
      description: 'Track price changes and get notified when deals appear',
      icon: Bell,
      badge: 'Popular',
      action: 'Set Price Alert',
      benefits: [
        'Real-time notifications',
        'Historical price data',
        'Trend analysis',
      ],
      timing: 'immediate',
    },
  ],
  'price-check': [
    {
      id: 'total-cost',
      title: 'True Total Cost Calculator',
      description:
        'See all hidden fees upfront - bags, seats, taxes, everything',
      icon: Calculator,
      badge: 'Transparent',
      action: 'View True Cost',
      benefits: [
        'No surprise fees',
        'Compare total costs',
        'Budget accurately',
      ],
      timing: 'immediate',
    },
  ],
};

export function FeatureDiscovery({
  className,
  trigger,
  onDismiss,
  onTakeAction,
}: FeatureDiscoveryProps) {
  const [visible, setVisible] = useState(false);
  const features = discoveryFeatures[trigger] || [];

  useEffect(() => {
    // Show discovery after appropriate trigger delay
    const delay = trigger === 'first-search' ? 3000 : 1000;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible || features.length === 0) return null;

  const handleTakeAction = (feature: DiscoveryFeature) => {
    onTakeAction?.(feature.id);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-2 fade-in',
        className
      )}
    >
      <Card className="glass-card border-2 border-primary/20 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <CardTitle className="text-sm font-semibold">
                Discover More
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Based on your usage, here's something that might help
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {features.map(feature => (
            <div key={feature.id} className="group cursor-pointer">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    {feature.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits Preview */}
                  <div className="mt-2 space-y-1">
                    {feature.benefits.slice(0, 2).map(benefit => (
                      <div
                        key={benefit}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    className="mt-3 w-full text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      handleTakeAction(feature);
                    }}
                  >
                    {feature.action}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="w-full text-xs text-muted-foreground"
            >
              Maybe later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
