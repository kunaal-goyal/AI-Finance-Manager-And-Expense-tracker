'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  HelpCircle,
  TrendingDown,
  PiggyBank,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { ChatMessage } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

function AssistantChatView() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');

  const {
    summary,
    transactions,
    budgets,
    goals,
    profile,
    addTransaction,
    deleteTransaction,
    theme,
  } = useApp();
  const sym = profile.currencySymbol;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `👋 Hi **${profile.fullName.split(' ')[0]}**! I'm your **SpendWise AI Assistant**, powered by Google Gemini.\n\n✨ **New Skill Active:** I can now directly **add or delete transactions** for you right here in chat!\n\nI have live access to your current student finances:\n* **Available Balance:** ${sym}${summary.totalBalance.toLocaleString()}\n* **Monthly Spent:** ${sym}${summary.totalExpenses.toLocaleString()} (of ${sym}${summary.monthlyBudgetLimit.toLocaleString()} limit)\n* **Top Spend Category:** ${summary.highestExpenseCategory.category}\n* **Active Savings Goals:** ${goals.length} goals\n\nTry telling me: *"Add ₹180 for canteen lunch via UPI"* or ask any question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOfficialGemini, setIsOfficialGemini] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle URL query parameter pre-fill if present
  useEffect(() => {
    if (queryParam && messages.length === 1) {
      handleSendMessage(queryParam);
    }
  }, [queryParam]);

  const quickPrompts = [
    'Add ₹180 for canteen lunch via UPI',
    'Add ₹2,500 freelance payment received today',
    'Where am I spending most of my money?',
    `How can I save ${sym}2,000 this month?`,
    'Delete my latest transaction',
    'Which category is consuming most of my budget?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build financial context payload
      const contextPayload = {
        summary,
        recentTransactions: transactions.slice(0, 15),
        budgets,
        savingsGoals: goals,
        userProfile: profile,
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
          context: contextPayload,
        }),
      });

      let data: any = {};
      const responseText = await res.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('Server returned an invalid response. Please try again in a moment.');
      }

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      setIsOfficialGemini(data.isOfficialGemini);

      // Execute AI action on local & Supabase ledger
      if (data.action) {
        if (data.action.type === 'ADD_TRANSACTION' && data.action.data) {
          await addTransaction(data.action.data);
        } else if (data.action.type === 'DELETE_TRANSACTION' && data.action.data?.transactionId) {
          await deleteTransaction(data.action.data.transactionId);
        }
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I was unable to analyze that. Please try rephrasing your question.',
        action: data.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${err.message || 'Error communicating with AI service. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMarkdown = (content: string) => {
    // Process markdown headers, bold, bullet points, numbered lists
    return content
      .split('\n')
      .map((line, idx) => {
        // Headers
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-white text-base mt-2 mb-1">
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-extrabold text-white text-lg mt-3 mb-1">
              {line.replace('## ', '')}
            </h3>
          );
        }
        // Bullet points
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const formatted = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
          return (
            <li
              key={idx}
              className="ml-4 list-disc text-slate-200 my-0.5 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          );
        }
        // Numbered list
        if (/^\d+\.\s/.test(line)) {
          const formatted = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
          return (
            <li
              key={idx}
              className="ml-4 list-decimal text-slate-200 my-0.5 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          );
        }
        // Standard line
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        return (
          <p
            key={idx}
            className="text-slate-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      });
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Header & Injected Live Context Bar */}
      <div className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border shrink-0 transition-all',
        theme === 'light'
          ? 'bg-purple-50/70 border-purple-200 shadow-sm'
          : 'bg-black border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.04)]'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg',
            theme === 'light' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.35)]'
          )}>
            <Sparkles className={cn('w-5 h-5', theme === 'light' ? 'text-white' : 'text-black')} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              SpendWise AI Assistant
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full font-semibold border',
                theme === 'light' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-white/15 text-white border-white/30'
              )}>
                Google Gemini
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Personalized advice based on your live college transactions & allowance
            </p>
          </div>
        </div>

        {/* Live Injected Context Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className={cn('px-2.5 py-1 rounded-lg border', theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-black border-white/10 text-white')}>
            Balance: <strong className="text-emerald-400">{formatCurrency(summary.totalBalance, sym)}</strong>
          </span>
          <span className={cn('px-2.5 py-1 rounded-lg border', theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-black border-white/10 text-white')}>
            Spent: <strong className="text-rose-400">{formatCurrency(summary.totalExpenses, sym)}</strong>
          </span>
          <span className={cn('px-2.5 py-1 rounded-lg border', theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-black border-white/10 text-white')}>
            Top: <strong className={theme === 'light' ? 'text-purple-700' : 'text-white'}>{summary.highestExpenseCategory.category}</strong>
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black border-white/10">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border ${
                  isUser
                    ? 'bg-white text-black border-white font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : 'bg-zinc-950 text-white border-white/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-black" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm shadow-md space-y-1.5 ${
                  isUser
                    ? 'bg-white text-black font-medium rounded-tr-none shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                    : 'bg-zinc-950 border border-white/15 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="space-y-1">{formatMarkdown(msg.content)}</div>

                {/* AI Action Execution Card */}
                {msg.action && msg.action.type === 'ADD_TRANSACTION' && msg.action.data && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                        +
                      </span>
                      <div>
                        <p className="font-semibold text-emerald-200">{msg.action.data.title}</p>
                        <p className="text-[10px] text-emerald-400/80">
                          {msg.action.data.category} • {msg.action.data.paymentMethod} • {msg.action.data.date}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-300 text-sm whitespace-nowrap pl-2">
                      {formatCurrency(msg.action.data.amount, sym)}
                    </span>
                  </div>
                )}

                {msg.action && msg.action.type === 'DELETE_TRANSACTION' && msg.action.data && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                        🗑️
                      </span>
                      <div>
                        <p className="font-semibold text-rose-200">Removed from Ledger</p>
                        <p className="text-[10px] text-rose-400/80">
                          {msg.action.data.title || 'Transaction deleted'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Deleted
                    </span>
                  </div>
                )}

                <div
                  className={`text-[10px] text-right pt-1 ${
                    isUser ? 'text-purple-200' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analyzing financial records with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Suggested Quick Prompt Chips */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap pl-1">
          Quick queries:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className={cn(
              'text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl border transition-all shrink-0 active:scale-95 disabled:opacity-50',
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white border-white/10 hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]'
            )}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className={cn(
        'shrink-0 p-2 rounded-2xl border flex items-end gap-2',
        theme === 'light' ? 'bg-white border-slate-200' : 'bg-black border-white/15 shadow-[0_0_25px_rgba(255,255,255,0.05)]'
      )}>
        <textarea
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SpendWise AI about your expenses, saving tips, or budgeting..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-zinc-500 focus:outline-none resize-none max-h-32"
        />

        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          variant="gradient"
          size="sm"
          className="h-10 px-4 shrink-0 rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Educational & Disclaimer Notice */}
      <div className="shrink-0 text-center text-[11px] text-slate-400 pb-1">
        SpendWise AI provides general student financial education & budgeting assistance. Not professional investment, tax, or legal advice.
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-purple-400" />
          Loading AI Assistant...
        </div>
      }
    >
      <AssistantChatView />
    </Suspense>
  );
}
