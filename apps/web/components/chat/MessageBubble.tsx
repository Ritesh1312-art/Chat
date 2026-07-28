import React from 'react';
import { motion } from 'framer-motion';

export interface MessageProps {
  content: string;
  originalContent?: string;
  isTranslated?: boolean;
  sender: string;
  timestamp: string;
  sourceLang?: string;
  targetLang?: string;
}

interface MessageBubbleProps {
  message: MessageProps;
  isSelf: boolean;
}

export default function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col w-full mb-4 ${isSelf ? 'items-end' : 'items-start'}`}
    >
      <div 
        className={`relative group max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 ${
          isSelf 
            ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-sm shadow-md' 
            : 'bg-white/5 backdrop-blur-md border border-white/10 text-[#F1F5F9] rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>
        
        {message.isTranslated && !isSelf && (
          <div className="mt-2 text-xs italic text-slate-400 bg-black/20 rounded px-2 py-1 inline-block border border-white/5">
            Auto-translated from {message.sourceLang} → {message.targetLang}
          </div>
        )}
      </div>
      
      <span className="text-xs text-slate-500 mt-1 mx-1 font-medium">
        {message.timestamp}
      </span>
    </motion.div>
  );
}
