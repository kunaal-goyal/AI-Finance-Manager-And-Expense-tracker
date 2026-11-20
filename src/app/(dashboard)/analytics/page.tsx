'use client';

import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getCategoryColor } from '@/lib/utils';

export default function AnalyticsPage() {
  const { transactions, summary, profile, categoryBreakdown } = useApp();
  const sym = profile.currencySymbol;

  const [timeRange, setTimeRange] = useState<'30days' | 'monthly'>('30days');

  // Income vs Expense comparison by date
  const incomeVsExpenseData = useMemo(() => {
    // Group transactions by date
    const dateMap: Record<string, { date: string; income: number; expense: number }> = {};

    transactions.forEach((t) => {
      if (!dateMap[t.date]) {
        dateMap[t.date] = { date: t.date, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dateMap[t.date].income += Number(t.amount);
      } else {
        dateMap[t.date].expense += Number(t.amount);
      }
    });

    const sortedDates = Object.keys(dateMap).sort();
    return sortedDates.map((d) => {
      const dateObj = new Date(d);
      return {
        date: d,
        label: `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`,
        income: dateMap[d].income,
        expense: dateMap[d].expense,
      };
    });
  }, [transactions]);

  // Payment Method Breakdown
  const paymentMethodData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.paymentMethod] = (map[t.paymentMethod] || 0) + Number(t.amount);
      });

    const colors: Record<string, string> = {
      UPI: '#06b6d4',
      Cash: '#10b981',
      Card: '#8b5cf6',
      'Net Banking': '#3b82f6',
      Other: '#64748b',
    };

    return Object.entries(map).map(([method, amount]) => ({
      name: method,
      value: amount,
      color: colors[method] || '#a855f7',
    }));
  }, [transactions]);

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-semibold text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className={entry.name === 'income' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}
            >
              {entry.name === 'income' ? 'Income' : 'Expense'}: {formatCurrency(entry.value, sym)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-purple-300 font-bold mt-1">
            {formatCurrency(data.value, sym)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial Analytics & Patterns
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Data-backed metrics derived from your actual college transactions and allowance cycle
          </p>
        </div>
      </div>

      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Savings Rate"
          value={`${summary.savingsRate}%`}
          subtitle="Of income saved this month"
          icon={<Percent className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          trend={{
            value: summary.savingsRate >= 15 ? 'Excellent student rate' : 'Aim for 15-20%',
            isPositive: summary.savingsRate >= 15,
          }}
        />

        <StatCard
          title="Daily Average Burn"
          value={formatCurrency(summary.dailyAverageSpend, sym)}
          subtitle="Average outgoing cash/day"
          icon={<Coins className="w-5 h-5" />}
          iconBgColor="bg-purple-500/15 text-purple-400 border-purple-500/30"
          trend={{
            value: `Projected: ${formatCurrency(summary.dailyAverageSpend * 30, sym)}/mo`,
            isNeutral: true,
          }}
        />

        <StatCard
          title="Top Expense Driver"
          value={summary.highestExpenseCategory.category}
          subtitle={`${summary.highestExpenseCategory.percentage}% of all expenses`}
          icon={<BarChart3 className="w-5 h-5" />}
          iconBgColor="bg-rose-500/15 text-rose-400 border-rose-500/30"
          trend={{
            value: formatCurrency(summary.highestExpenseCategory.amount, sym),
            isNeutral: true,
          }}
        />

        <StatCard
          title="Budget Safety"
          value={`${summary.budgetUtilizationPercent}%`}
          subtitle={`Limit: ${formatCurrency(summary.monthlyBudgetLimit, sym)}`}
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBgColor={
            summary.budgetStatus === 'safe'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }
          trend={{
            value: summary.budgetStatus === 'safe' ? 'Budget Protected' : 'Approaching Ceiling',
            isPositive: summary.budgetStatus === 'safe',
          }}
        />
      </div>

      {/* Big Chart 1: Income vs Expenses Comparison */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Income vs Expenses Flow</CardTitle>
            <CardDescription>
              Compare incoming funds (allowance, gigs) versus day-to-day college spending
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> Expense
            </span>
          </div>
        </CardHeader>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpenseData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${sym}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2 Column Charts: Category Breakdown Leaderboard & Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Details */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Category Distribution & Frequency</CardTitle>
              <CardDescription>
                Where your student rupees are draining the fastest
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3 pt-2 max-h-80 overflow-y-auto pr-1">
            {categoryBreakdown.map((item) => {
              const catColor = getCategoryColor(item.category);
              return (
                <div
                  key={item.category}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: catColor.chartColor }}
                      />
                      {item.category}
                    </span>
                    <span className="text-white font-bold">
                      {formatCurrency(item.amount, sym)} ({item.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: catColor.chartColor,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{item.count} transactions recorded</span>
                    <span>
                      Avg {formatCurrency(Math.round(item.amount / item.count), sym)} / transaction
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Payment Channels (UPI vs Cash vs Card) */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle>Payment Methods & Channels</CardTitle>
                <CardDescription>
                  Tracking UPI microtransactions vs cash withdrawals
                </CardDescription>
              </div>
            </CardHeader>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b16" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              {paymentMethodData.map((pm) => (
                <div key={pm.name} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pm.color }} />
                    <span className="truncate">{pm.name}</span>
                  </div>
                  <p className="font-bold text-white mt-1">
                    {formatCurrency(pm.value, sym)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
