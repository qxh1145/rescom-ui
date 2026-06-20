'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onboardingData } from '@/lib/onboarding-data';
import { ForestBackground } from '@/components/onboarding/ForestBackground';
import { ProgressTrail } from '@/components/onboarding/ProgressTrail';
import { QuestionCard } from '@/components/onboarding/QuestionCard';
import { CompletionScreen } from '@/components/onboarding/CompletionScreen';
import { LivingTree } from '@/components/onboarding/LivingTree';
import { Leaf } from 'lucide-react';

export default function OnboardingPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // State for orchestrating the transition
  // We want to hide the form while the tree is growing to focus the user's attention on the tree.
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentSection = onboardingData[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  
  // Calculate the overall stage for the tree (0 to 4)
  // We have 4 sections.
  // Stage 0: Section 0
  // Stage 1: Section 1
  // Stage 2: Section 2
  // Stage 3: Section 3
  // Stage 4: Completion (currentSectionIndex === 4)
  const treeStage = currentSectionIndex;
  const isComplete = treeStage >= onboardingData.length;

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleContinue = () => {
    // If it's just the next question in the SAME section, no major tree growth happens, just next question.
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Moving to the next SECTION! This triggers a tree growth stage.
      // We start the transition to hide the form and watch the tree.
      setIsTransitioning(true);
      
      // Wait for the tree to grow, then show the next section.
      setTimeout(() => {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setIsTransitioning(false);
      }, 1500); // 1.5s rewarding animation duration
    }
  };

  const handleFinishOnboarding = () => {
    window.location.href = '/';
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#F0FDF4]">
      {/* Background layer ecosystem */}
      <ForestBackground stage={treeStage} />

      {/* Top Header Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-30 flex items-center gap-2">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/40">
          <Leaf className="text-green-700 w-5 h-5" />
        </div>
        <span className="font-display font-bold text-xl text-green-950 tracking-tight">Rescom</span>
      </div>

      {/* LEFT PANE: LIVING TREE CONTAINER */}
      <div className="relative z-10 w-full md:w-1/2 h-[50vh] md:h-screen flex items-end justify-center pt-20">
         {/* The Living Tree itself */}
         <div className="absolute inset-0 flex items-end justify-center">
            <LivingTree stage={treeStage} />
         </div>
      </div>

      {/* MOBILE PROGRESS TIMELINE */}
      <div className="relative z-20 w-full max-w-2xl mx-auto -mt-6 mb-2 md:hidden">
         <ProgressTrail stage={treeStage} totalStages={onboardingData.length + 1} />
      </div>

      {/* RIGHT PANE: INTERACTIVE FORM AREA */}
      <div className="relative z-30 w-full md:w-1/2 flex-1 md:h-screen flex flex-col pt-4 md:pt-0 pb-8 md:pb-0">
        
        <div className="flex-1 w-full max-w-xl mx-auto px-4 md:px-12 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {!isTransitioning && !isComplete && (
             <motion.div
               key={currentQuestion.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
               transition={{ duration: 0.5 }}
               className="w-full"
             >
               <QuestionCard
                 question={currentQuestion}
                 selectedValue={answers[currentQuestion.id] || null}
                 onSelect={handleSelect}
                 onContinue={handleContinue}
               />
             </motion.div>
          )}

          {isTransitioning && !isComplete && (
             <motion.div
               key="transitioning"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="w-full text-center py-10"
             >
                <p className="text-green-800/60 animate-pulse font-medium tracking-wide">
                  Đang phát triển...
                </p>
             </motion.div>
          )}

          {isComplete && (
            <motion.div
               key="completion"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full"
            >
              <CompletionScreen 
                answers={answers} 
                onComplete={handleFinishOnboarding} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        </div>

        {/* DESKTOP PROGRESS TIMELINE */}
        <div className="hidden md:block w-full max-w-xl mx-auto px-12 pb-12 mt-auto">
           <ProgressTrail stage={treeStage} totalStages={onboardingData.length + 1} />
        </div>
      </div>

    </main>
  );
}
