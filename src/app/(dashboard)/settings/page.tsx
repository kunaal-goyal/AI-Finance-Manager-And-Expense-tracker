'use client';

import React, { useState } from 'react';
import {
  User,
  Sliders,
  DollarSign,
  GraduationCap,
  Database,
  Download,
  RotateCcw,
  Trash2,
  Check,
  ShieldCheck,
  Key,
  Sun,
  Moon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { StudentType } from '@/types';

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    transactions,
    budgets,
    goals,
    resetToDemoData,
    clearAllData,
    isSupabaseMode,
    theme,
    setThemeMode,
  } = useApp();

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [studentType, setStudentType] = useState<StudentType>(profile.studentType);
  const [collegeName, setCollegeName] = useState(profile.collegeName);
  const [currency, setCurrency] = useState(profile.currency);
  const [currencySymbol, setCurrencySymbol] = useState(profile.currencySymbol);
  const [monthlyAllowance, setMonthlyAllowance] = useState(profile.monthlyAllowance.toString());
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(profile.monthlyBudgetLimit.toString());
  const [cycleStartDay, setCycleStartDay] = useState(profile.cycleStartDay.toString());

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    switch (newCurrency) {
      case 'INR':
        setCurrencySymbol('₹');
        break;
      case 'USD':
        setCurrencySymbol('$');
        break;
      case 'EUR':
        setCurrencySymbol('€');
        break;
      case 'GBP':
        setCurrencySymbol('£');
        break;
      case 'AED':
        setCurrencySymbol('AED ');
        break;
      default:
        setCurrencySymbol('₹');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      email,
      studentType,
      collegeName,
      currency,
      currencySymbol,
      monthlyAllowance: Number(monthlyAllowance) || 0,
      monthlyBudgetLimit: Number(monthlyBudgetLimit) || 0,
      cycleStartDay: Number(cycleStartDay) || 1,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Export all JSON
  const handleExportJSON = () => {
    const dataToExport = {
      profile,
      transactions,
      budgets,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `SpendWise_Data_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Settings & Student Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Customize your profile, currency formats, monthly allowance cycles and database preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Settings successfully saved and updated across all dashboards!</span>
        </div>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <CardTitle>Student Profile Details</CardTitle>
          </div>
          <CardDescription>Personal details and student classification</CardDescription>
        </CardHeader>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />

            <Input
              label="Student Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aarav@college.ac.in"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College / University Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. JECRC University, Jaipur"
            />

            <Select
              label="Student Living Arrangement"
              value={studentType}
              onChange={(e) => setStudentType(e.target.value as StudentType)}
              options={[
                { value: 'hosteler', label: 'Hosteler (Living in campus hostel)' },
                { value: 'day_scholar', label: 'Day Scholar (Commuting from home)' },
                { value: 'independent', label: 'Independent Flat / PG' },
                { value: 'part_time_job', label: 'Working Student / Freelancer' },
              ]}
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Financial Baseline & Currency
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Currency"
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                options={[
                  { value: 'INR', label: 'INR (₹ - Indian Rupee)' },
                  { value: 'USD', label: 'USD ($ - US Dollar)' },
                  { value: 'EUR', label: 'EUR (€ - Euro)' },
                  { value: 'GBP', label: 'GBP (£ - British Pound)' },
                  { value: 'AED', label: 'AED (Dirham)' },
                ]}
              />

              <Input
                label={`Monthly Allowance (${currencySymbol})`}
                type="number"
                value={monthlyAllowance}
                onChange={(e) => setMonthlyAllowance(e.target.value)}
                placeholder="8000"
              />

              <Input
                label={`Monthly Spending Cap (${currencySymbol})`}
                type="number"
                value={monthlyBudgetLimit}
                onChange={(e) => setMonthlyBudgetLimit(e.target.value)}
                placeholder="7000"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" variant="gradient">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Theme Appearance Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <CardTitle>Appearance & Theme Mode</CardTitle>
          </div>
          <CardDescription>Select your preferred visual theme for SpendWise AI</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={cn(
              'p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer',
              theme === 'dark'
                ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Dark Mode</p>
                <p className="text-xs text-slate-400">Deep navy theme with neon purple accents</p>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-purple-400" />}
          </button>

          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={cn(
              'p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer',
              theme === 'light'
                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-amber-500">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Light Mode</p>
                <p className="text-xs text-slate-400">Clean white & slate palette with visible typography</p>
              </div>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      </Card>

      {/* System Status & Database Connection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <CardTitle>Storage & Backend Status</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="space-y-0.5">
              <p className="font-semibold text-white">Database Mode</p>
              <p className="text-slate-400">
                {isSupabaseMode
                  ? 'Connected to live Supabase PostgreSQL with Row Level Security'
                  : 'Running in Local Sandbox / Persistent Offline Mode'}
              </p>
            </div>
            <Badge variant={isSupabaseMode ? 'safe' : 'purple'}>
              {isSupabaseMode ? 'Supabase PostgreSQL' : 'Local Storage Sandbox'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="space-y-0.5">
              <p className="font-semibold text-white">Gemini AI Endpoint</p>
              <p className="text-slate-400">
                Backend route: <code>/api/ai/chat</code> with financial context injection
              </p>
            </div>
            <Badge variant="safe">Ready</Badge>
          </div>
        </div>
      </Card>

      {/* Data Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-slate-400" />
            <CardTitle>Data Backup & Reset Options</CardTitle>
          </div>
          <CardDescription>Manage sample datasets and export records</CardDescription>
        </CardHeader>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleExportJSON}
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Complete Backup (JSON)
          </Button>

          <Button
            onClick={() => {
              if (confirm('Reset your account to the demo student dataset (Aarav Sharma)?')) {
                resetToDemoData();
                alert('Reset complete! Sample student data reloaded.');
              }
            }}
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reload Sample Student Dataset
          </Button>

          <Button
            onClick={() => {
              if (confirm('Are you sure you want to clear all transactions, budgets and goals?')) {
                clearAllData();
                alert('All data cleared.');
              }
            }}
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear All Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
