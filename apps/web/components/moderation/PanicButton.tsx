'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PanicContextType {
  panicVisible: boolean;
  targetUserId: string | null;
  setPanicTarget: (userId: string) => void;
  clearPanic: () => void;
}

const PanicContext = createContext<PanicContextType>({
  panicVisible: false,
  targetUserId: null,
  setPanicTarget: () => {},
  clearPanic: () => {}
});

export const usePanic = () => useContext(PanicContext);

export const PanicProvider = ({ children }: { children: ReactNode }) => {
  const [panicVisible, setPanicVisible] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  const setPanicTarget = (userId: string) => {
    setTargetUserId(userId);
    setPanicVisible(true);
  };

  const clearPanic = () => {
    setTargetUserId(null);
    setPanicVisible(false);
  };

  return (
    <PanicContext.Provider value={{ panicVisible, targetUserId, setPanicTarget, clearPanic }}>
      {children}
    </PanicContext.Provider>
  );
};

export const PanicButton = () => {
  const { panicVisible, targetUserId, clearPanic } = usePanic();
  const [showModal, setShowModal] = useState(false);
  const [reported, setReported] = useState(false);

  const handlePanicClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    // In real app: socket.emit('PANIC_PRESSED', { targetUserId })
    setReported(true);
    setTimeout(() => {
      setShowModal(false);
      setReported(false);
      clearPanic();
    }, 2000);
  };

  return (
    <>
      <AnimatePresence>
        {panicVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handlePanicClick}
            className="fixed right-4 bottom-[144px] z-50 w-14 h-14 bg-[#EF4444] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:bg-red-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#080810] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl"
            >
              {reported ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-4 text-[#10B981]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#F1F5F9] mb-2 font-['Space_Grotesk']">Reported Successfully</h3>
                  <p className="text-[#64748B] text-sm">User has been blocked and our team will review the interaction.</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#EF4444]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#EF4444]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#F1F5F9] mb-2 font-['Space_Grotesk']">Report & Block</h3>
                  <p className="text-[#64748B] text-sm mb-6">Are you sure you want to report this user? They will be immediately blocked from this session.</p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-[#F1F5F9] hover:bg-white/10 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleConfirm}
                      className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white hover:bg-red-600 transition-colors font-medium"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
