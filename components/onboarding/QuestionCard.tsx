'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import type { Question } from '@/lib/onboarding-data';
import { ArrowRight, ChevronDown, Search, Check } from 'lucide-react';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]);

  const renderDropdown = () => {
    if (!question.options) return null;

    const filteredOptions = question.options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full text-left px-5 py-4 radius-wobbly border-[3px] transition-all duration-200 flex items-center justify-between shadow-hard-sm ${
            selectedValue
              ? 'border-landing-accent bg-landing-yellow/20'
              : 'border-landing-border bg-white hover:bg-landing-yellow/10 hover:translate-y-[-2px]'
          }`}
        >
          <span className={`text-lg font-bold ${selectedValue ? 'text-landing-fg' : 'text-landing-fg/60'}`}>
            {selectedValue || 'Chọn tỉnh/thành phố...'}
          </span>
          <ChevronDown className={`w-6 h-6 text-landing-fg transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-3 w-full bg-white radius-wobbly border-[3px] border-landing-border shadow-hard overflow-hidden rotate-1"
            >
              {/* Search Input */}
              <div className="p-3 border-b-[3px] border-dashed border-landing-border bg-paper">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-landing-fg/50" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm tỉnh/thành phố..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-lg font-bold bg-white radius-wobbly border-2 border-landing-border focus:border-landing-accent focus:outline-none focus:shadow-hard-sm transition-all placeholder:text-landing-fg/40"
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-[280px] overflow-y-auto p-3 custom-scrollbar space-y-2">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-lg font-bold text-landing-fg/60">
                    Không tìm thấy kết quả
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValue === option;
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          onSelect(option);
                          setDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left px-4 py-3 radius-wobbly text-lg font-bold transition-all duration-150 flex items-center justify-between border-2 ${
                          isSelected
                            ? 'bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-1px]'
                            : 'bg-white text-landing-fg border-transparent hover:border-landing-border hover:bg-landing-yellow/30'
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-landing-accent stroke-[3]" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderStandardOptions = () => {
    if (!question.options) return null;
    return (
      <div className="space-y-4">
        {question.options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-5 py-4 radius-wobbly border-[3px] transition-all duration-200 flex items-center justify-between shadow-hard-sm ${
                isSelected
                  ? 'border-landing-fg bg-landing-yellow translate-y-[2px] translate-x-[2px] shadow-none'
                  : 'border-landing-border bg-white hover:bg-landing-yellow/20 hover:translate-y-[-2px]'
              }`}
            >
              <span className={`text-xl font-bold ${isSelected ? 'text-landing-fg' : 'text-landing-fg/80'}`}>
                {option}
              </span>
              <div
                className={`w-6 h-6 radius-wobbly border-[3px] flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-landing-fg bg-landing-accent'
                    : 'border-landing-border bg-white'
                }`}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white stroke-[4]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderCheckboxOptions = () => {
    if (!question.options) return null;
    
    let currentSelections: string[] = [];
    if (selectedValue) {
      try {
        currentSelections = JSON.parse(selectedValue);
        if (!Array.isArray(currentSelections)) currentSelections = [];
      } catch(e) {}
    }

    const toggleSelection = (option: string) => {
      const newSelections = currentSelections.includes(option)
        ? currentSelections.filter(c => c !== option)
        : [...currentSelections, option];
      if (newSelections.length > 0) {
        onSelect(JSON.stringify(newSelections));
      } else {
        onSelect('');
      }
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {question.options.map((option) => {
          const isSelected = currentSelections.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggleSelection(option)}
              className={`text-left px-5 py-4 radius-wobbly border-[3px] transition-all duration-200 flex items-center gap-4 shadow-hard-sm ${
                isSelected
                  ? 'border-landing-fg bg-landing-yellow translate-y-[2px] translate-x-[2px] shadow-none'
                  : 'border-landing-border bg-white hover:bg-landing-yellow/20 hover:translate-y-[-2px]'
              }`}
            >
              <div
                className={`w-6 h-6 flex-shrink-0 radius-wobbly border-[3px] flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-landing-fg bg-landing-accent'
                    : 'border-landing-border bg-white'
                }`}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white stroke-[4]" />
                )}
              </div>
              <span className={`text-lg font-bold leading-snug ${isSelected ? 'text-landing-fg' : 'text-landing-fg/80'}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white radius-wobbly border-[3px] border-landing-border shadow-hard p-8 md:p-10 w-full max-w-[600px] relative">
      {/* Tape decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-8 bg-gray-400/30 backdrop-blur-sm -rotate-2 skew-x-12 mix-blend-multiply z-10" />

      <div className="mb-8">
        <span className="inline-block bg-landing-yellow text-landing-fg border-2 border-landing-border font-bold font-kalam text-lg px-4 py-1.5 radius-wobbly shadow-[2px_2px_0_0_#2d2d2d] -rotate-2">
          Bước {currentStep}/{totalSteps}
        </span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold font-kalam text-landing-fg mb-10 leading-snug">
        {question.title}
      </h2>

      {question.type === 'dropdown'
        ? renderDropdown()
        : question.type === 'checkbox'
          ? renderCheckboxOptions()
          : renderStandardOptions()}

      <div className="mt-10 flex justify-end">
        <button
          onClick={onContinue}
          disabled={!selectedValue}
          className={`px-8 h-14 radius-wobbly font-bold text-xl border-[3px] transition-all flex items-center gap-2 ${
            selectedValue
              ? 'bg-landing-fg hover:bg-landing-accent text-white border-landing-border shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:-rotate-1'
              : 'bg-landing-muted border-landing-border/50 text-landing-fg/50 cursor-not-allowed shadow-none'
          }`}
        >
          Tiếp tục
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
