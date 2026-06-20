'use client';

import { motion } from 'framer-motion';

interface ProgressTrailProps {
  stage: number; // 0 to 4
  totalStages: number; // usually 5
}

export function ProgressTrail({
  stage,
  totalStages,
}: ProgressTrailProps) {
  
  // Calculate the percentage of path drawn (0 to 1)
  const drawProgress = stage / (totalStages - 1);

  return (
    <div className="w-full relative px-4 py-8 flex flex-col items-center justify-center">
      
      {/* 
        The SVG Timeline: A winding vine path.
        We use an SVG path with pathLength mapped to the stage progress.
      */}
      <div className="w-full max-w-lg relative h-16">
        
        {/* SVG Container */}
        <svg 
          viewBox="0 0 400 60" 
          className="w-full h-full absolute inset-0 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="vine-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
            
            <filter id="vine-blur">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track (dimmed root/vine) */}
          <path 
            d="M20,30 Q100,0 200,30 T380,30" 
            fill="none" 
            stroke="#14532D" 
            strokeWidth="2" 
            strokeLinecap="round"
            opacity="0.15"
          />

          {/* Animated Glowing Vine */}
          <motion.path 
            d="M20,30 Q100,0 200,30 T380,30" 
            fill="none" 
            stroke="url(#vine-glow)" 
            strokeWidth="3" 
            strokeLinecap="round"
            filter="url(#vine-blur)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: drawProgress }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Milestone Stones */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          {Array.from({ length: totalStages }).map((_, index) => {
            const isReached = index <= stage;
            const isActive = index === stage;

            // Approximate visual positioning to match the curve
            // The curve dips up then down, we can just center them vertically for simplicity,
            // but let's give them a subtle Y offset to match the `Q100,0 200,30 T380,30` path.
            // X goes from 0 to 100%. Y offset varies.
            // X=0 -> Y=0 (center)
            // X=25% -> Y=-15px (peak)
            // X=50% -> Y=0 (center)
            // X=75% -> Y=+15px (valley)
            // X=100% -> Y=0 (center)
            const yOffsets = [0, -10, 0, 10, 0];

            return (
              <motion.div
                key={index}
                className="relative"
                style={{
                  top: `${yOffsets[index]}px`
                }}
                initial={{
                  scale: isActive ? 1.4 : isReached ? 1 : 0.6,
                  opacity: isReached ? 1 : 0.3,
                }}
                animate={{
                  scale: isActive ? 1.4 : isReached ? 1 : 0.6,
                  opacity: isReached ? 1 : 0.3,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* The milestone stone */}
                <div 
                  className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                    isActive ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' 
                    : isReached ? 'bg-green-400' 
                    : 'bg-green-900/40'
                  }`}
                />
                
                {/* Active glow pulse effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-300 -z-10"
                    animate={{
                      scale: [1, 2.5, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Subtle helper text */}
      <motion.p 
        key={stage} // forces re-animation on stage change
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-[10px] md:text-xs text-green-800/50 uppercase tracking-[0.2em] font-semibold"
      >
        {stage === 0 && "Gieo mầm hy vọng"}
        {stage === 1 && "Chồi non hé mở"}
        {stage === 2 && "Cây non vươn cành"}
        {stage === 3 && "Tán lá xum xuê"}
        {stage === 4 && "Trí tuệ nghìn năm"}
      </motion.p>
    </div>
  );
}
