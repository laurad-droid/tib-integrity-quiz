'use client';

import type { Question, Dimension } from '@/types';
import WhyThisMatters from './WhyThisMatters';

interface CardProps {
  question: Question;
  selectedValue: number | null;
  onAnswer: (value: number, points: number) => void;
  dimension?: Dimension;
}

export default function YesPartialNoCard({ question, selectedValue, onAnswer, dimension }: CardProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ti-text dark:text-ti-dark-text mb-4 leading-relaxed">
        {question.text}
      </h2>
      {dimension && <WhyThisMatters dimension={dimension} />}
      <div className="flex gap-4 justify-center">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value, option.points)}
            className={selectedValue === option.value
              ? 'flex-1 py-4 px-6 rounded-[4px] border-2 text-base font-semibold transition-all duration-200 bg-ti-yellow border-ti-yellow text-ti-navy'
              : 'flex-1 py-4 px-6 rounded-[4px] border-2 text-base font-semibold transition-all duration-200 bg-white dark:bg-ti-dark-bg border-ti-grey-mid dark:border-ti-dark-border text-ti-text-muted dark:text-ti-dark-muted hover:border-ti-red dark:hover:border-ti-red hover:text-ti-red dark:hover:text-ti-red'
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
