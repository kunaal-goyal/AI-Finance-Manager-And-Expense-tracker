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
import { formatCurrency } from '@/lib/utils';

function AssistantChatView() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');

  const {
    summary,
    transactions,
    budgets,
    goals,
    profile,
  } = useApp();
  const sym = profile.currencySymbol;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `👋 Hi **${profile.fullName.split(' ')[0]}**! I'm your **SpendWise AI Assistant**, powered by Google Gemini.\n\nI have live access to your current student finances:\n* **Available Balance:** ${sym}${summary.totalBalance.toLocaleString()}\n* **Monthly Spent:** ${sym}${summary.totalExpenses.toLocaleString()} (of ${sym}${summary.monthlyBudgetLimit.toLocaleString()} limit)\n* **Top Spend Category:** ${summary.highestExpenseCategory.category}\n* **Active Savings Goals:** ${goals.length} goals\n\nHow can I help you stretch your allowance or optimize your budget today?`,
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
    'Where am I spending most of my money?',
    `How can I save ${sym}2,000 this month?`,
    `Can I afford to buy a ${sym}5,000 pair of headphones?`,
    'Which category is consuming most of my budget?',
    'Analyze my expenses this month.',
    'Give me a plan to reduce my food expenses.',
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setIsOfficialGemini(data.isOfficialGemini);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I was unable to analyze that. Please try rephrasing your question.',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              SpendWise AI Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                Google Gemini
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized advice based on your live college transactions & allowance
            </p>
          </div>
        </div>

        {/* Live Injected Context Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Balance: <strong className="text-emerald-400">{formatCurrency(summary.totalBalance, sym)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Spent: <strong className="text-rose-400">{formatCurrency(summary.totalExpenses, sym)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Top: <strong className="text-purple-300">{summary.highestExpenseCategory.category}</strong>
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0a0f1e]/80 border-slate-800/80">
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
                    ? 'bg-purple-600 text-white border-purple-500/40'
                    : 'bg-indigo-950/80 text-cyan-300 border-cyan-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm shadow-md space-y-1.5 ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="space-y-1">{formatMarkdown(msg.content)}</div>
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
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap pl-1">
          Quick queries:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 transition-all shrink-0 active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="shrink-0 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-end gap-2">
        <textarea
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SpendWise AI about your expenses, saving tips, or budgeting..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none max-h-32"
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
