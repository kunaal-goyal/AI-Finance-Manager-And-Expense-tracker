'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export function SpendingTrendChart() {
  const { transactions, profile } = useApp();
  const sym = profile.currencySymbol;

  // Aggregate daily expenses for the current month
  const chartData = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === 'expense');

    // Group by date
    const dateMap: Record<string, number> = {};
    expenseTx.forEach((t) => {
      dateMap[t.date] = (dateMap[t.date] || 0) + Number(t.amount);
    });

    // Sort dates ascending
    const sortedDates = Object.keys(dateMap).sort();

    return sortedDates.map((date) => {
      const d = new Date(date);
      const label = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
      return {
        date,
        label,
        amount: dateMap[date],
      };
    });
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="text-slate-400">{formatDate(data.date)}</p>
          <p className="text-rose-400 font-bold text-sm mt-1">
            {formatCurrency(data.amount, sym)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <CardTitle>Spending Velocity & Activity</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Daily expenses over time</span>
        </CardHeader>

        {chartData.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs">
            <p>No expense data points available yet.</p>
          </div>
        ) : (
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${sym}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#spendVelocityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
