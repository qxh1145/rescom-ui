'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CompletionScreenProps {
  answers: Record<string, string>;
  onComplete: () => void;
}

export function CompletionScreen({ answers, onComplete }: CompletionScreenProps) {
  return (
    <div className="w-[550px] h-[550px] bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_80px_-20px_rgba(34,197,94,0.3)] rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center text-center p-12">
      
      {/* Sparkles Decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
         <Sparkles className="w-24 h-24 text-green-500" />
      </div>
      <div className="absolute bottom-0 left-0 p-8 opacity-10 pointer-events-none">
         <Sparkles className="w-20 h-20 text-emerald-400" />
      </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-green-950 mb-6 font-display"
          >
            Hoàn thành hồ sơ
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-green-800/80 mb-12 text-lg md:text-xl max-w-lg mx-auto leading-relaxed"
          >
            Cảm ơn bạn đã đồng hành cùng Rescom.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            onClick={onComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-3 px-12 py-4 bg-green-950 hover:bg-green-900 text-white rounded-full font-bold text-lg transition-all shadow-[0_10px_30px_rgba(20,83,45,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Bắt đầu trải nghiệm</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.button>

    </div>
  );
}
