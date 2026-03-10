'use client';

import type { Question } from '@/types';

interface CardProps {
  question: Question;
  selectedValue: number | null;
  onAnswer: (value: number, points: number) => void;
}

export default function YesPartialNoCard({ question, selectedValue, onAnswer }: CardProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ti-navy mb-6 leading-relaxed">
        {question.text}
      </h2>
      <div className="flex gap-4 justify-center">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value, option.points)}
            className={`flex-1 py-4 px-6 rounded-lg border-2 text-base font-semibold transition-all duration-200 ${
              selectedValue === option.value
                ? 'bg-ti-yellow border-ti-yellow text-ti-navy'
                : 'bg-white border-gray-200 text-ti-gray hover:border-ti-accent hover:text-ti-accent'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
