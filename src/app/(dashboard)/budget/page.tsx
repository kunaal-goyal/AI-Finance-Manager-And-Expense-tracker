'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  Edit,
  Trash2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatCurrency, EXPENSE_CATEGORIES } from '@/lib/utils';
import { Budget, ExpenseCategory } from '@/types';

export default function BudgetPage() {
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    budgetPerformances,
    summary,
    profile,
    updateProfile,
  } = useApp();
  const sym = profile.currencySymbol;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // State for Add/Edit Budget Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [category, setCategory] = useState<ExpenseCategory>('Food and Dining');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [error, setError] = useState('');

  // State for Overall Monthly Limit editor
  const [isEditingOverall, setIsEditingOverall] = useState(false);
  const [overallLimitInput, setOverallLimitInput] = useState(profile.monthlyBudgetLimit.toString());

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setCategory('Food and Dining');
    setMonthlyLimit('');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setEditingBudget(b);
    setCategory(b.category);
    setMonthlyLimit(b.monthlyLimit.toString());
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyLimit || isNaN(Number(monthlyLimit)) || Number(monthlyLimit) <= 0) {
      setError('Please enter a valid monthly limit greater than 0');
      return;
    }

    if (editingBudget) {
      await updateBudget(editingBudget.id, {
        monthlyLimit: Number(monthlyLimit),
      });
    } else {
      await addBudget({
        category,
        monthlyLimit: Number(monthlyLimit),
        month: currentMonthStr,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteBudget = (id: string, catName: string) => {
    if (confirm(`Remove budget limit for ${catName}?`)) {
      deleteBudget(id);
    }
  };

  const handleSaveOverallLimit = async () => {
    const val = Number(overallLimitInput);
    if (isNaN(val) || val <= 0) return;
    await updateProfile({ monthlyBudgetLimit: val });
    setIsEditingOverall(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Monthly Budgets & Category Limits
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Set hard caps on dining, entertainment, shopping & transit to stop end-of-month broke days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenAdd}
            variant="gradient"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Category Budget
          </Button>
        </div>
      </div>

      {/* Overall Monthly Spending Cap Card */}
      <Card className="bg-gradient-to-r from-[#0d152d] via-[#101833] to-[#0a1024] border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Overall Student Cap
              </span>
              <span className="text-xs text-slate-400">
                Allowance: {formatCurrency(profile.monthlyAllowance, sym)}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {formatCurrency(summary.monthlyBudgetLimit, sym)}
              </span>
              <span className="text-xs text-slate-400">Max spend allowed this month</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2 max-w-xl">
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    summary.budgetStatus === 'safe'
                      ? 'bg-emerald-500'
                      : summary.budgetStatus === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, summary.budgetUtilizationPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>
                  Spent: <strong className="text-white">{formatCurrency(summary.totalExpenses, sym)}</strong> ({summary.budgetUtilizationPercent}%)
                </span>
                <span>
                  Remaining: <strong className="text-emerald-400">{formatCurrency(summary.remainingBudget, sym)}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isEditingOverall ? (
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <Input
                  type="number"
                  value={overallLimitInput}
                  onChange={(e) => setOverallLimitInput(e.target.value)}
                  className="w-32 py-1.5 text-xs"
                />
                <Button size="sm" variant="primary" onClick={handleSaveOverallLimit}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingOverall(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sliders className="w-3.5 h-3.5" />}
                onClick={() => setIsEditingOverall(true)}
              >
                Change Monthly Limit
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Visual Status Legend */}
      <div className="flex flex-wrap items-center gap-4 px-2 py-1 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Status Indicators:</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Under 75% (Safe)
        </span>
        <span className="inline-flex items-center gap-1.5 text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" /> 75% - 99% (Approaching Limit)
        </span>
        <span className="inline-flex items-center gap-1.5 text-rose-400">
          <AlertCircle className="w-3.5 h-3.5" /> 100%+ (Exceeded Limit)
        </span>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgetPerformances.map((bp) => {
          const { budget, spent, remaining, percent, status } = bp;

          const statusBadge = {
            safe: { variant: 'safe' as const, label: 'Under Control', color: 'bg-emerald-500', text: 'text-emerald-400' },
            warning: { variant: 'warning' as const, label: 'Approaching Limit', color: 'bg-amber-500', text: 'text-amber-400' },
            danger: { variant: 'danger' as const, label: 'Budget Exceeded', color: 'bg-rose-500', text: 'text-rose-400' },
          }[status];

          return (
            <Card key={budget.id} className="space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-white text-base">{budget.category}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monthly Cap: {formatCurrency(budget.monthlyLimit, sym)}
                    </p>
                  </div>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </div>

                {/* Progress bar */}
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-400">
                      Spent: <strong className="text-white font-bold">{formatCurrency(spent, sym)}</strong>
                    </span>
                    <span className={`font-bold ${statusBadge.text}`}>{percent}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusBadge.color}`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>
                      {remaining > 0 ? (
                        <span className="text-slate-300">{formatCurrency(remaining, sym)} remaining</span>
                      ) : (
                        <span className="text-rose-400 font-bold">
                          Exceeded by {formatCurrency(Math.abs(budget.monthlyLimit - spent), sym)}
                        </span>
                      )}
                    </span>
                    <span>Month: {budget.month}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleOpenEdit(budget)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Limit</span>
                </button>
                <button
                  onClick={() => handleDeleteBudget(budget.id, budget.category)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {budgetPerformances.length === 0 && (
        <Card className="py-12 text-center text-slate-400 space-y-3">
          <PieChart className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-medium">No category budgets created yet.</p>
          <p className="text-xs text-slate-500">
            Set category limits for Food, Transportation, Stationery and Entertainment to avoid overspending!
          </p>
          <Button onClick={handleOpenAdd} variant="gradient" size="sm">
            Create First Category Budget
          </Button>
        </Card>
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? `Edit ${editingBudget.category} Budget` : 'Create Category Budget'}
        description="Set a maximum spending ceiling for this category for the current month"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          {!editingBudget && (
            <Select
              label="Select Expense Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          )}

          <Input
            label={`Monthly Limit (${sym})`}
            type="number"
            placeholder="e.g. 3000"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            error={error}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
