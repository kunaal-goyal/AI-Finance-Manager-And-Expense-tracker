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
import { formatCurrency } from '@/lib/utils';
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
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#090e1e]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">
            Welcome back, {profile.fullName.split(' ')[0]}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Available Balance Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <span className="text-slate-400">Balance:</span>
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-medium hover:border-purple-400/50 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
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
          className="p-2 rounded-xl border transition-all duration-200 flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 text-amber-400 border-slate-800 hover:border-amber-400/50 hover:scale-105 active:scale-95 shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600 transition-transform duration-300" />
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white border border-purple-400/30 shadow-sm focus:outline-none"
          >
            {profile.fullName.charAt(0) || 'U'}
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white truncate">
                  {profile.fullName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
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
