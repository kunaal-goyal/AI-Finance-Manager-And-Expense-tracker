'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, Lock, Mail, User, Building } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { StudentType } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, updateProfile } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [studentType, setStudentType] = useState<StudentType>('hosteler');
  const [password, setPassword] = useState('');
  const [monthlyAllowance, setMonthlyAllowance] = useState('8000');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await register(email, password, fullName);
      if (res.success) {
        await updateProfile({
          fullName,
          email,
          collegeName: collegeName || 'College Student',
          studentType,
          monthlyAllowance: Number(monthlyAllowance) || 8000,
          monthlyBudgetLimit: Math.round((Number(monthlyAllowance) || 8000) * 0.85),
        });
        router.push('/dashboard');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              SpendWise <span className="text-purple-400">AI</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create Your Student Account
          </h2>
          <p className="text-xs text-slate-400">
            Set up your student profile and take control of your college finances
          </p>
        </div>

        <div className="rounded-2xl bg-[#0e152a]/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                placeholder="e.g. Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Student Email"
                type="email"
                placeholder="e.g. name@college.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="College / Institute"
                placeholder="e.g. JECRC, IIT, BITS"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                leftIcon={<Building className="w-4 h-4" />}
              />

              <Select
                label="Living Arrangement"
                value={studentType}
                onChange={(e) => setStudentType(e.target.value as StudentType)}
                options={[
                  { value: 'hosteler', label: 'Hosteler (Campus hostel)' },
                  { value: 'day_scholar', label: 'Day Scholar (From home)' },
                  { value: 'independent', label: 'Flat / PG Independent' },
                  { value: 'part_time_job', label: 'Working Student' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Monthly Allowance (₹)"
                type="number"
                placeholder="8000"
                value={monthlyAllowance}
                onChange={(e) => setMonthlyAllowance(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full py-2.5"
              isLoading={isLoading}
            >
              Complete Registration & Go to Dashboard
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
