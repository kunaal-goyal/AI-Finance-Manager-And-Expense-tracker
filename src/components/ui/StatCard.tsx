import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-purple-600/10 text-purple-400 border-purple-500/20',
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden group hover:border-slate-700/90 transition-all', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105',
            iconBgColor
          )}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span
            className={cn(
              'font-semibold inline-flex items-center gap-1',
              trend.isNeutral
                ? 'text-slate-400'
                : trend.isPositive
                ? 'text-emerald-400'
                : 'text-rose-400'
            )}
          >
            {trend.value}
          </span>
          {trend.label && <span className="text-slate-400">{trend.label}</span>}
        </div>
      )}
    </Card>
  );
}
