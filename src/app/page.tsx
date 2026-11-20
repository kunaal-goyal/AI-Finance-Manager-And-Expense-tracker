'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PieChart,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Coins,
  Bot,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const features = [
    {
      icon: Receipt,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Daily Expense & Income Tracking',
      description:
        'Log canteen snacks, hostel mess fees, textbook photocopies, and UPI transfers in seconds with smart categorization.',
    },
    {
      icon: Sparkles,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: 'Gemini AI Financial Assistant',
      description:
        'Ask real questions like "Can I afford ₹5,000 headphones?" or "Where am I spending most?" and get honest, practical student advice.',
    },
    {
      icon: PieChart,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'Smart Category Budgets',
      description:
        'Set hard spending ceilings on dining, transit and shopping. Get visual Green, Yellow and Red alerts before you run out of cash.',
    },
    {
      icon: PiggyBank,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Milestone Savings Goals',
      description:
        'Save systematically for a coding laptop, end-sem Goa trip or an emergency fund with visual progress bars and confetti celebrations.',
    },
    {
      icon: TrendingUp,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Interactive Analytics & Trends',
      description:
        'Visual charts showing income vs expenses, category distributions, daily burn rates, and savings momentum over time.',
    },
    {
      icon: Smartphone,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: 'UPI & Cash Aware',
      description:
        'Built specifically for the student economy where 90% of micro-payments happen through GPay, PhonePe, and Paytm taps.',
    },
  ];

  const studentTypes = [
    {
      title: 'Hostel Students',
      icon: '🏨',
      desc: 'Track mess bills, late night Swiggy orders, and shared room amenities without awkward bill splitting.',
    },
    {
      title: 'Day Scholars',
      icon: '🚌',
      desc: 'Keep tabs on metro cards, fuel, bus passes, and campus canteen spending during long transit days.',
    },
    {
      title: 'Independent PG / Flats',
      icon: '🏠',
      desc: 'Manage electricity shares, groceries, Wi-Fi bills, and monthly rent deposits in one clean ledger.',
    },
    {
      title: 'Freelancers & Earners',
      icon: '💻',
      desc: 'Balance freelance web gigs, part-time earnings, and scholarships alongside regular pocket money.',
    },
  ];

  const faqs = [
    {
      q: 'How does the Gemini AI Assistant help me save money?',
      a: 'The assistant securely reads your recorded transactions and active budget limits. When you ask questions like "How can I save ₹2,000 this month?", it analyzes where your money is actually leaking (like excess food delivery or cab rides) and gives practical, student-tailored alternatives.',
    },
    {
      q: 'Is SpendWise AI completely free for college students?',
      a: 'Yes, SpendWise AI is 100% free for students. You can track unlimited expenses, set custom budgets, and create multiple savings goals.',
    },
    {
      q: 'Does it support Indian Rupees (₹) and UPI payments?',
      a: 'Absolutely. Indian Rupee (₹) is the default currency with support for Indian numbering formatting (lakhs/crores). You can categorize transactions by UPI, Cash, Debit Card, or Net Banking.',
    },
    {
      q: 'Can I test the platform without registering?',
      a: 'Yes! We have a one-click "Live Demo Mode" that loads realistic student transactions (Aarav Sharma at JECRC University) so you can test all features, charts, and the AI assistant immediately.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-white selection:text-black">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1.5">
              SpendWise <span className="text-black bg-white font-bold text-xs px-1.5 py-0.5 rounded-md border border-white shadow-[0_0_10px_rgba(255,255,255,0.6)]">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#students" className="hover:text-white transition-colors">For Students</a>
            <a href="#ai-assistant" className="hover:text-white transition-colors">Gemini AI</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Built Specifically for College Students • Powered by Google Gemini</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Stop Wondering Where Your{' '}
            <span className="text-gradient">Monthly Allowance</span> Went.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SpendWise AI combines seamless UPI & cash expense logging, category budgets, milestone savings goals, and an intelligent 24/7 financial advisor powered by Google Gemini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="w-full text-sm sm:text-base px-7 py-3.5" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Try Live Student Demo
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full text-sm sm:text-base px-7 py-3.5">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Defaults to Indian Rupees (₹)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> UPI & Cash Logging
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supabase RLS Data Isolation
            </span>
          </div>
        </div>

        {/* Interactive App Mockup Preview */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
          <div className="rounded-2xl border border-white/15 bg-black p-3 sm:p-5 shadow-[0_0_50px_rgba(255,255,255,0.06)] backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400 px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">spendwise.ai/dashboard</span>
              </div>
              <span className="text-white font-semibold">Live Sandbox Preview</span>
            </div>

            {/* Simulated mini dashboard */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <p className="text-[11px] text-zinc-400">Total Available Balance</p>
                <p className="text-xl font-extrabold text-emerald-400">₹6,850</p>
                <p className="text-[10px] text-zinc-500">+₹2,500 freelance added</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <p className="text-[11px] text-zinc-400">Monthly Spending</p>
                <p className="text-xl font-extrabold text-white">₹4,650</p>
                <p className="text-[10px] text-amber-400">62% of ₹7,500 monthly limit</p>
              </div>
              <div className="p-4 rounded-xl bg-black border border-white/15 space-y-1">
                <p className="text-[11px] text-white font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-white" /> Gemini Observation
                </p>
                <p className="text-xs text-zinc-200">
                  "Food consumes 45% of your outflow. Switching 2 Swiggy orders to hostel mess saves ₹600/mo."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Complete Feature Suite
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything A Student Needs To Master Their Finances
            </h3>
            <p className="text-xs sm:text-base text-zinc-400">
              No complicated corporate accounting jargon. Designed exclusively for student lifestyles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-zinc-950 border border-white/10 p-6 space-y-3 hover:border-white/30 transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${f.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{f.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Students Section */}
      <section id="students" className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Tailored For Your Living Setup
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Whether You Live In A Hostel, PG Or Home
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentTypes.map((st, i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-950 border border-white/10 p-6 space-y-3"
              >
                <div className="text-3xl">{st.icon}</div>
                <h4 className="text-base font-bold text-white">{st.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gemini AI Spotlight */}
      <section id="ai-assistant" className="py-20 border-t border-white/10 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-white/15 bg-zinc-950 p-8 sm:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.06)]">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold">
                <Bot className="w-4 h-4 text-white" />
                <span>Google Gemini 1.5 / 2.0 Integration</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                An AI That Knows Your Actual Bank & Allowance Reality
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Most generic AI chatbots know nothing about your finances. SpendWise AI safely injects your live category spending, budget caps, and savings progress into structured Gemini prompts so you receive tailored, hyper-relevant answers.
              </p>
              <div className="pt-2">
                <Link href="/assistant">
                  <Button variant="gradient" size="md" rightIcon={<Sparkles className="w-4 h-4" />}>
                    Chat with SpendWise AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Got Questions?
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl bg-zinc-950 border border-white/10 p-5 space-y-2"
              >
                <h4 className="font-bold text-white text-sm sm:text-base">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 border-t border-white/10 text-center bg-black">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready To Master Your Student Allowance?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Join thousands of college students keeping their budgets under control with SpendWise AI.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="gradient" size="lg" className="px-8 py-3.5">
                Launch Live App Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-bold text-white">SpendWise AI</span>
            <span>— Student Expense Management Platform</span>
          </div>
          <div>
            Built with Next.js, TypeScript, Tailwind CSS, Supabase & Google Gemini API.
          </div>
        </div>
      </footer>
    </div>
  );
}
