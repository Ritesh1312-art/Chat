import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080810] text-[#F1F5F9] relative overflow-hidden flex flex-col items-center justify-center font-['Inter']">
       {/* Particles */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
             <div key={i} className="particle absolute bg-white/10 rounded-full" style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 15 + 10}s linear infinite`,
                animationDelay: `-${Math.random() * 15}s`
             }} />
          ))}
       </div>
       <style>{`
         @keyframes float {
           0% { transform: translateY(0) translateX(0); opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { transform: translateY(-100vh) translateX(${Math.random() * 40 - 20}px); opacity: 0; }
         }
       `}</style>
       <div className="z-10 text-center mb-8">
          <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-tighter text-[#7C3AED]" style={{ textShadow: '0 0 20px rgba(124,58,237,0.6)' }}>
             Vibe<span className="text-[#06B6D4]" style={{ textShadow: '0 0 20px rgba(6,182,212,0.6)' }}>Room</span>
          </h1>
       </div>
       <div className="z-10 w-full max-w-md p-8 mx-4 bg-white/[0.05] backdrop-blur-[16px] border border-white/10 rounded-3xl shadow-2xl">
          {children}
       </div>
       <div className="z-10 mt-8 text-[#64748B] text-sm text-center">
          By continuing, you agree to our <br/><a href="#" className="text-[#06B6D4] hover:underline transition-colors">Terms of Service</a> & <a href="#" className="text-[#06B6D4] hover:underline transition-colors">Privacy Policy</a>
       </div>
    </div>
  );
}
