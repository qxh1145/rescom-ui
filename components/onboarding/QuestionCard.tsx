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
          className={`w-full text-left px-5 py-4 rounded-[18px] border-[1.5px] transition-all duration-200 flex items-center justify-between ${
            selectedValue
              ? 'border-[#4ade80] bg-white'
              : 'border-[#f0f0f0] hover:border-[#4ade80] bg-white'
          }`}
        >
          <span className={`text-[15px] font-medium ${selectedValue ? 'text-[#1a3628]' : 'text-[#9ca3af]'}`}>
            {selectedValue || 'Chọn tỉnh/thành phố...'}
          </span>
          <ChevronDown className={`w-5 h-5 text-[#9ca3af] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 w-full bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-[#f0f0f0]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm tỉnh/thành phố..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-[14px] rounded-xl bg-[#f9fafb] border border-[#e5e7eb] focus:border-[#4ade80] focus:outline-none focus:ring-2 focus:ring-[#4ade80]/20 transition-all placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-[280px] overflow-y-auto p-2 custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[14px] text-[#9ca3af]">
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
                        className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-150 flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#f0fdf4] text-[#1a3628]'
                            : 'text-[#4b5563] hover:bg-[#f9fafb]'
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#4ade80]" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        {question.options.map((option) => {
          const isSelected = currentSelections.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggleSelection(option)}
              className={`text-left px-4 py-3.5 rounded-[14px] border transition-all duration-200 flex items-center gap-3 ${
                isSelected
                  ? 'border-[#4ade80] bg-[#f0fdf4]'
                  : 'border-[#e5e7eb] hover:border-[#4ade80]'
              }`}
            >
              <div
                className={`w-5 h-5 flex-shrink-0 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-[#4ade80] bg-[#4ade80]'
                    : 'border-[#d1d5db] bg-white'
                }`}
              >
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-[14px] font-medium leading-snug ${isSelected ? 'text-[#1a3628]' : 'text-[#4b5563]'}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 md:p-10 w-full max-w-[560px] relative">
      <div className="mb-6">
        <span className="inline-flex items-center justify-center bg-[#e8f5ed] text-[#4ade80] font-bold text-[11px] tracking-wide px-3 py-1.5 rounded-full uppercase">
          Bước {currentStep}/{totalSteps}
        </span>
      </div>

      <h2 className="text-xl md:text-[22px] font-bold text-[#1a3628] mb-8 leading-snug">
        {question.title}
      </h2>

      {question.type === 'dropdown'
        ? renderDropdown()
        : question.type === 'checkbox'
          ? renderCheckboxOptions()
          : renderStandardOptions()}

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

