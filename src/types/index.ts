export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Food and Dining'
  | 'Transportation'
  | 'Accommodation and Hostel'
  | 'Education and Stationery'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Subscriptions'
  | 'Personal Care'
  | 'Other';

export type IncomeCategory =
  | 'Monthly Allowance'
  | 'Part-time Job'
  | 'Freelancing'
  | 'Scholarship'
  | 'Gifts'
  | 'Other Income';

export type AllCategory = ExpenseCategory | IncomeCategory;

export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Net Banking' | 'Other';

export interface Transaction {
  id: string;
  userId?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: AllCategory;
  date: string; // YYYY-MM-DD
  description?: string;
  paymentMethod: PaymentMethod;
  isRecurring?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  userId?: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  month: string; // YYYY-MM
  createdAt?: string;
  updatedAt?: string;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  userId?: string;
  amount: number;
  note?: string;
  date: string;
  createdAt?: string;
}

export interface SavingsGoal {
  id: string;
  userId?: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  icon?: string;
  isCompleted?: boolean;
  contributions?: SavingsContribution[];
  createdAt?: string;
  updatedAt?: string;
}

export type StudentType = 'hosteler' | 'day_scholar' | 'independent' | 'part_time_job';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  studentType: StudentType;
  collegeName: string;
  currency: string;
  currencySymbol: string;
  monthlyAllowance: number;
  monthlyBudgetLimit: number;
  cycleStartDay: number; // e.g., 1st of month
  avatarUrl?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  action?: {
    type: 'ADD_TRANSACTION' | 'DELETE_TRANSACTION';
    data: any;
  };
  metadata?: {
    suggestedActions?: string[];
    isInsight?: boolean;
  };
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyBudgetLimit: number;
  remainingBudget: number;
  savingsThisMonth: number;
  savingsRate: number; // percentage
  dailyAverageSpend: number;
  budgetUtilizationPercent: number;
  budgetStatus: 'safe' | 'warning' | 'danger';
  highestExpenseCategory: {
    category: ExpenseCategory | string;
    amount: number;
    percentage: number;
  };
}
