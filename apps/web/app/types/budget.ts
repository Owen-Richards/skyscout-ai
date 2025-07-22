/**
 * Trip Budgeting Types
 * Comprehensive budget management for travel planning
 */

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  isEssential: boolean;
}

export interface BudgetItem {
  id: string;
  name: string;
  categoryId: string;
  estimatedCost: number;
  actualCost?: number;
  currency: string;
  isBooked: boolean;
  bookingDate?: string;
  notes?: string;
  provider?: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface TripBudget {
  id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  spentAmount: number;
  currency: string;
  categories: BudgetCategory[];
  items: BudgetItem[];
  savings: {
    target: number;
    current: number;
    monthlyContribution: number;
  };
  alerts: {
    overBudget: boolean;
    approaching75Percent: boolean;
    unusedCategories: string[];
  };
  aiInsights: {
    costOptimizations: string[];
    alternativeOptions: string[];
    seasonalPricing: string[];
    savingsOpportunities: {
      amount: number;
      suggestion: string;
      confidence: number;
    }[];
  };
}

export interface BudgetComparison {
  actual: number;
  estimated: number;
  variance: number;
  variancePercent: number;
  trend: 'over' | 'under' | 'ontrack';
}

export interface CurrencyExchange {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}
