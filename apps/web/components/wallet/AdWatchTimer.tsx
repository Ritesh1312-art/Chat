'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, Coins } from 'lucide-react';

interface AdWatchTimerProps {
  token: string;
  onComplete: () => void;
}

export default function AdWatchTimer({ token, onComplete }: AdWatchTimerProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [timeLeft, completed, onComplete]);

  const progress = ((30 - timeLeft) / 30) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg aspect-video bg-gradient-to-br from-indigo-900 to-violet-900 rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col items-center justify-center"
        >
          {!completed ? (
            <>
              {/* Mock Ad Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[url('/noise.png')] mix-blend-overlay opacity-30"></div>
              
              <PlayCircle className="w-16 h-16 text-white/50 mb-4 animate-pulse" />
              <h2 className="text-3xl font-space font-bold text-white mb-2">VibeRoom Premium</h2>
              <p className="text-white/70">Upgrade your experience. Stand out in the crowd.</p>

              {/* Progress and Timer */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-md flex items-center px-6">
                <div className="flex-1 mr-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 1 }}
                  />
                </div>
                <div className="text-white font-mono font-bold w-12 text-right">
                  0:{timeLeft.toString().padStart(2, '0')}
                </div>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                <Coins className="w-12 h-12 text-[#F59E0B]" />
              </div>
              <h3 className="text-3xl font-space font-bold text-white mb-2">Reward Unlocked!</h3>
              <p className="text-white/70 text-lg">+10 VibeCoins added to your wallet</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
