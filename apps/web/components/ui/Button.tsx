'use client'
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cyan' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = `inline-flex items-center justify-center gap-2 transition-all ${disabled || loading ? 'btn-disabled' : ''}`;
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm rounded-lg',
    md: 'py-3 px-6 text-base rounded-xl',
    lg: 'py-4 px-8 text-lg rounded-2xl'
  };

  const variantClasses = {
    primary: 'btn-primary',
    cyan: 'btn-cyan',
    danger: 'btn-danger',
    ghost: 'btn-ghost'
  };

  return (
    <button
      className={`${baseClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};
