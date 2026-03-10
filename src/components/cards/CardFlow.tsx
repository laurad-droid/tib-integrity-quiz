'use client';

import { useState } from 'react';
import ProgressBar from '@/components/ui/ProgressBar';
import WelcomeCard from './WelcomeCard';
import LikertCard from './LikertCard';
import ScenarioCard from './ScenarioCard';
import YesPartialNoCard from './YesPartialNoCard';
import questionsData from '../../../config/questions.json';
import type { Question } from '@/types';

const questions = questionsData as Question[];

interface Answer {
  questionId: string;
  value: number;
  points: number;
}

export default function CardFlow() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = questions.length;
  const isWelcome = currentIndex === -1;
  const isComplete = currentIndex >= totalQuestions;
  const currentQuestion = !isWelcome && !isComplete ? questions[currentIndex] : null;

  const handleAnswer = (value: number, points: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { questionId: currentQuestion.id, value, points },
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > -1) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: Object.values(answers) }),
      });
      const data = await response.json();
      if (data.assessmentId) {
        window.location.href = '/results/' + data.assessmentId;
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      setIsSubmitting(false);
    }
  };

  const renderCard = () => {
    if (isWelcome) return <WelcomeCard onStart={handleNext} />;
    if (isComplete) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ti-navy mb-4">Assessment Complete!</h2>
          <p className="text-ti-gray mb-6">
            You have answered all {totalQuestions} questions. Click below to see your results.
          </p>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-ti-yellow text-ti-navy font-bold py-3 px-8 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Calculating...' : 'View My Results'}
          </button>
        </div>
      );
    }

    const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : null;

    switch (currentQuestion?.type) {
      case 'likert':
        return <LikertCard question={currentQuestion} selectedValue={selectedAnswer?.value ?? null} onAnswer={handleAnswer} />;
      case 'scenario':
        return <ScenarioCard question={currentQuestion} selectedValue={selectedAnswer?.value ?? null} onAnswer={handleAnswer} />;
      case 'yes_partial_no':
        return <YesPartialNoCard question={currentQuestion} selectedValue={selectedAnswer?.value ?? null} onAnswer={handleAnswer} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ti-bg flex flex-col">
      {!isWelcome && !isComplete && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-8">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      )}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          {renderCard()}
        </div>
      </div>
      {!isWelcome && !isComplete && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-8 flex justify-between">
          <button onClick={handleBack} className="text-ti-accent hover:underline">
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!currentQuestion || !answers[currentQuestion.id]}
            className="bg-ti-yellow text-ti-navy font-bold py-2 px-6 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
