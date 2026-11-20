'use client';

import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useApp } from '@/context/AppContext';
import { formatCurrency, cn } from '@/lib/utils';

export function BalanceCards() {
  const { summary, profile, theme } = useApp();
  const sym = profile.currencySymbol;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 0,
      title: 'Total Balance',
      value: formatCurrency(summary.totalBalance, sym),
      subtitle: 'Cumulative net savings',
      icon: <Wallet className="w-5 h-5" />,
      iconBgColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      glowColor: 'from-indigo-600/40 via-purple-600/30 to-blue-600/40',
      trend: {
        value: summary.totalBalance >= 0 ? 'Positive cashflow' : 'Negative balance',
        isPositive: summary.totalBalance >= 0,
      },
    },
    {
      id: 1,
      title: 'Monthly Expenses',
      value: formatCurrency(summary.totalExpenses, sym),
      subtitle: `Avg ${formatCurrency(summary.dailyAverageSpend, sym)} / day`,
      icon: <ArrowDownRight className="w-5 h-5" />,
      iconBgColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      glowColor: 'from-rose-600/40 via-purple-600/30 to-amber-600/40',
      trend: {
        value: `${summary.budgetUtilizationPercent}% of budget`,
        isPositive: summary.budgetUtilizationPercent < 80,
        label: summary.budgetStatus === 'safe' ? 'Under control' : 'High spending',
      },
    },
    {
      id: 2,
      title: 'Monthly Income',
      value: formatCurrency(summary.totalIncome, sym),
      subtitle: `Base Allowance: ${formatCurrency(profile.monthlyAllowance, sym)}`,
      icon: <ArrowUpRight className="w-5 h-5" />,
      iconBgColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glowColor: 'from-emerald-600/40 via-teal-600/30 to-cyan-600/40',
      trend: {
        value: `${summary.savingsRate}% saved`,
        isPositive: summary.savingsRate > 0,
        label: 'Savings rate',
      },
    },
    {
      id: 3,
      title: 'Remaining Budget',
      value: formatCurrency(summary.remainingBudget, sym),
      subtitle: `Of ${formatCurrency(summary.monthlyBudgetLimit, sym)} limit`,
      icon: <Gauge className="w-5 h-5" />,
      iconBgColor:
        summary.budgetStatus === 'safe'
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : summary.budgetStatus === 'warning'
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      glowColor:
        summary.budgetStatus === 'safe'
          ? 'from-emerald-600/40 via-purple-600/30 to-indigo-600/40'
          : 'from-amber-600/40 via-rose-600/30 to-purple-600/40',
      trend: {
        value:
          summary.budgetStatus === 'safe'
            ? '🟢 On Track'
            : summary.budgetStatus === 'warning'
            ? '🟡 Caution (<25% left)'
            : '🔴 Budget Exceeded',
        isNeutral: true,
      },
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      onMouseLeave={() => setHoveredCard(null)}
    >
      {cards.map((card) => {
        const isHovered = hoveredCard === card.id;
        const isOther = hoveredCard !== null && !isHovered;

        return (
          <div
            key={card.id}
            className="relative"
            onMouseEnter={() => setHoveredCard(card.id)}
          >
            {isHovered && (
              <div
                className={cn(
                  'absolute -inset-1.5 rounded-2xl bg-gradient-to-r blur-lg -z-10 animate-pulse pointer-events-none transition-all duration-300',
                  theme === 'light' ? 'opacity-40' : 'opacity-75',
                  theme === 'light' ? card.glowColor : 'from-white/30 via-white/20 to-white/30'
                )}
              />
            )}
            <StatCard
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              iconBgColor={card.iconBgColor}
              trend={card.trend}
              className={cn(
                'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu',
                isHovered &&
                  (theme === 'light'
                    ? 'scale-[1.05] -translate-y-1 z-20 border-purple-400 shadow-[0_8px_30px_rgba(147,51,234,0.18)] bg-white'
                    : 'scale-[1.05] -translate-y-1 z-20 border-white/70 shadow-[0_0_25px_rgba(255,255,255,0.4)] bg-black'),
                isOther && 'scale-[0.95] opacity-50 z-0'
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
