import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] text-white z-10"
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative z-20 flex flex-col items-center text-center px-8 w-full h-full justify-center">
        
        <motion.div
          className="mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-32 h-32 bg-[#0a7ea4] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(10,126,164,0.5)]">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinelinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M9 10h.01"></path>
              <path d="M15 10h.01"></path>
              <path d="M12 10h.01"></path>
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-[14vw] font-black tracking-tighter leading-none mb-4">Svar Direkt</div>
          <div className="text-[5vw] text-white/80 font-medium tracking-wide">Skriv rätt. Få svar. Sluta stressa.</div>
        </motion.div>

        <motion.div
          className="bg-white text-[#0f172a] px-8 py-4 rounded-full mb-8 font-black text-[8vw]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Endast 49 kr
        </motion.div>

        <motion.div
          className="text-[6vw] font-bold text-[#0a7ea4]"
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={phase >= 3 ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.5 }}
        >
          svardirekt.site
        </motion.div>
      </div>
    </motion.div>
  );
}
