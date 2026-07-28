'use client'
import React, { useEffect, useState } from 'react';

interface CoinBadgeProps {
  balance: number;
  size?: 'sm' | 'md';
}

export const CoinBadge: React.FC<CoinBadgeProps> = ({ balance, size = 'md' }) => {
  const [prevBalance, setPrevBalance] = useState(balance);
  const [pops, setPops] = useState<{ id: number; amount: number }[]>([]);

  useEffect(() => {
    if (balance > prevBalance) {
      const diff = balance - prevBalance;
      const id = Date.now();
      setPops(p => [...p, { id, amount: diff }]);
      setTimeout(() => {
        setPops(p => p.filter(pop => pop.id !== id));
      }, 1000);
    }
    setPrevBalance(balance);
  }, [balance, prevBalance]);

  return (
    <div className={`relative inline-flex items-center gap-2 glass px-3 py-1.5 ${size === 'sm' ? 'text-sm' : 'text-base font-bold'}`}>
      <span className="text-yellow-400">🪙</span>
      <span className="text-yellow-100">{balance}</span>
      
      {pops.map(pop => (
        <span
          key={pop.id}
          className="absolute -top-4 right-0 text-green-400 font-bold text-sm animate-[coin-pop_1s_ease-out_forwards]"
        >
          +{pop.amount}
        </span>
      ))}
    </div>
  );
};
