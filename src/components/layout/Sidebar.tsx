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
  const [isExpanded, setIsExpanded] = useState(false);
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
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setHoveredIdx(null);
      }}
      className={cn(
        'hidden lg:flex flex-col border-r shrink-0 min-h-screen sticky top-0 h-screen select-none overflow-x-hidden overflow-y-auto scrollbar-none z-40 p-3.5',
        'transition-[width] duration-300 ease-in-out',
        isExpanded ? 'w-64' : 'w-[74px]',
        theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#090e1e] border-slate-800/80'
      )}
    >
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-1 py-1 mb-6 group overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 whitespace-nowrap',
            isExpanded ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0 pointer-events-none'
          )}
        >
          <span className={cn(
            'font-extrabold text-lg tracking-tight flex items-center gap-1.5',
            theme === 'light' ? 'text-slate-900' : 'text-white'
          )}>
            SpendWise <span className="text-purple-400 font-bold text-xs bg-purple-500/20 px-1.5 py-0.5 rounded-md border border-purple-500/30">AI</span>
          </span>
          <p className={cn(
            'text-[11px] font-medium',
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          )}>Student Finance Suite</p>
        </div>
      </Link>

      {/* Quick Add Action */}
      <div className="mb-5 px-0.5">
        <button
          onClick={onOpenAddModal}
          title={!isExpanded ? 'Add Transaction' : undefined}
          className={cn(
            'w-full h-11 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 border border-purple-400/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden',
            isExpanded ? 'px-4 gap-2.5' : 'px-0'
          )}
        >
          <PlusCircle className="w-5 h-5 shrink-0" />
          <span
            className={cn(
              'overflow-hidden transition-all duration-200 whitespace-nowrap font-semibold text-sm',
              isExpanded ? 'opacity-100 max-w-[130px] ml-1' : 'opacity-0 max-w-0 ml-0 pointer-events-none'
            )}
          >
            Add Transaction
          </span>
        </button>
      </div>

      {/* Navigation Links with Simple Zoom In / Out */}
      <nav
        className="space-y-1.5 flex-1 py-1 px-1 overflow-x-hidden scrollbar-none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <div
          className={cn(
            'px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 overflow-hidden transition-all duration-200',
            isExpanded ? 'opacity-100 h-6 pb-2' : 'opacity-0 h-0 pointer-events-none'
          )}
        >
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
                    'absolute inset-x-0.5 inset-y-0 rounded-xl opacity-75 blur-md -z-10 transition-all duration-200 pointer-events-none',
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-400/35 via-indigo-400/25 to-pink-400/25'
                      : 'bg-gradient-to-r from-purple-600/50 via-indigo-600/40 to-cyan-500/30'
                  )}
                />
              )}

              <Link
                href={item.href}
                onMouseEnter={() => setHoveredIdx(index)}
                title={!isExpanded ? item.name : undefined}
                className={cn(
                  'group relative flex items-center h-11 w-full rounded-xl transition-all duration-200 ease-out select-none overflow-hidden',
                  isExpanded ? 'px-3 justify-start' : 'px-0 justify-center',
                  // Hovered state: simple zoom without clipping borders
                  isHovered &&
                    (theme === 'light'
                      ? 'scale-[1.02] bg-purple-100/90 text-purple-900 border border-purple-300 shadow-[0_2px_12px_rgba(147,51,234,0.14)] z-20 font-bold'
                      : 'scale-[1.02] bg-purple-900/35 text-white border border-purple-400/80 shadow-[0_0_16px_rgba(168,85,247,0.35)] z-20 font-bold'),
                  // Other items: subtle softening
                  isOtherHovered && 'scale-[0.98] opacity-60 z-0',
                  // Standard unhovered state
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
                {/* Fixed-size Icon Container so it NEVER shifts, balloons or goes outside */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200 ease-out',
                      isHovered ? 'scale-110' : 'scale-100',
                      isHovered
                        ? (theme === 'light' ? 'text-purple-600' : 'text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]')
                        : isActive
                        ? 'text-purple-500'
                        : item.isAi
                        ? 'text-cyan-500'
                        : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')
                    )}
                  />
                </div>

                {/* Name of the page: noticeably larger than the 20px symbol (18px font-bold) */}
                <span
                  className={cn(
                    'text-[18px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 ease-out origin-left',
                    isExpanded
                      ? 'opacity-100 max-w-[140px] ml-2'
                      : 'opacity-0 max-w-0 ml-0 overflow-hidden pointer-events-none',
                    isHovered ? 'scale-105' : 'scale-100',
                    isHovered && (theme === 'light' ? 'text-purple-950 font-extrabold' : 'text-white font-extrabold')
                  )}
                >
                  {item.name}
                </span>

                {/* Optional Badge */}
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 shrink-0 ml-auto mr-1',
                      isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 overflow-hidden pointer-events-none',
                      isHovered
                        ? (theme === 'light' ? 'bg-purple-600 text-white font-extrabold shadow-sm' : 'bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.6)]')
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
      <div className={cn(
        'pt-4 border-t space-y-3 overflow-hidden',
        theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'
      )}>
        <div className={cn(
          'p-1.5 rounded-xl border flex items-center gap-2.5 transition-all duration-200 overflow-hidden h-12',
          theme === 'light'
            ? 'bg-slate-100 border-slate-200 hover:border-purple-300'
            : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/30'
        )}>
          <div className={cn(
            'w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm shrink-0',
            theme === 'light'
              ? 'bg-purple-100 border-purple-200 text-purple-700'
              : 'bg-purple-600/20 border-purple-500/30 text-purple-300'
          )}>
            {profile.fullName.charAt(0) || 'S'}
          </div>
          <div
            className={cn(
              'overflow-hidden transition-all duration-200 flex-1 min-w-0 whitespace-nowrap',
              isExpanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none'
            )}
          >
            <p className={cn(
              'text-xs font-semibold truncate',
              theme === 'light' ? 'text-slate-800' : 'text-white'
            )}>
              {profile.fullName}
            </p>
            <p className={cn(
              'text-[11px] truncate',
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            )}>
              {profile.collegeName || 'Student'}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'flex items-center justify-between px-1 text-[11px] overflow-hidden transition-all duration-200',
            theme === 'light' ? 'text-slate-500' : 'text-slate-400',
            isExpanded ? 'opacity-100 h-6' : 'opacity-0 h-0 pointer-events-none'
          )}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isSupabaseMode ? 'Supabase Live' : 'Active Workspace'}
          </span>
          <span className={cn(
            'font-semibold px-2 py-0.5 rounded border whitespace-nowrap',
            theme === 'light'
              ? 'text-purple-700 bg-purple-50 border-purple-200'
              : 'text-purple-300 bg-purple-950/60 border-purple-800/40'
          )}>
            {profile.currencySymbol} {profile.currency}
          </span>
        </div>
      </div>
    </aside>
  );
}
