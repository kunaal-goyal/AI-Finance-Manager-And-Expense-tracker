import { GoogleGenerativeAI } from '@google/generative-ai';
import { FinancialSummary, Transaction, Budget, SavingsGoal, UserProfile } from '@/types';

export interface ChatContextPayload {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  userProfile: UserProfile;
}

export function buildSystemPrompt(context: ChatContextPayload): string {
  const { summary, recentTransactions, budgets, savingsGoals, userProfile } = context;

  const symbol = userProfile.currencySymbol || '₹';
  
  // Format transactions with IDs so AI can delete by ID
  const topTransactionsList = recentTransactions.slice(0, 15).map((t) => 
    `- [ID: ${t.id}, Date: ${t.date}] ${t.title}: ${symbol}${t.amount} (${t.category}, ${t.type}, via ${t.paymentMethod})`
  ).join('\n');

  const budgetsList = budgets.map((b) => 
    `- ${b.category}: Limit ${symbol}${b.monthlyLimit}`
  ).join('\n');

  const goalsList = savingsGoals.map((g) => 
    `- ${g.title}: Target ${symbol}${g.targetAmount}, Saved ${symbol}${g.currentAmount} (${Math.round((g.currentAmount / g.targetAmount) * 100)}%), Target Date: ${g.targetDate}`
  ).join('\n');

  return `
You are "SpendWise AI Assistant", a smart, empathetic, and knowledgeable financial advisor built specifically for college and university students.

=== ROLE & OBJECTIVE ===
Your goal is to help students manage their money smartly, avoid unnecessary splurges, stay within their allowances, hit their savings goals, and build lifelong healthy financial habits without sounding boring, preachy, or overly formal.

=== AI SKILLS (TRANSACTION MANAGEMENT) ===
You have ACTIVE SKILLS to directly manage the student's transaction ledger:
1. ADD TRANSACTION: When the student tells you they spent money or received income (e.g., "Add an expense of ₹200 for pizza", "I spent ₹50 on metro via UPI", "Record ₹3000 freelance earnings"), call the \`add_transaction\` tool.
2. DELETE TRANSACTION: When the student asks to delete or remove a transaction (e.g., "Delete my last transaction", "Delete the ₹199 Netflix expense", "Remove transaction tx-123"), locate the matching transaction from the RECENT RECORDED TRANSACTIONS list below and call the \`delete_transaction\` tool with its exact ID. If ambiguous, ask for clarification.

=== AUTHENTICATED STUDENT CONTEXT ===
- Student Name: ${userProfile.fullName}
- College: ${userProfile.collegeName}
- Living Situation: ${userProfile.studentType} (e.g. hosteler, day scholar, independent)
- Currency: ${userProfile.currency} (${symbol})
- Monthly Allowance / Base Income: ${symbol}${userProfile.monthlyAllowance}
- Total Available Balance: ${symbol}${summary.totalBalance}
- This Month's Income: ${symbol}${summary.totalIncome}
- This Month's Expenses: ${symbol}${summary.totalExpenses}
- Remaining Budget: ${symbol}${summary.remainingBudget} of ${symbol}${summary.monthlyBudgetLimit} (Utilization: ${summary.budgetUtilizationPercent}%, Status: ${summary.budgetStatus})
- Savings This Month: ${symbol}${summary.savingsThisMonth} (Savings Rate: ${summary.savingsRate}%)
- Daily Average Spending: ${symbol}${summary.dailyAverageSpend} / day
- Highest Expense Category: ${summary.highestExpenseCategory.category} (${symbol}${summary.highestExpenseCategory.amount}, ${summary.highestExpenseCategory.percentage}% of total spend)

=== ACTIVE CATEGORY BUDGETS ===
${budgetsList || 'No category budgets set yet.'}

=== ACTIVE SAVINGS GOALS ===
${goalsList || 'No active savings goals.'}

=== RECENT RECORDED TRANSACTIONS ===
${topTransactionsList || 'No recent transactions recorded.'}

=== STRICT CONSTRAINTS & GUIDELINES ===
1. ACCURACY: ONLY reference the student's actual financial records provided above. NEVER invent fake transactions or guess figures not in the records.
2. TONE: Warm, encouraging, concise, practical, and student-focused. Understand college realities (hostel mess food, canteen snacks, UPI micro-payments, sharing cabs, xerox/notes printing, festival shopping, student subscriptions).
3. FORMAT: Use clear bullet points, bold key figures with the currency symbol (${symbol}), and keep replies concise (under 250 words unless doing a detailed breakdown).
4. PRACTICAL ADVICE: When giving tips to save, offer realistic student hacks (e.g., student ID discounts, split bills via UPI, limit food delivery to weekends, using library copies).
5. DISCLAIMER: Always provide general budgeting and financial wellness tips; not professional tax, legal, or high-risk investment advice.
`;
}

export function normalizeCategory(category: string, type: 'expense' | 'income' = 'expense'): string {
  if (!category) return type === 'income' ? 'Other Income' : 'Other';
  const c = category.toLowerCase().trim();

  if (type === 'income') {
    if (c.includes('allowance') || c.includes('pocket')) return 'Monthly Allowance';
    if (c.includes('free') || c.includes('client')) return 'Freelancing';
    if (c.includes('job') || c.includes('part')) return 'Part-time Job';
    if (c.includes('scholar')) return 'Scholarship';
    if (c.includes('gift')) return 'Gifts';
    return 'Other Income';
  }

  if (c.includes('food') || c.includes('dine') || c.includes('canteen') || c.includes('snack') || c.includes('mess') || c.includes('pizza') || c.includes('chai') || c.includes('lunch') || c.includes('dinner') || c.includes('breakfast')) {
    return 'Food and Dining';
  }
  if (c.includes('trans') || c.includes('travel') || c.includes('auto') || c.includes('cab') || c.includes('metro') || c.includes('bus') || c.includes('fuel') || c.includes('uber') || c.includes('ola') || c.includes('rapido')) {
    return 'Transportation';
  }
  if (c.includes('hostel') || c.includes('rent') || c.includes('accommodat') || c.includes('pg') || c.includes('room')) {
    return 'Accommodation and Hostel';
  }
  if (c.includes('edu') || c.includes('book') || c.includes('station') || c.includes('print') || c.includes('xerox') || c.includes('course') || c.includes('pen') || c.includes('notes')) {
    return 'Education and Stationery';
  }
  if (c.includes('shop') || c.includes('cloth') || c.includes('amazon') || c.includes('flipkart') || c.includes('myntra') || c.includes('zara')) {
    return 'Shopping';
  }
  if (c.includes('entertain') || c.includes('movie') || c.includes('game') || c.includes('outing') || c.includes('party')) {
    return 'Entertainment';
  }
  if (c.includes('health') || c.includes('medic') || c.includes('clinic') || c.includes('doctor') || c.includes('pharmacy')) {
    return 'Healthcare';
  }
  if (c.includes('sub') || c.includes('netflix') || c.includes('spotify') || c.includes('prime') || c.includes('recharge') || c.includes('youtube')) {
    return 'Subscriptions';
  }
  if (c.includes('person') || c.includes('salon') || c.includes('hair') || c.includes('groom') || c.includes('spa')) {
    return 'Personal Care';
  }

  return 'Other';
}

export function normalizePaymentMethod(pm?: string): 'UPI' | 'Cash' | 'Card' | 'Net Banking' | 'Other' {
  if (!pm) return 'UPI';
  const p = pm.toLowerCase().trim();
  if (p.includes('cash')) return 'Cash';
  if (p.includes('card') || p.includes('debit') || p.includes('credit')) return 'Card';
  if (p.includes('bank') || p.includes('net') || p.includes('neft') || p.includes('imps')) return 'Net Banking';
  if (p.includes('upi') || p.includes('gpay') || p.includes('phonepe') || p.includes('paytm')) return 'UPI';
  return 'Other';
}

export function generateSmartFallbackResponse(
  userMessage: string,
  context?: Partial<ChatContextPayload> | null
): string {
  const summary = context?.summary || {
    totalBalance: 7800,
    totalIncome: 12000,
    totalExpenses: 4200,
    remainingBudget: 5800,
    monthlyBudgetLimit: 10000,
    savingsRate: 65,
    budgetUtilizationPercent: 42,
    budgetStatus: 'safe' as const,
    highestExpenseCategory: { category: 'Food & Dining', amount: 1850, percentage: 44 },
    dailyAverageSpend: 210,
    totalTransactionsCount: 13,
  };
  const userProfile = context?.userProfile || {
    fullName: 'Student',
    currencySymbol: '₹',
  };
  const symbol = userProfile.currencySymbol || '₹';
  const lower = (userMessage || '').toLowerCase();

  if (lower.includes('where') && (lower.includes('spend') || lower.includes('money') || lower.includes('most'))) {
    return `### 📊 Your Spending Breakdown\n\n` +
      `Your biggest expense category this month is **${summary.highestExpenseCategory.category}**, accounting for **${symbol}${summary.highestExpenseCategory.amount}** (${summary.highestExpenseCategory.percentage}% of your total expenses).\n\n` +
      `Here is a snapshot of your monthly numbers:\n` +
      `* **Total Expenses:** ${symbol}${summary.totalExpenses}\n` +
      `* **Average Daily Burn:** ${symbol}${summary.dailyAverageSpend} per day\n` +
      `* **Remaining Budget:** ${symbol}${summary.remainingBudget} of ${symbol}${summary.monthlyBudgetLimit}\n\n` +
      `💡 *Student Tip:* If you cut down on just 2 food delivery orders or snacks a week, you could easily save ₹500–₹800 this month!`;
  }

  if (lower.includes('save') && (lower.includes('2000') || lower.includes('how can i save') || lower.includes('2,000') || lower.includes('money'))) {
    return `### 💡 Plan to Save ${symbol}2,000 This Month\n\n` +
      `Based on your current daily spending of **${symbol}${summary.dailyAverageSpend}/day**, here is an achievable roadmap for a student:\n\n` +
      `1. **Canteen & Swiggy/Zomato Check:** You've spent **${symbol}${summary.highestExpenseCategory.amount}** on ${summary.highestExpenseCategory.category}. Swapping 2 outside meals per week for hostel mess or cooking can save approx **${symbol}800**.\n` +
      `2. **Transit Pooling:** Opt for metro student passes or shared autos instead of private cabs. Potential savings: **${symbol}400**.\n` +
      `3. **Micro-UPI Pauses:** Minor ₹30–₹50 snacks and chai add up quickly. Setting a daily UPI tap limit can rescue **${symbol}500**.\n` +
      `4. **Student Perks:** Utilize student Spotify/Prime rates and college library book scans instead of brand new copies. Savings: **${symbol}300**.\n\n` +
      `Total estimated monthly savings: **${symbol}2,000**!`;
  }

  if (lower.includes('afford') && (lower.includes('5000') || lower.includes('5,000') || lower.includes('headphone') || lower.includes('buy'))) {
    const canAfford = summary.totalBalance >= 5000;
    const remainingAfter = summary.totalBalance - 5000;
    return `### 🎧 Can You Afford the ${symbol}5,000 Headphones?\n\n` +
      `Let's look at your current numbers:\n` +
      `* **Current Available Balance:** ${symbol}${summary.totalBalance}\n` +
      `* **Remaining Monthly Budget:** ${symbol}${summary.remainingBudget}\n` +
      `* **After Purchase Balance:** ${symbol}${remainingAfter}\n\n` +
      (canAfford && remainingAfter > 1500
        ? `✅ **Yes, technically you have the funds!** However, spending ${symbol}5,000 will consume ${(5000 / summary.monthlyBudgetLimit * 100).toFixed(0)}% of your monthly budget. If they are essential for your coursework or study focus, consider buying during festive student sales or using a 2-month savings goal so your emergency buffer stays intact.`
        : `⚠️ **Not recommended right now.** Spending ${symbol}5,000 would leave you with very little buffer (${symbol}${remainingAfter}) for essential hostel dockets, emergency medicines, or mess fees. Why not create a **Savings Goal** in the app and contribute ${symbol}1,250 over the next 4 weeks?`);
  }

  if (lower.includes('analyze') || lower.includes('overview') || lower.includes('habits')) {
    return `### 🔍 Monthly Expense Analysis\n\n` +
      `* **Income Received:** ${symbol}${summary.totalIncome}\n` +
      `* **Total Spent:** ${symbol}${summary.totalExpenses} (${summary.budgetUtilizationPercent}% of budget used)\n` +
      `* **Savings Rate:** **${summary.savingsRate}%** (Goal for students is 15-20%)\n` +
      `* **Budget Health:** **${summary.budgetStatus.toUpperCase()}** ${summary.budgetStatus === 'safe' ? '🟢 You are on track!' : '🟡 Caution, nearing limits!'}\n\n` +
      `**Top Spending:** Your spending is heavily weighted towards **${summary.highestExpenseCategory.category}** (${symbol}${summary.highestExpenseCategory.amount}). Your daily run-rate is **${symbol}${summary.dailyAverageSpend}**.\n\n` +
      `Keep logging every transaction, especially small UPI scans!`;
  }

  return `### 💡 SpendWise Financial Insight\n\n` +
    `Hello **${userProfile.fullName}**! Looking at your finances:\n\n` +
    `* **Available Balance:** ${symbol}${summary.totalBalance}\n` +
    `* **Remaining Monthly Budget:** ${symbol}${summary.remainingBudget}\n` +
    `* **Top Expense Category:** ${summary.highestExpenseCategory.category} (${symbol}${summary.highestExpenseCategory.amount})\n` +
    `* **Monthly Savings Rate:** ${summary.savingsRate}%\n\n` +
    `Feel free to ask me:\n` +
    `* *"Where am I spending most of my money?"*\n` +
    `* *"How can I save ₹2,000 this month?"*\n` +
    `* *"Can I afford ₹5,000 headphones?"*\n` +
    `* *"Analyze my food expenses"*`;
}
