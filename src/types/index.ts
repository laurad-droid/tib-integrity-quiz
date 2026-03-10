// Sector type
export type Sector = 'government' | 'private' | 'ngo';

// Question types
export type QuestionType = 'likert' | 'scenario' | 'yes_partial_no';

// Dimension IDs
export type DimensionId =
  | 'leadership'
  | 'anticorruption'
  | 'transparency'
  | 'whistleblower'
  | 'accountability'
  | 'stakeholder';

// Score range for recommendations
export type ScoreRange = 'low' | 'medium' | 'high';

// Question option
export interface QuestionOption {
  label: string;
  value: number;
  points: number;
}

// Question definition
export interface Question {
  id: string;
  dimension: DimensionId;
  type: QuestionType;
  text: string;
  maxPoints: number;
  weight: number;
  options: QuestionOption[];
}

// Dimension definition
export interface Dimension {
  id: DimensionId;
  label: string;
  weight: number;
}

// CPI country score
export interface CPICountryScore {
  name: string;
  score: number;
}

// CPI scores map
export interface CPIScores {
  [countryCode: string]: CPICountryScore;
}

// Recommendations map
export interface Recommendations {
  [dimension: string]: {
    low: string[];
    medium: string[];
    high: string[];
  };
}

// User profile
export interface Profile {
  id: string;
  organization_name: string;
  sector: Sector;
  created_at: string;
}

// Assessment
export interface Assessment {
  id: string;
  user_id: string;
  total_score: number;
  dimension_scores: Record<DimensionId, number>;
  completed_at: string;
}

// Individual response
export interface QuestionResponse {
  id: string;
  assessment_id: string;
  question_id: string;
  answer_value: string;
  points_earned: number;
}

// Dimension score result
export interface DimensionScore {
  dimensionId: DimensionId;
  label: string;
  score: number; // 0-100
  earned: number; // raw points earned
  maxPoints: number; // raw max points
}

// Full assessment result
export interface AssessmentResult {
  totalScore: number;
  dimensionScores: DimensionScore[];
  recommendations: Record<DimensionId, string[]>;
}
