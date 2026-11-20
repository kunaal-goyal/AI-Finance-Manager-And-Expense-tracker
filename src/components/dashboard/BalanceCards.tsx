'use client';

import React from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  Gauge,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';

export function BalanceCards() {
  const { summary, profile } = useApp();
  const sym = profile.currencySymbol;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance */}
      <StatCard
        title="Total Balance"
        value={formatCurrency(summary.totalBalance, sym)}
        subtitle="Cumulative net savings"
        icon={<Wallet className="w-5 h-5" />}
        iconBgColor="bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
        trend={{
          value: summary.totalBalance >= 0 ? 'Positive cashflow' : 'Negative balance',
          isPositive: summary.totalBalance >= 0,
        }}
      />

      {/* Monthly Expenses */}
      <StatCard
        title="Monthly Expenses"
        value={formatCurrency(summary.totalExpenses, sym)}
        subtitle={`Avg ${formatCurrency(summary.dailyAverageSpend, sym)} / day`}
        icon={<ArrowDownRight className="w-5 h-5" />}
        iconBgColor="bg-rose-500/15 text-rose-400 border-rose-500/30"
        trend={{
          value: `${summary.budgetUtilizationPercent}% of budget`,
          isPositive: summary.budgetUtilizationPercent < 80,
          label: summary.budgetStatus === 'safe' ? 'Under control' : 'High spending',
        }}
      />

      {/* Monthly Income / Allowance */}
      <StatCard
        title="Monthly Income"
        value={formatCurrency(summary.totalIncome, sym)}
        subtitle={`Base Allowance: ${formatCurrency(profile.monthlyAllowance, sym)}`}
        icon={<ArrowUpRight className="w-5 h-5" />}
        iconBgColor="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
        trend={{
          value: `${summary.savingsRate}% saved`,
          isPositive: summary.savingsRate > 0,
          label: 'Savings rate',
        }}
      />

      {/* Remaining Budget */}
      <StatCard
        title="Remaining Budget"
        value={formatCurrency(summary.remainingBudget, sym)}
        subtitle={`Of ${formatCurrency(summary.monthlyBudgetLimit, sym)} limit`}
        icon={<Gauge className="w-5 h-5" />}
        iconBgColor={
          summary.budgetStatus === 'safe'
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            : summary.budgetStatus === 'warning'
            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
        }
        trend={{
          value:
            summary.budgetStatus === 'safe'
              ? '🟢 On Track'
              : summary.budgetStatus === 'warning'
              ? '🟡 Caution (<25% left)'
              : '🔴 Budget Exceeded',
          isNeutral: true,
        }}
      />
    </div>
  );
}
