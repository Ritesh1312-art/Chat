'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();
  const unreadMessages = 2; // Mock

  const tabs = [
    {
      name: 'Home',
      href: '/zone-b',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      name: 'Zone A',
      href: '/zone-a',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      )
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    },
    {
      name: 'Wallet',
      href: '/wallet',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
        </svg>
      )
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#080810]/80 backdrop-blur-[16px] border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-[72px] px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link key={tab.name} href={tab.href} className="relative flex flex-col items-center justify-center w-full h-full">
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1, color: isActive ? '#7C3AED' : '#64748B' }}
                className={`relative z-10 flex flex-col items-center gap-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]' : ''}`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.name === 'Home' && unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#EF4444] rounded-full border-2 border-[#080810] flex items-center justify-center">
                      {/* Optional: Add number here if desired */}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium">{tab.name}</span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
