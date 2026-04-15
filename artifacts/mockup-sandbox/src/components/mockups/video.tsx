import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENES = [0, 1, 2, 3, 4];
const DURATIONS = [5000, 6000, 7000, 6000, 6000];
const TOTAL = DURATIONS.reduce((a, b) => a + b, 0);

const PRIMARY = "#0a7ea4";
const NAVY = "#0f172a";
const LIGHT = "#e0f2fe";

function useScene() {
  const [scene, setScene] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(Date.now());

  useEffect(() => {
    const tick = setInterval(() => {
      const t = (Date.now() - start.current) % TOTAL;
      setElapsed(t);
      let acc = 0;
      for (let i = 0; i < DURATIONS.length; i++) {
        acc += DURATIONS[i];
        if (t < acc) { setScene(i); break; }
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  const sceneStart = DURATIONS.slice(0, scene).reduce((a, b) => a + b, 0);
  const sceneElapsed = elapsed - sceneStart;
  const sceneDuration = DURATIONS[scene];
  const progress = Math.min(sceneElapsed / sceneDuration, 1);

  return { scene, progress };
}

function FloatingOrb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{ left: x, top: y, width: size, height: size, background: color, opacity: 0.25 }}
      animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.15, 0.9, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function Scene0() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <div className="w-24 h-32 rounded-xl flex flex-col items-center justify-start p-3 shadow-2xl"
          style={{ background: "white" }}>
          <div className="w-full h-2 rounded mb-2" style={{ background: "#e2e8f0" }} />
          <div className="w-3/4 h-1.5 rounded mb-1.5" style={{ background: "#e2e8f0" }} />
          <div className="w-full h-1.5 rounded mb-1.5" style={{ background: "#e2e8f0" }} />
          <div className="w-5/6 h-1.5 rounded mb-3" style={{ background: "#e2e8f0" }} />
          <div className="w-16 h-6 rounded-lg flex items-center justify-center"
            style={{ background: PRIMARY }}>
            <div className="w-8 h-1 rounded" style={{ background: "white" }} />
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-lg font-semibold mb-3 text-center"
        style={{ color: LIGHT }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Fick du ett brev från
      </motion.p>

      <motion.h1
        className="text-5xl font-black text-center leading-tight"
        style={{ color: "white", letterSpacing: "-0.02em" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 250 }}
      >
        myndig&shy;heten?
      </motion.h1>

      <motion.div
        className="mt-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        {["Skatteverket", "FK", "Kronofogden"].map((label, i) => (
          <motion.div
            key={label}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: `${PRIMARY}33`, color: LIGHT, border: `1px solid ${PRIMARY}66` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 + i * 0.15 }}
          >
            {label}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Scene1() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="w-64 h-80 rounded-2xl shadow-2xl mb-8 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "white" }}
        initial={{ rotateY: 25, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="absolute inset-0 flex flex-col p-5 gap-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: `${PRIMARY}22` }} />
            <div>
              <div className="w-24 h-2 rounded mb-1" style={{ background: "#cbd5e1" }} />
              <div className="w-16 h-1.5 rounded" style={{ background: "#e2e8f0" }} />
            </div>
          </div>
          {[1, 0.7, 0.9, 0.6, 0.8, 0.5].map((w, i) => (
            <div key={i} className="h-1.5 rounded" style={{ background: "#e2e8f0", width: `${w * 100}%` }} />
          ))}
          <motion.div
            className="mt-3 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "#fef2f2", border: "1px dashed #fca5a5" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-medium" style={{ color: "#ef4444" }}>Tomt svar…</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl font-black text-center leading-tight mb-4"
        style={{ color: "white" }}
        initial={{ opacity: 0, y: 25 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
        transition={{ duration: 0.5 }}
      >
        Vet du inte vad<br />du ska skriva?
      </motion.h1>

      <motion.p
        className="text-center text-base"
        style={{ color: `${LIGHT}cc` }}
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        Du är inte ensam.
      </motion.p>

      <motion.p
        className="text-center text-base mt-2"
        style={{ color: `${LIGHT}99` }}
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        Men det finns hjälp.
      </motion.p>
    </motion.div>
  );
}

function Scene2() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => setPhase(4), 2600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const authorities = ["Skatteverket", "Försäkringskassan", "Kronofogden", "Migrationsverket"];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="mb-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase"
        style={{ background: `${PRIMARY}33`, color: PRIMARY, border: `1px solid ${PRIMARY}55` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        Svar Direkt
      </motion.div>

      <motion.h1
        className="text-5xl font-black text-center leading-none mb-2"
        style={{ color: "white", letterSpacing: "-0.03em" }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        52+ färdiga
      </motion.h1>
      <motion.h1
        className="text-5xl font-black text-center leading-none mb-6"
        style={{ color: PRIMARY, letterSpacing: "-0.03em" }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 300 }}
      >
        mallar
      </motion.h1>

      <div className="w-full flex flex-col gap-2.5">
        {authorities.map((auth, i) => (
          <motion.div
            key={auth}
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            initial={{ opacity: 0, x: 50 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.12, type: "spring", stiffness: 280 }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: PRIMARY }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 12l4-4 2 2 4-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold" style={{ color: "white" }}>{auth}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="mt-5 text-sm text-center"
        style={{ color: `${LIGHT}88` }}
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : {}}
      >
        Alla situationer. Korrekt svenska.
      </motion.p>
    </motion.div>
  );
}

function Scene3() {
  const steps = [
    { num: "1", label: "Kopiera", sub: "välj din situation" },
    { num: "2", label: "Anpassa", sub: "fyll i dina uppgifter" },
    { num: "3", label: "Skicka", sub: "klart på minuter" },
  ];
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className="text-lg font-semibold mb-2 text-center"
        style={{ color: LIGHT }}
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : {}}
      >
        Så enkelt är det
      </motion.p>

      <motion.h1
        className="text-5xl font-black text-center mb-10 leading-none"
        style={{ color: "white" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 250 }}
      >
        3 steg.<br />Klart.
      </motion.h1>

      <div className="w-full flex flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex items-center gap-4 rounded-2xl px-5 py-4"
            style={{ background: i === 1 ? PRIMARY : "rgba(255,255,255,0.07)", border: `1px solid ${i === 1 ? "transparent" : "rgba(255,255,255,0.1)"}` }}
            initial={{ opacity: 0, x: -40 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.18, type: "spring", stiffness: 260 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg"
              style={{ background: i === 1 ? "rgba(255,255,255,0.2)" : PRIMARY, color: "white" }}
            >
              {step.num}
            </div>
            <div>
              <div className="font-bold text-white text-base">{step.label}</div>
              <div className="text-xs mt-0.5" style={{ color: i === 1 ? "rgba(255,255,255,0.75)" : `${LIGHT}88` }}>{step.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Scene4() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
        style={{ background: PRIMARY }}
        initial={{ scale: 0, rotate: -20 }}
        animate={phase >= 1 ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="8" width="28" height="36" rx="4" fill="white" fillOpacity="0.2" />
          <rect x="10" y="8" width="28" height="36" rx="4" stroke="white" strokeWidth="2" />
          <path d="M17 20h14M17 26h10M17 32h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="36" r="8" fill="white" />
          <path d="M32 36l2.5 2.5L39 33" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
      >
        <div className="text-6xl font-black" style={{ color: "white", letterSpacing: "-0.04em" }}>49 kr</div>
        <div className="text-sm mt-1" style={{ color: `${LIGHT}99` }}>Engångspris · Ingen prenumeration</div>
      </motion.div>

      <motion.div
        className="w-full rounded-2xl px-5 py-4 mt-4 text-center"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="font-bold text-white text-lg mb-1">svardirekt.site</div>
        <div className="text-sm" style={{ color: `${LIGHT}88` }}>Ladda ner appen idag</div>
      </motion.div>

      <motion.div
        className="mt-8 px-8 py-4 rounded-2xl font-black text-xl text-white text-center"
        style={{ background: PRIMARY }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={phase >= 3 ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Svar Direkt
      </motion.div>
      <motion.p
        className="mt-3 text-sm text-center font-semibold"
        style={{ color: `${LIGHT}cc` }}
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        Skriv rätt. Få svar. Sluta stressa.
      </motion.p>
    </motion.div>
  );
}

export default function Video() {
  const { scene } = useScene();

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ width: "100vw", height: "100dvh", background: NAVY, maxWidth: 430, margin: "0 auto" }}
    >
      {/* Persistent ambient orbs */}
      <FloatingOrb x="10%" y="5%" size={220} delay={0} color={PRIMARY} />
      <FloatingOrb x="55%" y="60%" size={280} delay={2} color="#0369a1" />
      <FloatingOrb x="-5%" y="55%" size={180} delay={4} color="#075985" />

      {/* Persistent midground accent — moves with scene */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 80, height: 80, background: `${PRIMARY}44`, filter: "blur(20px)" }}
        animate={{
          left: ["75%", "10%", "60%", "20%", "70%"][scene],
          top: ["10%", "75%", "15%", "60%", "20%"][scene],
          scale: [1, 1.5, 0.8, 1.2, 1][scene],
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full"
          style={{ background: PRIMARY }}
          animate={{ width: `${((scene + 1) / SCENES.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Scene counter dots */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {SCENES.map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ height: 3, background: i === scene ? "white" : "rgba(255,255,255,0.25)" }}
            animate={{ width: i === scene ? 20 : 6 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Scenes */}
      <AnimatePresence mode="popLayout">
        {scene === 0 && <Scene0 key="s0" />}
        {scene === 1 && <Scene1 key="s1" />}
        {scene === 2 && <Scene2 key="s2" />}
        {scene === 3 && <Scene3 key="s3" />}
        {scene === 4 && <Scene4 key="s4" />}
      </AnimatePresence>
    </div>
  );
}
