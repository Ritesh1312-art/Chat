'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Edit3, Shield, Globe, Users, LogOut, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ALL_WORLD_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' }
];

// Mock User Data
const MOCK_USER = {
  name: 'Vibe King',
  phone: '+91 98****5678',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VibeKing',
  memberSince: 'Jul 2023',
  balance: 150,
  preferences: {
    language: 'hi',
    gender: 'male',
    zoneBFilterGender: 'female',
    zoneBFilterLang: 'hi'
  },
  settings: {
    nsfwEnabled: true,
    shareStatus: true
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout, updateUser, token } = useAuth();
  
  const user = {
    name: authUser?.name || authUser?.displayName || 'VibeUser',
    phone: authUser?.phone || authUser?.phoneNumber || authUser?.email || 'Connected',
    avatar: authUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=VibeUser',
    memberSince: '2026',
    balance: authUser?.coins ?? authUser?.walletBalance ?? 100,
    preferences: {
      language: authUser?.nativeLanguage || 'en',
      gender: authUser?.gender || 'prefer_not_to_say',
      zoneBFilterGender: authUser?.genderFilter || 'any',
      zoneBFilterLang: authUser?.languageFilter || 'any'
    },
    settings: {
      nsfwEnabled: true,
      shareStatus: true
    }
  };

  const [expandedSection, setExpandedSection] = useState<string | null>('preferences');

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 max-w-2xl mx-auto pb-28">
      {/* Profile Luxury Card Header */}
      <div className="glass-card p-6 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-[#8B5CF6]/30 via-[#7C3AED]/20 to-[#06B6D4]/30 blur-2xl pointer-events-none" />
        
        <div className="relative group cursor-pointer mt-4">
          <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#06B6D4] shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-[20px] bg-[#040409] object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-4 text-center z-10 space-y-1">
          <h2 className="text-2xl font-black font-space text-white flex items-center justify-center gap-2">
            {user.name}
            {(authUser as any)?.isAdmin && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                👑 ADMIN VIP
              </span>
            )}
          </h2>
          <p className="text-slate-400 font-mono text-xs">{user.phone}</p>
        </div>

        <Link href="/wallet" className="mt-6 z-10">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/40 px-5 py-2.5 rounded-2xl text-amber-300 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <span>👑 Coins Balance:</span>
            <span className="font-space text-base">{(authUser as any)?.isAdmin || user.balance >= 999999 ? '∞ Infinity' : `${user.balance} Coins`}</span>
          </motion.div>
        </Link>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        
        {/* Preferences Section */}
        <div className="glass-card overflow-hidden">
          <button 
            onClick={() => toggleSection('preferences')}
            className="w-full p-5 flex items-center justify-between hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A855F7]">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-space font-bold text-base block text-white">Language & Preferences</span>
                <span className="text-xs text-slate-400 font-medium">Set native language and Zone B filters</span>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedSection === 'preferences' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'preferences' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Native Language</label>
                  <select className="w-full bg-black/50 border border-white/15 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors font-medium">
                    {ALL_WORLD_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-[#040409]">
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Your Gender</label>
                  <select className="w-full bg-black/50 border border-white/15 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors font-medium">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer Not To Say</option>
                  </select>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95">
                  Save Preference Settings
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy & Safety Section */}
        <div className="glass-card overflow-hidden">
          <button 
            onClick={() => toggleSection('privacy')}
            className="w-full p-5 flex items-center justify-between hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-space font-bold text-base block text-white">Girl Safety & Moderation</span>
                <span className="text-xs text-slate-400 font-medium">NSFW Blur, Panic Button & Blocked Users</span>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedSection === 'privacy' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'privacy' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-xs">Enable Automated NSFW Blur</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">Automatically blurs sensitive streams</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={user.settings.nsfwEnabled} />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Controls */}
        <div className="glass-card p-5 space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl bg-white/[0.04] border border-white/15 text-slate-200 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 font-bold transition-all flex items-center justify-center gap-2 text-xs"
          >
            <LogOut className="w-4 h-4" /> Log Out Account
          </button>
        </div>

      </div>
    </div>
  );
}
