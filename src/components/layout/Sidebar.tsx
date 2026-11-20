'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  onOpenAddModal: () => void;
}

export function Sidebar({ onOpenAddModal }: SidebarProps) {
  const pathname = usePathname();
  const { profile, isSupabaseMode, theme } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#090e1e] p-5 shrink-0 min-h-screen sticky top-0 h-screen overflow-x-hidden overflow-y-auto scrollbar-none select-none">
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:scale-110 transition-transform duration-300">
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
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 border border-purple-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Navigation Links with Fisheye / Zoom & Glow Animation */}
      <nav
        className="space-y-1.5 flex-1 py-1 overflow-x-hidden scrollbar-none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </div>
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isHovered = hoveredIdx === index;
          const isOtherHovered = hoveredIdx !== null && !isHovered;

          return (
            <div key={item.name} className="relative">
              {/* Glowing Aura Behind Hovered Item */}
              {isHovered && (
                <div
                  className={cn(
                    'absolute inset-0 rounded-xl opacity-75 blur-md -z-10 transition-all duration-300 animate-pulse pointer-events-none',
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-400/40 via-indigo-400/30 to-pink-400/30'
                      : 'bg-gradient-to-r from-purple-600/60 via-indigo-600/50 to-cyan-500/40'
                  )}
                />
              )}

              <Link
                href={item.href}
                onMouseEnter={() => setHoveredIdx(index)}
                className={cn(
                  'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-center select-none',
                  // Hovered state: zoom in slightly without pushing horizontally
                  isHovered &&
                    (theme === 'light'
                      ? 'scale-[1.03] bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 text-purple-900 border border-purple-300 shadow-[0_4px_20px_rgba(147,51,234,0.18)] z-20 font-bold'
                      : 'scale-[1.03] bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-purple-900/40 text-white border border-purple-400/80 shadow-[0_0_22px_rgba(168,85,247,0.4)] z-20 font-bold'),
                  // Other items: decrease size and soften opacity
                  isOtherHovered && 'scale-[0.96] opacity-50 z-0',
                  // Standard state when nothing hovered
                  !isHovered && !isOtherHovered && (
                    isActive
                      ? (theme === 'light'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm font-semibold'
                          : 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm')
                      : (theme === 'light'
                          ? 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/80'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60')
                  )
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-all duration-300',
                      isHovered
                        ? (theme === 'light' ? 'text-purple-600 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-purple-300 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]')
                        : isActive
                        ? 'text-purple-500'
                        : item.isAi
                        ? 'text-cyan-500'
                        : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')
                    )}
                  />
                  <span className={cn('transition-colors', isHovered && (theme === 'light' ? 'text-purple-900 font-bold' : 'text-white font-bold'))}>
                    {item.name}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300',
                      isHovered
                        ? (theme === 'light' ? 'bg-purple-600 text-white shadow-sm font-extrabold' : 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-extrabold')
                        : 'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer Student Card */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 transition-all duration-300 hover:border-purple-500/30 hover:scale-[1.02]">
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
