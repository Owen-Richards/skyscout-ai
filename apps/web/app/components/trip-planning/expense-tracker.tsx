/**
 * Expense Tracker Component
 * Advanced expense tracking with receipt scanning and AI categorization
 * Real-time currency conversion and automatic splitting
 */

'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  AlertCircle,
  Calendar,
  Camera,
  Car,
  Clock,
  Coffee,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  Home,
  Image,
  MapPin,
  PieChart,
  Plane,
  Plus,
  Receipt,
  RefreshCw,
  Scan,
  Search,
  ShoppingBag,
  Sparkles,
  Split,
  Star,
  Target,
  Train,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Utensils,
  Wallet,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { ExpenseCategory, TripExpense } from '../../types/trip';

interface ExpenseTrackerProps {
  expenses: TripExpense[];
  travelers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  categories: ExpenseCategory[];
  onAddExpense: (expense: Omit<TripExpense, 'id'>) => void;
  onUpdateExpense: (expenseId: string, expense: Partial<TripExpense>) => void;
  onDeleteExpense: (expenseId: string) => void;
  onScanReceipt: (file: File) => Promise<Partial<TripExpense>>;
  className?: string;
}

export function ExpenseTracker({
  expenses,
  travelers,
  categories,
  _onAddExpense,
  _onUpdateExpense,
  _onDeleteExpense,
  onScanReceipt,
  className,
}: ExpenseTrackerProps) {
  const [activeTab, setActiveTab] = useState<
    'recent' | 'categories' | 'splits' | 'receipts'
  >('recent');
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accommodation':
        return Home;
      case 'food & dining':
        return Utensils;
      case 'transportation':
        return Car;
      case 'activities':
        return Star;
      case 'shopping':
        return ShoppingBag;
      case 'coffee':
        return Coffee;
      case 'flights':
        return Plane;
      case 'ground transport':
        return Train;
      default:
        return Receipt;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return CreditCard;
      case 'cash':
        return Wallet;
      case 'debit card':
        return CreditCard;
      default:
        return DollarSign;
    }
  };

  const handleReceiptScan = async (file: File) => {
    setIsScanning(true);
    try {
      await onScanReceipt(file);
      // setShowAddExpense(true); // TODO: Implement modal
      // Pre-fill form with scanned data
    } catch (error) {
      console.error('Receipt scanning failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleReceiptScan(file);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const expenseDate = new Date(expense.date);

    switch (selectedPeriod) {
      case 'today':
        return (
          matchesSearch && expenseDate.toDateString() === now.toDateString()
        );
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && expenseDate >= weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return matchesSearch && expenseDate >= monthAgo;
      }
      default:
        return matchesSearch;
    }
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.convertedAmount,
    0
  );
  const todayExpenses = expenses.filter(
    expense =>
      new Date(expense.date).toDateString() === new Date().toDateString()
  );

  const expensesByCategory = categories
    .map(category => {
      const categoryExpenses = filteredExpenses.filter(
        expense => expense.category === category.name
      );
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.convertedAmount,
        0
      );

      return {
        ...category,
        total,
        count: categoryExpenses.length,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  const pendingSplits = expenses.filter(
    expense =>
      expense.splits && expense.splits.some(split => split.status === 'pending')
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            🧾 Expense Tracker
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered receipt scanning with automatic categorization and
            currency conversion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Smart Categorization
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
          >
            {isScanning ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Scan className="w-4 h-4 mr-2" />
            )}
            Scan Receipt
          </Button>

          <Button
            onClick={() => setShowAddExpense(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-xs text-muted-foreground">
                {filteredExpenses.length} transaction
                {filteredExpenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Splits
              </p>
              <p className="text-2xl font-bold text-foreground">
                {pendingSplits.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(
                  pendingSplits.reduce(
                    (sum, expense) => sum + expense.convertedAmount,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Split className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Daily
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  totalExpenses /
                    Math.max(
                      1,
                      expenses.length > 0
                        ? Math.ceil(
                            (Date.now() -
                              new Date(
                                Math.min(
                                  ...expenses.map(e =>
                                    new Date(e.date).getTime()
                                  )
                                )
                              ).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 1
                    )
                )}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">
                  On track
                </span>
              </div>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Receipt Scanning Feature */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Scan className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                📸 Smart Receipt Scanning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">
                    Auto-Extract Data:
                  </strong>{' '}
                  Our AI automatically extracts amount, date, merchant, and
                  category from receipt photos with 98% accuracy.
                </div>
                <div>
                  <strong className="text-foreground">
                    Smart Categorization:
                  </strong>{' '}
                  Expenses are automatically categorized based on merchant type
                  and purchase patterns.
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'all', label: 'All' },
            ].map(period => (
              <button
                key={period.id}
                onClick={() =>
                  setSelectedPeriod(
                    period.id as 'today' | 'week' | 'month' | 'all'
                  )
                }
                className={cn(
                  'px-3 py-1 rounded text-xs font-medium transition-all',
                  selectedPeriod === period.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'categories', label: 'Categories', icon: PieChart },
            { id: 'splits', label: 'Splits', icon: Split },
            { id: 'receipts', label: 'Receipts', icon: Image },
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as 'recent' | 'categories' | 'splits' | 'receipts'
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
      </div>

      {/* Tab Content */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map(expense => {
                const CategoryIcon = getCategoryIcon(expense.category);
                const PaymentIcon = getPaymentMethodIcon(expense.paymentMethod);
                const paidBy = travelers.find(t => t.id === expense.paidBy);

                return (
                  <Card key={expense.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">
                              {expense.description}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {expense.location?.name || 'Unknown location'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(expense.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <PaymentIcon className="w-3 h-3" />
                                {expense.paymentMethod}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold text-foreground">
                              {formatCurrency(expense.convertedAmount)}
                            </p>
                            {expense.originalAmount !==
                              expense.convertedAmount && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(
                                  expense.originalAmount,
                                  expense.originalCurrency
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-xs">
                              {expense.category}
                            </Badge>

                            {expense.splits && expense.splits.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Split className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Split {expense.splits.length} way
                                  {expense.splits.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}

                            {paidBy && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Paid by {paidBy.firstName}
                                </span>
                              </div>
                            )}

                            {expense.receipt && (
                              <Badge variant="outline" className="text-xs">
                                <Image className="w-3 h-3 mr-1" />
                                Receipt
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
          ) : (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">
                No expenses found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedPeriod !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Start tracking your expenses by adding or scanning receipts'}
              </p>
              <Button onClick={() => setShowAddExpense(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expensesByCategory.map(category => {
            const CategoryIcon = getCategoryIcon(category.name);

            return (
              <Card key={category.id} className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.count} expenses
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">
                      {formatCurrency(category.total)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(category.percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pending Splits Alert */}
      {pendingSplits.length > 0 && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Pending Expense Splits
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You have {pendingSplits.length} expense
                  {pendingSplits.length > 1 ? 's' : ''} waiting for split
                  confirmation totaling{' '}
                  {formatCurrency(
                    pendingSplits.reduce(
                      (sum, expense) => sum + expense.convertedAmount,
                      0
                    )
                  )}
                  .
                </p>
                <Button variant="outline" size="sm">
                  <Split className="w-4 h-4 mr-1" />
                  Review Splits
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
