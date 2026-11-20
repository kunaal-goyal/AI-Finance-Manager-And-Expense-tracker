import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-white hover:bg-slate-200 text-black font-semibold shadow-lg shadow-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] focus:ring-white border border-white',
      gradient:
        'bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-100 hover:to-white text-black font-semibold shadow-lg shadow-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.45)] focus:ring-white border border-white/80',
      secondary:
        'bg-zinc-900 hover:bg-zinc-800 text-white border border-white/15 focus:ring-white/40',
      outline:
        'bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] focus:ring-white',
      ghost:
        'bg-transparent hover:bg-white/10 text-zinc-300 hover:text-white focus:ring-white',
      danger:
        'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-500/40 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-5 py-3 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
