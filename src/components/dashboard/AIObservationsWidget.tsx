'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';
import { formatCurrency, cn } from '@/lib/utils';

export function AIObservationsWidget() {
  const { summary, profile, categoryBreakdown, theme } = useApp();
  const sym = profile.currencySymbol;

  // Generate dynamic financial observations based on actual current state
  const observations = [];

  // 1. Food / Top Category observation
  if (summary.highestExpenseCategory.amount > 0) {
    if (summary.highestExpenseCategory.percentage > 40) {
      observations.push({
        type: 'warning',
        icon: AlertCircle,
        iconColor: 'text-amber-400',
        text: `Your spending is heavily skewed: **${summary.highestExpenseCategory.category}** consumes **${summary.highestExpenseCategory.percentage}%** (${formatCurrency(summary.highestExpenseCategory.amount, sym)}) of all outgoing money. Consider cooking hostel meals or sharing canteen snacks.`,
      });
    } else {
      observations.push({
        type: 'info',
        icon: TrendingUp,
        iconColor: 'text-indigo-400',
        text: `Your biggest expenditure is **${summary.highestExpenseCategory.category}** at **${formatCurrency(summary.highestExpenseCategory.amount, sym)}** (${summary.highestExpenseCategory.percentage}% of expenses).`,
      });
    }
  }

  // 2. Budget utilization velocity observation
  if (summary.budgetUtilizationPercent >= 90) {
    observations.push({
      type: 'danger',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      text: `Critical Run-Rate: You've consumed **${summary.budgetUtilizationPercent}%** of your monthly limit. At **${formatCurrency(summary.dailyAverageSpend, sym)}/day**, you will run out before month end.`,
    });
  } else if (summary.budgetUtilizationPercent <= 60 && summary.totalExpenses > 0) {
    observations.push({
      type: 'success',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      text: `Healthy Budget Discipline: You've used only **${summary.budgetUtilizationPercent}%** of your limit, leaving **${formatCurrency(summary.remainingBudget, sym)}** in your reserve!`,
    });
  }

  // 3. Savings Rate observation
  if (summary.savingsRate >= 20) {
    observations.push({
      type: 'success',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      text: `Great savings momentum! Your current savings rate is **${summary.savingsRate}%**, well above the average 10% student benchmark.`,
    });
  } else if (summary.totalIncome > 0 && summary.savingsRate < 10) {
    observations.push({
      type: 'info',
      icon: Zap,
      iconColor: 'text-purple-400',
      text: `Your savings rate is currently **${summary.savingsRate}%**. Allocating even ₹50/day into your savings goal would yield ₹1,500 by semester end.`,
    });
  }

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all',
      theme === 'light'
        ? 'border-purple-200 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/40 shadow-sm'
        : 'border-white/10 bg-black shadow-[0_0_30px_rgba(255,255,255,0.04)]'
    )}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

      <CardHeader className={cn('mb-3', theme === 'light' ? 'border-purple-100' : 'border-white/10')}>
        <div className="flex items-center gap-2">
          <div className={cn(
            'p-1.5 rounded-lg border',
            theme === 'light' ? 'bg-purple-500/20 text-purple-700 border-purple-500/30' : 'bg-white/10 text-white border-white/20'
          )}>
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              Gemini AI Financial Observations
            </CardTitle>
            <p className="text-[11px] text-zinc-400">
              Personalized insights deduced from your recorded habits
            </p>
          </div>
        </div>

        <Link
          href="/assistant"
          className={cn(
            'text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all shrink-0',
            theme === 'light'
              ? 'bg-purple-600/20 text-purple-700 hover:text-purple-900 border-purple-500/30'
              : 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'
          )}
        >
          <span>Chat with Gemini</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <div className="space-y-3 my-2">
        {observations.slice(0, 3).map((obs, idx) => {
          const Icon = obs.icon;
          return (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed',
                theme === 'light'
                  ? 'bg-white border-purple-100 text-slate-700 shadow-sm'
                  : 'bg-zinc-950 border-white/10 text-zinc-200'
              )}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${obs.iconColor}`} />
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: obs.text.replace(
                    /\*\*(.*?)\*\*/g,
                    `<strong class="${theme === 'light' ? 'text-purple-950 font-bold' : 'text-white font-semibold'}">$1</strong>`
                  ),
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-400">Want deeper recommendations?</span>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/assistant?q=Where am I spending most of my money?"
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            "Where am I spending most?"
          </Link>
          <Link
            href="/assistant?q=How can I save ₹2,000 this month?"
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            "How to save {sym}2,000?"
          </Link>
        </div>
      </div>
    </Card>
  );
}
