import { motion } from 'motion/react';

export function LoadingView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center pointer-events-none w-full h-full"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs md:text-sm tracking-[0.4em] font-bold text-gray-800 uppercase">
          Synthesizing Data
        </div>
        <div className="w-64 h-[2px] bg-gray-300 overflow-hidden relative">
          <motion.div 
            className="h-full bg-orange-500 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "circInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function LoadingDetailView({ title }: { title: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full bg-white/80 backdrop-blur-md p-6 h-[60vh] flex items-center justify-center border border-gray-200 text-[10px] tracking-widest uppercase text-gray-400 font-bold">
       {title}
    </motion.div>
  );
}

export function EmptyDetailView({ title }: { title: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full bg-white/80 backdrop-blur-md p-6 h-[60vh] flex items-center justify-center border border-gray-200 text-[10px] tracking-widest uppercase text-gray-400 font-bold">
       {title}
    </motion.div>
  );
}
