'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from '@skyscout/ui';
import {
  BarChart3,
  Bell,
  Bot,
  Calendar,
  Globe,
  LineChart,
  MapPin,
  PieChart,
  Plane,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Enhanced Features Section
 * Showcases advanced UI components and interactions
 */
export function EnhancedFeatures() {
  const [selectedTab, setSelectedTab] = useState('ai-features');
  const [progressValue, setProgressValue] = useState(73);

  const features = [
    {
      icon: Bot,
      title: 'AI Price Prediction',
      description:
        'Advanced machine learning algorithms predict price changes up to 7 days in advance.',
      status: 'active',
      accuracy: 94,
    },
    {
      icon: TrendingUp,
      title: 'Real-time Market Analysis',
      description:
        'Monitor global flight prices and market trends across 500+ airlines.',
      status: 'beta',
      accuracy: 87,
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description:
        'Get instant alerts when prices drop for your favorite destinations.',
      status: 'active',
      accuracy: 96,
    },
    {
      icon: Shield,
      title: 'Price Protection',
      description:
        'Guaranteed lowest price or we refund the difference automatically.',
      status: 'premium',
      accuracy: 100,
    },
  ];

  const stats = [
    { label: 'Price Accuracy', value: 94, color: 'bg-green-500' },
    { label: 'User Satisfaction', value: 97, color: 'bg-blue-500' },
    { label: 'Cost Savings', value: 78, color: 'bg-purple-500' },
    { label: 'Speed Improvement', value: 89, color: 'bg-orange-500' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0">
            <Zap className="w-4 h-4 mr-2" />
            Advanced Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Future of{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Travel Intelligence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience cutting-edge AI technology that revolutionizes how you
            discover, book, and manage your travel experiences.
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-16"
        >
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger
              value="ai-features"
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              AI Engine
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="destinations"
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-features" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Features List */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-sky-500"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-sky-100 dark:bg-sky-900/20 rounded-lg">
                            <feature.icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {feature.title}
                            </h3>
                            <Badge
                              variant={
                                feature.status === 'active'
                                  ? 'default'
                                  : feature.status === 'beta'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className="text-xs mt-1"
                            >
                              {feature.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {feature.accuracy}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            accuracy
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4">
                        <Progress value={feature.accuracy} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Interactive Demo */}
              <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 border-sky-200 dark:border-sky-800">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2 text-sky-700 dark:text-sky-300">
                    <Zap className="w-5 h-5" />
                    Live AI Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      NYC → Tokyo
                    </div>
                    <div className="text-muted-foreground">
                      AI analyzing 47 price sources...
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Analysis Progress
                      </span>
                      <span className="text-sm font-medium">
                        {progressValue}%
                      </span>
                    </div>
                    <Progress value={progressValue} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        $589
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Best Price Found
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        -15%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Price Drop Predicted
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    onClick={() =>
                      setProgressValue(Math.min(100, progressValue + 10))
                    }
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Run AI Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div
                        className={cn(
                          'w-16 h-16 rounded-full flex items-center justify-center',
                          stat.color.replace('bg-', 'bg-opacity-20 bg-')
                        )}
                      >
                        <PieChart
                          className={cn(
                            'w-8 h-8',
                            stat.color.replace('bg-', 'text-')
                          )}
                        />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {stat.label}
                    </div>
                    <Progress value={stat.value} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="destinations" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  city: 'Tokyo',
                  country: 'Japan',
                  price: '$589',
                  trend: '+12%',
                  image: '🏯',
                },
                {
                  city: 'Paris',
                  country: 'France',
                  price: '$456',
                  trend: '-8%',
                  image: '🗼',
                },
                {
                  city: 'Bali',
                  country: 'Indonesia',
                  price: '$398',
                  trend: '+5%',
                  image: '🏝️',
                },
              ].map((destination, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="h-32 bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900 dark:to-blue-800 flex items-center justify-center text-4xl">
                    {destination.image}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {destination.city}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {destination.country}
                        </p>
                      </div>
                      <Badge
                        variant={
                          destination.trend.startsWith('+')
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {destination.trend}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-foreground">
                        {destination.price}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="group-hover:bg-sky-500 group-hover:text-white transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-sky-500" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-40 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-950/30 dark:to-blue-950/30 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">
                      Interactive chart placeholder
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Best booking window: 6-8 weeks ahead
                    </span>
                    <span className="font-medium text-green-600">
                      Average savings: 23%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    User Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      metric: 'Average Savings per Trip',
                      value: '$312',
                      change: '+18%',
                    },
                    {
                      metric: 'Booking Success Rate',
                      value: '94%',
                      change: '+5%',
                    },
                    {
                      metric: 'Time Saved per Search',
                      value: '12 min',
                      change: '+22%',
                    },
                  ].map((insight, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                    >
                      <span className="text-sm text-muted-foreground">
                        {insight.metric}
                      </span>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {insight.value}
                        </div>
                        <div className="text-xs text-green-600">
                          {insight.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0">
            <CardContent className="space-y-4">
              <h3 className="text-2xl font-bold">
                Ready to Experience the Future?
              </h3>
              <p className="text-sky-100">
                Join thousands of travelers who save money and time with our
                AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-sky-600 hover:bg-slate-100"
                >
                  <Plane className="w-5 h-5 mr-2" />
                  Start Searching
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
