import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const authorities = [
    "Skatteverket",
    "Försäkringskassan",
    "Kronofogden",
    "Migrationsverket"
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a7ea4] text-white z-10"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-8 w-full h-full justify-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-[16vw] font-black tracking-tighter leading-none mb-2">Svar Direkt</div>
          <div className="text-[6vw] font-medium opacity-80 uppercase tracking-widest">52+ färdiga mallar</div>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {authorities.map((auth, i) => (
            <motion.div
              key={auth}
              className="bg-white/10 backdrop-blur-md border border-white/20 py-4 px-6 rounded-2xl text-left flex items-center justify-between"
              initial={{ opacity: 0, x: -50 }}
              animate={phase >= 2 + i ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="text-[5vw] font-bold">{auth}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinelinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
