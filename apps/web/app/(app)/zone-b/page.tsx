'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getToken } from '@/lib/auth';

const FILTERS = ['All', 'Unread', 'Male', 'Female', 'Hindi', 'English', 'Spanish'];

export default function ZoneBPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/chats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        }
      } catch (err) {
        console.warn('[ZoneB] Fetch chats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="min-h-screen bg-[#040409] text-slate-100 font-sans pb-28 relative">
      <header className="sticky top-0 z-30 bg-[#040409]/80 backdrop-blur-2xl border-b border-white/10 px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-black font-space tracking-tight text-white">
              Zone <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#06B6D4]">B</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium">Private DMs & Unlocked Rooms</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-slate-300 transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-slate-300 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chats.length > 0 ? (
          <div className="flex flex-col gap-3">
            {chats.map((chat) => {
              const myId = (user as any)?._id || (user as any)?.id;
              const other = chat.participants?.find((p: any) => p._id !== myId) || chat.participants?.[0] || {};
              const lastMsg = chat.messages?.[0]?.content || 'Start a conversation';
              return (
                <Link key={chat._id || chat.id} href={`/zone-b/${chat._id || chat.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-3xl glass-card-interactive cursor-pointer relative"
                  >
                    <div className="relative w-14 h-14 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center text-2xl shrink-0 overflow-hidden shadow-md">
                      {other.avatar ? (
                        <img src={other.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>👤</span>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#040409]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-white text-base truncate">{other.displayName || 'VibeUser'}</h3>
                        <span className="text-[10px] text-slate-500 font-semibold">Just now</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate font-medium">{lastMsg}</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-white/[0.04] border border-white/10 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl">
              💬
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-space text-white">No active chats yet</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto font-medium">Connect with strangers in Zone A to unlock DMs in Zone B!</p>
            </div>
            <Link href="/zone-a" className="inline-block px-8 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#06B6D4] rounded-2xl font-bold text-white text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] transition-all">
              ⚡ Go to Zone A Matching
            </Link>
          </div>
        )}
      </main>

      <button 
        onClick={() => router.push('/explore')}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] hover:-translate-y-1 transition-all z-40 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
