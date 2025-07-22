/**
 * Trip Budget Tracker Component
 * Comprehensive budget management for trip planning
 * Standalone feature integrating with flights and hotels
 */

'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@skyscout/ui';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  Calendar,
  MapPin,
  Plus,
  CheckCircle,
  Wallet,
  Receipt,
  Sparkles,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { cn } from '@skyscout/ui';
import type { TripBudget } from '../../types/budget';

export function TripBudgetTracker({ className }: { className?: string }) {
  const [budgets] = useState<TripBudget[]>([
    {
      id: '1',
      tripName: 'Japan Adventure',
      destination: 'Tokyo, Japan',
      startDate: '2024-09-15',
      endDate: '2024-09-25',
      totalBudget: 4500,
      spentAmount: 2850,
      currency: 'USD',
      categories: [
        {
          id: 'flights',
          name: 'Flights',
          icon: '✈️',
          color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
          description: 'Air travel and transfers',
          isEssential: true,
        },
        {
          id: 'accommodation',
          name: 'Hotels',
          icon: '🏨',
          color: 'bg-green-500/20 text-green-600 dark:text-green-400',
          description: 'Hotels, ryokans, and lodging',
          isEssential: true,
        },
        {
          id: 'food',
          name: 'Food & Dining',
          icon: '🍜',
          color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
          description: 'Restaurants, street food, groceries',
          isEssential: true,
        },
        {
          id: 'activities',
          name: 'Activities',
          icon: '🎌',
          color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
          description: 'Tours, attractions, experiences',
          isEssential: false,
        },
        {
          id: 'transport',
          name: 'Local Transport',
          icon: '🚊',
          color: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
          description: 'JR Pass, metro, taxis',
          isEssential: true,
        },
        {
          id: 'shopping',
          name: 'Shopping',
          icon: '🛍️',
          color: 'bg-pink-500/20 text-pink-600 dark:text-pink-400',
          description: 'Souvenirs, clothes, electronics',
          isEssential: false,
        },
      ],
      items: [
        {
          id: '1',
          name: 'Round-trip Flight to Tokyo',
          categoryId: 'flights',
          estimatedCost: 1200,
          actualCost: 1150,
          currency: 'USD',
          isBooked: true,
          bookingDate: '2024-06-15',
          provider: 'SkyScout AI',
          priority: 'high',
          tags: ['confirmed', 'best-price'],
        },
        {
          id: '2',
          name: 'Hotel in Shibuya (5 nights)',
          categoryId: 'accommodation',
          estimatedCost: 800,
          actualCost: 750,
          currency: 'USD',
          isBooked: true,
          bookingDate: '2024-06-20',
          provider: 'SkyScout Hotels',
          priority: 'high',
          tags: ['confirmed', 'central-location'],
        },
        {
          id: '3',
          name: 'JR Pass (7-day)',
          categoryId: 'transport',
          estimatedCost: 300,
          actualCost: 280,
          currency: 'USD',
          isBooked: true,
          provider: 'JR Pass',
          priority: 'high',
          tags: ['confirmed', 'unlimited-travel'],
        },
        {
          id: '4',
          name: 'TeamLab Borderless Tickets',
          categoryId: 'activities',
          estimatedCost: 120,
          currency: 'USD',
          isBooked: false,
          priority: 'medium',
          tags: ['popular', 'advance-booking'],
        },
        {
          id: '5',
          name: 'Food Budget (10 days)',
          categoryId: 'food',
          estimatedCost: 600,
          actualCost: 420,
          currency: 'USD',
          isBooked: false,
          priority: 'high',
          tags: ['daily-expense'],
        },
        {
          id: '6',
          name: 'Shopping & Souvenirs',
          categoryId: 'shopping',
          estimatedCost: 400,
          actualCost: 250,
          currency: 'USD',
          isBooked: false,
          priority: 'low',
          tags: ['flexible'],
        },
      ],
      savings: {
        target: 4500,
        current: 3200,
        monthlyContribution: 800,
      },
      alerts: {
        overBudget: false,
        approaching75Percent: true,
        unusedCategories: ['shopping'],
      },
      aiInsights: {
        costOptimizations: [
          'Consider staying in Shinjuku instead of Shibuya for 15% savings',
          'Book TeamLab tickets now - prices increase 20% closer to date',
          'Use convenience store meals for 2-3 lunches to save $150',
        ],
        alternativeOptions: [
          'Hostel options available for $200 less per night',
          'Local train passes instead of JR Pass could save $80',
          'Free walking tours available instead of paid guides',
        ],
        seasonalPricing: [
          'September is shoulder season - good timing for hotels',
          'Cherry blossom season (March-May) costs 40% more',
          'Winter months offer 25% savings on accommodation',
        ],
        savingsOpportunities: [
          {
            amount: 150,
            suggestion:
              'Book activities bundle through SkyScout for group discount',
            confidence: 92,
          },
          {
            amount: 80,
            suggestion: 'Use IC card instead of individual metro tickets',
            confidence: 88,
          },
        ],
      },
    },
  ]);

  const [selectedBudget] = useState<TripBudget>(budgets[0]);

  const getCategorySpending = (categoryId: string) => {
    return selectedBudget.items
      .filter(item => item.categoryId === categoryId)
      .reduce((sum, item) => sum + (item.actualCost || item.estimatedCost), 0);
  };

  const getCategoryItems = (categoryId: string) => {
    return selectedBudget.items.filter(item => item.categoryId === categoryId);
  };

  const getBudgetProgress = () => {
    const progressPercent =
      (selectedBudget.spentAmount / selectedBudget.totalBudget) * 100;
    return Math.min(progressPercent, 100);
  };

  const getRemainingBudget = () => {
    return selectedBudget.totalBudget - selectedBudget.spentAmount;
  };

  const getSpendingTrend = () => {
    const remaining = getRemainingBudget();
    if (remaining < 0) return 'over-budget';
    if (remaining < selectedBudget.totalBudget * 0.1) return 'tight';
    return 'healthy';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedBudget.currency,
    }).format(amount);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            💰 Trip Budget Tracker
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Smart budget management with AI-powered savings recommendations
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Trip Budget
        </Button>
      </div>

      {/* Budget Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {selectedBudget.tripName}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{selectedBudget.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {selectedBudget.startDate} to {selectedBudget.endDate}
                </span>
              </div>
            </div>
          </div>
          <Badge
            className={cn(
              'border',
              getSpendingTrend() === 'healthy' &&
                'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
              getSpendingTrend() === 'tight' &&
                'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
              getSpendingTrend() === 'over-budget' &&
                'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
            )}
          >
            {getSpendingTrend() === 'healthy' && (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {getSpendingTrend() === 'tight' && (
              <AlertTriangle className="w-3 h-3 mr-1" />
            )}
            {getSpendingTrend() === 'over-budget' && (
              <TrendingUp className="w-3 h-3 mr-1" />
            )}
            {getSpendingTrend()}
          </Badge>
        </div>

        {/* Budget Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(selectedBudget.spentAmount)}
              </div>
              <div className="text-sm text-muted-foreground">
                of {formatCurrency(selectedBudget.totalBudget)} budgeted
              </div>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  'text-lg font-semibold',
                  getRemainingBudget() >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {getRemainingBudget() >= 0 ? '+' : ''}
                {formatCurrency(getRemainingBudget())}
              </div>
              <div className="text-sm text-muted-foreground">remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={cn(
                  'h-3 rounded-full transition-all duration-300',
                  getSpendingTrend() === 'healthy' &&
                    'bg-gradient-to-r from-green-500 to-emerald-500',
                  getSpendingTrend() === 'tight' &&
                    'bg-gradient-to-r from-yellow-500 to-orange-500',
                  getSpendingTrend() === 'over-budget' &&
                    'bg-gradient-to-r from-red-500 to-pink-500'
                )}
                style={{ width: `${getBudgetProgress()}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {getBudgetProgress().toFixed(1)}% of budget used
            </div>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedBudget.categories.map(category => {
          const spent = getCategorySpending(category.id);
          const items = getCategoryItems(category.id);
          const totalEstimated = items.reduce(
            (sum, item) => sum + item.estimatedCost,
            0
          );
          const progress =
            totalEstimated > 0 ? (spent / totalEstimated) * 100 : 0;

          return (
            <Card
              key={category.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn('p-2 rounded-lg', category.color)}>
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {category.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {items.length} items
                    </p>
                  </div>
                </div>
                {category.isEssential && (
                  <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs">
                    Essential
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent:</span>
                  <span className="font-medium">{formatCurrency(spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budgeted:</span>
                  <span className="font-medium">
                    {formatCurrency(totalEstimated)}
                  </span>
                </div>

                {totalEstimated > 0 && (
                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          progress <= 80
                            ? 'bg-green-500'
                            : progress <= 100
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {progress.toFixed(1)}% used
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              🤖 AI Budget Insights
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  💡 Cost Optimizations
                </h4>
                <div className="space-y-1">
                  {selectedBudget.aiInsights.costOptimizations
                    .slice(0, 2)
                    .map((insight, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <TrendingDown className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  💰 Savings Opportunities
                </h4>
                <div className="space-y-1">
                  {selectedBudget.aiInsights.savingsOpportunities.map(
                    (opportunity, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <PiggyBank className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Save {formatCurrency(opportunity.amount)}:{' '}
                          {opportunity.suggestion}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <Receipt className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Reports
        </Button>
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <PieChart className="w-4 h-4 mr-2" />
          Category Analysis
        </Button>
        <Button
          variant="outline"
          className="border-border hover:border-border/80"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Savings Plan
        </Button>
      </div>
    </div>
  );
}
