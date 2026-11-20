import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'SpendWise AI — Smart Student Expense & Budget Management',
  description:
    'An AI-powered financial management platform built specifically for college students. Track daily expenses, stay inside your monthly allowance, hit savings goals, and get 24/7 intelligent advice from Google Gemini.',
  keywords: [
    'student expense tracker',
    'college budget',
    'spendwise ai',
    'gemini financial assistant',
    'hostel budget manager',
    'student savings goals',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b16] text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
