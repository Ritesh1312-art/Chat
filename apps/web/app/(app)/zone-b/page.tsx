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
    <div className="min-h-screen bg-[#080810] text-slate-100 font-inter pb-20 md:pb-0 relative">
      <header className="sticky top-0 z-10 bg-[#080810]/80 backdrop-blur-xl border-b border-white/5 px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Zone B
          </h1>
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300 border border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chats.length > 0 ? (
          <div className="flex flex-col gap-2">
            {chats.map((chat) => {
              const myId = (user as any)?._id || (user as any)?.id;
              const other = chat.participants?.find((p: any) => p._id !== myId) || chat.participants?.[0] || {};
              const lastMsg = chat.messages?.[0]?.content || 'Start a conversation';
              return (
                <Link key={chat._id || chat.id} href={`/zone-b/${chat._id || chat.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer relative"
                  >
                    <div className="relative w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {other.avatar ? (
                        <img src={other.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-slate-100 truncate">{other.displayName || 'VibeUser'}</h3>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{lastMsg}</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-3xl">💬</div>
            <h3 className="text-lg font-semibold text-slate-200">No active chats yet</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Connect with strangers in Zone A to unlock DMs in Zone B!</p>
            <Link href="/zone-a" className="inline-block px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full font-medium text-white shadow-lg">Go to Zone A</Link>
          </div>
        )}
      </main>

      <button 
        onClick={() => router.push('/explore')}
        className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.6)] hover:-translate-y-1 transition-all z-20"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
