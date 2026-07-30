'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, MicOff, Camera, CameraOff, MessageSquare, PhoneOff, AlertTriangle, X, Check } from 'lucide-react';
import VideoTile from '../../../components/video/VideoTile';

type MatchState = 'IDLE' | 'SEARCHING' | 'MATCHED';

export default function ZoneAPage() {
  const [matchState, setMatchState] = useState<MatchState>('IDLE');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [isBlurred, setIsBlurred] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [showRevealModal, setShowRevealModal] = useState(false);
  
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [remoteUserName, setRemoteUserName] = useState('Stranger');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => setLocalStream(stream))
      .catch(err => console.error('Error accessing media devices', err));
      
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (matchState === 'MATCHED' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (matchState === 'MATCHED' && countdown === 0) {
      setShowRevealModal(true);
    }
    return () => clearTimeout(timer);
  }, [matchState, countdown]);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showRevealModal) {
      timeout = setTimeout(() => {
        handleEndCall();
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [showRevealModal]);

  const handleStartMatching = () => {
    setMatchState('SEARCHING');
    setTimeout(() => {
      setMatchState('MATCHED');
      setCountdown(15);
      setIsBlurred(false);
      setShowRevealModal(false);
      setRemoteUserName('Live Peer User (' + (['India 🇮🇳', 'USA 🇺🇸', 'Spain 🇪🇸', 'Japan 🇯🇵'][Math.floor(Math.random() * 4)]) + ')');
      if (localStream) {
        setRemoteStream(localStream);
      }
    }, 2500);
  };

  const handleCancelSearch = () => {
    setMatchState('IDLE');
  };

  const handleEndCall = () => {
    setMatchState('IDLE');
    setRemoteStream(null);
    setCountdown(15);
    setIsBlurred(true);
    setShowRevealModal(false);
    setShowChat(false);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleRevealVote = (vote: boolean) => {
    setShowRevealModal(false);
    if (vote) {
      setIsBlurred(false); 
    } else {
      handleEndCall();
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'You', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#080810] text-slate-100 overflow-hidden font-inter">
      {matchState === 'IDLE' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Glowing Ambient Mesh Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[#8B5CF6]/25 to-[#06B6D4]/25 blur-[120px] rounded-full pointer-events-none animate-pulse" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center max-w-md w-full relative z-10 space-y-6"
          >
            {/* Center Animated 3D Icon */}
            <div className="relative flex items-center justify-center mb-4">
              <motion.div 
                animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }} 
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                className="absolute w-40 h-40 rounded-full border border-dashed border-[#8B5CF6]/40"
              />
              <motion.div 
                animate={{ scale: [1.1, 1, 1.1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)] border border-white/20"
              >
                <Video className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-space">
                Zone <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4]">A</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Instant 1-on-1 Anonymous Video Match with Live Translation
              </p>
            </div>
            
            <button 
              onClick={handleStartMatching}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg shadow-[0_10px_30px_rgba(139,92,246,0.4)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.6)] transition-all hover:-translate-y-1 active:translate-y-0 tracking-wide"
            >
              ⚡ Start Random Matching
            </button>
            
            <div className="flex gap-2 flex-wrap justify-center pt-2">
              <div className="bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">1,480 Active Now</span>
              </div>
              <div className="bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md shadow-md">
                <span className="text-xs font-semibold text-slate-300">🌐 30+ Languages Live</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {matchState === 'SEARCHING' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[#06B6D4]/20 to-[#8B5CF6]/20 blur-[100px] rounded-full pointer-events-none animate-pulse" />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center relative z-10 space-y-6"
          >
            {/* Cyber Radar Scanner */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#06B6D4] border-r-[#8B5CF6] shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-3 rounded-full border-4 border-transparent border-b-[#EC4899] border-l-[#8B5CF6]"
              />
              <div className="w-20 h-20 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center backdrop-blur-xl">
                <Video className="w-8 h-8 text-[#06B6D4] animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold font-space text-white flex items-center justify-center gap-1">
                Searching Global Radar
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1], delay: 0.2 }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1], delay: 0.4 }}>.</motion.span>
              </h2>
              <p className="text-slate-400 text-xs font-medium">Scanning 30+ language peers worldwide</p>
            </div>
            
            <button 
              onClick={handleCancelSearch}
              className="px-8 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-slate-300 font-semibold hover:bg-white/10 transition-all active:scale-95 text-sm"
            >
              Cancel Match
            </button>
          </motion.div>
        </div>
      )}

      {matchState === 'MATCHED' && (
        <div className="flex-1 relative flex flex-col md:flex-row p-4 gap-4 pb-24">
          
          <div className="flex-1 h-full relative">
            <VideoTile 
              stream={remoteStream || localStream} 
              isBlurred={isBlurred} 
              isLocal={false} 
              userName={remoteUserName} 
              isAudioMuted={false} 
            />
          </div>

          <div className="absolute bottom-28 right-8 w-32 h-48 md:w-48 md:h-72 z-20">
            <VideoTile 
              stream={localStream} 
              isBlurred={false} 
              isLocal={true} 
              userName="You" 
              isAudioMuted={isMuted} 
            />
          </div>

          {countdown > 0 && isBlurred && (
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: `${(countdown / 15) * 100}%` }}
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
              />
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#080810]/80 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 z-40">
            <button 
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isVideoOff ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-full transition-colors ${showChat ? 'bg-violet-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <MessageSquare className="w-6 h-6" />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button 
              onClick={handleEndCall}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2">
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {showRevealModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#080810] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
                >
                  <h3 className="text-2xl font-space font-bold text-white mb-2">Reveal your face?</h3>
                  <p className="text-slate-400 mb-8">Time's up! Do you want to remove the blur and continue the call?</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleRevealVote(false)}
                      className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" /> No, end
                    </button>
                    <button 
                      onClick={() => handleRevealVote(true)}
                      className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" /> Yes 😊
                    </button>
                  </div>
                  <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: 0 }}
                      transition={{ duration: 10, ease: "linear" }}
                      className="h-full bg-slate-500"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showChat && (
              <motion.div 
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-28 left-4 right-4 md:left-auto md:right-auto md:w-80 h-[40%] bg-[#080810]/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col z-30 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h4 className="font-space font-bold text-white">Chat</h4>
                  <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center my-auto">Say hello!</p>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'You' ? 'bg-violet-600 text-white self-end rounded-br-sm' : 'bg-white/10 text-slate-200 self-start rounded-bl-sm'}`}>
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button type="submit" disabled={!chatInput.trim()} className="bg-violet-600 text-white p-2 rounded-xl disabled:opacity-50">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
