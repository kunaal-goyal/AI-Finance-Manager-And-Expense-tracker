'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Transaction, TransactionType, AllCategory, PaymentMethod } from '@/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
}: TransactionModalProps) {
  const { addTransaction, updateTransaction, profile } = useApp();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Food and Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
      setPaymentMethod(transactionToEdit.paymentMethod);
      setDescription(transactionToEdit.description || '');
    } else {
      // Reset form
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('Food and Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setDescription('');
    }
    setErrors({});
  }, [transactionToEdit, isOpen]);

  // When type changes, update default category
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('Food and Dining');
    } else {
      setCategory('Monthly Allowance');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title or purpose is required';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, {
          title: title.trim(),
          amount: Number(amount),
          type,
          category: category as AllCategory,
          date,
          paymentMethod,
          description: description.trim() || undefined,
        });
      } else {
        await addTransaction({
          title: title.trim(),
          amount: Number(amount),
          type,
          category: category as AllCategory,
          date,
          paymentMethod,
          description: description.trim() || undefined,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Record New Transaction'}
      description="Track student expenses, hostel bills, mess dues, or received allowance"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: Expense vs Income */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            💰 Income / Allowance
          </button>
        </div>

        {/* Title Input */}
        <Input
          label="Transaction Title"
          placeholder={type === 'expense' ? 'e.g. Canteen Lunch, Xerox Notes, Metro Recharge' : 'e.g. Monthly Allowance, Freelance Gig'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        {/* Amount & Date in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={`Amount (${profile.currencySymbol})`}
            type="number"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />

          <Input
            label="Transaction Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
        </div>

        {/* Category & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            options={[
              { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Card', label: 'Debit / Credit Card' },
              { value: 'Net Banking', label: 'Net Banking' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>

        {/* Description / Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Notes / Description (Optional)
          </label>
          <textarea
            rows={2}
            className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2 text-sm text-slate-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40"
            placeholder="e.g. Split with Rohan, paid at North Gate canteen"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" isLoading={isSubmitting}>
            {transactionToEdit ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
