import { createClient } from '@/lib/supabase/server';
import { calculateAssessmentResult } from '@/lib/scoring';
import type { Question, Dimension, Recommendations } from '@/types';
import questionsData from '../../../../config/questions.json';
import dimensionsData from '../../../../config/dimensions.json';
import recommendationsData from '../../../../config/recommendations.json';
import ScoreHero from '@/components/results/ScoreHero';
import CPIComparisonChart from '@/components/results/CPIComparisonChart';
import DimensionRadar from '@/components/results/DimensionRadar';
import ActionPlan from '@/components/results/ActionPlan';

const questions = questionsData as Question[];
const dimensions = dimensionsData as Dimension[];
const recommendations = recommendationsData as Recommendations;

interface ResultsPageProps {
  params: { id: string };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const supabase = createClient();

  // Fetch assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', params.id)
    .single();

  if (assessmentError || !assessment) {
    return (
      <div className="min-h-screen bg-ti-bg dark:bg-ti-dark-bg flex items-center justify-center">
        <div className="bg-white dark:bg-ti-dark-card rounded-[4px] border border-ti-grey-mid dark:border-ti-dark-border shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-heading font-bold text-ti-navy dark:text-ti-dark-text mb-4">
            Assessment Not Found
          </h1>
          <p className="text-ti-text-muted dark:text-ti-dark-muted mb-6">
            The assessment you are looking for does not exist or you do not have
            permission to view it.
          </p>
          <a
            href="/assessment"
            className="inline-block bg-ti-red hover:bg-ti-red-dark text-white font-bold uppercase tracking-wide py-3 px-8 rounded-[4px] transition-colors"
          >
            Start New Assessment
          </a>
        </div>
      </div>
    );
  }

  // Fetch responses
  const { data: responses } = await supabase
    .from('responses')
    .select('*')
    .eq('assessment_id', params.id);

  // Calculate results
  const responseInputs = (responses || []).map((r: { question_id: string; points_earned: number }) => ({
    question_id: r.question_id,
    points_earned: r.points_earned,
  }));

  const result = calculateAssessmentResult(
    responseInputs,
    questions,
    dimensions,
    recommendations
  );

  // Prepare data for radar chart
  const radarData = result.dimensionScores.map((ds) => ({
    dimension: ds.dimensionId,
    score: ds.score,
    label: ds.label,
  }));

  // Format date
  const completedDate = assessment.completed_at
    ? new Date(assessment.completed_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'In progress';

  return (
    <div className="min-h-screen bg-ti-bg dark:bg-ti-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold text-ti-navy dark:text-ti-dark-text text-center mb-2">
          Your Assessment Results
        </h1>
        <p className="text-ti-text-muted dark:text-ti-dark-muted text-center mb-12">
          Completed on {completedDate}
        </p>

        <ScoreHero score={result.totalScore} />

        <div className="mt-12">
          <h2 className="text-2xl font-heading font-bold text-ti-navy dark:text-ti-dark-text mb-6">
            How You Compare
          </h2>
          <CPIComparisonChart userScore={result.totalScore} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-heading font-bold text-ti-navy dark:text-ti-dark-text mb-6">
            Dimension Breakdown
          </h2>
          <DimensionRadar dimensionScores={radarData} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-heading font-bold text-ti-navy dark:text-ti-dark-text mb-6">
            Action Plan
          </h2>
          <ActionPlan
            recommendations={result.recommendations as Record<string, string[]>}
            dimensionScores={result.dimensionScores.map((ds) => ({
              dimensionId: ds.dimensionId,
              label: ds.label,
              score: ds.score,
            }))}
          />
        </div>

        <div className="mt-12 text-center space-x-4">
          <a
            href="/dashboard"
            className="inline-block bg-ti-red hover:bg-ti-red-dark text-white font-bold uppercase tracking-wide py-3 px-8 rounded-[4px] transition-colors"
          >
            Go to Dashboard
          </a>
          <a
            href="/assessment"
            className="inline-block border-2 border-ti-navy text-ti-navy dark:text-ti-dark-text font-bold py-3 px-8 rounded-[4px] hover:bg-ti-navy hover:text-white transition-colors"
          >
            Take Another Assessment
          </a>
        </div>
      </div>
    </div>
  );
}
