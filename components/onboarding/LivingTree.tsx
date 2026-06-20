'use client';

import { motion } from 'framer-motion';

interface LivingTreeProps {
  stage: number; // 0 to 4
}

export function LivingTree({ stage }: LivingTreeProps) {
  const growthTransition = {
    type: 'spring' as const,
    stiffness: 50,
    damping: 15,
    mass: 1,
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto flex items-end justify-center pointer-events-none select-none mb-10">
      
      {/* 
        ==================================================
        ANCIENT AURA (Stage 4)
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[100px] w-[600px] h-[600px] flex items-center justify-center origin-bottom"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: stage === 4 ? 1 : 0,
          scale: stage === 4 ? 1 : 0.5
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="w-full h-full rounded-full bg-green-300/20 blur-3xl mix-blend-screen" />
        {/* Fireflies / Magic Dust */}
        {stage === 4 && Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_15px_rgba(253,224,71,1)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, -20 + Math.random() * 40, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* 
        ==================================================
        ANCIENT ROOTS (Stage 4)
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[-10px] w-[400px] h-[100px] origin-bottom"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ 
          opacity: stage === 4 ? 1 : 0,
          scaleY: stage === 4 ? 1 : 0
        }}
        transition={growthTransition}
      >
        <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
          {/* Left Root */}
          <path d="M 200,20 Q 100,50 20,80" fill="none" stroke="#5D4037" strokeWidth="16" strokeLinecap="round" />
          <path d="M 200,20 Q 100,50 20,80" fill="none" stroke="#86EFAC" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
          
          {/* Right Root */}
          <path d="M 200,20 Q 300,50 380,70" fill="none" stroke="#5D4037" strokeWidth="20" strokeLinecap="round" />
          <path d="M 200,20 Q 300,50 380,70" fill="none" stroke="#86EFAC" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
          
          {/* Small side roots */}
          <path d="M 120,45 Q 80,80 50,100" fill="none" stroke="#4E342E" strokeWidth="10" strokeLinecap="round" />
          <path d="M 280,45 Q 320,80 340,110" fill="none" stroke="#4E342E" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </motion.div>


      {/* 
        ==================================================
        MAIN TRUNK (Stage 2+)
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[30px] w-[140px] h-[240px] origin-bottom"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: stage >= 2 ? 1 : 0,
          scale: stage === 2 ? 0.6 : stage === 3 ? 1 : stage === 4 ? 1.3 : 0,
        }}
        transition={growthTransition}
      >
        <svg viewBox="0 0 140 240" className="w-full h-full overflow-visible">
          {/* Main Trunk Shape */}
          <path 
            d="
              M 40,240 
              C 50,180 60,120 60,80 
              C 50,60 30,30 10,10
              C 30,20 50,40 65,70
              C 70,50 75,20 80,0
              C 85,20 90,50 95,70
              C 110,40 130,20 140,15
              C 120,30 100,60 90,80
              C 90,120 100,180 110,240 
              Z" 
            fill="#6D4C41" 
          />
          {/* Bark Shadow / Texture for 3D effect */}
          <path 
            d="
              M 40,240 
              C 50,180 60,120 60,80 
              C 50,60 30,30 10,10
              C 20,25 35,45 45,70
              C 45,120 35,180 45,240 Z" 
            fill="#5D4037" 
          />
          <path 
            d="
              M 80,0
              C 85,20 90,50 95,70
              C 110,40 130,20 140,15
              C 125,25 110,50 105,75
              C 105,120 115,180 110,240
              L 90,240
              C 80,180 90,120 90,80
              C 85,50 80,20 80,0 Z" 
            fill="#5D4037" 
          />
          {/* Bark Lines */}
          <path d="M 65,230 Q 70,150 65,90" fill="none" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M 85,220 Q 80,140 85,100" fill="none" stroke="#4E342E" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      </motion.div>


      {/* 
        ==================================================
        CANOPY (Stage 2+)
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[160px] w-[360px] h-[260px] origin-bottom"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: stage >= 2 ? 1 : 0,
          scale: stage === 2 ? 0.4 : stage === 3 ? 1 : stage === 4 ? 1.4 : 0,
          y: stage === 2 ? 120 : stage === 3 ? 0 : stage === 4 ? -40 : 0
        }}
        transition={growthTransition}
      >
        <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible drop-shadow-2xl">
          {/* Back dark canopy */}
          <g fill="#1B5E20">
            <circle cx="180" cy="130" r="120" />
            <circle cx="90" cy="160" r="80" />
            <circle cx="270" cy="160" r="80" />
            <circle cx="120" cy="70" r="90" />
            <circle cx="240" cy="70" r="90" />
          </g>
          
          {/* Mid green canopy */}
          <g fill="#2E7D32">
            <circle cx="180" cy="120" r="110" />
            <circle cx="100" cy="150" r="70" />
            <circle cx="260" cy="150" r="70" />
            <circle cx="130" cy="60" r="80" />
            <circle cx="230" cy="60" r="80" />
            {/* Fluffy edge bumps */}
            <circle cx="50" cy="120" r="50" />
            <circle cx="310" cy="120" r="50" />
            <circle cx="180" cy="20" r="60" />
          </g>
          
          {/* Light highlight canopy (gives 3D cartoon volume) */}
          <g fill="#4CAF50">
            <circle cx="170" cy="100" r="95" />
            <circle cx="110" cy="130" r="55" />
            <circle cx="240" cy="130" r="60" />
            <circle cx="140" cy="50" r="65" />
            <circle cx="210" cy="50" r="65" />
            <circle cx="70" cy="100" r="40" />
            <circle cx="280" cy="100" r="45" />
            <circle cx="170" cy="10" r="50" />
          </g>

          {/* Extra Highlights */}
          <g fill="#81C784" opacity="0.8">
            <path d="M 170,5 A 45,45 0 0,0 125,50 A 45,45 0 0,1 170,15 Z" />
            <path d="M 140,40 A 55,55 0 0,0 85,95 A 55,55 0 0,1 140,50 Z" />
            <path d="M 210,40 A 55,55 0 0,0 155,95 A 55,55 0 0,1 210,50 Z" />
            <path d="M 280,75 A 35,35 0 0,0 245,110 A 35,35 0 0,1 280,85 Z" />
            <path d="M 70,75 A 35,35 0 0,0 35,110 A 35,35 0 0,1 70,85 Z" />
          </g>

          {/* Random decorative floating leaves around the canopy */}
          <g fill="#66BB6A">
            <path d="M 40,40 C 20,30 30,10 40,40 Z" />
            <path d="M 320,50 C 340,40 330,20 320,50 Z" />
            <path d="M 100,-10 C 110,-25 120,-10 100,-10 Z" />
          </g>
        </svg>
      </motion.div>


      {/* 
        ==================================================
        STAGE 1: SPROUT (Visible only at Stage 1)
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[25px] w-[60px] h-[80px] origin-bottom"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: stage === 1 ? 1 : 0,
          scale: stage === 1 ? 1 : 0,
          y: stage === 1 ? 0 : -20 // moves up slightly when growing out of it
        }}
        transition={growthTransition}
      >
        <svg viewBox="0 0 60 80" className="w-full h-full overflow-visible">
          {/* Stem */}
          <path d="M 30,80 Q 30,40 30,20" fill="none" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" />
          {/* Left Leaf */}
          <path d="M 30,40 C 10,40 0,20 15,15 C 25,10 30,30 30,40 Z" fill="#66BB6A" />
          {/* Right Leaf */}
          <path d="M 30,30 C 50,30 60,10 45,5 C 35,0 30,20 30,30 Z" fill="#4CAF50" />
        </svg>
      </motion.div>


      {/* 
        ==================================================
        SOIL MOUND (Base)
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[-10px] w-[200px] h-[50px] origin-bottom"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1,
          scaleX: stage === 0 ? 0.8 : stage === 1 ? 1 : stage === 2 ? 1.2 : stage === 3 ? 1.5 : 1.8,
          scaleY: stage === 0 ? 0.8 : stage === 1 ? 1 : stage === 2 ? 1.1 : stage === 3 ? 1.3 : 1.5,
        }}
        transition={growthTransition}
      >
        <svg viewBox="0 0 200 50" className="w-full h-full overflow-visible">
          {/* Main Soil Base */}
          <ellipse cx="100" cy="25" rx="100" ry="25" fill="#4E342E" />
          <ellipse cx="100" cy="20" rx="85" ry="18" fill="#5D4037" />
          <ellipse cx="100" cy="15" rx="60" ry="12" fill="#6D4C41" />
          
          {/* Pebbles / Soil Texture */}
          <circle cx="40" cy="30" r="3" fill="#3E2723" />
          <circle cx="60" cy="35" r="4" fill="#3E2723" />
          <circle cx="150" cy="28" r="5" fill="#3E2723" />
          <circle cx="170" cy="22" r="3" fill="#3E2723" />
          <circle cx="120" cy="35" r="4" fill="#3E2723" />
          <circle cx="80" cy="40" r="2" fill="#3E2723" />
        </svg>
      </motion.div>


      {/* 
        ==================================================
        STAGE 0: SEED
        ==================================================
      */}
      <motion.div
        className="absolute bottom-[20px] w-[30px] h-[30px] origin-bottom flex items-center justify-center"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: stage === 0 ? 1 : 0,
          scale: stage === 0 ? 1 : 0,
          y: stage === 0 ? 0 : 20 // sinks into soil
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-yellow-400 blur-md"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg viewBox="0 0 30 30" className="w-full h-full relative z-10">
          <ellipse cx="15" cy="15" rx="10" ry="7" fill="#FFB74D" />
          <path d="M 10,15 Q 15,10 20,15" fill="none" stroke="#F57C00" strokeWidth="1.5" />
        </svg>
      </motion.div>

    </div>
  );
}
