import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MicOff, User } from 'lucide-react';

interface VideoTileProps {
  stream: MediaStream | null;
  isBlurred: boolean;
  isLocal: boolean;
  userName: string;
  isAudioMuted: boolean;
}

export default function VideoTile({ stream, isBlurred, isLocal, userName, isAudioMuted }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl bg-[#080810] border border-white/10 ${isLocal ? 'shadow-lg' : ''}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLocal ? 'scale-x-[-1]' : ''
          } ${isBlurred && !isLocal ? 'blur-[50px]' : ''}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080810]/50 backdrop-blur-sm">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-4"
          >
            <User className="w-10 h-10 text-violet-400" />
          </motion.div>
          <p className="text-white font-medium">{userName || 'Connecting...'}</p>
        </div>
      )}

      {isBlurred && !isLocal && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-medium text-white text-shadow-sm">15s Blur</span>
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-sm font-medium text-white flex items-center gap-2">
          {userName || (isLocal ? 'You' : 'Stranger')}
          {isAudioMuted && <MicOff className="w-4 h-4 text-red-400" />}
        </div>
      </div>
      
      {/* Audio Wave Indicator (simulated) */}
      {!isAudioMuted && stream && !isLocal && (
        <div className="absolute top-4 right-4 flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 12, 4] }}
              transition={{ repeat: Infinity, duration: 0.5 + i * 0.2 }}
              className="w-1 bg-cyan-400 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
