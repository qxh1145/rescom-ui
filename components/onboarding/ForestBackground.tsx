'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ForestBackgroundProps {
  stage: number; // 0 to 4
}

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export function ForestBackground({ stage }: ForestBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Background color progression based on the stage
  // Stage 0: Empty meadow, foggy (#F0FDF4)
  // Stage 1: Sprout (#E6F9EC)
  // Stage 2: Sapling (#DCFCE7)
  // Stage 3: Mature (#BBF7D0)
  // Stage 4: Ancient (#064E3B - very dark magical green)
  const bgColors = [
    '#F0FDF4', 
    '#E6F9EC', 
    '#DCFCE7', 
    '#BBF7D0', 
    '#064E3B', 
  ];

  const currentBg = bgColors[stage] || bgColors[0];
  
  // Environment element visibility
  const showFlowers = stage >= 1;
  const showGrass = stage >= 2;
  const showBushes = stage >= 3;
  const showFireflies = stage >= 4;

  const particleCount = mounted ? (showFireflies ? 35 : 15 + stage * 5) : 0;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-[2000ms] ease-in-out" style={{ backgroundColor: currentBg }}>
      
      {/* Sun/Light Ray coming from top corner (fades out slightly in stage 4 for a darker mood) */}
      <motion.div 
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: stage === 4 ? [0.1, 0.2, 0.1] : [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fog effect at Stage 0 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-white/60 to-transparent"
        initial={{ opacity: stage === 0 ? 1 : 0 }}
        animate={{ opacity: stage === 0 ? 1 : 0 }}
        transition={{ duration: 2 }}
      />

      {/* Ground Layers */}
      
      {/* Layer 1 - Back */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[30vh]"
        animate={{ 
          y: stage === 0 ? 50 : 0,
          opacity: stage === 4 ? 0.3 : 0.4 
        }}
        transition={{ duration: 1.5 }}
      >
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-green-800">
          <path d="M0 200 L0 100 Q200 150 400 80 T800 120 T1000 90 L1000 200 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Layer 2 - Middle (Bushes appear here) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[25vh]"
        animate={{ 
          y: stage <= 1 ? 50 : 0,
          opacity: stage === 4 ? 0.5 : 0.6 
        }}
        transition={{ duration: 1.5 }}
      >
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full text-green-700">
          <path d="M0 200 L0 120 Q150 70 300 140 T600 100 T1000 130 L1000 200 Z" fill="currentColor" />
        </svg>
        
        {/* Animated Bushes (Stage 3+) */}
        <motion.div 
          className="absolute bottom-[20%] left-[15%] w-32 h-24 rounded-t-full bg-green-800 blur-[2px]"
          animate={{ scale: showBushes ? 1 : 0, opacity: showBushes ? 0.8 : 0 }}
          transition={{ duration: 1.5, type: 'spring' }}
          style={{ transformOrigin: 'bottom' }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[20%] w-48 h-32 rounded-t-full bg-green-800 blur-[2px]"
          animate={{ scale: showBushes ? 1 : 0, opacity: showBushes ? 0.7 : 0 }}
          transition={{ duration: 1.8, type: 'spring' }}
          style={{ transformOrigin: 'bottom' }}
        />
      </motion.div>

      {/* Layer 3 - Front (Grass and Flowers) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[15vh]"
        animate={{ 
          opacity: stage === 4 ? 0.8 : 1 
        }}
        transition={{ duration: 1.5 }}
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full text-green-600">
          <path d="M0 100 L0 50 Q250 80 500 40 T1000 60 L1000 100 Z" fill="currentColor" />
        </svg>

        {/* Flowers (Stage 1+) */}
        <div className="absolute inset-x-0 bottom-0 h-full">
          {mounted && Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`flower-${i}`}
              className="absolute w-3 h-3 rounded-full bg-yellow-300 blur-[1px]"
              style={{
                left: `${10 + i * 15}%`,
                bottom: `${random(20, 60)}%`,
              }}
              animate={{ 
                scale: showFlowers ? [1, 1.2, 1] : 0, 
                opacity: showFlowers ? 0.8 : 0 
              }}
              transition={{ 
                scale: { duration: random(2, 4), repeat: Infinity },
                opacity: { duration: 1 }
              }}
            />
          ))}
        </div>

        {/* Richer Grass Blades (Stage 2+) */}
        {showGrass && (
          <div className="absolute inset-x-0 bottom-0 h-full opacity-40">
            {mounted && Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`grass-${i}`}
                className="absolute bottom-0 w-1 bg-green-900 rounded-t-full"
                style={{
                  left: `${random(0, 100)}%`,
                  height: `${random(20, 50)}%`,
                  transformOrigin: 'bottom',
                }}
                animate={{ rotate: [random(-10, 0), random(0, 10), random(-10, 0)] }}
                transition={{ duration: random(3, 5), repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Particles (Leaves / Fireflies) */}
      {mounted && Array.from({ length: particleCount }).map((_, i) => {
        // In stage 4, almost all particles are fireflies. Otherwise mostly leaves.
        const isFirefly = showFireflies ? Math.random() > 0.1 : (stage > 2 && Math.random() > 0.7);
        const size = isFirefly ? random(3, 7) : random(10, 20);
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: isFirefly ? '#FACC15' : '#4ADE80',
              opacity: isFirefly ? 0.8 : 0.3,
              boxShadow: isFirefly ? '0 0 12px 3px rgba(250, 204, 21, 0.6)' : 'none',
              filter: isFirefly ? 'none' : 'blur(1px)',
              left: `${random(-10, 110)}%`,
              top: `${random(-10, 110)}%`,
            }}
            animate={{
              y: [0, random(-100, -300)],
              x: [0, random(-50, 50)],
              rotate: isFirefly ? 0 : [0, random(180, 360)],
              opacity: [0, isFirefly ? 0.9 : 0.5, 0],
            }}
            transition={{
              duration: random(8, 18),
              repeat: Infinity,
              ease: 'linear',
              delay: random(0, 10),
            }}
          >
            {!isFirefly && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform -rotate-45">
                 <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.4C8 18 10 14 12 10c2 4 4 8 5.5 10.4C20.2 18.6 22 15.5 22 12c0-5.5-4.5-10-10-10z" />
              </svg>
            )}
          </motion.div>
        );
      })}

      {/* Overlay gradient to soften the bottom and add ancient magic feel at Stage 4 */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none" 
        animate={{
          background: stage === 4 
            ? 'linear-gradient(to top, rgba(6, 78, 59, 0.9), transparent)' 
            : 'linear-gradient(to top, rgba(20, 83, 45, 0.1), transparent)'
        }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}
