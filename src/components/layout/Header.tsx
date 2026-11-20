'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Plus,
  Sparkles,
  GraduationCap,
  Bell,
  Coins,
  LogOut,
  User,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onOpenAddModal: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({
  onOpenAddModal,
  onToggleMobileMenu,
  isMobileMenuOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const { profile, summary, logout, theme, toggleTheme } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Derive friendly page title from pathname
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Financial Overview';
      case '/transactions':
        return 'Expenses & Income';
      case '/budget':
        return 'Monthly Budget Limits';
      case '/goals':
        return 'Student Savings Goals';
      case '/analytics':
        return 'Financial Analytics';
      case '/assistant':
        return 'SpendWise AI Assistant';
      case '/settings':
        return 'Account & Preferences';
      default:
        return 'Student Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-black/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-zinc-400">
            Welcome back, {profile.fullName.split(' ')[0]}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Available Balance Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black border border-white/10 text-xs">
          <span className="text-zinc-400">Balance:</span>
          <span
            className={`font-bold ${
              summary.totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(summary.totalBalance, profile.currencySymbol)}
          </span>
        </div>

        {/* AI Assistant Quick Pill */}
        <Link
          href="/assistant"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.35)] text-xs font-medium transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="hidden md:inline">Ask</span> Gemini
        </Link>

        {/* Add Transaction Button */}
        <Button
          onClick={onOpenAddModal}
          size="sm"
          variant="gradient"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Add</span>
        </Button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={cn(
            'p-2 rounded-xl border transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm',
            theme === 'dark'
              ? 'bg-black hover:bg-zinc-900 text-white border-white/15 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-400'
          )}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-white transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600 transition-transform duration-300" />
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.3)] focus:outline-none"
          >
            {profile.fullName.charAt(0) || 'U'}
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl bg-black border border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.08)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-xs font-semibold text-white truncate">
                  {profile.fullName}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {profile.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Profile & Preferences</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
