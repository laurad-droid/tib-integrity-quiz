'use client';

import type { Question } from '@/types';

interface CardProps {
  question: Question;
  selectedValue: number | null;
  onAnswer: (value: number, points: number) => void;
}

export default function ScenarioCard({ question, selectedValue, onAnswer }: CardProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ti-navy mb-6 leading-relaxed">
        {question.text}
      </h2>
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value, option.points)}
            className={`w-full text-left py-4 px-5 rounded-lg border-2 text-sm leading-relaxed transition-all duration-200 ${
              selectedValue === option.value
                ? 'bg-ti-yellow border-ti-yellow text-ti-navy font-medium'
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
