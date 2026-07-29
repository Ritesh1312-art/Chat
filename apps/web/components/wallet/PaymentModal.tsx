'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Coins } from 'lucide-react';
import { getToken } from '@/lib/auth';

type Plan = { id: string; name: string; coins: number; price: number; bonus?: number };

interface PaymentModalProps {
  plan: Plan;
  onSuccess: (coins: number) => void;
  onClose: () => void;
}

export default function PaymentModal({ plan, onSuccess, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Load Razorpay script dynamically
    const loadScript = () => {
      if (document.getElementById('razorpay-script')) return;
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadScript();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setStatus('processing');
    setErrorMsg('');

    try {
      const token = getToken();
      let order: any = null;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/wallet/order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ planId: plan.id })
        });
        if (res.ok) {
          order = await res.json();
        }
      } catch (e) {
        console.warn('[Razorpay] Order API fallback:', e);
      }

      if (!order || !order.id) {
        order = { id: 'order_' + Date.now(), amount: plan.price * 100, currency: 'INR' };
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TIzWrtxCNfmOku', // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: 'VibeRoom',
        description: `Purchase ${plan.name} (${plan.coins} coins)`,
        order_id: order.id,
        handler: function (response: any) {
          // Success handler
          setStatus('success');
          // In a real app, verify the signature on backend here
          setTimeout(() => {
            onSuccess(plan.coins);
            onClose();
          }, 2000);
        },
        prefill: {
          name: 'VibeRoom User',
          contact: '9999999999'
        },
        theme: {
          color: '#7C3AED' // VibeRoom Violet
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setStatus('idle');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setStatus('error');
        setErrorMsg(response.error.description || 'Payment failed');
        setLoading(false);
      });
      
      rzp.open();

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Failed to initialize payment');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={status !== 'processing' ? onClose : undefined}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#080810] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {status === 'success' ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="flex flex-col items-center text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 relative">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 z-10" />
                <motion.div 
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/40 rounded-full"
                />
              </div>
              <h3 className="text-2xl font-space font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-white/60 mb-6">+{plan.coins} VibeCoins added to your wallet</p>
            </motion.div>
          ) : (
            <>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                disabled={status === 'processing'}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-space font-bold text-white mb-6">Confirm Purchase</h3>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70">{plan.name}</span>
                  <span className="text-cyan-400 font-bold">₹{plan.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-xl font-bold text-white">{plan.coins} Coins</span>
                  {plan.bonus && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">+{plan.bonus}% bonus</span>
                  )}
                </div>
              </div>

              {status === 'error' && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={status === 'processing'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay ₹{plan.price}</span>
                )}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
