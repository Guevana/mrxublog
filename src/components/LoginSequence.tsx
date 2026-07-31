import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Infinity } from 'lucide-react';

export function LoginSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Step 1: Initial pause
      await new Promise(r => setTimeout(r, 150));
      setStep(1); // ACCESS PERMISSION REQUIRED
      
      await new Promise(r => setTimeout(r, 300));
      setStep(2); // Logo + Text
      
      await new Promise(r => setTimeout(r, 600));
      setStep(3); // Circle + Authorized
      
      await new Promise(r => setTimeout(r, 700));
      setStep(4); // Welcome
      
      await new Promise(r => setTimeout(r, 300));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#f5f5f5] flex items-center justify-center text-[#111] font-sans selection:bg-orange-500 selection:text-white z-50">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs md:text-sm tracking-[0.3em] font-medium"
          >
            ACCESS PERMISSION REQUIRED
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-8 md:gap-16"
          >
            <div className="flex flex-col items-center gap-3">
              <Infinity className="w-16 h-16 md:w-24 md:h-24 stroke-[1.5]" />
              <div className="text-[10px] tracking-[0.2em] font-bold text-gray-800">PERSONAL LAB</div>
            </div>
            
            <div className="flex flex-col gap-4 text-[10px] md:text-xs tracking-[0.2em] uppercase text-gray-600">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                <span className="text-gray-900 mr-2">- ID CONFIRMED:</span> ADMINISTRATOR
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <span className="text-gray-900 mr-2">- REQUEST RECEIVED</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <span className="text-gray-900 mr-2">- START PROCESSING...</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center"
          >
            <motion.svg
              className="absolute w-64 h-64 md:w-80 md:h-80 -rotate-90"
              viewBox="0 0 100 100"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="#ccc"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ff6600"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
              />
              {/* Decorative inner dots */}
              <motion.circle cx="50" cy="15" r="1.5" fill="#ff6600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.circle cx="85" cy="50" r="1.5" fill="#ff6600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.circle cx="50" cy="85" r="1.5" fill="#ff6600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.circle cx="15" cy="50" r="1.5" fill="#ff6600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
            </motion.svg>
            <div className="text-xs md:text-sm tracking-[0.3em] font-medium z-10 bg-[#f5f5f5] px-4 py-2">
              PERMISSION AUTHORIZED
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="text-xs md:text-sm tracking-[0.4em] text-gray-500 uppercase">WELCOME TO</div>
            <div className="text-3xl md:text-5xl font-black tracking-[0.2em] text-[#111] uppercase">
              PERSONAL LAB LLC.
            </div>
            <div className="text-xs tracking-[0.4em] text-gray-500 uppercase">INTERNAL DATABASE</div>
            <div className="flex items-center gap-6 mt-6">
              <span className="w-16 h-[1px] bg-gray-300"></span>
              <Infinity className="w-6 h-6 text-gray-400 stroke-[1.5]" />
              <span className="w-16 h-[1px] bg-gray-300"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
