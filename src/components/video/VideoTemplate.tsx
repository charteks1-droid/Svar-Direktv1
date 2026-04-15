import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = {
  problem: 5000,
  pain: 5000,
  solution: 7000,
  benefit: 7000,
  cta: 6000
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-[100dvh] md:h-[100dvh] overflow-hidden bg-slate-900 text-white" style={{ aspectRatio: '9/16' }}>
      {/* Persistent background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-[#0a7ea4]"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="problem" />}
        {currentScene === 1 && <Scene2 key="pain" />}
        {currentScene === 2 && <Scene3 key="solution" />}
        {currentScene === 3 && <Scene4 key="benefit" />}
        {currentScene === 4 && <Scene5 key="cta" />}
      </AnimatePresence>
    </div>
  );
}
