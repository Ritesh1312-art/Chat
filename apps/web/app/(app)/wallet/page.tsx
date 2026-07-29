'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';
import { Coins, Tv, ShoppingCart, ArrowRight, Zap, Star } from 'lucide-react';
import PaymentModal from '@/components/wallet/PaymentModal';
import AdWatchTimer from '@/components/wallet/AdWatchTimer';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

// Types
type Plan = { id: string; name: string; coins: number; price: number; bonus?: number; popular?: boolean };
type Transaction = { id: string; type: 'credit' | 'debit'; amount: number; description: string; date: string; source: 'razorpay' | 'ad' | 'gift' | 'system' };

const PLANS: Plan[] = [
  { id: 'plan_starter', name: 'Starter Pack', coins: 45, price: 5 },
  { id: 'plan_vip', name: 'VIP Pass', coins: 100, price: 10, popular: true },
  { id: 'plan_power', name: 'Power Pack', coins: 210, price: 20, bonus: 5 }
];

export default function WalletPage() {
  const { user } = useAuth();
  const initialBalance = (user as any)?.coins ?? (user as any)?.walletBalance ?? 100;
  const [balance, setBalance] = useState<number>(initialBalance);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showAdTimer, setShowAdTimer] = useState(false);
  const [adCooldown, setAdCooldown] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [adToken, setAdToken] = useState<string | null>(null);
  
  // Animation for coin balance
  const count = useMotionValue(initialBalance);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (user) {
      const userCoins = (user as any)?.coins ?? (user as any)?.walletBalance ?? 100;
      setBalance(userCoins);
    }
  }, [user]);

  useEffect(() => {
    // Fetch initial balance and history
    const fetchWallet = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/wallet/balance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.balance !== undefined) setBalance(data.balance);
        }
      } catch (e) {
        console.warn('[Wallet] Balance fetch error:', e);
      }
      const storedLimit = localStorage.getItem('vibe_ads_watched');
      if (storedLimit) {
        setAdsWatchedToday(parseInt(storedLimit, 10));
      }
    };
    fetchWallet();
  }, []);

  useEffect(() => {
    const animation = animate(count, balance, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [balance, count]);

  useEffect(() => {
    if (adCooldown > 0) {
      const timer = setTimeout(() => setAdCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [adCooldown]);

  const handlePaymentSuccess = (coins: number) => {
    setBalance(prev => prev + coins);
    setHistory(prev => [{
      id: Date.now().toString(),
      type: 'credit',
      amount: coins,
      description: `Razorpay +${coins} coins`,
      date: new Date().toISOString(),
      source: 'razorpay'
    }, ...prev]);
  };

  const handleAdWatchStart = async () => {
    if (adsWatchedToday >= 5) return;
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/wallet/ad-token`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        const data = await res.json();
        setAdToken(data.token);
      }
    } catch (e) {
      console.warn('[Wallet] Ad token error:', e);
    }
    setShowAdTimer(true);
  };

  const handleAdComplete = async () => {
    setShowAdTimer(false);
    setAdCooldown(300); // 5 minutes cooldown
    setAdsWatchedToday(prev => {
      const newVal = prev + 1;
      localStorage.setItem('vibe_ads_watched', newVal.toString());
      return newVal;
    });

    try {
      const token = getToken();
      if (adToken) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/wallet/ad-reward`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ token: adToken })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.newBalance !== undefined) setBalance(data.newBalance);
        }
      }
    } catch (e) {
      console.warn('[Wallet] Ad reward error:', e);
    }

    setHistory(prev => [{
      id: Date.now().toString(),
      type: 'credit',
      amount: 10,
      description: 'Ad Reward',
      date: new Date().toISOString(),
      source: 'ad'
    }, ...prev]);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-4xl mx-auto pb-24">
      {/* Header Section */}
      <header className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <Coins className="w-8 h-8 text-[#F59E0B]" />
        </div>
        <h1 className="text-3xl font-space font-bold text-white tracking-tight">My Wallet</h1>
      </header>

      {/* Balance Display */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-amber-500/30 backdrop-blur-xl p-8 flex flex-col items-center justify-center shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400 font-semibold text-xs tracking-widest uppercase bg-amber-500/20 border border-amber-500/30 px-3 py-0.5 rounded-full">
            {(user as any)?.isAdmin ? '👑 ADMIN UNLIMITED VIP PASS' : 'CURRENT BALANCE'}
          </span>
        </div>
        <div className="flex items-baseline space-x-3">
          <motion.h2 className="text-7xl font-space font-black text-[#F59E0B] drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">
            {(user as any)?.isAdmin || balance >= 999999 ? '∞' : rounded}
          </motion.h2>
          <span className="text-2xl text-[#F59E0B]/80 font-bold">VibeCoins</span>
        </div>
        {(user as any)?.isAdmin && (
          <p className="text-amber-300/80 text-sm font-medium mt-2">Unlimited Access Granted for ritesh.gupta131290@gmail.com</p>
        )}
        <p className="text-white/40 mt-3 font-mono">≈ ₹{(balance / 10).toFixed(2)}</p>
      </motion.div>

      {/* Buy Coins */}
      <section className="space-y-4">
        <h3 className="text-xl font-space font-bold text-white flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-cyan-400" />
          Buy Coins
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
          {PLANS.map(plan => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={plan.id} 
              className={`snap-center shrink-0 w-64 p-6 rounded-3xl border backdrop-blur-md flex flex-col justify-between relative ${plan.popular ? 'bg-violet-900/40 border-violet-500/50' : 'bg-white/5 border-white/10'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-white" /> POPULAR
                </div>
              )}
              {plan.bonus && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {plan.bonus}% BONUS
                </div>
              )}
              <div>
                <h4 className="text-white/70 font-medium">{plan.name}</h4>
                <div className="flex items-center space-x-2 mt-2">
                  <Coins className="w-6 h-6 text-[#F59E0B]" />
                  <span className="text-3xl font-space font-bold text-white">{plan.coins}</span>
                </div>
                <p className="text-cyan-400 font-medium mt-4 text-lg">₹{plan.price}</p>
              </div>
              <button 
                onClick={() => setSelectedPlan(plan)}
                className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center group"
              >
                Buy Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Earn Free Coins */}
      <section className="space-y-4">
        <h3 className="text-xl font-space font-bold text-white flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Earn Free Coins
        </h3>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl">
              <Tv className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Watch an Ad = +10 Coins</h4>
              <p className="text-white/50 text-sm mt-1">{5 - adsWatchedToday} daily limits remaining</p>
            </div>
          </div>
          
          <button 
            disabled={adCooldown > 0 || adsWatchedToday >= 5}
            onClick={handleAdWatchStart}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            {adsWatchedToday >= 5 ? 'Daily Limit Reached' : adCooldown > 0 ? `Next ad in ${Math.floor(adCooldown/60)}m ${adCooldown%60}s` : 'Watch Ad'}
          </button>
        </div>
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <h3 className="text-xl font-space font-bold text-white">Transaction History</h3>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-white/40 text-center py-8 bg-white/5 rounded-2xl border border-white/10">No transactions yet.</p>
          ) : (
            history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${tx.source === 'razorpay' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {tx.source === 'razorpay' ? <ShoppingCart className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <p className="text-white/40 text-xs mt-1">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="text-emerald-400 font-bold font-mono">
                  +{tx.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedPlan && (
        <PaymentModal 
          plan={selectedPlan} 
          onSuccess={handlePaymentSuccess} 
          onClose={() => setSelectedPlan(null)} 
        />
      )}

      {showAdTimer && (
        <AdWatchTimer 
          token="mock-token-123" 
          onComplete={handleAdComplete} 
        />
      )}
    </div>
  );
}
