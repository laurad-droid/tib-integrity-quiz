import type { Question, Dimension } from '@/types';

export type StepType = 'welcome' | 'intro' | 'question' | 'complete';

export interface StepInfo {
  type: StepType;
  questionIndex?: number;
  dimensionId?: string;
  dimensionLabel?: string;
  questionInDimension?: number;
  totalInDimension?: number;
  globalQuestionNumber?: number;
}

/**
 * Build the full step mapping for the assessment flow.
 *
 * Step 0: welcome
 * For each dimension: 1 intro step + N question steps
 * Final step: complete
 */
export function buildSteps(questions: Question[], dimensions: Dimension[]): StepInfo[] {
  const steps: StepInfo[] = [];

  // Step 0: welcome
  steps.push({ type: 'welcome' });

  let globalQ = 0;

  for (const dim of dimensions) {
    // Intro step for this dimension
    steps.push({
      type: 'intro',
      dimensionId: dim.id,
      dimensionLabel: dim.label,
    });

    // Question steps for this dimension
    const dimQuestions = questions.filter(q => q.dimension === dim.id);
    dimQuestions.forEach((q, idx) => {
      globalQ++;
      steps.push({
        type: 'question',
        questionIndex: questions.indexOf(q),
        dimensionId: dim.id,
        dimensionLabel: dim.label,
        questionInDimension: idx + 1,
        totalInDimension: dimQuestions.length,
        globalQuestionNumber: globalQ,
      });
    });
  }

  // Final step: complete
  steps.push({ type: 'complete' });

  return steps;
}

/**
 * Get the index of the current dimension (0-based) from a step.
 */
export function getDimensionIndex(step: StepInfo, dimensions: Dimension[]): number {
  if (!step.dimensionId) return 0;
  const idx = dimensions.findIndex(d => d.id === step.dimensionId);
  return idx >= 0 ? idx : 0;
}
