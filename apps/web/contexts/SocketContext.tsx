'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useToast } from '@/components/ui/Toast';

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({ socket: null, isConnected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (token) {
      const s = getSocket(token);
      setSocketInstance(s);

      s.on('connect', () => setIsConnected(true));
      s.on('disconnect', () => setIsConnected(false));

      // Heartbeat
      const interval = setInterval(() => {
        if (s.connected) s.emit('ping');
      }, 20000);

      // Global Moderation
      s.on('MODERATION_WARNING', (data: { message: string }) => {
        toast.warning(data.message);
      });

      s.on('BANNED', (data: { message: string }) => {
        toast.error(data.message);
        logout();
      });

      s.on('FORCE_LOGOUT', () => {
        toast.info('You have been logged out.');
        logout();
      });

      return () => {
        clearInterval(interval);
        s.off('connect');
        s.off('disconnect');
        s.off('MODERATION_WARNING');
        s.off('BANNED');
        s.off('FORCE_LOGOUT');
      };
    } else {
      disconnectSocket();
      setSocketInstance(null);
      setIsConnected(false);
    }
  }, [token, toast, logout]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
