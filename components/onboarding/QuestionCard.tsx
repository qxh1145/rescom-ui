'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Question } from '@/lib/onboarding-data';

interface QuestionCardProps {
  question: Question;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onContinue: () => void;
}

export function QuestionCard({
  question,
  selectedValue,
  onSelect,
  onContinue,
}: QuestionCardProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_16px_60px_-15px_rgba(34,197,94,0.15)] rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
          {/* Subtle noise texture or gradient overlay could go here */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-green-950 mb-8 leading-tight font-display">
              {question.title}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedValue === option;

                return (
                  <motion.button
                    key={option}
                    onClick={() => onSelect(option)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? 'bg-green-50/80 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                        : 'bg-white/60 border-transparent hover:bg-white/80 hover:border-green-200'
                    }`}
                  >
                    {/* Selected state background effect */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeOptionBg"
                        className="absolute inset-0 bg-green-100/50"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className={`text-lg font-medium ${
                          isSelected ? 'text-green-900' : 'text-green-800'
                        }`}
                      >
                        {option}
                      </span>
                      
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                          isSelected
                            ? 'bg-green-500 border-green-500'
                            : 'border-green-200/80'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-end">
              <motion.button
                onClick={onContinue}
                disabled={!selectedValue}
                whileHover={selectedValue ? { scale: 1.02 } : {}}
                whileTap={selectedValue ? { scale: 0.95 } : {}}
                className={`px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center gap-2 ${
                  selectedValue
                    ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5'
                    : 'bg-green-200 cursor-not-allowed opacity-70'
                }`}
              >
                Tiếp tục
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
