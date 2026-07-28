'use client'
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{
      success: (msg) => addToast('success', msg),
      error: (msg) => addToast('error', msg),
      warning: (msg) => addToast('warning', msg),
      info: (msg) => addToast('info', msg)
    }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`glass-strong p-4 rounded-xl flex items-center gap-3 animate-[slide-up_0.3s_ease-out] pointer-events-auto
            ${toast.type === 'success' ? 'border-[var(--color-success)] neon-text-success' : ''}
            ${toast.type === 'error' ? 'border-[var(--color-danger)] text-red-400' : ''}
            ${toast.type === 'warning' ? 'border-yellow-500 text-yellow-400' : ''}
            ${toast.type === 'info' ? 'border-[var(--color-cyan-neon)] neon-text-cyan' : ''}
          `}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
