import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] text-white z-10"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 overflow-hidden opacity-40">
         <motion.div 
          className="absolute inset-x-8 top-1/4 bottom-1/4 bg-white/5 rounded-3xl border border-white/10 flex flex-col p-8 gap-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
         >
           <div className="w-1/3 h-4 bg-white/20 rounded-full" />
           <div className="w-3/4 h-4 bg-white/10 rounded-full" />
           <div className="w-full h-4 bg-white/10 rounded-full" />
           <div className="w-5/6 h-4 bg-white/10 rounded-full" />
           <div className="w-1/2 h-4 bg-white/10 rounded-full" />
         </motion.div>
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-8 w-full">
        <h2 className="text-[14vw] leading-[1] font-black tracking-tighter uppercase mb-6">
          <motion.span 
            className="block"
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            Vet du inte
          </motion.span>
          <motion.span 
            className="block text-[#0a7ea4]"
            initial={{ opacity: 0, x: 50 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            vad du ska
          </motion.span>
          <motion.span 
            className="block"
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            skriva?
          </motion.span>
        </h2>
      </div>
    </motion.div>
  );
}
