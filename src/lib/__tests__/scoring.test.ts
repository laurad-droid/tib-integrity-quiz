import { describe, it, expect } from 'vitest';
import {
  calculateDimensionScore,
  calculateOverallScore,
  getScoreRange,
  getRecommendations,
  calculateAssessmentResult,
} from '../scoring';

import type { Question, Dimension, DimensionScore, Recommendations } from '@/types';

// Test fixtures
const mockQuestions: Question[] = [
  {
    id: 'ldr-01', dimension: 'leadership', type: 'likert',
    text: 'Test Q1', maxPoints: 10, weight: 1.0,
    options: [
      { label: 'SD', value: 1, points: 0 },
      { label: 'D', value: 2, points: 2 },
      { label: 'N', value: 3, points: 5 },
      { label: 'A', value: 4, points: 8 },
      { label: 'SA', value: 5, points: 10 },
    ],
  },
  {
    id: 'ldr-02', dimension: 'leadership', type: 'yes_partial_no',
    text: 'Test Q2', maxPoints: 10, weight: 1.0,
    options: [
      { label: 'No', value: 0, points: 0 },
      { label: 'Partially', value: 1, points: 5 },
      { label: 'Yes', value: 2, points: 10 },
    ],
  },
  {
    id: 'trn-01', dimension: 'transparency', type: 'likert',
    text: 'Test Q3', maxPoints: 10, weight: 1.0,
    options: [
      { label: 'SD', value: 1, points: 0 },
      { label: 'SA', value: 5, points: 10 },
    ],
  },
];

const mockDimensions: Dimension[] = [
  { id: 'leadership', label: 'Leadership & Governance', weight: 0.60 },
  { id: 'transparency', label: 'Transparency & Disclosure', weight: 0.40 },
];

describe('calculateDimensionScore', () => {
  it('should calculate score for a dimension with full points', () => {
    const responses = [
      { question_id: 'ldr-01', points_earned: 10 },
      { question_id: 'ldr-02', points_earned: 10 },
    ];
    const result = calculateDimensionScore(responses, mockQuestions, 'leadership');
    expect(result.score).toBe(100);
    expect(result.earned).toBe(20);
    expect(result.maxPoints).toBe(20);
  });

  it('should calculate score for partial points', () => {
    const responses = [
      { question_id: 'ldr-01', points_earned: 5 },
      { question_id: 'ldr-02', points_earned: 5 },
    ];
    const result = calculateDimensionScore(responses, mockQuestions, 'leadership');
    expect(result.score).toBe(50);
    expect(result.earned).toBe(10);
  });

  it('should return 0 for dimension with no questions', () => {
    const result = calculateDimensionScore([], mockQuestions, 'accountability');
    expect(result.score).toBe(0);
  });

  it('should handle missing responses (unanswered = 0)', () => {
    const responses = [
      { question_id: 'ldr-01', points_earned: 8 },
      // ldr-02 not answered
    ];
    const result = calculateDimensionScore(responses, mockQuestions, 'leadership');
    expect(result.score).toBe(40); // 8/20 = 40%
    expect(result.earned).toBe(8);
    expect(result.maxPoints).toBe(20);
  });
});

describe('calculateOverallScore', () => {
  it('should calculate weighted average', () => {
    const dimScores: DimensionScore[] = [
      { dimensionId: 'leadership', label: 'Leadership', score: 80, earned: 16, maxPoints: 20 },
      { dimensionId: 'transparency', label: 'Transparency', score: 60, earned: 6, maxPoints: 10 },
    ];
    // 80 * 0.60 + 60 * 0.40 = 48 + 24 = 72
    expect(calculateOverallScore(dimScores, mockDimensions)).toBe(72);
  });

  it('should return 0 for empty scores', () => {
    expect(calculateOverallScore([], mockDimensions)).toBe(0);
  });

  it('should round to nearest integer', () => {
    const dimScores: DimensionScore[] = [
      { dimensionId: 'leadership', label: 'Leadership', score: 73, earned: 14, maxPoints: 20 },
      { dimensionId: 'transparency', label: 'Transparency', score: 61, earned: 6, maxPoints: 10 },
    ];
    // 73 * 0.60 + 61 * 0.40 = 43.8 + 24.4 = 68.2 -> 68
    expect(calculateOverallScore(dimScores, mockDimensions)).toBe(68);
  });
});

describe('getScoreRange', () => {
  it('should return low for scores below 40', () => {
    expect(getScoreRange(0)).toBe('low');
    expect(getScoreRange(39)).toBe('low');
  });
  it('should return medium for scores 40-74', () => {
    expect(getScoreRange(40)).toBe('medium');
    expect(getScoreRange(74)).toBe('medium');
  });
  it('should return high for scores 75+', () => {
    expect(getScoreRange(75)).toBe('high');
    expect(getScoreRange(100)).toBe('high');
  });
});

describe('getRecommendations', () => {
  it('should return recommendations for low-scoring dimensions', () => {
    const dimScores: DimensionScore[] = [
      { dimensionId: 'leadership', label: 'Leadership', score: 30, earned: 6, maxPoints: 20 },
    ];
    const recs: Recommendations = {
      leadership: {
        low: ['Develop code of conduct'],
        medium: ['Strengthen oversight'],
        high: ['Benchmark against ISO'],
      },
    };
    const result = getRecommendations(dimScores, recs);
    expect(result.leadership).toEqual(['Develop code of conduct']);
  });

  it('should return medium recommendations for medium-scoring dimensions below 60', () => {
    const dimScores: DimensionScore[] = [
      { dimensionId: 'leadership', label: 'Leadership', score: 50, earned: 10, maxPoints: 20 },
    ];
    const recs: Recommendations = {
      leadership: {
        low: ['Develop code of conduct'],
        medium: ['Strengthen oversight'],
        high: ['Benchmark against ISO'],
      },
    };
    const result = getRecommendations(dimScores, recs);
    expect(result.leadership).toEqual(['Strengthen oversight']);
  });

  it('should NOT return recommendations for dimensions scoring 60+', () => {
    const dimScores: DimensionScore[] = [
      { dimensionId: 'leadership', label: 'Leadership', score: 80, earned: 16, maxPoints: 20 },
    ];
    const recs: Recommendations = {
      leadership: { low: ['A'], medium: ['B'], high: ['C'] },
    };
    const result = getRecommendations(dimScores, recs);
    expect(result.leadership).toBeUndefined();
  });

  it('should handle multiple dimensions with mixed scores', () => {
    const dimScores: DimensionScore[] = [
      { dimensionId: 'leadership', label: 'Leadership', score: 30, earned: 6, maxPoints: 20 },
      { dimensionId: 'transparency', label: 'Transparency', score: 70, earned: 7, maxPoints: 10 },
    ];
    const recs: Recommendations = {
      leadership: { low: ['Fix leadership'], medium: ['Improve leadership'], high: ['Great leadership'] },
      transparency: { low: ['Fix transparency'], medium: ['Improve transparency'], high: ['Great transparency'] },
    };
    const result = getRecommendations(dimScores, recs);
    expect(result.leadership).toEqual(['Fix leadership']);
    expect(result.transparency).toBeUndefined();
  });
});

describe('calculateAssessmentResult', () => {
  it('should produce a full assessment result', () => {
    const responses = [
      { question_id: 'ldr-01', points_earned: 8 },
      { question_id: 'ldr-02', points_earned: 10 },
      { question_id: 'trn-01', points_earned: 5 },
    ];
    const recs: Recommendations = {
      leadership: { low: ['A'], medium: ['B'], high: ['C'] },
      transparency: { low: ['D'], medium: ['E'], high: ['F'] },
    };
    const result = calculateAssessmentResult(responses, mockQuestions, mockDimensions, recs);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(result.dimensionScores).toHaveLength(2);
    expect(result.recommendations).toBeDefined();
  });

  it('should calculate correct scores end-to-end', () => {
    const responses = [
      { question_id: 'ldr-01', points_earned: 10 },
      { question_id: 'ldr-02', points_earned: 10 },
      { question_id: 'trn-01', points_earned: 10 },
    ];
    const recs: Recommendations = {
      leadership: { low: ['A'], medium: ['B'], high: ['C'] },
      transparency: { low: ['D'], medium: ['E'], high: ['F'] },
    };
    const result = calculateAssessmentResult(responses, mockQuestions, mockDimensions, recs);
    // leadership: 20/20 = 100%, transparency: 10/10 = 100%
    // overall: 100 * 0.60 + 100 * 0.40 = 100
    expect(result.totalScore).toBe(100);
    // No recommendations for scores >= 60
    expect(result.recommendations.leadership).toBeUndefined();
    expect(result.recommendations.transparency).toBeUndefined();
  });

  it('should include recommendations for low-scoring dimensions', () => {
    const responses = [
      { question_id: 'ldr-01', points_earned: 2 },
      { question_id: 'ldr-02', points_earned: 0 },
      { question_id: 'trn-01', points_earned: 10 },
    ];
    const recs: Recommendations = {
      leadership: { low: ['Fix it'], medium: ['Improve it'], high: ['Keep going'] },
      transparency: { low: ['D'], medium: ['E'], high: ['F'] },
    };
    const result = calculateAssessmentResult(responses, mockQuestions, mockDimensions, recs);
    // leadership: 2/20 = 10% -> low -> should have recommendations
    expect(result.recommendations.leadership).toEqual(['Fix it']);
    // transparency: 10/10 = 100% -> no recommendations
    expect(result.recommendations.transparency).toBeUndefined();
  });
});
