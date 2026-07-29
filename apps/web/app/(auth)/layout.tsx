import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05050A] text-[#F1F5F9] relative overflow-hidden flex flex-col items-center justify-center font-['Inter'] selection:bg-[#7C3AED] selection:text-white">
      {/* Animated Mesh Gradient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#7C3AED]/30 to-[#8B5CF6]/10 blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#06B6D4]/30 to-[#3B82F6]/10 blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#EC4899]/15 to-[#7C3AED]/15 blur-[100px] pointer-events-none" />

      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div 
            key={i} 
            className="particle absolute bg-gradient-to-r from-white/20 to-cyan-300/20 rounded-full" 
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 15 + 12}s linear infinite`,
              animationDelay: `-${Math.random() * 15}s`
            }} 
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(-90vh) scale(1.2); opacity: 0; }
        }
      `}</style>

      {/* Top Live Status Bar */}
      <div className="z-10 mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-300 tracking-wide">
          14,892 Vibes Active Worldwide
        </span>
      </div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-md px-4">
        {children}
      </div>

      {/* Footer Terms & Badges */}
      <div className="z-10 mt-8 text-slate-500 text-xs text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-400 font-medium">
          <span>🛡️ Encrypted</span>
          <span>•</span>
          <span>🚨 Panic Shield</span>
          <span>•</span>
          <span>🌐 30+ Languages</span>
        </div>
        <p>
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#06B6D4] hover:underline transition-colors">Terms of Service</a> &{' '}
          <a href="#" className="text-[#06B6D4] hover:underline transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
