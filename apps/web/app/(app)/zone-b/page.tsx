'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FILTERS = ['All', 'Unread', 'Male', 'Female', 'Hindi', 'English', 'Spanish'];

const MOCK_CHATS = [
  { id: '1', name: 'Priya Sharma', avatar: '👩🏽', nativeLanguage: '🇮🇳', lastMessage: 'नमस्ते! How are you?', time: '2m ago', unread: 2, online: true, isLocked: false },
  { id: '2', name: 'Carlos R', avatar: '👨🏽', nativeLanguage: '🇪🇸', lastMessage: 'That sounds great, talk to you later.', time: '1h ago', unread: 0, online: false, isLocked: true },
  { id: '3', name: 'Sarah Lee', avatar: '👩🏻', nativeLanguage: '🇺🇸', lastMessage: 'Haha yes, exactly!', time: 'Yesterday', unread: 0, online: false, isLocked: false },
];

export default function ZoneBPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const router = useRouter();

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
        {MOCK_CHATS.length > 0 ? (
          <div className="flex flex-col gap-2">
            {MOCK_CHATS.map((chat) => (
              <Link key={chat.id} href={`/zone-b/${chat.id}`}>
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer relative"
                >
                  <div className="relative w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                    {chat.avatar}
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080810]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-slate-200 truncate flex items-center gap-2">
                        {chat.name} <span>{chat.nativeLanguage}</span>
                      </h3>
                      <span className={`text-xs whitespace-nowrap ml-2 ${chat.unread > 0 ? 'text-violet-400 font-semibold' : 'text-slate-500'}`}>
                        {chat.time}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                        {chat.unread}
                      </span>
                    )}
                    {chat.isLocked && (
                      <Lock className="w-3.5 h-3.5 text-yellow-500" />
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No chats yet</h3>
            <p className="text-slate-500 max-w-xs">Go to Explore to find someone to chat with!</p>
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
