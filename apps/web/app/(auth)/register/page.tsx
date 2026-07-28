'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function RegisterPage() {
  const router = useRouter();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [language, setLanguage] = useState('en');
  const [gender, setGender] = useState('Prefer not to say');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      // In real implementation: upload to /api/upload and get Cloudinary URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.length < 2 || displayName.length > 30 || /[^a-zA-Z0-9 ]/.test(displayName)) {
      setError('Name must be 2-30 characters, no special symbols.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Mock PATCH /auth/profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/zone-b');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#F1F5F9] mb-2">
          Set up your profile
        </h2>
        <p className="text-[#64748B]">Let others know who you are</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-white/5 border border-white/20 flex items-center justify-center cursor-pointer relative overflow-hidden group hover:border-[#7C3AED] transition-colors"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-[#64748B] group-hover:text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white">
              Upload
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        <div>
          <label className="block text-sm text-[#64748B] mb-1">Display Name</label>
          <input 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#64748B] mb-1">Native Language</label>
          <div className="relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-12 appearance-none bg-white/5 border border-white/10 rounded-xl px-4 pr-10 text-[#F1F5F9] focus:outline-none focus:border-[#06B6D4] transition-colors"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-[#080810]">{l.flag} {l.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">▼</div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#64748B] mb-2">Gender</label>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`px-4 py-2 rounded-full text-sm transition-all border ${
                  gender === g 
                  ? 'bg-white/10 border-[#7C3AED] text-[#F1F5F9] shadow-[0_0_10px_rgba(124,58,237,0.3)]' 
                  : 'bg-transparent border-white/10 text-[#64748B] hover:border-white/30'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-[#EF4444] text-sm text-center">{error}</p>}

        <button 
          type="submit" 
          disabled={loading || !displayName.trim()}
          className="w-full h-12 mt-4 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Start Vibing'}
        </button>
      </form>
    </div>
  );
}
