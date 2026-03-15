'use client';

import type { StepInfo } from '@/lib/steps';
import type { Dimension } from '@/types';

interface ProgressBarProps {
  currentStep: StepInfo;
  totalQuestions: number;
  answeredCount: number;
  dimensions: Dimension[];
  currentDimensionIndex: number;
}

export default function ProgressBar({
  currentStep,
  totalQuestions,
  answeredCount,
  dimensions,
  currentDimensionIndex,
}: ProgressBarProps) {
  const percentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const remaining = totalQuestions - answeredCount;
  const minutesRemaining = Math.max(1, Math.ceil((remaining * 30) / 60));
  const questionsPerDimension = totalQuestions / dimensions.length;

  const headerLabel = currentStep.dimensionLabel || '';
  const headerSub =
    currentStep.type === 'intro'
      ? 'Introduction'
      : currentStep.type === 'question'
        ? `Question ${currentStep.questionInDimension} of ${currentStep.totalInDimension}`
        : '';

  return (
    <div className="w-full mb-6">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold text-ti-navy dark:text-ti-dark-text">
          {headerLabel}
        </span>
        <span className="text-xs text-ti-text-muted dark:text-ti-dark-muted">
          {headerSub}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1 mb-2">
        {dimensions.map((dim, i) => {
          // How many questions answered in this dimension
          // For dimensions before current: all answered (assume full)
          // For current dimension: partial
          // For future dimensions: none
          let fillFraction = 0;
          if (i < currentDimensionIndex) {
            fillFraction = 1;
          } else if (i === currentDimensionIndex) {
            if (currentStep.type === 'intro') {
              fillFraction = 0;
            } else if (currentStep.type === 'question' && currentStep.questionInDimension && currentStep.totalInDimension) {
              // Fill based on how many questions have been answered in this dimension
              // The current question might not yet be answered, so use (questionInDimension - 1) / total
              // But actually, answeredCount includes all answered, so let's calculate
              const prevDimensionsQuestions = i * questionsPerDimension;
              const answeredInThisDim = Math.max(0, Math.min(questionsPerDimension, answeredCount - prevDimensionsQuestions));
              fillFraction = answeredInThisDim / questionsPerDimension;
            }
          }

          return (
            <div key={dim.id} className="flex-1 h-2 rounded-[2px] bg-ti-grey-mid dark:bg-ti-dark-border overflow-hidden">
              <div
                className="h-full rounded-[2px] transition-all duration-500"
                style={{
                  width: `${Math.min(100, fillFraction * 100)}%`,
                  backgroundColor: dim.color,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-ti-text-muted dark:text-ti-dark-muted">
        <span>{percentage}% complete &middot; {answeredCount}/{totalQuestions} answered</span>
        <span>~{minutesRemaining} min remaining</span>
      </div>
    </div>
  );
}
