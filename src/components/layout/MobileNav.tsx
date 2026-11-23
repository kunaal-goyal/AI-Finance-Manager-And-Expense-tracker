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
      <div className={cn(
        'relative w-72 max-w-[80%] border-r p-5 flex flex-col h-full z-10',
        theme === 'light' ? 'bg-white border-slate-200' : 'bg-black border-white/10'
      )}>
        <div className={cn('flex items-center justify-between pb-6 border-b', theme === 'light' ? 'border-slate-200' : 'border-white/10')}>
          <div className="flex items-center gap-2.5">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
              theme === 'light' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
            )}>
              <GraduationCap className={cn('w-4 h-4', theme === 'light' ? 'text-white' : 'text-black')} />
            </div>
            <span className="font-bold text-white text-base">SpendWise AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
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
            className={cn(
              'w-full flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-xl text-sm active:scale-95 transition-all',
              theme === 'light'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25'
                : 'bg-white text-black font-semibold shadow-lg shadow-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white'
            )}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Nav Links with Fisheye Zoom & Glow */}
        <nav
          className="space-y-1.5 flex-1 overflow-x-hidden overflow-y-auto scrollbar-none py-2"
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
                      'absolute inset-0 rounded-xl opacity-75 blur-md -z-10 animate-pulse pointer-events-none',
                      theme === 'light'
                        ? 'bg-gradient-to-r from-purple-400/40 via-indigo-400/30 to-pink-400/30'
                        : 'bg-white/20 shadow-[0_0_22px_rgba(255,255,255,0.45)]'
                    )}
                  />
                )}

                <Link
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredIdx(index)}
                  className={cn(
                    'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-center select-none',
                    isHovered &&
                      (theme === 'light'
                        ? 'scale-[1.03] bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 text-purple-900 border border-purple-300 shadow-[0_4px_20px_rgba(147,51,234,0.18)] z-20 font-bold'
                        : 'scale-[1.03] bg-white/10 text-white border border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.4)] z-20 font-bold'),
                    isOtherHovered && 'scale-[0.96] opacity-50 z-0',
                    !isHovered && !isOtherHovered && (
                      isActive
                        ? (theme === 'light'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-white/10 text-white border border-white/30')
                        : (theme === 'light'
                            ? 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/80'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5')
                    )
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-all duration-300',
                      isHovered
                        ? (theme === 'light' ? 'text-purple-600 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]')
                        : isActive
                        ? (theme === 'light' ? 'text-purple-600' : 'text-white')
                        : item.isAi
                        ? (theme === 'light' ? 'text-cyan-600' : 'text-white')
                        : 'text-zinc-400'
                    )}
                  />
                  <span className={cn(isHovered && 'font-bold text-white')}>{item.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer with Theme Switch & Profile */}
        <div className={cn('pt-4 border-t space-y-3', theme === 'light' ? 'border-slate-200' : 'border-white/10')}>
          <button
            onClick={toggleTheme}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs',
              theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-black border-white/10 text-white'
            )}
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-purple-400" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className={cn('text-[10px] uppercase font-semibold', theme === 'light' ? 'text-purple-600' : 'text-white')}>Toggle</span>
          </button>

          <div>
            <p className="text-xs font-semibold text-white">{profile.fullName}</p>
            <p className="text-[11px] text-zinc-400 truncate">{profile.collegeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
