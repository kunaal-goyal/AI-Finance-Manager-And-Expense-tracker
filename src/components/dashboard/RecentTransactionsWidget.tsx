'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  Banknote,
  CreditCard,
  Building,
  Receipt,
  MoreVertical,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getCategoryColor } from '@/lib/utils';
import { PaymentMethod } from '@/types';

export function RecentTransactionsWidget() {
  const { transactions, profile } = useApp();
  const sym = profile.currencySymbol;

  const recent = transactions.slice(0, 5);

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3 h-3 text-cyan-400" />;
      case 'Cash':
        return <Banknote className="w-3 h-3 text-emerald-400" />;
      case 'Card':
        return <CreditCard className="w-3 h-3 text-purple-400" />;
      case 'Net Banking':
        return <Building className="w-3 h-3 text-blue-400" />;
      default:
        return <Receipt className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="mb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-400" />
            <CardTitle>Recent Transactions</CardTitle>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardHeader>

        {recent.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            <p>No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((tx) => {
              const catColor = getCategoryColor(tx.category);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {getPaymentIcon(tx.paymentMethod)}
                          {tx.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, sym)}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border inline-block mt-0.5 font-medium ${catColor.bg} ${catColor.text} ${catColor.border}`}
                    >
                      {tx.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
