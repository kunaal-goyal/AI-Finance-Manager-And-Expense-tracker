'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';

export function BudgetUtilizationWidget() {
  const { summary, profile, budgetPerformances } = useApp();
  const sym = profile.currencySymbol;

  const percent = Math.min(100, summary.budgetUtilizationPercent);

  // Status configuration
  const statusConfig = {
    safe: {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      badge: 'safe' as const,
      label: 'Budget Under Control',
      icon: CheckCircle2,
    },
    warning: {
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      badge: 'warning' as const,
      label: 'Approaching Budget Limit',
      icon: AlertTriangle,
    },
    danger: {
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      badge: 'danger' as const,
      label: 'Monthly Limit Exceeded',
      icon: AlertCircle,
    },
  }[summary.budgetStatus];

  const StatusIcon = statusConfig.icon;

  // Filter categories that are in warning or danger
  const criticalCategories = budgetPerformances.filter(
    (bp) => bp.status === 'warning' || bp.status === 'danger'
  );

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${statusConfig.textColor}`} />
            <CardTitle>Budget Health & Utilization</CardTitle>
          </div>
          <Badge variant={statusConfig.badge}>{statusConfig.label}</Badge>
        </CardHeader>

        {/* Big numbers */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold text-white">
            {formatCurrency(summary.totalExpenses, sym)}
          </span>
          <span className="text-xs text-slate-400">
            Limit: {formatCurrency(summary.monthlyBudgetLimit, sym)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50 mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${statusConfig.color}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
          <span>{summary.budgetUtilizationPercent}% Consumed</span>
          <span>
            {summary.remainingBudget > 0
              ? `${formatCurrency(summary.remainingBudget, sym)} Remaining`
              : 'Limit Reached'}
          </span>
        </div>

        {/* Critical Alerts if any */}
        {criticalCategories.length > 0 && (
          <div className="space-y-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs mb-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Categories needing attention:</span>
            </div>
            {criticalCategories.slice(0, 2).map((cat) => (
              <div
                key={cat.budget.category}
                className="flex items-center justify-between text-slate-300"
              >
                <span>{cat.budget.category}</span>
                <span
                  className={
                    cat.status === 'danger' ? 'text-rose-400 font-bold' : 'text-amber-400 font-medium'
                  }
                >
                  {cat.percent}% used ({formatCurrency(cat.spent, sym)} / {formatCurrency(cat.budget.monthlyLimit, sym)})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/budget"
        className="flex items-center justify-between text-xs font-medium text-purple-400 hover:text-purple-300 pt-2 border-t border-slate-800/60 group"
      >
        <span>Manage monthly category caps</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Card>
  );
}
