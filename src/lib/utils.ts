import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ExpenseCategory, IncomeCategory } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with Indian numbering system if symbol is ₹
  let formatted: string;
  if (symbol === '₹') {
    formatted = absAmount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
  } else {
    formatted = absAmount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
  }

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
  chartColor: string;
} {
  switch (category) {
    case 'Food and Dining':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
        chartColor: '#f59e0b',
      };
    case 'Transportation':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20',
        chartColor: '#3b82f6',
      };
    case 'Accommodation and Hostel':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/20',
        chartColor: '#6366f1',
      };
    case 'Education and Stationery':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
        chartColor: '#10b981',
      };
    case 'Shopping':
      return {
        bg: 'bg-pink-500/10',
        text: 'text-pink-400',
        border: 'border-pink-500/20',
        chartColor: '#ec4899',
      };
    case 'Entertainment':
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/20',
        chartColor: '#a855f7',
      };
    case 'Healthcare':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/20',
        chartColor: '#f43f5e',
      };
    case 'Subscriptions':
      return {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/20',
        chartColor: '#06b6d4',
      };
    case 'Personal Care':
      return {
        bg: 'bg-violet-500/10',
        text: 'text-violet-400',
        border: 'border-violet-500/20',
        chartColor: '#8b5cf6',
      };
    case 'Monthly Allowance':
    case 'Part-time Job':
    case 'Freelancing':
    case 'Scholarship':
    case 'Gifts':
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        chartColor: '#22c55e',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
        chartColor: '#64748b',
      };
  }
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food and Dining',
  'Transportation',
  'Accommodation and Hostel',
  'Education and Stationery',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Subscriptions',
  'Personal Care',
  'Other',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Monthly Allowance',
  'Part-time Job',
  'Freelancing',
  'Scholarship',
  'Gifts',
  'Other Income',
];
