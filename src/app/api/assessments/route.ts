import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { calculateAssessmentResult } from '@/lib/scoring';
import type { Question, Dimension, Recommendations } from '@/types';
import questionsData from '../../../../config/questions.json';
import dimensionsData from '../../../../config/dimensions.json';
import recommendationsData from '../../../../config/recommendations.json';

const questions = questionsData as Question[];
const dimensions = dimensionsData as Dimension[];
const recommendations = recommendationsData as Recommendations;

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { answers } = await request.json();

  // Calculate scores
  const responseInputs = answers.map((a: { questionId: string; points: number }) => ({
    question_id: a.questionId,
    points_earned: a.points,
  }));

  const result = calculateAssessmentResult(
    responseInputs,
    questions,
    dimensions,
    recommendations
  );

  const dimensionScoresObj: Record<string, number> = {};
  result.dimensionScores.forEach(ds => {
    dimensionScoresObj[ds.dimensionId] = ds.score;
  });

  // Save to database for ALL users (authenticated and anonymous)
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .insert({ user_id: user?.id || null })
    .select()
    .single();

  if (assessmentError) {
    return NextResponse.json({ error: assessmentError.message }, { status: 500 });
  }

  const responses = answers.map((a: { questionId: string; value: number; points: number }) => ({
    assessment_id: assessment.id,
    question_id: a.questionId,
    answer_value: String(a.value),
    points_earned: a.points,
  }));

  const { error: responsesError } = await supabase
    .from('responses')
    .insert(responses);

  if (responsesError) {
    return NextResponse.json({ error: responsesError.message }, { status: 500 });
  }

  await supabase
    .from('assessments')
    .update({
      total_score: result.totalScore,
      dimension_scores: dimensionScoresObj,
      completed_at: new Date().toISOString(),
    })
    .eq('id', assessment.id);

  // Always return assessmentId — both auth and anonymous get a permalink
  return NextResponse.json({ assessmentId: assessment.id });
}
