import { Transaction, Budget, FinancialSummary, ExpenseCategory } from '@/types';

export function calculateFinancialSummary(
  transactions: Transaction[],
  monthlyBudgetLimit: number = 7000,
  referenceDate: Date = new Date()
): FinancialSummary {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth(); // 0-indexed
  const currentDay = referenceDate.getDate();

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
  });

  // Calculate overall balance
  let allTimeIncome = 0;
  let allTimeExpense = 0;
  transactions.forEach((t) => {
    if (t.type === 'income') {
      allTimeIncome += Number(t.amount);
    } else {
      allTimeExpense += Number(t.amount);
    }
  });
  const totalBalance = allTimeIncome - allTimeExpense;

  // Monthly income & expense
  let monthlyIncome = 0;
  let monthlyExpenses = 0;
  const categorySpendingMap: Record<string, number> = {};

  currentMonthTransactions.forEach((t) => {
    const amt = Number(t.amount);
    if (t.type === 'income') {
      monthlyIncome += amt;
    } else {
      monthlyExpenses += amt;
      categorySpendingMap[t.category] = (categorySpendingMap[t.category] || 0) + amt;
    }
  });

  const remainingBudget = Math.max(0, monthlyBudgetLimit - monthlyExpenses);
  const savingsThisMonth = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)) : 0;
  
  // Daily average spend
  const daysPassed = Math.max(1, currentDay);
  const dailyAverageSpend = Math.round(monthlyExpenses / daysPassed);

  // Budget utilization percent
  const budgetUtilizationPercent = monthlyBudgetLimit > 0
    ? Math.round((monthlyExpenses / monthlyBudgetLimit) * 100)
    : 0;

  // Budget status: green (<75%), yellow (75%-99%), red (>=100%)
  let budgetStatus: 'safe' | 'warning' | 'danger' = 'safe';
  if (budgetUtilizationPercent >= 100) {
    budgetStatus = 'danger';
  } else if (budgetUtilizationPercent >= 75) {
    budgetStatus = 'warning';
  }

  // Highest spending category
  let highestCategory = 'None';
  let highestAmount = 0;
  Object.entries(categorySpendingMap).forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCategory = cat;
    }
  });

  const highestPercentage = monthlyExpenses > 0 ? Math.round((highestAmount / monthlyExpenses) * 100) : 0;

  return {
    totalBalance,
    totalIncome: monthlyIncome,
    totalExpenses: monthlyExpenses,
    monthlyBudgetLimit,
    remainingBudget,
    savingsThisMonth,
    savingsRate,
    dailyAverageSpend,
    budgetUtilizationPercent,
    budgetStatus,
    highestExpenseCategory: {
      category: highestCategory,
      amount: highestAmount,
      percentage: highestPercentage,
    },
  };
}

export function calculateCategoryBreakdown(
  transactions: Transaction[],
  monthStr?: string // 'YYYY-MM'
): { category: string; amount: number; percentage: number; count: number }[] {
  let filtered = transactions.filter((t) => t.type === 'expense');

  if (monthStr) {
    filtered = filtered.filter((t) => t.date.startsWith(monthStr));
  } else {
    // Current month by default
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    filtered = filtered.filter((t) => t.date.startsWith(currentMonthPrefix));
  }

  const totalExpense = filtered.reduce((acc, t) => acc + Number(t.amount), 0);
  const map: Record<string, { amount: number; count: number }> = {};

  filtered.forEach((t) => {
    if (!map[t.category]) {
      map[t.category] = { amount: 0, count: 0 };
    }
    map[t.category].amount += Number(t.amount);
    map[t.category].count += 1;
  });

  return Object.entries(map)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateBudgetPerformances(
  budgets: Budget[],
  transactions: Transaction[],
  monthStr: string
): {
  budget: Budget;
  spent: number;
  remaining: number;
  percent: number;
  status: 'safe' | 'warning' | 'danger';
}[] {
  // Expenses in that month
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(monthStr)
  );

  return budgets.map((b) => {
    const spent = monthExpenses
      .filter((t) => t.category === b.category)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const remaining = Math.max(0, b.monthlyLimit - spent);
    const percent = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percent >= 100) {
      status = 'danger';
    } else if (percent >= 75) {
      status = 'warning';
    }

    return {
      budget: b,
      spent,
      remaining,
      percent,
      status,
    };
  });
}
