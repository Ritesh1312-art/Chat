'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Phone, MoreVertical, Send, Mic, Smile, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import MessageBubble from '../../../../components/chat/MessageBubble';
import { useAuth } from '@/contexts/AuthContext';
import { getToken } from '@/lib/auth';
import { getSocket } from '@/lib/socket';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId as string;
  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [callConsent, setCallConsent] = useState<'NONE' | 'PENDING' | 'GRANTED'>('NONE');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const token = getToken();
        if (!token || !chatId) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.messages) {
            setMessages(data.messages.map((m: any) => ({
              id: m._id || m.id,
              content: m.content,
              sender: m.senderId === user?.id ? 'self' : 'peer',
              timestamp: new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
          }
        }
      } catch (err) {
        console.warn('[ChatPage] Fetch chat error:', err);
      }
    };
    fetchChatDetails();
  }, [chatId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const token = getToken();
    const socket = getSocket(token || '');
    if (!socket || !chatId) return;

    socket.emit('join-room', { roomId: chatId });

    const handleMessageReceived = (msg: any) => {
      const myUserId = (user as any)?._id || (user as any)?.id;
      setMessages(prev => [...prev, {
        id: msg.id || Date.now().toString(),
        content: msg.translatedText || msg.content || msg.text,
        sender: msg.senderId === myUserId ? 'self' : 'peer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };

    socket.on('receive-message', handleMessageReceived);

    return () => {
      socket.off('receive-message', handleMessageReceived);
    };
  }, [chatId, user]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const textToSend = inputValue.trim();
    setInputValue('');

    const newMsg = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'self',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);

    const token = getToken();
    const socket = getSocket(token || '');
    if (socket) {
      socket.emit('send-message', {
        roomId: chatId,
        text: textToSend,
        senderId: (user as any)?._id || (user as any)?.id,
        targetLanguage: 'en'
      });
    }
  };

  const handleRequestCall = () => {
    setCallConsent('GRANTED');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#080810] font-inter">
      <header className="flex-none bg-[#080810]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-white/5 text-slate-300 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">👨🏽</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#080810]" />
          </div>
          
          <div>
            <h2 className="font-semibold text-slate-200 flex items-center gap-1.5">
              Carlos R <span>🇪🇸</span>
            </h2>
            <p className="text-xs text-emerald-400 font-medium">Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {callConsent === 'NONE' && (
            <button 
              onClick={handleRequestCall}
              className="text-xs bg-violet-600/20 text-violet-400 px-3 py-1.5 rounded-full font-medium hover:bg-violet-600/30 transition-colors mr-2"
            >
              Request Call
            </button>
          )}
          {callConsent === 'PENDING' && (
            <span className="text-xs text-slate-400 px-3 py-1.5 mr-2 bg-white/5 rounded-full">Waiting...</span>
          )}
          
          <button 
            disabled={callConsent !== 'GRANTED'}
            className={`p-2.5 rounded-full transition-colors ${
              callConsent === 'GRANTED' 
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                : 'text-slate-600 bg-transparent'
            }`}
          >
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2 text-center flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-yellow-500" />
        <p className="text-xs text-yellow-400 font-medium">You can send 1 more message. Wait for a reply.</p>
      </div>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg as any} isSelf={msg.sender === 'self'} />
        ))}
        
        {isTyping && (
          <div className="flex items-start mb-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="flex-none bg-[#080810] border-t border-white/10 p-3 pb-safe">
        <form onSubmit={handleSend} className="flex items-end gap-2 bg-white/5 rounded-3xl p-2 border border-white/10 focus-within:border-violet-500/50 transition-colors">
          <button type="button" className="p-2 text-slate-400 hover:text-white shrink-0">
            <Smile className="w-6 h-6" />
          </button>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message..."
            className="flex-1 max-h-32 bg-transparent text-white placeholder-slate-500 resize-none outline-none py-2.5 text-sm"
            rows={1}
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as any);
              }
            }}
          />
          
          {inputValue.trim() ? (
            <button 
              type="submit" 
              className="p-2.5 rounded-full bg-violet-600 text-white shrink-0 hover:bg-violet-700 transition-colors"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          ) : (
            <button type="button" className="p-2.5 rounded-full text-slate-400 hover:text-white shrink-0 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
        <div className="text-right mt-1 mr-4">
          <span className="text-[10px] text-slate-600">{inputValue.length}/500</span>
        </div>
      </footer>
    </div>
  );
}
