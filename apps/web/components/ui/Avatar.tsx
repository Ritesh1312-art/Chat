'use client'
import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  ring?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', isOnline = false, ring = false }) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  };

  const ringClass = ring ? 'ring-2 ring-[var(--color-violet-neon)] ring-offset-2 ring-offset-[#080810]' : '';

  return (
    <div className="relative inline-block">
      <div className={`${sizeMap[size]} ${ringClass} rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold`}>
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span>{name ? name.charAt(0).toUpperCase() : '?'}</span>
        )}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-[#080810] animate-[pulse-glow_2s_infinite]" />
      )}
    </div>
  );
};
