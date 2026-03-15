'use client';

import { useState, useCallback, useEffect } from 'react';
import ProgressBar from '@/components/ui/ProgressBar';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import WelcomeCard from './WelcomeCard';
import LikertCard from './LikertCard';
import ScenarioCard from './ScenarioCard';
import YesPartialNoCard from './YesPartialNoCard';
import DimensionIntroCard from './DimensionIntroCard';
import { buildSteps, getDimensionIndex } from '@/lib/steps';
import questionsData from '../../../config/questions.json';
import dimensionsData from '../../../config/dimensions.json';
import type { Question, Dimension } from '@/types';

const questions = questionsData as Question[];
const dimensions = dimensionsData as Dimension[];
const steps = buildSteps(questions, dimensions);
const totalQuestions = questions.length;

interface Answer {
  questionId: string;
  value: number;
  points: number;
}

export default function CardFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const currentQuestion =
    currentStep?.type === 'question' && currentStep.questionIndex != null
      ? questions[currentStep.questionIndex]
      : null;
  const answeredCount = Object.keys(answers).length;
  const currentDimIndex = getDimensionIndex(currentStep, dimensions);
  const currentDimension = currentStep?.dimensionId
    ? dimensions.find(d => d.id === currentStep.dimensionId) || null
    : null;

  const handleAnswer = (value: number, points: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { questionId: currentQuestion.id, value, points },
    }));
  };

  const handleNext = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(prev => prev + 1);
    }
  }, [stepIndex]);

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
    }
  }, [stepIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentStep.type === 'welcome') {
          handleNext();
        } else if (currentStep.type === 'intro') {
          handleNext();
        } else if (currentStep.type === 'question' && currentQuestion && answers[currentQuestion.id]) {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentStep, currentQuestion, answers, handleNext]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: Object.values(answers) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit assessment');
      }

      const data = await response.json();

      if (data.assessmentId) {
        window.location.href = '/results/' + data.assessmentId;
      } else if (data.anonymous && data.result) {
        sessionStorage.setItem('anonymousResult', JSON.stringify(data.result));
        window.location.href = '/results/anonymous';
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const canGoNext = (() => {
    if (currentStep.type === 'welcome') return true;
    if (currentStep.type === 'intro') return true;
    if (currentStep.type === 'question' && currentQuestion) {
      return !!answers[currentQuestion.id];
    }
    return false;
  })();

  const renderCard = () => {
    switch (currentStep.type) {
      case 'welcome':
        return <WelcomeCard onStart={handleNext} />;
      case 'intro':
        if (currentDimension) {
          return <DimensionIntroCard dimension={currentDimension} onContinue={handleNext} />;
        }
        return null;
      case 'question': {
        if (!currentQuestion) return null;
        const selectedAnswer = answers[currentQuestion.id];
        switch (currentQuestion.type) {
          case 'likert':
            return (
              <LikertCard
                question={currentQuestion}
                selectedValue={selectedAnswer?.value ?? null}
                onAnswer={handleAnswer}
                dimension={currentDimension ?? undefined}
              />
            );
          case 'scenario':
            return (
              <ScenarioCard
                question={currentQuestion}
                selectedValue={selectedAnswer?.value ?? null}
                onAnswer={handleAnswer}
                dimension={currentDimension ?? undefined}
              />
            );
          case 'yes_partial_no':
            return (
              <YesPartialNoCard
                question={currentQuestion}
                selectedValue={selectedAnswer?.value ?? null}
                onAnswer={handleAnswer}
                dimension={currentDimension ?? undefined}
              />
            );
          default:
            return null;
        }
      }
      case 'complete':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-ti-navy dark:text-ti-dark-text mb-4">
              Assessment Complete!
            </h2>
            <p className="text-ti-text-muted dark:text-ti-dark-muted mb-6">
              You have answered all {totalQuestions} questions. Click below to see your results.
            </p>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-[4px] mb-4">
                {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-ti-red hover:bg-ti-red-dark text-white font-bold py-3 px-8 rounded-[4px] uppercase tracking-wide transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Calculating...' : 'View My Results'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const showProgress = currentStep.type === 'intro' || currentStep.type === 'question';
  const showNav = currentStep.type === 'intro' || currentStep.type === 'question';

  const nextBtnClass = canGoNext
    ? 'bg-ti-red hover:bg-ti-red-dark text-white animate-pulse-soft'
    : 'bg-ti-grey-mid dark:bg-ti-dark-border text-ti-text-muted dark:text-ti-dark-muted cursor-not-allowed';

  return (
    <div className="min-h-screen bg-ti-bg dark:bg-ti-dark-bg flex flex-col">
      {/* Top-right: Dark mode toggle */}
      <div className="flex justify-end px-4 pt-4">
        <DarkModeToggle />
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-4">
          <ProgressBar
            currentStep={currentStep}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            dimensions={dimensions}
            currentDimensionIndex={currentDimIndex}
          />
        </div>
      )}

      {/* Card content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-ti-dark-card rounded-[4px] border border-ti-grey-mid dark:border-ti-dark-border shadow-lg p-8">
          {renderCard()}
        </div>
      </div>

      {/* Bottom navigation */}
      {showNav && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-ti-text-muted dark:text-ti-dark-muted hover:text-ti-navy dark:hover:text-ti-navy-light transition-colors text-sm"
          >
            &larr; Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={"inline-flex items-center gap-2 font-bold py-2.5 px-6 rounded-[4px] uppercase tracking-wide text-sm transition-all duration-200 " + nextBtnClass}
          >
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            {canGoNext && (
              <span className="ml-1 text-[10px] bg-white/20 rounded px-1.5 py-0.5 font-normal normal-case">
                Enter
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
