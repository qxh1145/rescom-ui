'use client';

import { motion } from 'framer-motion';
import type { Question } from '@/lib/onboarding-data';
import { ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onContinue: () => void;
  currentStep: number;
  totalSteps: number;
}

export function QuestionCard({
  question,
  selectedValue,
  onSelect,
  onContinue,
  currentStep,
  totalSteps
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 md:p-10 w-full max-w-[480px] relative">
      <div className="mb-6">
        <span className="inline-flex items-center justify-center bg-[#e8f5ed] text-[#4ade80] font-bold text-[11px] tracking-wide px-3 py-1.5 rounded-full uppercase">
          Bước {currentStep}/{totalSteps}
        </span>
      </div>

      <h2 className="text-xl md:text-[22px] font-bold text-[#1a3628] mb-8 leading-snug">
        {question.title}
      </h2>

      <div className="space-y-3.5">
        {question.options.map((option) => {
          const isSelected = selectedValue === option;

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-5 py-4 rounded-[18px] border-[1.5px] transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'border-[#4ade80] bg-white'
                  : 'border-[#f0f0f0] hover:border-[#4ade80]'
              }`}
            >
              <span className={`text-[15px] font-medium ${isSelected ? 'text-[#1a3628]' : 'text-[#333]'}`}>
                {option}
              </span>
              
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-[#4ade80] bg-white'
                    : 'border-[#e0e0e0]'
                }`}
              >
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" 
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          disabled={!selectedValue}
          className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 ${
            selectedValue
              ? 'bg-[#4ade80] hover:bg-[#22c55e] active:scale-95 shadow-sm'
              : 'bg-[#a7f3d0] cursor-not-allowed'
          }`}
        >
          Tiếp tục
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
