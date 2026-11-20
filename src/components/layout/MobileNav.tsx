'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  PiggyBank,
  BarChart3,
  Sparkles,
  Settings,
  X,
  PlusCircle,
  GraduationCap,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal: () => void;
}

export function MobileNav({ isOpen, onClose, onOpenAddModal }: MobileNavProps) {
  const pathname = usePathname();
  const { profile, theme, toggleTheme } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budget', icon: PieChart },
    { name: 'Savings Goals', href: '/goals', icon: PiggyBank },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles, isAi: true },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80%] bg-[#090e1e] border-r border-slate-800 p-5 flex flex-col h-full z-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base">SpendWise AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add */}
        <div className="my-4">
          <button
            onClick={() => {
              onClose();
              onOpenAddModal();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-lg shadow-purple-600/25 active:scale-95 transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Nav Links with Fisheye Zoom & Glow */}
        <nav
          className="space-y-1.5 flex-1 overflow-y-auto py-2"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isHovered = hoveredIdx === index;
            const isOtherHovered = hoveredIdx !== null && !isHovered;

            return (
              <div key={item.name} className="relative">
                {isHovered && (
                  <div
                    className={cn(
                      'absolute -inset-1 rounded-2xl opacity-75 blur-md -z-10 animate-pulse pointer-events-none',
                      theme === 'light'
                        ? 'bg-gradient-to-r from-purple-400/40 via-indigo-400/30 to-pink-400/30'
                        : 'bg-gradient-to-r from-purple-600/60 via-indigo-600/50 to-cyan-500/40'
                    )}
                  />
                )}

                <Link
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredIdx(index)}
                  className={cn(
                    'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left select-none',
                    isHovered &&
                      (theme === 'light'
                        ? 'scale-[1.06] translate-x-1.5 bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 text-purple-900 border border-purple-300 shadow-[0_4px_20px_rgba(147,51,234,0.18)] z-20 font-bold'
                        : 'scale-[1.06] translate-x-1.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-purple-900/40 text-white border border-purple-400/80 shadow-[0_0_22px_rgba(168,85,247,0.4)] z-20 font-bold'),
                    isOtherHovered && 'scale-[0.94] opacity-50 z-0',
                    !isHovered && !isOtherHovered && (
                      isActive
                        ? (theme === 'light'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-purple-600/15 text-purple-300 border border-purple-500/30')
                        : (theme === 'light'
                            ? 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/80'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
                    )
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-all duration-300',
                      isHovered
                        ? 'text-purple-300 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                        : isActive
                        ? 'text-purple-400'
                        : item.isAi
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    )}
                  />
                  <span className={cn(isHovered && 'font-bold text-white')}>{item.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer with Theme Switch & Profile */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-purple-400">Toggle</span>
          </button>

          <div>
            <p className="text-xs font-semibold text-white truncate">{profile.fullName}</p>
            <p className="text-[11px] text-slate-400 truncate">{profile.collegeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
