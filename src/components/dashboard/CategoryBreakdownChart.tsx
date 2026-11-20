'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getCategoryColor } from '@/lib/utils';
import { PieChart as PieIcon } from 'lucide-react';

export function CategoryBreakdownChart() {
  const { categoryBreakdown, profile, summary } = useApp();
  const sym = profile.currencySymbol;

  const chartData = useMemo(() => {
    return categoryBreakdown.map((item) => ({
      name: item.category,
      value: item.amount,
      percentage: item.percentage,
      color: getCategoryColor(item.category).chartColor,
    }));
  }, [categoryBreakdown]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-purple-300 font-bold mt-1">
            {formatCurrency(data.value, sym)} ({data.percentage}%)
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
            <PieIcon className="w-5 h-5 text-indigo-400" />
            <CardTitle>Category Spending Breakdown</CardTitle>
          </div>
          <span className="text-xs text-slate-400">
            Total: {formatCurrency(summary.totalExpenses, sym)}
          </span>
        </CardHeader>

        {chartData.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs">
            <p>No expenses recorded this month yet.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-52 w-full sm:w-1/2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b16" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">Top Category</span>
                <span className="text-xs font-bold text-white text-center max-w-[90px] truncate">
                  {summary.highestExpenseCategory.category}
                </span>
              </div>
            </div>

            {/* Category Leaderboard */}
            <div className="w-full sm:w-1/2 space-y-2 max-h-52 overflow-y-auto pr-1">
              {chartData.slice(0, 5).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium shrink-0">
                    <span className="text-slate-400">{item.percentage}%</span>
                    <span className="text-white">{formatCurrency(item.value, sym)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
