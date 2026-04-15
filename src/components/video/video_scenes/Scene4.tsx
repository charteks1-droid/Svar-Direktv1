import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const steps = [
    { num: "1", text: "Kopiera" },
    { num: "2", text: "Anpassa" },
    { num: "3", text: "Skicka" }
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-white text-[#0f172a] z-10"
      initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative z-20 flex flex-col items-start px-12 w-full h-full justify-center gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex items-center gap-8 w-full"
            initial={{ opacity: 0, x: -100 }}
            animate={phase >= i + 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-20 h-20 rounded-full bg-[#0a7ea4] text-white flex items-center justify-center text-[8vw] font-black shrink-0">
              {step.num}
            </div>
            <div className="text-[12vw] font-black tracking-tighter uppercase">
              {step.text}.
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-2 bg-[#0a7ea4]"
        initial={{ width: "0%" }}
        animate={phase >= 1 ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 6, ease: "linear" }}
      />
    </motion.div>
  );
}
