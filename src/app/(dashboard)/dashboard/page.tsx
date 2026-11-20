'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BalanceCards } from '@/components/dashboard/BalanceCards';
import { BudgetUtilizationWidget } from '@/components/dashboard/BudgetUtilizationWidget';
import { CategoryBreakdownChart } from '@/components/dashboard/CategoryBreakdownChart';
import { SpendingTrendChart } from '@/components/dashboard/SpendingTrendChart';
import { RecentTransactionsWidget } from '@/components/dashboard/RecentTransactionsWidget';
import { AIObservationsWidget } from '@/components/dashboard/AIObservationsWidget';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, ArrowRight, Target } from 'lucide-react';

export default function DashboardPage() {
  const { profile, goals } = useApp();
  const sym = profile.currencySymbol;

  const activeGoals = goals.filter((g) => !g.isCompleted).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner / Student Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/20 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              {profile.studentType.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {profile.collegeName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Smart Financial Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time tracking of allowance, daily spending, budget limits & savings goals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[11px] text-slate-400 font-medium">Monthly Allowance</p>
            <p className="text-base font-bold text-emerald-400">
              {formatCurrency(profile.monthlyAllowance, sym)}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <BalanceCards />

      {/* Row: Budget Health & AI Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetUtilizationWidget />
        <AIObservationsWidget />
      </div>

      {/* Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingTrendChart />
        <CategoryBreakdownChart />
      </div>

      {/* Row: Recent Transactions & Savings Goals Mini-Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactionsWidget />
        </div>

        <div>
          <Card className="flex flex-col justify-between h-full">
            <div>
              <CardHeader className="mb-3">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-emerald-400" />
                  <CardTitle>Active Savings Goals</CardTitle>
                </div>
                <Link
                  href="/goals"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
                >
                  <span>All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardHeader>

              {activeGoals.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <p>No active goals. Set a goal for your next gadget or trip!</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activeGoals.map((g) => {
                    const percent = Math.min(
                      100,
                      Math.round((g.currentAmount / g.targetAmount) * 100)
                    );
                    return (
                      <div
                        key={g.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white truncate max-w-[150px]">
                            {g.title}
                          </span>
                          <span className="text-purple-300 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400">
                          <span>{formatCurrency(g.currentAmount, sym)}</span>
                          <span>Target: {formatCurrency(g.targetAmount, sym)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/goals"
              className="mt-4 pt-3 border-t border-slate-800/60 text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
            >
              <span>+ Add to savings goal</span>
              <Target className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
