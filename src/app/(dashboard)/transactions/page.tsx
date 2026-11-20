'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Smartphone,
  Banknote,
  CreditCard,
  Building,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { Transaction, PaymentMethod } from '@/types';
import { cn, formatCurrency, formatDate, getCategoryColor, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/utils';
import { TransactionModal } from '@/components/transactions/TransactionModal';

export default function TransactionsPage() {
  const { transactions, deleteTransaction, profile, theme } = useApp();
  const sym = profile.currencySymbol;

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL'); // 'ALL' | 'THIS_MONTH' | 'LAST_30'
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [hoveredTxId, setHoveredTxId] = useState<string | null>(null);

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesCategory = tx.category.toLowerCase().includes(query);
        const matchesDesc = tx.description ? tx.description.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
      }

      // Type filter
      if (selectedType !== 'ALL' && tx.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) {
        return false;
      }

      // Date filter
      if (dateFilter === 'THIS_MONTH') {
        const now = new Date();
        const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!tx.date.startsWith(monthPrefix)) return false;
      } else if (dateFilter === 'LAST_30') {
        const txTime = new Date(tx.date).getTime();
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        if (txTime < thirtyDaysAgo) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, dateFilter, sortBy]);

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTransaction(id);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Currency', 'Payment Method', 'Description'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.date,
      tx.type,
      `"${tx.category}"`,
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.amount,
      profile.currency,
      tx.paymentMethod,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allCategories = ['ALL', ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Card':
        return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
      case 'Net Banking':
        return <Building className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Receipt className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Transactions & Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Record, inspect and categorize every college expense, hostel fee, and allowance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            onClick={handleAddNew}
            variant="gradient"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Record Entry
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by title, description or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Type Filter */}
          <div>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Types (Income & Expense)' },
                { value: 'expense', label: 'Expenses Only' },
                { value: 'income', label: 'Income / Allowance Only' },
              ]}
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={allCategories.map((c) => ({
                value: c,
                label: c === 'ALL' ? 'All Categories' : c,
              }))}
            />
          </div>

          {/* Sort By */}
          <div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'date-desc', label: 'Newest First' },
                { value: 'date-asc', label: 'Oldest First' },
                { value: 'amount-desc', label: 'Highest Amount' },
                { value: 'amount-asc', label: 'Lowest Amount' },
              ]}
            />
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Date Range:</span>
            <button
              onClick={() => setDateFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                dateFilter === 'ALL'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('THIS_MONTH')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                dateFilter === 'THIS_MONTH'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter('LAST_30')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                dateFilter === 'LAST_30'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredTransactions.length}</strong> of{' '}
            {transactions.length} records
          </span>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="p-0 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Receipt className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium">No matching transactions found.</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or record a new transaction.
            </p>
            <Button onClick={handleAddNew} variant="secondary" size="sm">
              Add New Transaction
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">Transaction</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className="divide-y divide-slate-800/60 text-xs sm:text-sm"
                onMouseLeave={() => setHoveredTxId(null)}
              >
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catColor = getCategoryColor(tx.category);
                  const isHovered = hoveredTxId === tx.id;
                  const isOther = hoveredTxId !== null && !isHovered;

                  return (
                    <tr
                      key={tx.id}
                      onMouseEnter={() => setHoveredTxId(tx.id)}
                      className={cn(
                        'transition-all duration-200 transform-gpu group select-none',
                        isHovered &&
                          (theme === 'light'
                            ? 'scale-[1.015] bg-purple-50/90 border-y border-purple-200 shadow-[0_4px_16px_rgba(147,51,234,0.12)] text-slate-900 relative z-10 font-medium'
                            : 'scale-[1.015] bg-white/10 border-y border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)] relative z-10'),
                        isOther && 'opacity-50 scale-[0.99] z-0',
                        !isHovered && !isOther && (theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/[0.04]')
                      )}
                    >
                      {/* Title & Description */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="font-semibold text-white truncate">
                              {tx.title}
                            </p>
                            {tx.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium inline-block whitespace-nowrap ${catColor.bg} ${catColor.text} ${catColor.border}`}
                        >
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                          {getPaymentIcon(tx.paymentMethod)}
                          {tx.paymentMethod}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            isIncome ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount, sym)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Transaction"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id, tx.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit/Add Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
}
