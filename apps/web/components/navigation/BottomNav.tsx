'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Home',
      href: '/home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      name: 'Zone A',
      href: '/zone-a',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="3" ry="3" />
        </svg>
      )
    },
    {
      name: 'Zone B',
      href: '/zone-b',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 max-w-lg mx-auto pointer-events-none">
      <div className="pointer-events-auto bg-[#070712]/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link key={tab.name} href={tab.href} className="relative flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all">
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/30 via-[#7C3AED]/30 to-[#06B6D4]/20 border border-[#8B5CF6]/40 rounded-2xl shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                <div className={isActive ? 'drop-shadow-[0_0_10px_rgba(139,92,246,0.9)] text-[#A855F7]' : ''}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {tab.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
