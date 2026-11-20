'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  PieChart,
  BarChart3,
  Sparkles,
  Settings,
  PlusCircle,
  GraduationCap,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  onOpenAddModal: () => void;
}

export function Sidebar({ onOpenAddModal }: SidebarProps) {
  const pathname = usePathname();
  const { profile, isSupabaseMode } = useApp();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: Receipt,
    },
    {
      name: 'Budgets',
      href: '/budget',
      icon: PieChart,
    },
    {
      name: 'Savings Goals',
      href: '/goals',
      icon: PiggyBank,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'AI Assistant',
      href: '/assistant',
      icon: Sparkles,
      badge: 'Gemini',
      isAi: true,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#090e1e] p-5 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:scale-105 transition-transform">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
            SpendWise <span className="text-purple-400 font-bold text-xs bg-purple-500/20 px-1.5 py-0.5 rounded-md border border-purple-500/30">AI</span>
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Student Finance Suite</p>
        </div>
      </Link>

      {/* Quick Add Action */}
      <div className="mb-6">
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-purple-600/20 border border-purple-400/30 transition-all active:scale-[0.98] text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive
                      ? 'text-purple-400'
                      : item.isAi
                      ? 'text-cyan-400 group-hover:text-cyan-300'
                      : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Student Card */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-sm text-purple-300">
            {profile.fullName.charAt(0) || 'S'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {profile.fullName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {profile.collegeName || 'Student'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isSupabaseMode ? 'Supabase Live' : 'Active Workspace'}
          </span>
          <span className="font-semibold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
            {profile.currencySymbol} {profile.currency}
          </span>
        </div>
      </div>
    </aside>
  );
}
