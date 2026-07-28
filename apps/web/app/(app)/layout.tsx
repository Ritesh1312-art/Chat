'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BottomNav from '@/components/navigation/BottomNav';
import { PanicProvider, PanicButton } from '@/components/moderation/PanicButton';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const balance = user?.coins ?? 100;
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
        <Link href="/wallet" className="fixed top-4 right-4 z-40 transition-transform hover:scale-105 active:scale-95">
          <div className="bg-[#080810]/80 backdrop-blur-xl border border-violet-500/30 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center text-[10px] font-extrabold text-yellow-950 border border-yellow-200/50 shadow-inner">
              V
            </div>
            <span className="font-bold text-sm font-space text-white">{user?.coins ?? balance ?? 100}</span>
          </div>
        </Link>

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
