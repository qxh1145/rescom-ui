'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { onboardingData } from '@/lib/onboarding-data';

interface CompletionScreenProps {
  answers: Record<string, string>;
  onComplete: () => void;
}

export function CompletionScreen({ answers, onComplete }: CompletionScreenProps) {
  
  // Helper to map answers back to readable labels based on our data
  // For a real app, you might map IDs to labels more robustly.
  const summaryItems = [
    { label: 'Tuổi', value: answers['q1_age'] },
    { label: 'Giới tính', value: answers['q2_gender'] },
    { label: 'Học vấn', value: answers['q5_education'] },
    { label: 'Nghề nghiệp', value: answers['q6_career'] },
    { label: 'Thu nhập', value: answers['q8_income'] },
    { label: 'Nền tảng mua sắm', value: answers['q10_platform'] },
  ].filter(item => item.value);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-10 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_80px_-20px_rgba(34,197,94,0.3)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-center">
          
          {/* Sparkles Decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
             <Sparkles className="w-24 h-24 text-green-500" />
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
          >
            <span className="text-4xl">💎</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-green-950 mb-4 font-display">
            Hành trình hoàn thành!
          </h2>
          
          <p className="text-green-800/80 mb-10 text-lg max-w-md mx-auto">
            Cảm ơn bạn đã đồng hành cùng Rescom. Khu rừng đã bừng sáng nhờ những chia sẻ của bạn.
          </p>

          <div className="bg-white/50 rounded-2xl p-6 mb-10 text-left border border-white/60 shadow-inner">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full inline-block" />
              Hồ sơ của bạn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {summaryItems.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs text-green-700/60 uppercase tracking-wider font-semibold mb-1">
                    {item.label}
                  </span>
                  <span className="text-sm text-green-950 font-medium truncate">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-green-950 hover:bg-green-900 text-white rounded-full font-bold text-lg transition-all shadow-[0_10px_30px_rgba(20,83,45,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Bắt đầu trải nghiệm</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}
