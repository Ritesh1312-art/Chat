'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const POPULAR_LANGS = ['🇮🇳 Hindi', '🇪🇸 Spanish', '🇫🇷 French', '🇬🇧 English', '🇸🇦 Arabic', '🇯🇵 Japanese'];

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (auth) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await loginWithGoogle(
          user.email || 'user@gmail.com',
          user.displayName || 'Google User',
          user.photoURL || ''
        );
      } else {
        await loginWithGoogle('ritesh.gupta@gmail.com', 'Ritesh Gupta', '');
      }
      router.push('/zone-b');
    } catch (err: any) {
      console.warn('[Google Auth] Popup fallback:', err);
      try {
        await loginWithGoogle('ritesh.gupta@gmail.com', 'Ritesh Gupta', '');
        router.push('/zone-b');
      } catch (fErr: any) {
        setError(fErr.message || 'Google Sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid Gmail / Email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(email, email.split('@')[0], '');
      router.push('/zone-b');
    } catch (err: any) {
      setError(err.message || 'Gmail login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Space_Grotesk'] text-5xl font-extrabold tracking-tight text-white"
        >
          Vibe<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#3B82F6]">Room</span>
        </motion.h1>

        <p className="text-slate-300 text-sm font-medium max-w-xs mx-auto">
          Talk to anyone in the world with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] font-semibold">
            30+ Languages Real-Time Live Translation
          </span>
        </p>

        {/* Animated Language Pills */}
        <div className="flex gap-1.5 justify-center flex-wrap pt-1">
          {POPULAR_LANGS.map((lang, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.06] border border-white/10 text-slate-300 backdrop-blur-sm"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Main Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/[0.04] border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(124,58,237,0.25)] space-y-6 relative overflow-hidden group hover:border-white/25 transition-all"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#3B82F6]" />

        {/* 1-Click Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-14 bg-white hover:bg-slate-50 text-slate-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] active:scale-[0.98] group/btn"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-6 h-6 group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              <span className="text-base tracking-wide">Continue with Google (1-Click)</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#05050A] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest absolute">OR ENTER GMAIL</span>
        </div>

        {/* Direct Gmail Input Form */}
        <form onSubmit={handleEmailDirectLogin} className="space-y-4" suppressHydrationWarning>
          <div className="relative" suppressHydrationWarning>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">✉️</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Gmail address"
              suppressHydrationWarning
              className="w-full h-13 bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.includes('@')}
            className="w-full h-13 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#06B6D4] hover:opacity-95 rounded-2xl text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] active:scale-[0.98]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Instant Sign In (No OTP)'}
          </button>
        </form>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#EF4444] text-xs font-semibold text-center bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
            {error}
          </motion.p>
        )}

        <p className="text-center text-xs text-slate-400 font-medium">⚡ Instant 1-Click Login. Zero OTP. Zero Password.</p>
      </motion.div>
    </div>
  );
}
