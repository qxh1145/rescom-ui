'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onboardingData } from '@/lib/onboarding-data';
import { QuestionCard } from '@/components/onboarding/QuestionCard';
import { CompletionScreen } from '@/components/onboarding/CompletionScreen';
import Image from 'next/image';

export default function OnboardingPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentSection = onboardingData[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const isComplete = currentSectionIndex >= onboardingData.length;

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleContinue = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFinishOnboarding = () => {
    window.location.href = '/';
  };

  return (
    <main className="relative min-h-screen w-full flex overflow-hidden bg-white">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/BG.png"
          alt="Background"
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>

      {/* Top Header Logo */}
      <div className="absolute top-8 left-8 z-30">
        <h1 className="font-display font-bold text-[28px] text-[#0ea5e9]">
          Rescom
        </h1>
      </div>

      {/* Content Layout Grid */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-32 max-w-[1400px] mx-auto h-screen">

        {/* LEFT PANE: Mascot */}
        <div className="mb-[7rem] w-full md:w-1/2 flex justify-center md:justify-start items-end pb-[10vh] md:pb-[15vh] order-2 md:order-1 h-full">
          {!isComplete && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px]"
            >
              <Image
                src="/mascot 7.png"
                alt="Mascot"
                fill
                className="object-contain"
              />
            </motion.div>
          )}
        </div>

        {/* RIGHT PANE: Interactive Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end order-1 md:order-2 h-full z-20 pt-16 md:pt-0">
          <AnimatePresence mode="wait">
            {!isComplete && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center md:justify-end"
              >
                <QuestionCard
                  question={currentQuestion}
                  selectedValue={answers[currentQuestion.id] || null}
                  onSelect={handleSelect}
                  onContinue={handleContinue}
                  currentStep={currentSectionIndex + 1}
                  totalSteps={onboardingData.length}
                />
              </motion.div>
            )}

            {isComplete && (
              <motion.div
                key="completion"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex justify-center md:justify-end"
              >
                <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-10 w-full max-w-[480px]">
                  <CompletionScreen
                    answers={answers}
                    onComplete={handleFinishOnboarding}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
