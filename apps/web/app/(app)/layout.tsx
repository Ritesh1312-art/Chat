'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BottomNav from '@/components/navigation/BottomNav';
import { PanicProvider, PanicButton } from '@/components/moderation/PanicButton';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = (user as any)?.isAdmin;
  const balance = isAdmin || (user as any)?.walletBalance >= 999999 ? '∞' : (user?.coins ?? 100);
  const avatarUrl = (user as any)?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'VibeUser'}`;
  const name = (user as any)?.name || (user as any)?.displayName || 'VibeUser';

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted || !isAuthenticated) return null;

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.push('/login');
  };

  return (
    <PanicProvider>
      <div className="min-h-screen bg-[#040409] text-[#F1F5F9] pb-[80px]">

        {/* ── Top-Right Profile Dropdown ── */}
        <div ref={dropdownRef} className="fixed top-4 right-4 z-50">
          {/* Avatar Trigger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 bg-[#080810]/80 backdrop-blur-xl border border-white/15 rounded-2xl px-3 py-1.5 shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
          >
            {/* Coin badge */}
            <span className="text-xs font-bold font-space text-amber-300">
              {isAdmin ? '👑 ∞' : `🪙 ${balance}`}
            </span>
            {/* Separator */}
            <span className="w-px h-4 bg-white/15" />
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt={name}
                className="w-7 h-7 rounded-xl object-cover border border-violet-500/40 bg-[#040409]"
              />
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#040409]" />
            </div>
            {/* Chevron */}
            <motion.svg
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className="w-3.5 h-3.5 text-slate-400"
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </motion.button>

          {/* Dropdown Panel */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full right-0 mt-2 w-56 bg-[#0a0a18]/95 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-xl border border-violet-500/30 bg-[#040409]" />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate font-space">{name}</p>
                      {isAdmin
                        ? <p className="text-amber-300 text-[10px] font-bold">👑 ADMIN VIP · ∞ Coins</p>
                        : <p className="text-slate-400 text-[10px]">🪙 {balance} VibeCoins</p>
                      }
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  <Link
                    href="/wallet"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/[0.06] hover:text-white transition-all group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center group-hover:bg-amber-500/25 transition-colors text-base">
                      🪙
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-none">My Wallet</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Coins, top-up & history</p>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/[0.06] hover:text-white transition-all group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center group-hover:bg-violet-500/25 transition-colors text-base">
                      ⚙️
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-none">Settings</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Profile, privacy & language</p>
                    </div>
                  </Link>
                </div>

                {/* Divider + Logout */}
                <div className="border-t border-white/10 py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-all group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors text-base">
                      🚪
                    </span>
                    <p className="text-sm font-semibold">Log Out</p>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
