'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  Budget,
  SavingsGoal,
  UserProfile,
  FinancialSummary,
  ExpenseCategory,
  StudentType,
} from '@/types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
} from '@/lib/initialData';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
  calculateBudgetPerformances,
} from '@/lib/calculations';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

interface AppContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  summary: FinancialSummary;
  categoryBreakdown: { category: string; amount: number; percentage: number; count: number }[];
  budgetPerformances: ReturnType<typeof calculateBudgetPerformances>;
  isLoading: boolean;
  isSupabaseMode: boolean;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'contributions'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addGoalContribution: (goalId: string, amount: number, note?: string) => Promise<void>;
  
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetToDemoData: () => void;
  clearAllData: () => void;
  
  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'spendwise_profile_v1',
  TRANSACTIONS: 'spendwise_transactions_v1',
  BUDGETS: 'spendwise_budgets_v1',
  GOALS: 'spendwise_goals_v1',
  AUTH_USER: 'spendwise_auth_user_v1',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);

  // Initialize data on mount
  useEffect(() => {
    async function initData() {
      try {
        if (typeof window !== 'undefined') {
          // Check local storage first
          const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
          const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
          const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
          const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
          const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);

          if (savedAuth) {
            setUser(JSON.parse(savedAuth));
          } else {
            // Default demo logged in user for immediate experience
            const demoUser = { id: INITIAL_USER_PROFILE.id, email: INITIAL_USER_PROFILE.email };
            setUser(demoUser);
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(demoUser));
          }

          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          }
          if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
          }
          if (savedBudgets) {
            setBudgets(JSON.parse(savedBudgets));
          }
          if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
          }
        }
      } catch (e) {
        console.error('Failed to load local data', e);
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      if (user) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    }
  }, [profile, transactions, budgets, goals, user, isLoading]);

  // Dynamic calculations
  const summary = useMemo(() => {
    return calculateFinancialSummary(transactions, profile.monthlyBudgetLimit);
  }, [transactions, profile.monthlyBudgetLimit]);

  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(transactions);
  }, [transactions]);

  const budgetPerformances = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return calculateBudgetPerformances(budgets, transactions, currentMonth);
  }, [budgets, transactions]);

  // Transaction Actions
  const addTransaction = async (txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If Supabase is active, persist to database
    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('transactions').insert({
          user_id: user.id,
          title: newTx.title,
          amount: newTx.amount,
          type: newTx.type,
          category: newTx.category,
          date: newTx.date,
          description: newTx.description,
          payment_method: newTx.paymentMethod,
        });
      } catch (err) {
        console.warn('Supabase sync error (fallback to local):', err);
      }
    }
  };

  const updateTransaction = async (id: string, updateData: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updateData, updatedAt: new Date().toISOString() } : t))
    );

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('transactions').update(updateData).eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (isSupabaseConfigured && supabase && user) {
      try {
        await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
  };

  // Budget Actions
  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: `bg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBudgets((prev) => {
      // Remove existing budget for same category and month if present
      const filtered = prev.filter(
        (b) => !(b.category === newBudget.category && b.month === newBudget.month)
      );
      return [...filtered, newBudget];
    });
  };

  const updateBudget = async (id: string, budgetData: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...budgetData, updatedAt: new Date().toISOString() } : b))
    );
  };

  const deleteBudget = async (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Savings Goal Actions
  const addGoal = async (goalData: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'contributions'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      contributions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = async (id: string, goalData: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...goalData, updatedAt: new Date().toISOString() } : g))
    );
  };

  const deleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addGoalContribution = async (goalId: string, amount: number, note?: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrent = Number(g.currentAmount) + Number(amount);
          const isNowCompleted = newCurrent >= g.targetAmount;
          const newContrib = {
            id: `c-${Date.now()}`,
            goalId,
            amount: Number(amount),
            note: note || 'Contribution',
            date: dateStr,
          };
          return {
            ...g,
            currentAmount: newCurrent,
            isCompleted: isNowCompleted,
            contributions: [...(g.contributions || []), newContrib],
          };
        }
        return g;
      })
    );
  };

  // Profile Update
  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...newProfile,
    }));
  };

  const resetToDemoData = () => {
    setProfile(INITIAL_USER_PROFILE);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setUser({ id: INITIAL_USER_PROFILE.id, email: INITIAL_USER_PROFILE.email });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    }
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setProfile((prev) => ({
      ...prev,
      monthlyAllowance: 0,
      monthlyBudgetLimit: 0,
    }));
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.BUDGETS);
      localStorage.removeItem(STORAGE_KEYS.GOALS);
    }
  };

  // Auth functions
  const login = async (email: string, password?: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'defaultPassword123!',
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication error' };
      }
    }

    // Local sandbox authentication fallback
    const mockUser = {
      id: `user-${Date.now()}`,
      email,
    };
    setUser(mockUser);
    setProfile((prev) => ({ ...prev, email }));
    return { success: true };
  };

  const register = async (email: string, password?: string, fullName?: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'defaultPassword123!',
          options: {
            data: { full_name: fullName || 'Student' },
          },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
          if (fullName) {
            setProfile((prev) => ({ ...prev, fullName, email }));
          }
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration error' };
      }
    }

    // Local sandbox fallback
    const mockUser = {
      id: `user-${Date.now()}`,
      email,
    };
    setUser(mockUser);
    setProfile((prev) => ({
      ...prev,
      email,
      fullName: fullName || prev.fullName,
    }));
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        transactions,
        budgets,
        goals,
        summary,
        categoryBreakdown,
        budgetPerformances,
        isLoading,
        isSupabaseMode: isSupabaseConfigured,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        addGoalContribution,
        updateProfile,
        resetToDemoData,
        clearAllData,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
