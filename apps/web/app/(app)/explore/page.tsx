'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export default function ExplorePage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [gender, setGender] = useState('Any');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/explore`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.warn('[Explore] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStartChat = (userId: string) => {
    router.push(`/zone-b/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#040409] text-slate-100 font-sans pb-28">
      <header className="pt-6 pb-4 px-6 sticky top-0 z-30 bg-[#040409]/80 backdrop-blur-2xl border-b border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black font-space tracking-tight text-white">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">Global</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium">Discover Active Users & Vibe Peers</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              showFilters ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] border-transparent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-white/[0.04] border border-white/15 rounded-3xl p-5 space-y-4 backdrop-blur-2xl">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Gender Filter</label>
                  <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                    {['Any', 'Male', 'Female', 'Other'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${gender === g ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Native Language</label>
                  <div className="relative">
                    <select className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 appearance-none outline-none focus:border-[#8B5CF6] transition-colors font-medium">
                      <option value="any">Any Language</option>
                      <option value="en">English 🇬🇧</option>
                      <option value="hi">Hindi 🇮🇳</option>
                      <option value="es">Spanish 🇪🇸</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {users.map((u, i) => (
              <motion.div 
                key={u._id || u.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-interactive p-5 flex flex-col items-center text-center group relative overflow-hidden"
              >
                {u.isVIP && (
                  <span className="absolute top-3 right-3 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    👑 VIP
                  </span>
                )}
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/15 flex items-center justify-center mb-3 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                <h3 className="font-bold text-white text-base mb-0.5 truncate w-full">{u.displayName || u.name}</h3>
                <p className="text-[11px] font-semibold text-slate-400 mb-4 flex items-center gap-1">
                  🌐 {u.nativeLanguage?.toUpperCase() || 'EN'} • <span className="text-emerald-400">Online</span>
                </p>
                
                <div className="mt-auto pt-2 w-full">
                  <button 
                    onClick={() => handleStartChat(u._id || u.id)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#06B6D4] text-white text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Start Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
