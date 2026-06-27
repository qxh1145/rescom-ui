'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  const [locScope, setLocScope] = useState<string | null>(null);
  const [locRegion, setLocRegion] = useState<string | null>(null);
  const [locCities, setLocCities] = useState<string[]>([]);

  useEffect(() => {
    if (question.type === 'location_complex') {
      if (selectedValue && selectedValue !== '') {
        try {
          const parsed = JSON.parse(selectedValue);
          setLocScope(parsed.scope || null);
          setLocRegion(parsed.region || null);
          setLocCities(parsed.cities || []);
        } catch(e) {}
      } else {
        setLocScope(null);
        setLocRegion(null);
        setLocCities([]);
      }
    }
  }, [question.id, selectedValue, question.type]);

  const handleScopeSelect = (scope: string) => {
    setLocScope(scope);
    if (scope === 'Toàn quốc') {
      onSelect(JSON.stringify({ scope }));
    } else {
      onSelect('');
    }
  };

  const handleRegionSelect = (region: string) => {
    setLocRegion(region);
    onSelect(JSON.stringify({ scope: locScope, region }));
  };

  const handleCityToggle = (city: string) => {
    const newCities = locCities.includes(city)
      ? locCities.filter(c => c !== city)
      : [...locCities, city];
    setLocCities(newCities);
    if (newCities.length > 0) {
      onSelect(JSON.stringify({ scope: locScope, cities: newCities }));
    } else {
      onSelect('');
    }
  };

  const renderLocationComplex = () => {
    const scopes = ['Toàn quốc', 'Theo miền', 'Theo tỉnh/thành phố'];
    const regions = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];
    const citiesList = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Khác'];

    return (
      <div className="space-y-6">
        <div className="space-y-3.5">
          <p className="text-[15px] font-semibold text-[#1a3628] mb-2">Phạm vi khu vực*</p>
          {scopes.map(scope => {
            const isSelected = locScope === scope;
            return (
              <button
                key={scope}
                onClick={() => handleScopeSelect(scope)}
                className={`w-full text-left px-5 py-4 rounded-[18px] border-[1.5px] transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'border-[#4ade80] bg-white'
                    : 'border-[#f0f0f0] hover:border-[#4ade80]'
                }`}
              >
                <span className={`text-[15px] font-medium ${isSelected ? 'text-[#1a3628]' : 'text-[#333]'}`}>
                  {scope}
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

        <AnimatePresence>
          {locScope === 'Theo miền' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3.5 overflow-hidden"
            >
              <p className="text-[15px] font-semibold text-[#1a3628] mt-4 mb-2">Chọn miền:</p>
              {regions.map(region => {
                const isSelected = locRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className={`w-full text-left px-5 py-3 rounded-[14px] border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-[#4ade80] bg-[#f0fdf4]'
                        : 'border-[#e5e7eb] hover:border-[#4ade80]'
                    }`}
                  >
                    <span className={`text-[14px] font-medium ${isSelected ? 'text-[#1a3628]' : 'text-[#4b5563]'}`}>
                      {region}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#4ade80] bg-white'
                          : 'border-[#d1d5db]'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#4ade80]" />}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {locScope === 'Theo tỉnh/thành phố' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3.5 overflow-hidden"
            >
              <p className="text-[15px] font-semibold text-[#1a3628] mt-4 mb-2">Chọn tỉnh/thành phố (có thể chọn nhiều):</p>
              <div className="grid grid-cols-2 gap-3">
                {citiesList.map(city => {
                  const isSelected = locCities.includes(city);
                  return (
                    <button
                      key={city}
                      onClick={() => handleCityToggle(city)}
                      className={`text-left px-4 py-3 rounded-[14px] border transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#4ade80] bg-[#f0fdf4]'
                          : 'border-[#e5e7eb] hover:border-[#4ade80]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#4ade80] bg-[#4ade80]'
                            : 'border-[#d1d5db] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[14px] font-medium ${isSelected ? 'text-[#1a3628]' : 'text-[#4b5563]'}`}>
                        {city}
                      </span>
                    </button>
                  );
                })}
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

      {question.type === 'location_complex' 
        ? renderLocationComplex() 
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
