'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onboardingData } from '@/lib/onboarding-data';
import { QuestionCard } from '@/components/onboarding/QuestionCard';
import { CompletionScreen } from '@/components/onboarding/CompletionScreen';
import Image from 'next/image';
import '../landing/landing.css';

export default function OnboardingPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [authChecked, setAuthChecked] = useState(false);

  const currentSection = onboardingData[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const isComplete = currentSectionIndex >= onboardingData.length;

  // Auth guard: redirect if not logged in, or if onboarding already done
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const onboardingDone = localStorage.getItem('isOnboardingComplete') === 'true';

    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    if (onboardingDone) {
      window.location.href = '/';
      return;
    }
    setAuthChecked(true);
  }, []);

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
    localStorage.setItem('isOnboardingComplete', 'true');
    window.location.href = '/';
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper bg-landing-bg">
        <div className="w-12 h-12 border-[5px] border-landing-accent border-t-transparent radius-wobbly animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex overflow-hidden bg-paper bg-landing-bg text-landing-fg font-patrick selection:bg-landing-yellow selection:text-landing-fg">
      {/* Top Header Logo */}
      <div className="absolute top-8 left-8 z-30">
        <img
          src="/rescom-logo.png"
          alt="Rescom"
          className="w-[130px] h-auto object-contain -rotate-2"
        />
      </div>

      {/* Content Layout Grid */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-32 max-w-[1400px] mx-auto h-screen">

        {/* LEFT PANE: Mascot */}
        <div className="mb-[7rem] w-full md:w-1/2 flex justify-center md:justify-start items-end pb-[10vh] md:pb-[15vh] order-2 md:order-1 h-full relative">
          {!isComplete && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0], rotate: [-1, 2, -1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] filter drop-shadow-[4px_4px_0px_#2d2d2d]"
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
        {!isComplete && (
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end order-1 md:order-2 h-full z-20 pt-16 md:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 30, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 1 }}
                exit={{ opacity: 0, x: -30, rotate: -2 }}
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
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Completion Modal - Full screen centered overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="completion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-landing-fg/40 backdrop-blur-[2px]"
            />
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 1 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }}
              className="relative"
            >
              <CompletionScreen
                answers={answers}
                onComplete={handleFinishOnboarding}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
