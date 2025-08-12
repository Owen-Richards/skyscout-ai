/**
 * Progressive Disclosure Demo Page
 * Demonstrates the UX strategy for SkyScout AI
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@skyscout/ui';
import {
  ArrowRight,
  Settings,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Import our progressive disclosure components
import { FeatureDiscovery } from '../components/discovery/feature-discovery';
import { SmartNavigation } from '../components/navigation/smart-navigation';
import {
  ResultsDisplay,
  mockFlightResults,
} from '../components/results/results-display';
import { AdaptiveSearch } from '../components/search/adaptive-search';

// Mock user level detection (replace with actual implementation)
type UserLevel = 'beginner' | 'intermediate' | 'expert';

interface UserBehavior {
  searchCount: number;
  featuresUsed: string[];
  timeSpent: number;
}

export default function ProgressiveDisclosureDemo() {
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [discoveryTrigger, setDiscoveryTrigger] = useState<
    'first-search' | 'repeat-user' | 'price-check' | 'group-hint'
  >('first-search');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    searchCount: 0,
    featuresUsed: [],
    timeSpent: 0,
  });

  // Simulate user progression
  const simulateUserProgress = () => {
    setUserBehavior(prev => ({
      searchCount: prev.searchCount + 1,
      featuresUsed: [...prev.featuresUsed, 'search'],
      timeSpent: prev.timeSpent + 2,
    }));

    // Update user level based on behavior
    if (
      userBehavior.searchCount >= 5 ||
      userBehavior.featuresUsed.length >= 3
    ) {
      setUserLevel('expert');
    } else if (
      userBehavior.searchCount >= 2 ||
      userBehavior.featuresUsed.length >= 1
    ) {
      setUserLevel('intermediate');
    }

    setSearchPerformed(true);

    // Show discovery after first search
    if (userBehavior.searchCount === 0) {
      setTimeout(() => {
        setShowDiscovery(true);
        setDiscoveryTrigger('first-search');
      }, 2000);
    }
  };

  const handleFeatureUse = (feature: string) => {
    setUserBehavior(prev => {
      const existingFeatures = prev.featuresUsed;
      const newFeatures = existingFeatures.includes(feature)
        ? existingFeatures
        : [...existingFeatures, feature];

      return {
        ...prev,
        featuresUsed: newFeatures,
      };
    });
    setShowDiscovery(false);
  };

  const getLevelBadgeColor = (level: UserLevel) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Controls */}
      <div className="bg-muted/50 border-b p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Progressive Disclosure Demo
              </h1>
              <p className="text-muted-foreground">
                How SkyScout adapts to user expertise without overwhelming
                beginners
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">User Level:</span>
                <Badge className={getLevelBadgeColor(userLevel)}>
                  {userLevel}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Searches: {userBehavior.searchCount} | Features:{' '}
                {userBehavior.featuresUsed.length}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUserLevel('beginner');
                  setUserBehavior({
                    searchCount: 0,
                    featuresUsed: [],
                    timeSpent: 0,
                  });
                  setSearchPerformed(false);
                  setShowDiscovery(false);
                }}
              >
                Reset Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Smart Navigation */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-primary">SkyScout AI</h2>
              <Badge variant="secondary">Progressive UX</Badge>
            </div>
            <SmartNavigation userLevel={userLevel} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section with Progressive Hints */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Everyone Travel Platform</h1>
          <p className="text-xl text-muted-foreground mb-6">
            {userLevel === 'beginner' && 'Find the perfect flight in seconds'}
            {userLevel === 'intermediate' &&
              'Smart travel planning with AI-powered insights'}
            {userLevel === 'expert' && 'Complete multi-modal travel ecosystem'}
          </p>

          {/* Progressive Feature Highlights */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm">AI-Powered</span>
            </div>
            {userLevel !== 'beginner' && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm">Group Planning</span>
              </div>
            )}
            {userLevel === 'expert' && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm">Multi-Modal</span>
              </div>
            )}
          </div>
        </div>

        {/* Adaptive Search Interface */}
        <div className="mb-8">
          <AdaptiveSearch
            userLevel={userLevel}
            showMultiModal={userLevel === 'expert'}
          />

          {/* Search Action (Demo) */}
          <div className="text-center mt-4">
            <Button size="lg" onClick={simulateUserProgress} className="px-8">
              <span>Simulate Search</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Results Display (After Search) */}
        {searchPerformed && (
          <div className="mb-8">
            <ResultsDisplay userLevel={userLevel} results={mockFlightResults} />
          </div>
        )}

        {/* User Journey Explanation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              How Progressive Disclosure Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={cn(
                  'p-4 rounded-lg border',
                  userLevel === 'beginner'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-100 text-green-800">
                    Beginner
                  </Badge>
                  {userLevel === 'beginner' && (
                    <Star className="w-4 h-4 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold mb-2">Simple & Clear</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 4-field search form</li>
                  <li>• Top-3 results with clear benefits</li>
                  <li>• Smart tips and guidance</li>
                  <li>• Basic booking flow</li>
                </ul>
              </div>

              <div
                className={cn(
                  'p-4 rounded-lg border',
                  userLevel === 'intermediate'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Intermediate
                  </Badge>
                  {userLevel === 'intermediate' && (
                    <Star className="w-4 h-4 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold mb-2">Enhanced Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Advanced filters</li>
                  <li>• Price tracking & alerts</li>
                  <li>• True total cost breakdown</li>
                  <li>• Group planning hints</li>
                </ul>
              </div>

              <div
                className={cn(
                  'p-4 rounded-lg border',
                  userLevel === 'expert'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-purple-100 text-purple-800">
                    Expert
                  </Badge>
                  {userLevel === 'expert' && (
                    <Star className="w-4 h-4 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold mb-2">Full Power</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multi-modal transport</li>
                  <li>• Advanced comparison tools</li>
                  <li>• Group trip workspaces</li>
                  <li>• Concierge services</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Key Insight:</strong> Users naturally progress through
                levels based on behavior. Advanced features appear contextually
                without overwhelming beginners. This approach reduces cognitive
                load while maintaining power-user capabilities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Advantage */}
        <Card>
          <CardHeader>
            <CardTitle>Competitive Advantage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">vs. Booking.com</h4>
                <p className="text-sm text-muted-foreground">
                  Their complex interface overwhelms users. Our progressive
                  disclosure starts simple and reveals complexity only when
                  needed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">vs. Skyscanner</h4>
                <p className="text-sm text-muted-foreground">
                  Their basic search lacks intelligence. Our AI-powered
                  matchmaking provides personalized recommendations from the
                  start.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">vs. Google Flights</h4>
                <p className="text-sm text-muted-foreground">
                  Their sterile UX has no personality. Our progressive system
                  grows with users and builds lasting engagement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Feature Discovery Overlay */}
      {showDiscovery && (
        <FeatureDiscovery
          trigger={discoveryTrigger}
          onDismiss={() => setShowDiscovery(false)}
          onTakeAction={handleFeatureUse}
        />
      )}
    </div>
  );
}
