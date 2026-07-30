'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const cards = [
  {
    id: 'zone-a',
    href: '/zone-a',
    title: 'Zone A',
    subtitle: 'Random Video Match',
    description: 'Match with strangers worldwide via live video call with real-time translation.',
    gradient: 'from-violet-600/40 via-purple-700/30 to-indigo-600/20',
    border: 'border-violet-500/30',
    glow: 'shadow-[0_0_40px_rgba(139,92,246,0.25)]',
    badge: '🎥 LIVE',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="3" />
      </svg>
    ),
    iconColor: 'text-violet-400',
    accentDot: 'bg-violet-400',
  },
  {
    id: 'zone-b',
    href: '/zone-b',
    title: 'Zone B',
    subtitle: 'Private Chats & DMs',
    description: 'Unlock persistent private DM rooms with matched strangers you connect with.',
    gradient: 'from-cyan-600/40 via-sky-700/30 to-blue-600/20',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_40px_rgba(6,182,212,0.25)]',
    badge: '💬 CHAT',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    iconColor: 'text-cyan-400',
    accentDot: 'bg-cyan-400',
  },
  {
    id: 'explore',
    href: '/explore',
    title: 'Explore',
    subtitle: 'Global User Gallery',
    description: 'Discover active users worldwide by language, region, and VIP status.',
    gradient: 'from-emerald-600/40 via-green-700/30 to-teal-600/20',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_40px_rgba(16,185,129,0.25)]',
    badge: '🌍 GLOBAL',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    iconColor: 'text-emerald-400',
    accentDot: 'bg-emerald-400',
  },
  {
    id: 'avatar',
    href: '/profile',
    title: 'My Avatar',
    subtitle: 'Personalize Profile',
    description: 'Update your avatar, language, gender preferences, and privacy settings.',
    gradient: 'from-pink-600/40 via-rose-700/30 to-fuchsia-600/20',
    border: 'border-pink-500/30',
    glow: 'shadow-[0_0_40px_rgba(236,72,153,0.25)]',
    badge: '✨ PROFILE',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    iconColor: 'text-pink-400',
    accentDot: 'bg-pink-400',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const { user } = useAuth();
  const name = (user as any)?.name || (user as any)?.displayName || 'VibeUser';
  const firstName = name.split(' ')[0];
  const isAdmin = (user as any)?.isAdmin;

  return (
    <div className="min-h-screen px-4 pt-20 pb-28 max-w-lg mx-auto">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 text-center"
      >
        <p className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">
          Welcome back
        </p>
        <h1 className="text-3xl font-black font-space text-white">
          Hey, {firstName} 👋
        </h1>
        {isAdmin && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/35 px-3 py-1 rounded-full font-bold">
            👑 Admin VIP · ∞ Infinity Coins
          </span>
        )}
        <p className="text-slate-500 text-xs mt-2 font-medium">
          What would you like to do today?
        </p>
      </motion.div>

      {/* 2×2 Card Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4"
      >
        {cards.map((card) => (
          <motion.div key={card.id} variants={cardVariants}>
            <Link href={card.href} className="block h-full">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative h-full min-h-[190px] rounded-3xl border ${card.border} ${card.glow}
                  bg-gradient-to-br ${card.gradient}
                  backdrop-blur-xl overflow-hidden cursor-pointer
                  transition-all duration-300 flex flex-col justify-between p-5
                `}
              >
                {/* Ambient glow orb */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 ${card.accentDot} opacity-20 blur-2xl rounded-full pointer-events-none`} />

                {/* Badge */}
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-extrabold tracking-widest border px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                  {/* Pulsing live dot */}
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${card.accentDot} animate-pulse`} />
                  </span>
                </div>

                {/* Icon */}
                <div className={`${card.iconColor} opacity-85 mt-2`}>
                  {card.icon}
                </div>

                {/* Text */}
                <div className="mt-auto">
                  <h3 className="text-white font-black text-base font-space leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-slate-300 text-[11px] font-semibold mt-0.5 leading-snug">
                    {card.subtitle}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-slate-600 text-[11px] font-medium mt-8"
      >
        🔒 All conversations are encrypted & anonymous
      </motion.p>
    </div>
  );
}
