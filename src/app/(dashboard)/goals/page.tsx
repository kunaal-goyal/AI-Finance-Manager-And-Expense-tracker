'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  PiggyBank,
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Coins,
  ArrowRight,
  Laptop,
  Palmtree,
  Shield,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { SavingsGoal } from '@/types';

export default function GoalsPage() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalContribution,
    profile,
    theme,
  } = useApp();
  const sym = profile.currencySymbol;

  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Gadgets');
  const [contribAmount, setContribAmount] = useState('');
  const [contribNote, setContribNote] = useState('');
  const [error, setError] = useState('');
  const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);

  const handleOpenAddGoal = () => {
    setSelectedGoal(null);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('0');
    const future = new Date();
    future.setMonth(future.getMonth() + 4);
    setTargetDate(future.toISOString().split('T')[0]);
    setCategory('Gadgets');
    setError('');
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setTitle(goal.title);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate);
    setCategory(goal.category);
    setError('');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }

    if (selectedGoal) {
      await updateGoal(selectedGoal.id, {
        title: title.trim(),
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        targetDate,
        category,
        isCompleted: Number(currentAmount) >= Number(targetAmount),
      });
    } else {
      await addGoal({
        title: title.trim(),
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        targetDate,
        category,
        isCompleted: (Number(currentAmount) || 0) >= Number(targetAmount),
      });
    }

    setIsGoalModalOpen(false);
  };

  const handleOpenDeposit = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setContribAmount('');
    setContribNote('');
    setError('');
    setIsContribModalOpen(true);
  };

  const handleSaveContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribAmount || Number(contribAmount) <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }

    if (selectedGoal) {
      await addGoalContribution(
        selectedGoal.id,
        Number(contribAmount),
        contribNote.trim() || undefined
      );

      // Check if newly completed to celebrate!
      if (selectedGoal.currentAmount + Number(contribAmount) >= selectedGoal.targetAmount) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }

    setIsContribModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete savings goal "${name}"?`)) {
      deleteGoal(id);
    }
  };

  const totalSavedAcrossGoals = goals.reduce((acc, g) => acc + Number(g.currentAmount), 0);
  const totalTargetAcrossGoals = goals.reduce((acc, g) => acc + Number(g.targetAmount), 0);
  const completedGoalsCount = goals.filter((g) => g.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Student Savings Goals
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Set targets for coding laptops, semester roadtrips, course certificates & emergency buffers
          </p>
        </div>

        <Button
          onClick={handleOpenAddGoal}
          variant="gradient"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Savings Goal
        </Button>
      </div>

      {/* Aggregate Savings Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className={cn(
          'p-4 transition-all',
          theme === 'light'
            ? 'bg-indigo-50/50 border-indigo-200'
            : 'bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/20'
        )}>
          <p className="text-xs text-slate-400 font-medium">Total Saved in Goals</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {formatCurrency(totalSavedAcrossGoals, sym)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Of {formatCurrency(totalTargetAcrossGoals, sym)} target
          </p>
        </Card>

        <Card className={cn(
          'p-4 transition-all',
          theme === 'light'
            ? 'bg-purple-50/50 border-purple-200'
            : 'bg-gradient-to-br from-purple-950/40 to-slate-900 border-purple-500/20'
        )}>
          <p className="text-xs text-slate-400 font-medium">Active Goals</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mt-1">
            {goals.length - completedGoalsCount} Goals In Progress
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Targeting specific student milestones</p>
        </Card>

        <Card className={cn(
          'p-4 transition-all',
          theme === 'light'
            ? 'bg-emerald-50/50 border-emerald-200'
            : 'bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/20'
        )}>
          <p className="text-xs text-slate-400 font-medium">Goals Accomplished</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <span>{completedGoalsCount} Goals</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </p>
          <p className="text-[11px] text-emerald-500 dark:text-emerald-400 mt-0.5">100% funded and completed</p>
        </Card>
      </div>

      {/* Goals Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        onMouseLeave={() => setHoveredGoalId(null)}
      >
        {goals.map((g) => {
          const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);
          const isHovered = hoveredGoalId === g.id;
          const isOther = hoveredGoalId !== null && !isHovered;

          return (
            <div
              key={g.id}
              className="relative"
              onMouseEnter={() => setHoveredGoalId(g.id)}
            >
              {/* Glowing Aura Behind Hovered Goal Card */}
              {isHovered && (
                <div
                  className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-r ${
                    g.isCompleted
                      ? 'from-emerald-600/50 via-teal-600/40 to-cyan-500/40'
                      : 'from-purple-600/50 via-indigo-600/40 to-cyan-500/30'
                  } opacity-80 blur-lg -z-10 animate-pulse pointer-events-none transition-all duration-300`}
                />
              )}

              <Card
                className={`space-y-4 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu h-full ${
                  isHovered
                    ? (theme === 'light'
                        ? 'scale-[1.04] -translate-y-1.5 z-20 border-purple-400 shadow-[0_8px_30px_rgba(147,51,234,0.18)] bg-white'
                        : 'scale-[1.04] -translate-y-1.5 z-20 border-purple-400/80 shadow-[0_0_28px_rgba(168,85,247,0.35)]')
                    : isOther
                    ? 'scale-[0.95] opacity-50 z-0'
                    : g.isCompleted
                    ? (theme === 'light' ? 'border-emerald-500/40 bg-emerald-50/50' : 'border-emerald-500/40 bg-emerald-950/10')
                    : 'hover:border-purple-300'
                }`}
              >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        g.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {g.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Target className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base truncate">{g.title}</h3>
                      <p className="text-xs text-slate-400">{g.category}</p>
                    </div>
                  </div>

                  {g.isCompleted ? (
                    <Badge variant="safe">Completed 🎉</Badge>
                  ) : (
                    <span className="text-sm font-bold text-purple-400">{percent}%</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="pt-3 space-y-2">
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        g.isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-400">
                      Saved: <strong className="text-white font-bold">{formatCurrency(g.currentAmount, sym)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Target: <strong className="text-slate-200">{formatCurrency(g.targetAmount, sym)}</strong>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Target: {formatDate(g.targetDate)}
                    </span>
                    {!g.isCompleted && (
                      <span className="text-purple-300 font-medium">
                        {formatCurrency(remaining, sym)} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Contribution History Preview */}
                {g.contributions && g.contributions.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                    <p className="text-slate-400 font-semibold">Recent Contribution:</p>
                    {g.contributions.slice(-1).map((c) => (
                      <div key={c.id} className="flex justify-between text-slate-300">
                        <span>{c.note || 'Deposit'} ({formatDate(c.date)})</span>
                        <span className="text-emerald-400 font-bold">+{formatCurrency(c.amount, sym)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button
                  onClick={() => handleOpenDeposit(g)}
                  size="sm"
                  variant={g.isCompleted ? 'secondary' : 'gradient'}
                  leftIcon={<Coins className="w-3.5 h-3.5" />}
                >
                  Deposit Funds
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditGoal(g)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Goal"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(g.id, g.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="py-16 text-center text-slate-400 space-y-3">
          <PiggyBank className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-medium">No savings goals created yet.</p>
          <p className="text-xs text-slate-500">
            Set goals to build your emergency fund or save for that new laptop!
          </p>
          <Button onClick={handleOpenAddGoal} variant="gradient" size="sm">
            Create Your First Savings Goal
          </Button>
        </Card>
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title={selectedGoal ? 'Edit Savings Goal' : 'Create Student Savings Goal'}
        description="Set a target amount and date to stay motivated"
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. M2 MacBook Air, Goa Semester Trip, Emergency Fund"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={`Target Amount (${sym})`}
              type="number"
              placeholder="e.g. 15000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />

            <Input
              label={`Current Amount (${sym})`}
              type="number"
              placeholder="0"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Target Completion Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />

            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Gadgets', label: 'Gadgets & Tech' },
                { value: 'Travel', label: 'Travel & Trips' },
                { value: 'Education', label: 'Courses & Certifications' },
                { value: 'Emergency', label: 'Emergency Fund' },
                { value: 'Clothing', label: 'Wardrobe & Shopping' },
                { value: 'Other', label: 'Other Goal' },
              ]}
            />
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {selectedGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Contribution / Deposit Modal */}
      <Modal
        isOpen={isContribModalOpen}
        onClose={() => setIsContribModalOpen(false)}
        title={`Add Savings to "${selectedGoal?.title}"`}
        description="Log money set aside from your monthly allowance or freelance earnings"
      >
        <form onSubmit={handleSaveContribution} className="space-y-4">
          <Input
            label={`Contribution Amount (${sym})`}
            type="number"
            placeholder="e.g. 500"
            value={contribAmount}
            onChange={(e) => setContribAmount(e.target.value)}
            autoFocus
          />

          <Input
            label="Note / Source (Optional)"
            placeholder="e.g. Saved from Diwali gifts, Freelance gig"
            value={contribNote}
            onChange={(e) => setContribNote(e.target.value)}
          />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsContribModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Deposit Contribution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
