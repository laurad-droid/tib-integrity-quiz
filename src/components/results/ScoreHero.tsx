'use client';

import { useState, useEffect } from 'react';

interface ScoreHeroProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score < 40) return 'text-score-red';
  if (score < 60) return 'text-score-orange';
  if (score < 75) return 'text-score-yellow';
  return 'text-score-green';
}

function getScoreBgColor(score: number): string {
  if (score < 40) return 'bg-score-red';
  if (score < 60) return 'bg-score-orange';
  if (score < 75) return 'bg-score-yellow';
  return 'bg-score-green';
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Significant improvement needed';
  if (score < 60) return 'Room for improvement';
  if (score < 75) return 'Good foundation, keep building';
  return 'Strong integrity posture';
}

export default function ScoreHero({ score }: ScoreHeroProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (score <= 0) {
      setDisplayScore(0);
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <p className="text-ti-gray text-sm uppercase tracking-widest mb-4">
        Your Integrity Score
      </p>
      <div className="relative inline-flex items-center justify-center mb-4">
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center ${getScoreBgColor(score)} bg-opacity-10 border-4 ${getScoreColor(score).replace('text-', 'border-')}`}
        >
          <span className={`text-6xl font-bold ${getScoreColor(score)}`}>
            {displayScore}
          </span>
        </div>
      </div>
      <p className="text-sm text-ti-gray mb-1">out of 100</p>
      <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </p>
    </div>
  );
}
