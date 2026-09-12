'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { OptionItem } from '@/data/questionnaireData';

interface ChoiceCardProps {
  option: OptionItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function ChoiceCard({ option, index, isSelected, onSelect }: ChoiceCardProps) {
  const letter = OPTION_LETTERS[index] || String.fromCharCode(65 + index);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className={`group relative w-full text-left p-5 sm:p-6 rounded-[20px] border-2 transition-all duration-200 flex items-start gap-4 min-h-[96px] cursor-pointer ${
        isSelected
          ? 'border-[#00C2E0] bg-[#EAF6FF] shadow-[0_8px_24px_rgba(0,194,224,0.18)] ring-2 ring-[#00C2E0]/20'
          : 'border-[#D6E5EF] bg-white hover:border-[#00C2E0]/60 hover:bg-[#F8FCFF] shadow-sm'
      }`}
    >
      {/* Letter badge / Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
          isSelected
            ? 'bg-[#00C2E0] text-white shadow-sm'
            : 'bg-[#F0F5F9] text-[#4F6B85] group-hover:bg-[#DEEEFF] group-hover:text-[#082A4A]'
        }`}
      >
        {option.icon ? (
          <span className="text-lg leading-none">{option.icon}</span>
        ) : (
          <span>{letter}</span>
        )}
      </div>

      {/* Option Text */}
      <div className="flex-1 pr-6 pt-0.5">
        <p
          className={`text-[15px] sm:text-[16px] leading-relaxed font-medium transition-colors ${
            isSelected ? 'text-[#082A4A] font-semibold' : 'text-[#334E68] group-hover:text-[#082A4A]'
          }`}
        >
          {option.optionText}
        </p>
      </div>

      {/* Checkmark circle */}
      <div
        className={`absolute top-5 right-5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
          isSelected
            ? 'bg-[#00C2E0] border-[#00C2E0] text-white scale-100'
            : 'border-[#CBD5E1] bg-transparent opacity-40 group-hover:opacity-80 scale-90'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </motion.button>
  );
}
