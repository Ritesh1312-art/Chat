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
      setIsBlurred(true);
      setShowRevealModal(false);
      setRemoteUserName('User' + Math.floor(Math.random() * 1000));
    }, 3000);
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
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center max-w-md w-full"
          >
            <div className="mb-12 relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute w-48 h-48 rounded-full bg-violet-600 blur-[80px]"
              />
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.4)]">
                <Video className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-4 text-center">
              Zone A
            </h1>
            <p className="text-slate-400 text-lg text-center mb-10">Ready to meet someone new?</p>
            
            <button 
              onClick={handleStartMatching}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Start Matching
            </button>
            
            <div className="flex gap-4 mt-8">
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-300">Online now: ~1.2K</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">Avg wait: &lt;10s</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {matchState === 'SEARCHING' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-violet-500 opacity-80"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyan-400 border-l-violet-500 opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold font-space text-white mb-2 flex items-center gap-1">
              Finding your match
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1], delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1], delay: 0.4 }}>.</motion.span>
            </h2>
            
            <button 
              onClick={handleCancelSearch}
              className="mt-12 px-8 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
            >
              Cancel
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
