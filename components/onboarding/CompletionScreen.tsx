'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface CompletionScreenProps {
  answers: Record<string, string>;
  onComplete: () => void;
}

export function CompletionScreen({ answers, onComplete }: CompletionScreenProps) {
  return (
    <div className="w-[90vw] max-w-[550px] bg-white radius-wobbly border-[3px] border-landing-border shadow-hard relative overflow-hidden flex flex-col items-center justify-center text-center p-10 md:p-14">
      
      {/* Tape Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-10 bg-gray-400/30 backdrop-blur-sm rotate-2 skew-x-12 mix-blend-multiply z-10" />

      {/* Sketched stars */}
      <div className="absolute top-8 right-8 text-landing-accent rotate-12 pointer-events-none opacity-80">
         <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 2L24 14L38 16L26 24L30 38L20 28L10 38L14 24L2 16L16 14L20 2Z" />
         </svg>
      </div>
      <div className="absolute bottom-20 left-8 text-landing-yellow -rotate-12 pointer-events-none opacity-80">
         <svg width="30" height="30" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 2L24 14L38 16L26 24L30 38L20 28L10 38L14 24L2 16L16 14L20 2Z" />
         </svg>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 5 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        className="w-28 h-28 radius-wobbly border-[4px] border-landing-border bg-landing-accent flex items-center justify-center mx-auto mb-8 shadow-hard"
      >
        <Check className="w-16 h-16 text-white stroke-[4]" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold font-kalam text-landing-fg mb-6 leading-tight"
      >
        Hoàn thành hồ sơ!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-landing-fg/80 font-bold mb-12 text-xl max-w-lg mx-auto"
      >
        Cảm ơn bạn đã đồng hành cùng Rescom. Hãy bắt đầu ngay thôi!
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        onClick={onComplete}
        whileHover={{ scale: 1.05, rotate: -1 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center justify-center gap-3 px-10 h-16 bg-landing-yellow hover:bg-landing-accent text-landing-fg hover:text-white border-[3px] border-landing-border radius-wobbly font-bold text-2xl transition-colors shadow-[4px_4px_0_0_#2d2d2d] hover:shadow-[2px_2px_0_0_#2d2d2d] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
      >
        <span className="relative z-10 font-kalam">Bắt đầu trải nghiệm</span>
        <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform stroke-[3]" />
      </motion.button>
    </div>
  );
}
