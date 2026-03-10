import type {
  DimensionId,
  DimensionScore,
  Dimension,
  Question,
  Recommendations,
  AssessmentResult,
  ScoreRange,
} from '@/types';

/**
 * Simplified response input for scoring calculations.
 * Only needs question_id and points_earned (no database fields).
 */
export type ResponseInput = {
  question_id: string;
  points_earned: number;
};

/**
 * Calculate the score for a single dimension.
 *
 * Filters questions and responses for the given dimension,
 * then calculates: (sum of points earned / sum of maxPoints) x 100.
 *
 * If no questions exist for the dimension, returns score 0.
 * Missing responses (unanswered questions) count as 0 points earned.
 */
export function calculateDimensionScore(
  responses: ResponseInput[],
  questions: Question[],
  dimensionId: DimensionId
): DimensionScore {
  // Filter questions belonging to this dimension
  const dimensionQuestions = questions.filter((q) => q.dimension === dimensionId);

  // Edge case: no questions for this dimension
  if (dimensionQuestions.length === 0) {
    return {
      dimensionId,
      label: '',
      score: 0,
      earned: 0,
      maxPoints: 0,
    };
  }

  // Calculate max possible points for this dimension
  const maxPoints = dimensionQuestions.reduce((sum, q) => sum + q.maxPoints, 0);

  // Build a map of question_id -> points_earned for fast lookup
  const responseMap = new Map<string, number>();
  for (const r of responses) {
    responseMap.set(r.question_id, r.points_earned);
  }

  // Calculate earned points (unanswered questions contribute 0)
  const earned = dimensionQuestions.reduce((sum, q) => {
    return sum + (responseMap.get(q.id) ?? 0);
  }, 0);

  // Calculate percentage score
  const score = maxPoints > 0 ? Math.round((earned / maxPoints) * 100) : 0;

  return {
    dimensionId,
    label: '',
    score,
    earned,
    maxPoints,
  };
}

/**
 * Calculate the overall weighted score from dimension scores.
 *
 * Uses weighted average: sum(score x weight) for each dimension.
 * Returns a number 0-100 rounded to the nearest integer.
 *
 * Returns 0 for empty dimension scores.
 */
export function calculateOverallScore(
  dimensionScores: DimensionScore[],
  dimensions: Dimension[]
): number {
  if (dimensionScores.length === 0) {
    return 0;
  }

  // Build a map of dimension id -> weight
  const weightMap = new Map<string, number>();
  for (const dim of dimensions) {
    weightMap.set(dim.id, dim.weight);
  }

  // Calculate weighted sum
  const weightedSum = dimensionScores.reduce((sum, ds) => {
    const weight = weightMap.get(ds.dimensionId) ?? 0;
    return sum + ds.score * weight;
  }, 0);

  return Math.round(weightedSum);
}

/**
 * Determine the score range category.
 *
 * - low: score < 40
 * - medium: 40-74
 * - high: 75+
 */
export function getScoreRange(score: number): ScoreRange {
  if (score < 40) {
    return 'low';
  }
  if (score < 75) {
    return 'medium';
  }
  return 'high';
}

/**
 * Get recommendations for dimensions that score below 60.
 *
 * For each dimension with a score below 60, looks up the
 * recommendations based on the score range (low/medium/high).
 *
 * Dimensions scoring 60 or above receive no recommendations.
 */
export function getRecommendations(
  dimensionScores: DimensionScore[],
  recommendations: Recommendations
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const ds of dimensionScores) {
    // Only provide recommendations for dimensions scoring below 60
    if (ds.score >= 60) {
      continue;
    }

    const dimRecs = recommendations[ds.dimensionId];
    if (!dimRecs) {
      continue;
    }

    const range = getScoreRange(ds.score);
    const rangeRecs = dimRecs[range];
    if (rangeRecs && rangeRecs.length > 0) {
      result[ds.dimensionId] = rangeRecs;
    }
  }

  return result;
}

/**
 * Orchestrate the full assessment calculation.
 *
 * 1. Calculate dimension scores for each dimension
 * 2. Calculate weighted overall score
 * 3. Gather recommendations for low-scoring dimensions
 * 4. Return the complete AssessmentResult
 */
export function calculateAssessmentResult(
  responses: ResponseInput[],
  questions: Question[],
  dimensions: Dimension[],
  recommendations: Recommendations
): AssessmentResult {
  // 1. Calculate score for each dimension
  const dimensionScores: DimensionScore[] = dimensions.map((dim) => {
    const ds = calculateDimensionScore(responses, questions, dim.id);
    return {
      ...ds,
      label: dim.label,
    };
  });

  // 2. Calculate overall weighted score
  const totalScore = calculateOverallScore(dimensionScores, dimensions);

  // 3. Gather recommendations
  const recs = getRecommendations(dimensionScores, recommendations);

  return {
    totalScore,
    dimensionScores,
    recommendations: recs as Record<DimensionId, string[]>,
  };
}
