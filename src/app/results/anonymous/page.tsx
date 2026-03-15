'use client';

import { useEffect, useState } from 'react';
import ScoreHero from '@/components/results/ScoreHero';
import CPIComparisonChart from '@/components/results/CPIComparisonChart';
import DimensionRadar from '@/components/results/DimensionRadar';
import ActionPlan from '@/components/results/ActionPlan';
import Link from 'next/link';

interface StoredDimensionScore {
  dimensionId: string;
  label: string;
  score: number;
  earned: number;
  maxPoints: number;
}

interface AnonymousResult {
  totalScore: number;
  dimensionScores: StoredDimensionScore[];
  recommendations: Record<string, string[]>;
}

export default function AnonymousResultsPage() {
  const [result, setResult] = useState<AnonymousResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('anonymousResult');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-ti-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-ti-navy mb-4">No Results Found</h1>
          <p className="text-ti-gray mb-6">
            It looks like you haven&apos;t completed an assessment yet.
          </p>
          <Link
            href="/assessment"
            className="inline-block bg-ti-yellow text-ti-navy font-bold py-3 px-8 rounded-lg hover:opacity-90"
          >
            Take the Assessment
          </Link>
        </div>
      </div>
    );
  }

  // Map dimensionId to dimension for DimensionRadar compatibility
  const radarScores = result.dimensionScores.map(ds => ({
    dimension: ds.dimensionId,
    label: ds.label,
    score: ds.score,
  }));

  // Map for ActionPlan compatibility
  const actionPlanScores = result.dimensionScores.map(ds => ({
    dimensionId: ds.dimensionId,
    label: ds.label,
    score: ds.score,
  }));

  return (
    <div className="min-h-screen bg-ti-bg">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <ScoreHero score={result.totalScore} />
        <CPIComparisonChart userScore={result.totalScore} />
        <DimensionRadar dimensionScores={radarScores} />
        <ActionPlan
          dimensionScores={actionPlanScores}
          recommendations={result.recommendations}
        />

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-ti-gray mb-4">
            Want to save your results and track progress over time?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/register"
              className="bg-ti-yellow text-ti-navy font-bold py-3 px-8 rounded-lg hover:opacity-90"
            >
              Create an Account
            </Link>
            <Link
              href="/assessment"
              className="border-2 border-ti-navy text-ti-navy font-bold py-3 px-8 rounded-lg hover:bg-ti-navy hover:text-white transition-colors"
            >
              Retake Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
