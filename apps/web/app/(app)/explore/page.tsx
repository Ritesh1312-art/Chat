'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MOCK_USERS = [
  { id: '1', name: 'Aisha', avatar: '👩🏾', language: 'Hindi', flag: '🇮🇳', gender: 'Female' },
  { id: '2', name: 'James', avatar: '👨🏼', language: 'English', flag: '🇬🇧', gender: 'Male' },
  { id: '3', name: 'Yuki', avatar: '👩🏻', language: 'Japanese', flag: '🇯🇵', gender: 'Female' },
  { id: '4', name: 'Carlos', avatar: '👨🏽', language: 'Spanish', flag: '🇪🇸', gender: 'Male' },
  { id: '5', name: 'Amelie', avatar: '👩🏼', language: 'French', flag: '🇫🇷', gender: 'Female' },
  { id: '6', name: 'Chen', avatar: '👨🏻', language: 'Mandarin', flag: '🇨🇳', gender: 'Male' },
];

export default function ExplorePage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [gender, setGender] = useState('Any');

  const handleStartChat = (userId: string) => {
    router.push(`/zone-b/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#080810] text-slate-100 font-inter pb-24">
      <header className="pt-8 pb-4 px-6 sticky top-0 z-20 bg-[#080810]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Explore
          </h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-2 text-sm font-medium ${
              showFilters ? 'bg-violet-600 border-violet-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" /> Filters
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
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Gender</label>
                  <div className="flex gap-2 bg-black/40 p-1 rounded-xl">
                    {['Any', 'Male', 'Female', 'Other'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${gender === g ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Language</label>
                  <div className="relative">
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 appearance-none outline-none focus:border-violet-500 transition-colors">
                      <option value="any">Any Language</option>
                      <option value="en">English 🇬🇧</option>
                      <option value="hi">Hindi 🇮🇳</option>
                      <option value="es">Spanish 🇪🇸</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_USERS.map((user, i) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col items-center text-center hover:bg-white/10 transition-colors group"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800 text-4xl flex items-center justify-center mb-3 shadow-inner">
                {user.avatar}
              </div>
              <h3 className="font-bold text-slate-200 text-lg mb-1">{user.name}</h3>
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                {user.flag} {user.language}
              </p>
              
              <div className="mt-auto pt-2 w-full">
                <button 
                  onClick={() => handleStartChat(user.id)}
                  className="w-full py-2 rounded-xl bg-white/10 text-white text-sm font-semibold group-hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button className="px-6 py-2.5 rounded-full border border-white/20 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors">
            Load more
          </button>
        </div>
      </main>
    </div>
  );
}
