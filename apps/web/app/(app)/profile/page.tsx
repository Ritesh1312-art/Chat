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
    <div className="min-h-screen p-4 md:p-8 space-y-6 max-w-2xl mx-auto pb-24">
      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-violet-600/30 to-cyan-600/30 blur-2xl"></div>
        
        <div className="relative group cursor-pointer mt-4">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-violet-500 to-cyan-500">
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full bg-[#080810] object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-4 text-center z-10">
          <h2 className="text-2xl font-space font-bold text-white flex items-center justify-center">
            {user.name}
            <button className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors">
              <Edit3 className="w-4 h-4 text-white/50" />
            </button>
          </h2>
          <p className="text-white/50 font-mono mt-1">{user.phone}</p>
          <p className="text-white/30 text-xs mt-1">Member since {user.memberSince}</p>
        </div>

        <Link href="/wallet" className="mt-6 z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-4 py-2 rounded-full font-bold"
          >
            <span>Wallet Balance:</span>
            <span className="font-space">{user.balance} Coins</span>
          </motion.div>
        </Link>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        
        {/* Preferences Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <button 
            onClick={() => toggleSection('preferences')}
            className="w-full p-5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3 text-white">
              <Globe className="w-5 h-5 text-violet-400" />
              <span className="font-space font-semibold text-lg">Preferences</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${expandedSection === 'preferences' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'preferences' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 space-y-4"
              >
                <div className="pt-2">
                  <label className="block text-sm text-white/60 mb-2">Native Language</label>
                  <select className="w-full bg-[#080810]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500">
                    {ALL_WORLD_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-[#080810]">
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Your Gender</label>
                  <select className="w-full bg-[#080810]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer Not To Say</option>
                  </select>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-white/80 font-medium mb-3">Zone B Filters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Preferred Gender</label>
                      <select className="w-full bg-[#080810]/50 border border-white/10 rounded-xl p-2 text-sm text-white">
                        <option value="any">Any</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">Preferred Language</label>
                      <select className="w-full bg-[#080810]/50 border border-white/10 rounded-xl p-2 text-sm text-white">
                        <option value="any">Any Language</option>
                        {ALL_WORLD_LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code} className="bg-[#080810]">
                            {lang.name} ({lang.nativeName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 mt-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
                  Save Changes
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy & Safety Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <button 
            onClick={() => toggleSection('privacy')}
            className="w-full p-5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3 text-white">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="font-space font-semibold text-lg">Privacy & Safety</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${expandedSection === 'privacy' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'privacy' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 space-y-4"
              >
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Enable NSFW Detection</h4>
                    <p className="text-white/40 text-xs mt-1">Automatically blurs inappropriate content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={user.settings.nsfwEnabled} />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <h4 className="text-white font-medium">Share Online Status</h4>
                    <p className="text-white/40 text-xs mt-1">Let others see when you're active</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={user.settings.shareStatus} />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <button className="flex items-center text-white/70 hover:text-white transition-colors">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Blocked Users (3)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <button 
            onClick={() => toggleSection('account')}
            className="w-full p-5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3 text-white">
              <LogOut className="w-5 h-5 text-cyan-400" />
              <span className="font-space font-semibold text-lg">Account</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${expandedSection === 'account' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expandedSection === 'account' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-5 space-y-3 pt-2"
              >
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-medium transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
                <button className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors flex items-center justify-center">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
