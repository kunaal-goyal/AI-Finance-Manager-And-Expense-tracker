# SpendWise AI 🎓💸
### Intelligent Student Expense & Budget Management SaaS Platform

> Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL & Auth**, **Google Gemini AI**, and **Recharts**.

SpendWise AI is a complete, production-grade financial management platform tailored specifically for college and university students. It solves the classic student problem of "Where did my allowance go?" by combining daily expense logging, UPI/cash microtransaction tracking, category budgets with visual warnings, milestone savings goals, and an intelligent financial advisor powered by Google's Gemini models.

---

## 🌟 Key Features

### 1. 📊 Smart Student Dashboard
- **Real-Time Financial Overview**: Live calculations of Total Available Balance, Monthly Expenses, Monthly Income / Allowance, and Remaining Budget.
- **Budget Health & Utilization**: Visual progress indicators with dynamic **Green (<75%)**, **Yellow (75%–99%)**, and **Red (100%+)** status alerts.
- **Spending Velocity**: Area chart tracking daily spending run-rate and outflow.
- **Category Breakdown**: Interactive donut chart with percentage distributions and category leaderboards.
- **Recent Activity**: Quick overview of recent transactions with payment method icons (UPI, Cash, Card, Net Banking).
- **AI-Powered Observations**: Dynamic financial recommendations based on actual spending patterns.

### 2. 🧾 Expense & Income Management (Ledger)
- **Comprehensive Entry Form**: Title, amount, date, description, category, and payment method.
- **Student Categories**:
  - *Expenses*: Food and Dining, Transportation, Accommodation and Hostel, Education and Stationery, Shopping, Entertainment, Healthcare, Subscriptions, Personal Care, Other.
  - *Income*: Monthly Allowance, Part-time Job, Freelancing, Scholarship, Gifts, Other Income.
- **Smart Filtering & Search**: Instant full-text search, filter by expense/income, filter by category, date range filters (All Time, This Month, Last 30 Days), and sorting (newest, oldest, highest, lowest).
- **Data Export**: 1-click export of filtered records to clean CSV.
- **Full CRUD**: Add, edit, and delete transactions with instant dashboard recalculation.

### 3. 🎯 Monthly & Category Budgets
- **Overall Monthly Spending Cap**: Edit your monthly ceiling (e.g., ₹7,500).
- **Category-Specific Limits**: Set custom caps on dining, entertainment, shopping, and hostel bills.
- **Color-Coded Warning System**:
  - 🟢 **Safe**: Under 75% limit consumed.
  - 🟡 **Warning**: 75% – 99% approaching limit.
  - 🔴 **Danger**: 100%+ limit breached.
- **Over-Budget Warnings**: Highlights high-risk categories before end-of-month broke days.

### 4. 🐷 Milestone Savings Goals
- **Student Targets**: Create goals for laptops (e.g. M2 MacBook for ML), semester roadtrips (e.g. Goa trip with roommates), or emergency hostel buffers.
- **Visual Progress Bars**: Displays percentage completed, remaining amount needed, and target date.
- **Deposit / Contribution Logging**: Add savings toward any goal with notes (e.g. "Saved from Diwali gift" or "Freelance gig").
- **Celebration Mode**: Triggers animated confetti celebration upon reaching 100% goal completion.

### 5. 📈 Financial Analytics & Trends
- **Income vs. Expenses Flow**: Interactive dual-bar comparison chart.
- **Category Frequency & Averages**: Average spend per transaction per category.
- **Payment Method Distribution**: UPI vs. Cash vs. Card pie chart.
- **Student Metrics**: Savings rate (`((Income - Expenses) / Income) * 100`) and projected monthly burn rate.

### 6. 🤖 SpendWise AI Assistant (Google Gemini)
- **Official Google Gemini API Integration**: Secure server-side endpoint at `/api/ai/chat`.
- **Financial Context Injection**: Injects the student's real financial status (balance, expenses, category breakdown, budget utilization, and savings goals) into the system prompt.
- **Strict Guardrails**: Never hallucinates fake transactions, never claims to modify records directly, maintains student-appropriate advice.
- **Pre-Engineered Quick Prompts**:
  - *"Where am I spending most of my money?"*
  - *"How can I save ₹2,000 this month?"*
  - *"Can I afford to buy a ₹5,000 pair of headphones?"*
  - *"Which category is consuming most of my budget?"*
  - *"Analyze my expenses this month."*
  - *"Give me a plan to reduce my food expenses."*

### 7. ⚙️ Profile & Customization
- **Student Classification**: Hosteler, Day Scholar, Independent Flat/PG, or Working Student.
- **Currency Flexibility**: Defaults to Indian Rupee (`₹ INR`) with Indian numbering system formatting; supports `USD ($)`, `EUR (€)`, `GBP (£)`, and `AED`.
- **Data Management**: 1-click reload of sample student dataset (Aarav Sharma at JECRC University), 1-click JSON full backup export, and clear data options.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (Dark navy `#070b16` & purple visual theme) |
| **Icons** | Lucide React |
| **Data Visualizations** | Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart) |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) + LocalStorage Sandbox Fallback |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) |
| **Effects** | Canvas Confetti |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.17.0 or later, v20 recommended)
- npm or pnpm or bun

### 1. Clone the repository
```bash
git clone https://github.com/your-username/spendwise-ai.git
cd spendwise-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API Key (from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your-google-gemini-api-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note on Zero-Config Sandbox Mode:** If you do not have Supabase credentials yet, the application automatically defaults to its built-in local sandbox mode! All features, transactions, budgets, goals, and AI financial queries will work seamlessly right out of the box.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup & Schema

1. Go to [database.new](https://database.new) and create a new Supabase project.
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Copy and run the entire contents of `supabase/schema.sql`.

### The SQL Schema Configures:
- `profiles`: User information, living arrangement, allowance, currency, and cycle start day.
- `transactions`: All income and expense entries with type, category, date, and payment method.
- `budgets`: Category-specific monthly limits (`month` format: `YYYY-MM`).
- `savings_goals`: Target savings milestones, target amounts, and current progress.
- `savings_contributions`: Individual deposits into savings goals.
- `chat_messages`: Optional chat history storage.
- **Row Level Security (RLS)**: Strictly applied to every table with policies verifying `auth.uid() = user_id`, guaranteeing complete user data isolation.
- **Auto-Profile Trigger**: Automatically creates a `profiles` record whenever a new user signs up via Supabase Auth.

---

## 🧠 Google Gemini AI Integration Architecture

The AI chatbot uses a secure backend API route (`/api/ai/chat`):

```
[Browser Client] 
     │
     │ 1. Sends user message + recent client transactions/summary
     ▼
[Next.js API Route: /api/ai/chat]
     │
     │ 2. Extracts user financial context:
     │    - Balance, monthly income, expenses
     │    - Category breakdown with percentages
     │    - Budget utilization & warnings
     │    - Top recent transactions
     │ 3. Injects context into Structured System Prompt
     │ 4. Calls Google Gemini Model (gemini-1.5-flash) with GEMINI_API_KEY
     ▼
[Google Gemini API]
     │
     │ 5. Returns tailored financial advice in Markdown
     ▼
[SpendWise AI Chat Interface]
```

### Security Highlights:
- The `GEMINI_API_KEY` is **never** sent to the client or exposed in frontend bundles.
- Only the authenticated user's financial figures are injected into their prompt.
- The assistant is strictly instructed not to hallucinate transactions and to provide student-tailored financial education, not professional investment or tax advice.

---

## ☁️ Deployment Instructions (Vercel)

SpendWise AI is optimized for 1-click deployment on Vercel:

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SpendWise AI student expense platform"
   git branch -M main
   git remote add origin https://github.com/your-username/spendwise-ai.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `spendwise-ai` GitHub repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
5. Click **Deploy**. Vercel will build the project and supply your live production URL!

---

## 📂 Project Directory Structure

```
spendwise-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx         # Sign in & instant demo access
│   │   │   └── register/page.tsx      # Student registration & living setup
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx             # Sidebar, Header, MobileNav, Quick Add Modal
│   │   │   ├── dashboard/page.tsx     # Main Financial Dashboard
│   │   │   ├── transactions/page.tsx  # Transaction Ledger with search & CSV export
│   │   │   ├── budget/page.tsx        # Budget Management with Green/Yellow/Red alerts
│   │   │   ├── goals/page.tsx         # Savings Goals with progress & confetti
│   │   │   ├── analytics/page.tsx     # Recharts Financial Trends & Distributions
│   │   │   ├── assistant/page.tsx     # Gemini AI Financial Advisor chat
│   │   │   └── settings/page.tsx      # Profile, currency (INR default) & backup
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── chat/route.ts      # Secure Google Gemini API endpoint
│   │   ├── globals.css                # Dark navy theme & glassmorphic styling
│   │   ├── layout.tsx                 # Root layout with AppProvider
│   │   └── page.tsx                   # High-converting Landing Page
│   ├── components/
│   │   ├── ui/                        # Button, Card, Modal, Input, Select, Badge, StatCard
│   │   ├── dashboard/                 # BalanceCards, BudgetUtilization, Charts, AI Widgets
│   │   ├── transactions/              # TransactionModal
│   │   └── layout/                    # Sidebar, Header, MobileNav
│   ├── context/
│   │   └── AppContext.tsx             # Global state provider & dynamic recalculations
│   ├── lib/
│   │   ├── supabase/                  # Browser & Server Supabase clients
│   │   ├── calculations.ts            # Dynamic calculations (balance, rate, burn rate)
│   │   ├── gemini.ts                  # Gemini prompt builder & student inference engine
│   │   ├── initialData.ts             # Realistic college student initial dataset
│   │   └── utils.ts                   # Formatting (INR ₹), category colors & helpers
│   └── types/
│       └── index.ts                   # TypeScript interfaces
├── supabase/
│   └── schema.sql                     # Complete PostgreSQL schema & RLS policies
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎓 About

Developed as a Final Project for **Prompt Engineering / Full-Stack AI Application Development**.
Created for students everywhere striving to take charge of their pocket money and financial future!
