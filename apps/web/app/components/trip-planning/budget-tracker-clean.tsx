'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  PieChart,
  Plane,
  Plus,
  Receipt,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Utensils,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import type { TripBudget, TripExpense } from '../../types/trip';

interface BudgetTrackerProps {
  budget: TripBudget;
  expenses: TripExpense[];
  _travelers: Array<{ id: string; firstName: string; lastName: string }>;
  _onUpdateBudget: (budget: TripBudget) => void;
  _onAddExpense: (expense: Omit<TripExpense, 'id'>) => void;
  _onUpdateExpense: (expenseId: string, expense: Partial<TripExpense>) => void;
  _onDeleteExpense: (expenseId: string) => void;
  className?: string;
}

export function BudgetTracker({
  budget,
  expenses,
  _travelers,
  _onUpdateBudget,
  _onAddExpense,
  _onUpdateExpense,
  _onDeleteExpense,
  className,
}: BudgetTrackerProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'categories' | 'expenses' | 'analytics'
  >('overview');
  const [showBudgetDetails, setShowBudgetDetails] = useState(true);

  const formatCurrency = (
    amount: number,
    currency: string = budget.currency
  ) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getBudgetHealth = () => {
    const spentPercentage = (budget.actualSpent / budget.totalBudget) * 100;

    if (spentPercentage > 100) {
      return {
        status: 'critical',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500/20',
        icon: AlertTriangle,
      };
    } else if (spentPercentage > 90) {
      return {
        status: 'warning',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-500/20',
        icon: AlertTriangle,
      };
    } else if (spentPercentage > 75) {
      return {
        status: 'caution',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        icon: TrendingUp,
      };
    } else {
      return {
        status: 'good',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-500/20',
        icon: CheckCircle,
      };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accommodation':
        return Home;
      case 'food & dining':
        return Utensils;
      case 'transportation':
        return Plane;
      case 'activities':
        return Star;
      case 'shopping':
        return ShoppingBag;
      default:
        return Wallet;
    }
  };

  const budgetHealth = getBudgetHealth();
  const HealthIcon = budgetHealth.icon;

  const recentExpenses = expenses.slice(-5);
  const todayExpenses = expenses.filter(
    expense =>
      new Date(expense.date).toDateString() === new Date().toDateString()
  );

  const expensesByCategory = budget.categories.map(category => {
    const categoryExpenses = expenses.filter(
      expense => expense.category === category.name
    );
    const totalSpent = categoryExpenses.reduce(
      (sum, expense) => sum + expense.convertedAmount,
      0
    );

    return {
      ...category,
      actualSpent: totalSpent,
      remainingAmount: category.allocatedAmount - totalSpent,
      overSpent: totalSpent > category.allocatedAmount,
      recentExpenses: categoryExpenses.slice(-3),
    };
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            💰 Budget Tracker
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Smart expense tracking with AI-powered insights and real-time alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Categorization
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBudgetDetails(!showBudgetDetails)}
          >
            {showBudgetDetails ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={() => {
              /* TODO: Implement add expense modal */
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      {showBudgetDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Budget
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(budget.totalBudget)}
                </p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Spent
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(budget.actualSpent)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((budget.actualSpent / budget.totalBudget) * 100).toFixed(1)}
                  % of budget
                </p>
              </div>
              <div className={cn('p-2 rounded-lg', budgetHealth.bgColor)}>
                <HealthIcon className={cn('w-5 h-5', budgetHealth.color)} />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Remaining
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(budget.remainingBudget)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(budget.dailyBudget)} per day
                </p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Today's Spending
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(
                    todayExpenses.reduce(
                      (sum, expense) => sum + expense.convertedAmount,
                      0
                    )
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {todayExpenses.length} transaction
                  {todayExpenses.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Budget Health Alert */}
      {budget.budgetAlerts.length > 0 && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Budget Alerts
                </h3>
                <div className="space-y-2">
                  {budget.budgetAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'categories', label: 'Categories', icon: BarChart3 },
          { id: 'expenses', label: 'Expenses', icon: Receipt },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as 'overview' | 'categories' | 'expenses' | 'analytics'
                )
              }
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Progress */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Budget Progress
            </h3>
            <div className="space-y-4">
              <div className="w-full bg-border rounded-full h-3">
                <div
                  className={cn(
                    'h-3 rounded-full transition-all',
                    budgetHealth.status === 'critical'
                      ? 'bg-red-500'
                      : budgetHealth.status === 'warning'
                        ? 'bg-orange-500'
                        : budgetHealth.status === 'caution'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  )}
                  style={{
                    width: `${Math.min((budget.actualSpent / budget.totalBudget) * 100, 100)}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {formatCurrency(budget.actualSpent)}
                  </p>
                  <p className="text-muted-foreground">Spent</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {formatCurrency(budget.remainingBudget)}
                  </p>
                  <p className="text-muted-foreground">Remaining</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {formatCurrency(budget.projectedTotal)}
                  </p>
                  <p className="text-muted-foreground">Projected</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Expenses */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Expenses</h3>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentExpenses.length > 0 ? (
                recentExpenses.map(expense => {
                  const CategoryIcon = getCategoryIcon(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {expense.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {expense.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(expense.convertedAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <Receipt className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No expenses yet
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expensesByCategory.map(category => {
            const CategoryIcon = getCategoryIcon(category.name);
            const spentPercentage =
              category.allocatedAmount > 0
                ? (category.actualSpent / category.allocatedAmount) * 100
                : 0;

            return (
              <Card
                key={category.id}
                className={cn(
                  'p-4 transition-all duration-200',
                  category.overSpent && 'border-red-500/30 bg-red-500/5'
                )}
              >
                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.isEssential ? 'Essential' : 'Optional'}
                        </p>
                      </div>
                    </div>
                    {category.overSpent && (
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(category.actualSpent)} spent
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(category.allocatedAmount)} budget
                      </span>
                    </div>

                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          category.overSpent
                            ? 'bg-red-500'
                            : spentPercentage > 80
                              ? 'bg-orange-500'
                              : spentPercentage > 60
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                        )}
                        style={{
                          width: `${Math.min(spentPercentage, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={cn(
                          'font-medium',
                          category.overSpent
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-muted-foreground'
                        )}
                      >
                        {spentPercentage.toFixed(1)}% used
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          category.remainingAmount < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        )}
                      >
                        {formatCurrency(Math.abs(category.remainingAmount))}
                        {category.remainingAmount < 0 ? ' over' : ' left'}
                      </span>
                    </div>
                  </div>

                  {/* Recent Expenses in Category */}
                  {category.recentExpenses.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Recent:
                      </p>
                      {category.recentExpenses.map(expense => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-muted-foreground truncate">
                            {expense.description}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(expense.convertedAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Budget Insights */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                🤖 AI Budget Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">
                    Smart Categorization:
                  </strong>{' '}
                  Our AI automatically categorizes expenses from receipts and
                  transaction data with 95% accuracy.
                </div>
                <div>
                  <strong className="text-foreground">
                    Predictive Spending:
                  </strong>{' '}
                  Get alerts when you're likely to exceed budget based on your
                  spending patterns and remaining trip duration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
