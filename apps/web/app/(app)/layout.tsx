'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/navigation/BottomNav';
import { PanicProvider, PanicButton } from '@/components/moderation/PanicButton';

// Mock auth hook
const useAuth = () => ({ isAuthenticated: true, balance: 1250 });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, balance } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <PanicProvider>
      <div className="min-h-screen bg-[#080810] text-[#F1F5F9] pb-[80px]">
        {/* Floating Coin Balance */}
        <div className="fixed top-safe pt-4 right-4 z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-[10px] font-bold text-yellow-900 border border-yellow-200">
              V
            </div>
            <span className="font-bold font-['Space_Grotesk'] text-[#F1F5F9]">{balance}</span>
          </div>
        </div>

        {/* Page Transition Wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        <PanicButton />
        <BottomNav />
      </div>
    </PanicProvider>
  );
}
