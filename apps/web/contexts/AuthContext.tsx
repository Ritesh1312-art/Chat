'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser, getToken, setToken, removeToken, fetchCurrentUser } from '@/lib/auth';
import { disconnectSocket } from '@/lib/socket';

interface AuthContextProps {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (idToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        const u = await fetchCurrentUser(storedToken);
        if (u) {
          setUser(u);
          setTokenState(storedToken);
        } else {
          removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (idToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.token);
      setTokenState(data.token);
      const rawUser = data.user || data;
      setUser(rawUser ? {
        ...rawUser,
        name: rawUser.displayName || rawUser.name || 'User',
        phone: rawUser.phoneNumber || rawUser.phone || '',
        coins: rawUser.walletBalance ?? rawUser.coins ?? 0,
      } : null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (partial: Partial<IUser>) => {
    setUser(prev => prev ? { ...prev, ...partial } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
