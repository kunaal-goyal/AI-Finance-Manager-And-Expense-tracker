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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;500;600;700;800&family=Tangerine:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#070b16] text-slate-100 antialiased selection:bg-purple-600 selection:text-white font-sans">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
